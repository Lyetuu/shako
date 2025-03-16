// File: services/api/payment.js
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { getAuthHeader } from './auth';

/**
 * Fetch user's payment methods
 * @returns {Promise<Array>} List of payment methods
 */
export const fetchPaymentMethods = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/payment/methods`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - fetchPaymentMethods:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch payment methods' };
  }
};

/**
 * Add a new card payment method
 * @param {Object} cardData - The card data
 * @returns {Promise<Object>} The created payment method
 */
export const addCardPaymentMethod = async (cardData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/payment/methods/card`,
      cardData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - addCardPaymentMethod:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to add card payment method' };
  }
};

/**
 * Add a new bank account payment method
 * @param {Object} bankData - The bank account data
 * @returns {Promise<Object>} The created payment method
 */
export const addBankPaymentMethod = async (bankData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/payment/methods/bank`,
      bankData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - addBankPaymentMethod:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to add bank payment method' };
  }
};

/**
 * Delete a payment method
 * @param {string} methodId - The ID of the payment method to delete
 * @returns {Promise<Object>} The result of the operation
 */
export const deletePaymentMethod = async (methodId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.delete(
      `${API_BASE_URL}/payment/methods/${methodId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - deletePaymentMethod:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to delete payment method' };
  }
};

/**
 * Set a payment method as default
 * @param {string} methodId - The ID of the payment method to set as default
 * @returns {Promise<Object>} The updated payment method
 */
export const setDefaultPaymentMethod = async (methodId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.put(
      `${API_BASE_URL}/payment/methods/${methodId}/default`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - setDefaultPaymentMethod:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to set default payment method' };
  }
};

/**
 * Process a payment for a contribution
 * @param {string} groupId - The ID of the group
 * @param {number} amount - The amount to contribute
 * @param {string} paymentMethodId - The ID of the payment method to use
 * @param {string} note - Optional note for the payment
 * @returns {Promise<Object>} The payment result
 */
export const processContributionPayment = async (groupId, amount, paymentMethodId, note = '') => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/payment/process`,
      {
        groupId,
        amount,
        paymentMethodId,
        note,
        type: 'CONTRIBUTION'
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - processContributionPayment:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to process payment' };
  }
};

/**
 * Get payment transaction history
 * @param {Object} filters - Optional filters for transactions
 * @returns {Promise<Array>} List of transactions
 */
export const getTransactionHistory = async (filters = {}) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/payment/transactions`,
      { 
        headers,
        params: filters
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getTransactionHistory:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch transaction history' };
  }
};

/**
 * Get details of a specific transaction
 * @param {string} transactionId - The ID of the transaction
 * @returns {Promise<Object>} Transaction details
 */
export const getTransactionDetails = async (transactionId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/payment/transactions/${transactionId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getTransactionDetails:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch transaction details' };
  }
};
