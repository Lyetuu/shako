// controllers/authController.js - Authentication controller
const User = require('../models/User');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        success: true,
        twoFactorRequired: true,
        userId: user._id
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify 2FA code
// @route   POST /api/auth/verify-2fa
// @access  Public
exports.verify2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;

    // Find user
    const user = await User.findById(userId).select('+twoFactorSecret');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    // Generate JWT
    const jwtToken = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token: jwtToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Setup 2FA
// @route   POST /api/auth/setup-2fa
// @access  Private
exports.setup2FA = async (req, res) => {
  try {
    const { twoFactorMethod } = req.body;
    
    if (!['sms', 'app'].includes(twoFactorMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA method'
      });
    }

    const secret = speakeasy.generateSecret({ length: 20, name: `Oshako:${req.user.email}` });
    
    // Update user with new secret
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        twoFactorSecret: secret.base32,
        twoFactorMethod,
        twoFactorEnabled: false // Will be enabled after verification
      },
      { new: true }
    );

    if (twoFactorMethod === 'app') {
      // Generate QR code for app
      const qrCode = await QRCode.toDataURL(secret.otpauth_url);
      
      res.status(200).json({
        success: true,
        secret: secret.base32,
        qrCode
      });
    } else {
      // For SMS method
      res.status(200).json({
        success: true,
        message: 'SMS verification will be sent to your registered phone number'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Confirm 2FA setup
// @route   POST /api/auth/confirm-2fa
// @access  Private
exports.confirm2FA = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Get user with secret
    const user = await User.findById(req.user._id).select('+twoFactorSecret');
    
    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Enable 2FA
    await User.findByIdAndUpdate(
      user._id,
      { twoFactorEnabled: true }
    );

    res.status(200).json({
      success: true,
      message: '2FA has been successfully enabled'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// controllers/groupController.js - Group Savings controller
const GroupSavings = require('../models/GroupSavings');
const User = require('../models/User');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const { pgPool } = require('../config/database');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc    Create group savings
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      targetAmount,
      contributionSchedule,
      contributionAmount,
      startDate,
      endDate,
      currency
    } = req.body;

    // Generate unique invitation code
    const invitationCode = crypto.randomBytes(6).toString('hex');

    // Create group
    const group = await GroupSavings.create({
      name,
      description,
      targetAmount,
      contributionSchedule,
      contributionAmount,
      startDate,
      endDate,
      currency,
      creator: req.user._id,
      invitationCode,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    // Create transaction record in PostgreSQL
    await pgPool.query(
      'INSERT INTO group_records (group_id, name, created_by, creation_date) VALUES ($1, $2, $3, $4)',
      [group._id.toString(), name, req.user._id.toString(), new Date()]
    );

    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all groups for a user
// @route   GET /api/groups
// @access  Private
exports.getGroups = async (req, res) => {
  try {
    const groups = await GroupSavings.find({
      'members.user': req.user._id
    }).populate('members.user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private
exports.getGroup = async (req, res) => {
  try {
    const group = await GroupSavings.findById(req.params.id)
      .populate('members.user', 'firstName lastName email phoneNumber')
      .populate('creator', 'firstName lastName email');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member of the group
    const isMember = group.members.some(
      member => member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this group'
      });
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Join group with invitation code
// @route   POST /api/groups/join
// @access  Private
exports.joinGroup = async (req, res) => {
  try {
    const { invitationCode } = req.body;

    // Find group by invitation code
    const group = await GroupSavings.findOne({ invitationCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invitation code'
      });
    }

    // Check if user is already a member
    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group'
      });
    }

    // Add user to the group
    group.members.push({
      user: req.user._id,
      role: 'member'
    });

    await group.save();

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Invite members to group
// @route   POST /api/groups/:id/invite
// @access  Private
exports.inviteMembers = async (req, res) => {
  try {
    const { emails } = req.body;
    const group = await GroupSavings.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is admin of the group
    const member = group.members.find(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!member || member.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only group admins can send invitations'
      });
    }

    // Send invitation emails
    const invitationLink = `${process.env.FRONTEND_URL}/groups/join/${group.invitationCode}`;
    
    for (const email of emails) {
      const msg = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: `You've been invited to join ${group.name} on Oshako`,
        text: `You've been invited to join the savings group "${group.name}" on Oshako. Click the link to join: ${invitationLink}`,
        html: `
          <h1>Join ${group.name} on Oshako</h1>
          <p>You've been invited to join a savings group on Oshako.</p>
          <p>Group: <strong>${group.name}</strong></p>
          <p>Target Amount: <strong>${group.currency} ${group.targetAmount}</strong></p>
          <p>Contribution: <strong>${group.currency} ${group.contributionAmount} (${group.contributionSchedule})</strong></p>
          <p><a href="${invitationLink}">Click here to join</a></p>
        `
      };
      
      await sgMail.send(msg);
    }

    res.status(200).json({
      success: true,
      message: `Invitations sent to ${emails.length} email(s)`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Request withdrawal from group
// @route   POST /api/groups/:id/withdraw
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const group = await GroupSavings.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member of the group
    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this group'
      });
    }

    // Check if withdrawal amount is valid
    if (amount > group.currentAmount) {
      return res.status(400).json({
        success: false,
        message: 'Withdrawal amount exceeds available funds'
      });
    }

    // Create withdrawal request in PostgreSQL
    const result = await pgPool.query(
      'INSERT INTO withdrawal_requests (group_id, user_id, amount, reason, status, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [group._id.toString(), req.user._id.toString(), amount, reason, 'pending', new Date()]
    );

    const withdrawalId = result.rows[0].id;

    // Notify all members about the withdrawal request
    for (const member of group.members) {
      if (member.user.toString() !== req.user._id.toString()) {
        // Send notification (email, push, or in-app)
        // This would be implemented based on notification service
      }
    }

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted',
      data: {
        withdrawalId,
        amount,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
