// File: services/api/groupSavings.js (additional functions for member management)

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
