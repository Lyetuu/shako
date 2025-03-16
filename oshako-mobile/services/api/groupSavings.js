// File: services/api/groupSavings.js
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { getAuthHeader } from './auth';

/**
 * Fetch group details
 * @param {string} groupId - The ID of the group
 * @returns {Promise<Object>} - Group details
 */
export const fetchGroupDetails = async (groupId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/groups/savings/${groupId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - fetchGroupDetails:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch group details' };
  }
};

/**
 * Fetch all groups
 * @returns {Promise<Array>} - List of groups
 */
export const fetchGroups = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/groups/savings`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - fetchGroups:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch groups' };
  }
};

/**
 * Create a new savings group
 * @param {Object} groupData - The group creation data
 * @returns {Promise<Object>} - The created group
 */
export const createSavingsGroup = async (groupData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings`,
      groupData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - createSavingsGroup:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to create group' };
  }
};

/**
 * Get all savings groups for the current user
 * @returns {Promise<Array>} - List of savings groups
 */
export const getUserSavingsGroups = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/groups/savings/user`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getUserSavingsGroups:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch user groups' };
  }
};

/**
 * Make a contribution to a savings group
 * @param {string} groupId - The ID of the group
 * @param {Object} contributionData - The contribution data
 * @param {number} contributionData.amount - The amount to contribute
 * @param {string} contributionData.paymentMethod - ID of payment method or 'NEW_CARD'/'NEW_BANK'
 * @param {boolean} contributionData.savePaymentMethod - Whether to save the payment method
 * @param {string} contributionData.note - Optional note for the contribution
 * @returns {Promise<Object>} - The created contribution
 */
export const makeContribution = async (groupId, contributionData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/contributions`,
      contributionData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - makeContribution:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to make contribution' };
  }
};

/**
 * Get all contributions for a group
 * @param {string} groupId - The ID of the group
 * @returns {Promise<Array>} - List of contributions
 */
export const getGroupContributions = async (groupId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/groups/savings/${groupId}/contributions`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getGroupContributions:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch contributions' };
  }
};

/**
 * Get user's contribution history for a group
 * @param {string} groupId - The ID of the group
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - List of user's contributions
 */
export const getUserContributionHistory = async (groupId, userId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/groups/savings/${groupId}/contributions/user/${userId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getUserContributionHistory:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch contribution history' };
  }
};

/**
 * Request a withdrawal from a savings group
 * @param {string} groupId - The ID of the group
 * @param {Object} withdrawalData - The withdrawal request data
 * @param {number} withdrawalData.amount - The amount to withdraw
 * @param {string} withdrawalData.reason - The reason for withdrawal
 * @param {string} withdrawalData.bankAccountId - ID of the bank account for deposit
 * @returns {Promise<Object>} - The created withdrawal request
 */
export const requestWithdrawal = async (groupId, withdrawalData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/withdrawals`,
      withdrawalData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - requestWithdrawal:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to submit withdrawal request' };
  }
};

/**
 * Request a group withdrawal (for entire group savings)
 * @param {string} groupId - The ID of the group
 * @param {Object} withdrawalData - The withdrawal request data
 * @param {string} withdrawalData.reason - The reason for withdrawal
 * @param {string} withdrawalData.withdrawalType - Either 'GROUP_ACCOUNT' or 'DISTRIBUTE_TO_MEMBERS'
 * @param {string} [withdrawalData.bankAccountId] - ID of the bank account for deposit (if GROUP_ACCOUNT)
 * @returns {Promise<Object>} - The created group withdrawal request
 */
export const requestGroupWithdrawal = async (groupId, withdrawalData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/group-withdrawals`,
      withdrawalData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - requestGroupWithdrawal:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to submit group withdrawal request' };
  }
};

/**
 * Get details of a group withdrawal request
 * @param {string} groupId - The ID of the group
 * @param {string} withdrawalId - The ID of the withdrawal request
 * @returns {Promise<Object>} - The withdrawal request details
 */
export const getGroupWithdrawalDetails = async (groupId, withdrawalId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/groups/savings/${groupId}/group-withdrawals/${withdrawalId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getGroupWithdrawalDetails:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get withdrawal details' };
  }
};

/**
 * Approve a group withdrawal request
 * @param {string} groupId - The ID of the group
 * @param {string} withdrawalId - The ID of the withdrawal request
 * @returns {Promise<Object>} - The updated withdrawal request
 */
export const approveGroupWithdrawal = async (groupId, withdrawalId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/group-withdrawals/${withdrawalId}/approve`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - approveGroupWithdrawal:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to approve withdrawal' };
  }
};

