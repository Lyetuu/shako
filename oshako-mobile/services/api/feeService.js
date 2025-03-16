// File: services/api/feeService.js
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { getAuthHeader } from './auth';

/**
 * Calculate withdrawal fees based on timing and options
 * @param {Object} withdrawalData - The withdrawal data
 * @param {number} withdrawalData.amount - Withdrawal amount
 * @param {boolean} withdrawalData.isEarlyWithdrawal - Whether it's before reaching the goal
 * @param {string} withdrawalData.processingTime - Processing time ('INSTANT', 'DAYS_7', 'DAYS_14', 'DAYS_30')
 * @param {boolean} withdrawalData.isGroupWithdrawal - Whether it's a group withdrawal
 * @returns {Promise<Object>} Fee calculation results
 */
export const calculateWithdrawalFees = async (withdrawalData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/fees/withdrawal-calculation`,
      withdrawalData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - calculateWithdrawalFees:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to calculate fees' };
  }
};

/**
 * Calculate contribution service fee
 * @param {Object} contributionData - The contribution data
 * @param {number} contributionData.amount - Contribution amount
 * @returns {Promise<Object>} Service fee calculation results
 */
export const calculateServiceFee = async (contributionData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/fees/service-fee-calculation`,
      contributionData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - calculateServiceFee:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to calculate service fee' };
  }
};

/**
 * Get fee rates and configurations
 * @returns {Promise<Object>} Current fee rates and configuration
 */
export const getFeeConfiguration = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/fees/configuration`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getFeeConfiguration:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get fee configuration' };
  }
};

/**
 * Local fee calculation functions (for offline or quick calculations)
 */

/**
 * Calculate withdrawal fee locally
 * @param {number} amount - Withdrawal amount
 * @param {boolean} isEarlyWithdrawal - Whether it's before reaching the goal
 * @param {string} processingTime - Processing time ('INSTANT', 'DAYS_7', 'DAYS_14', 'DAYS_30')
 * @returns {Object} Fee calculation results
 */
export const calculateWithdrawalFeeLocally = (amount, isEarlyWithdrawal, processingTime) => {
  let feePercentage = 0;
  
  // Early withdrawal fee (20% if withdrawing before reaching goal)
  if (isEarlyWithdrawal) {
    feePercentage += 20;
  }
  
  // Processing time fee
  switch (processingTime) {
    case 'INSTANT':
      feePercentage += 20;
      break;
    case 'DAYS_7':
      feePercentage += 15;
      break;
    case 'DAYS_14':
      feePercentage += 10;
      break;
    case 'DAYS_30':
      feePercentage += 5;
      break;
    default:
      feePercentage += 5; // Default to 30-day processing
  }
  
  const feeAmount = (amount * feePercentage) / 100;
  const netAmount = amount - feeAmount;
  
  return {
    originalAmount: amount,
    feePercentage,
    feeAmount,
    netAmount,
    feeBreakdown: {
      earlyWithdrawalFee: isEarlyWithdrawal ? (amount * 20) / 100 : 0,
      processingTimeFee: (amount * (feePercentage - (isEarlyWithdrawal ? 20 : 0))) / 100
    }
  };
};

/**
 * Calculate service fee locally
 * @param {number} amount - Contribution amount
 * @returns {Object} Service fee calculation results
 */
export const calculateServiceFeeLocally = (amount) => {
  const feePercentage = 10;
  const feeAmount = (amount * feePercentage) / 100;
  const totalCharge = amount + feeAmount;
  
  return {
    contributionAmount: amount,
    feePercentage,
    feeAmount,
    totalChargeAmount: totalCharge
  };
};
