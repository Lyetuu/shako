// File: services/api/groupSavings.js (new functions for group withdrawal flow)

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
