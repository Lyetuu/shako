import supabase from '../../config/supabase';

/**
 * Create a new savings group
 * @param {object} groupData - Group data (name, description, etc.)
 * @param {string} creatorId - ID of the user creating the group
 * @returns {Promise} - New group data
 */
export const createGroup = async (groupData, creatorId) => {
  // Create the group
  const { data: groupResult, error: groupError } = await supabase
    .from('groups')
    .insert([
      {
        ...groupData,
        created_by: creatorId,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ])
    .select();

  if (groupError) throw groupError;
  
  const newGroupId = groupResult[0].id;
  
  // Add the creator as a member and admin
  const { error: memberError } = await supabase
    .from('group_members')
    .insert([
      {
        group_id: newGroupId,
        user_id: creatorId,
        role: 'admin',
        joined_at: new Date(),
        status: 'active'
      }
    ]);

  if (memberError) throw memberError;
  
  return groupResult[0];
};

/**
 * Get all groups for a user
 * @param {string} userId - User ID
 * @returns {Promise} - Array of groups
 */
export const getUserGroups = async (userId) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      group_id,
      role,
      joined_at,
      groups (
        id,
        name,
        description,
        group_type,
        meeting_frequency,
        member_count,
        created_at,
        total_savings,
        currency,
        logo_url
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) throw error;
  
  // Transform the data to a more usable format
  return data.map(membership => ({
    id: membership.group_id,
    role: membership.role,
    joinedAt: membership.joined_at,
    ...membership.groups
  }));
};

/**
 * Get group details
 * @param {string} groupId - Group ID
 * @returns {Promise} - Group details
 */
export const getGroupDetails = async (groupId) => {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      group_members (
        user_id,
        role,
        joined_at,
        status,
        profiles (
          id,
          full_name,
          email,
          avatar_url,
          phone
        )
      )
    `)
    .eq('id', groupId)
    .single();

  if (error) throw error;
  
  // Transform members data for easier use
  const transformedData = {
    ...data,
    members: data.group_members.map(member => ({
      id: member.user_id,
      role: member.role,
      joinedAt: member.joined_at,
      status: member.status,
      ...member.profiles
    }))
  };
  
  // Remove the original nested data
  delete transformedData.group_members;
  
  return transformedData;
};

/**
 * Update group details
 * @param {string} groupId - Group ID
 * @param {object} groupData - Updated group data
 * @returns {Promise} - Updated group data
 */
export const updateGroupDetails = async (groupId, groupData) => {
  const { data, error } = await supabase
    .from('groups')
    .update({
      ...groupData,
      updated_at: new Date()
    })
    .eq('id', groupId)
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Add member to group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @param {string} role - Member role (default: 'member')
 * @returns {Promise} - Result
 */
export const addGroupMember = async (groupId, userId, role = 'member') => {
  const { data, error } = await supabase
    .from('group_members')
    .insert([
      {
        group_id: groupId,
        user_id: userId,
        role: role,
        joined_at: new Date(),
        status: 'active'
      }
    ]);

  if (error) throw error;
  
  // Update the member count in the groups table
  const { error: updateError } = await supabase.rpc('increment_member_count', {
    group_id: groupId
  });
  
  if (updateError) throw updateError;
  
  return data;
};

/**
 * Remove member from group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @returns {Promise} - Result
 */
export const removeGroupMember = async (groupId, userId) => {
  const { data, error } = await supabase
    .from('group_members')
    .update({ status: 'removed' })
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) throw error;
  
  // Update the member count in the groups table
  const { error: updateError } = await supabase.rpc('decrement_member_count', {
    group_id: groupId
  });
  
  if (updateError) throw updateError;
  
  return data;
};

/**
 * Update member role
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @param {string} newRole - New role
 * @returns {Promise} - Result
 */
export const updateMemberRole = async (groupId, userId, newRole) => {
  const { data, error } = await supabase
    .from('group_members')
    .update({ role: newRole })
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

/**
 * Search for groups
 * @param {string} query - Search query
 * @returns {Promise} - Search results
 */
export const searchGroups = async (query) => {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, description, member_count, logo_url')
    .ilike('name', `%${query}%`)
    .order('member_count', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Get group invitations for a user
 * @param {string} userId - User ID
 * @returns {Promise} - Array of invitations
 */
export const getUserInvitations = async (userId) => {
  const { data, error } = await supabase
    .from('group_invitations')
    .select(`
      id,
      group_id,
      invited_by,
      created_at,
      status,
      groups (
        name,
        description,
        member_count,
        logo_url
      ),
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('invited_user', userId)
    .eq('status', 'pending');

  if (error) throw error;
  
  // Transform the data for easier use
  return data.map(invitation => ({
    id: invitation.id,
    groupId: invitation.group_id,
    invitedBy: {
      id: invitation.invited_by,
      name: invitation.profiles.full_name,
      avatar: invitation.profiles.avatar_url
    },
    group: invitation.groups,
    createdAt: invitation.created_at,
    status: invitation.status
  }));
};

/**
 * Respond to group invitation
 * @param {string} invitationId - Invitation ID
 * @param {string} response - Response ('accept' or 'decline')
 * @returns {Promise} - Result
 */
export const respondToInvitation = async (invitationId, response) => {
  // First get the invitation details
  const { data: invitation, error: invitationError } = await supabase
    .from('group_invitations')
    .select('group_id, invited_user')
    .eq('id', invitationId)
    .single();

  if (invitationError) throw invitationError;
  
  // Update the invitation status
  const { error: updateError } = await supabase
    .from('group_invitations')
    .update({ status: response === 'accept' ? 'accepted' : 'declined' })
    .eq('id', invitationId);
  
  if (updateError) throw updateError;
  
  // If accepted, add the user to the group
  if (response === 'accept') {
    return addGroupMember(invitation.group_id, invitation.invited_user);
  }
  
  return true;
};