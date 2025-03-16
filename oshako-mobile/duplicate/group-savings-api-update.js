// File: services/api/groupSavings.js (update requestWithdrawal function)
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