/**
 * Decline a group withdrawal request
 * @param {string} groupId - The ID of the group
 * @param {string} withdrawalId - The ID of the withdrawal request
 * @param {Object} declineData - The decline data
 * @param {string} declineData.reason - Reason for declining
 * @returns {Promise<Object>} - The updated withdrawal request
 */
export const declineGroupWithdrawal = async (groupId, withdrawalId, declineData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/group-withdrawals/${withdrawalId}/decline`,
      declineData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - declineGroupWithdrawal:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to decline withdrawal' };
  }
};

/**
 * Cancel a group withdrawal request (requester only)
 * @param {string} groupId - The ID of the group
 * @param {string} withdrawalId - The ID of the withdrawal request
 * @returns {Promise<Object>} - The result of the operation
 */
export const cancelGroupWithdrawal = async (groupId, withdrawalId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/group-withdrawals/${withdrawalId}/cancel`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - cancelGroupWithdrawal:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to cancel withdrawal' };
  }
};

/**
 * Create a dispute for a declined group withdrawal
 * @param {string} groupId - The ID of the group
 * @param {string} withdrawalId - The ID of the withdrawal request
 * @param {Object} disputeData - The dispute data
 * @param {string} disputeData.reason - Reason for the dispute
 * @returns {Promise<Object>} - The created dispute
 */
export const createWithdrawalDispute = async (groupId, withdrawalId, disputeData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/group-withdrawals/${withdrawalId}/dispute`,
      disputeData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - createWithdrawalDispute:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to create dispute' };
  }
};

/**
 * Get all group withdrawal requests for a group
 * @param {string} groupId - The ID of the group
 * @returns {Promise<Array>} - List of group withdrawal requests
 */
export const getGroupWithdrawals = async (groupId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/groups/savings/${groupId}/group-withdrawals`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getGroupWithdrawals:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch group withdrawals' };
  }
};

/**
 * Invite a user to join a savings group
 * @param {string} groupId - The ID of the group
 * @param {Object} inviteData - The invitation data
 * @returns {Promise<Object>} - The created invitation
 */
export const inviteToGroup = async (groupId, inviteData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/invites`,
      inviteData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - inviteToGroup:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to send invitation' };
  }
};

/**
 * Remove a member from a savings group
 * @param {string} groupId - The ID of the group
 * @param {string} userId - The ID of the user to remove
 * @returns {Promise<Object>} - The result of the operation
 */
export const removeGroupMember = async (groupId, userId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.delete(
      `${API_BASE_URL}/groups/savings/${groupId}/members/${userId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - removeGroupMember:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to remove group member' };
  }
};

/**
 * Update member role in a group (make admin or remove admin role)
 * @param {string} groupId - The ID of the group
 * @param {string} userId - The ID of the user
 * @param {Object} roleData - The role update data
 * @param {boolean} roleData.isAdmin - Whether the user should be an admin
 * @returns {Promise<Object>} - The updated member data
 */
export const updateMemberRole = async (groupId, userId, roleData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.put(
      `${API_BASE_URL}/groups/savings/${groupId}/members/${userId}/role`,
      roleData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - updateMemberRole:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to update member role' };
  }
};

/**
 * Get pending invitations for a group
 * @param {string} groupId - The ID of the group
 * @returns {Promise<Array>} - List of pending invitations
 */
export const getGroupInvitations = async (groupId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/groups/savings/${groupId}/invites`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getGroupInvitations:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch group invitations' };
  }
};

/**
 * Cancel a pending invitation
 * @param {string} groupId - The ID of the group
 * @param {string} inviteId - The ID of the invitation
 * @returns {Promise<Object>} - The result of the operation
 */
export const cancelInvitation = async (groupId, inviteId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.delete(
      `${API_BASE_URL}/groups/savings/${groupId}/invites/${inviteId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - cancelInvitation:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to cancel invitation' };
  }
};

/**
 * Join a group using an invitation code
 * @param {string} inviteCode - The invitation code
 * @returns {Promise<Object>} - The joined group data
 */
export const joinGroupWithCode = async (inviteCode) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/join`,
      { inviteCode },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - joinGroupWithCode:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to join group' };
  }
};

/**
 * Leave a savings group
 * @param {string} groupId - The ID of the group
 * @returns {Promise<Object>} - The result of the operation
 */
export const leaveGroup = async (groupId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/groups/savings/${groupId}/leave`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - leaveGroup:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to leave group' };
  }
};