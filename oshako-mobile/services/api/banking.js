// File: services/api/banking.js
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { getAuthHeader } from './auth';

/**
 * Fetch user's bank accounts
 * @returns {Promise<Array>} List of bank accounts
 */
export const fetchBankAccounts = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/banking/accounts`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - fetchBankAccounts:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch bank accounts' };
  }
};

/**
 * Add a new bank account
 * @param {Object} accountData - The bank account data
 * @returns {Promise<Object>} The created bank account
 */
export const addBankAccount = async (accountData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/banking/accounts`,
      accountData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - addBankAccount:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to add bank account' };
  }
};

/**
 * Delete a bank account
 * @param {string} accountId - The ID of the bank account to delete
 * @returns {Promise<Object>} The result of the operation
 */
export const deleteBankAccount = async (accountId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.delete(
      `${API_BASE_URL}/banking/accounts/${accountId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - deleteBankAccount:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to delete bank account' };
  }
};

/**
 * Set a bank account as default for withdrawals
 * @param {string} accountId - The ID of the bank account to set as default
 * @returns {Promise<Object>} The updated bank account
 */
export const setDefaultBankAccount = async (accountId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.put(
      `${API_BASE_URL}/banking/accounts/${accountId}/default`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - setDefaultBankAccount:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to set default bank account' };
  }
};

/**
 * Verify a bank account via micro-deposits
 * @param {string} accountId - The ID of the bank account to verify
 * @param {Object} verificationData - The verification data
 * @param {number} verificationData.amount1 - First micro-deposit amount
 * @param {number} verificationData.amount2 - Second micro-deposit amount
 * @returns {Promise<Object>} The verification result
 */
export const verifyBankAccount = async (accountId, verificationData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/banking/accounts/${accountId}/verify`,
      verificationData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - verifyBankAccount:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to verify bank account' };
  }
};

/**
 * Get bank account verification status
 * @param {string} accountId - The ID of the bank account
 * @returns {Promise<Object>} The verification status
 */
export const getBankAccountVerificationStatus = async (accountId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/banking/accounts/${accountId}/verification-status`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getBankAccountVerificationStatus:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get verification status' };
  }
};

/**
 * Update bank account details
 * @param {string} accountId - The ID of the bank account
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} The updated bank account
 */
export const updateBankAccount = async (accountId, updateData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.put(
      `${API_BASE_URL}/banking/accounts/${accountId}`,
      updateData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - updateBankAccount:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to update bank account' };
  }
};
