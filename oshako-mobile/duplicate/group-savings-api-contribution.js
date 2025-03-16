// File: services/api/groupSavings.js (additional functions to add to the existing file)

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
