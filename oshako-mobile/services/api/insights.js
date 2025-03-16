// File: services/api/insights.js
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { getAuthHeader } from './auth';

/**
 * Get user's savings insights
 * @param {string} timeRange - Time range for insights (1M, 3M, 6M, 1Y, ALL)
 * @returns {Promise<Object>} - User's savings insights data
 */
export const getSavingsInsights = async (timeRange = '6M') => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/insights/savings`,
      { 
        headers,
        params: { timeRange }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getSavingsInsights:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get savings insights' };
  }
};

/**
 * Get personalized financial insights
 * @returns {Promise<Object>} - Personalized financial insights data
 */
export const getPersonalizedInsights = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/insights/personalized`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getPersonalizedInsights:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get personalized insights' };
  }
};

/**
 * Get savings trend analysis
 * @param {string} timeRange - Time range for trend analysis (1M, 3M, 6M, 1Y, ALL)
 * @returns {Promise<Object>} - Savings trend analysis data
 */
export const getSavingsTrends = async (timeRange = '6M') => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/insights/trends`,
      { 
        headers,
        params: { timeRange }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getSavingsTrends:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get savings trends' };
  }
};

/**
 * Get spending pattern analysis
 * @param {string} timeRange - Time range for pattern analysis (1M, 3M, 6M, 1Y, ALL)
 * @returns {Promise<Object>} - Spending pattern analysis data
 */
export const getSpendingPatterns = async (timeRange = '6M') => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/insights/spending-patterns`,
      { 
        headers,
        params: { timeRange }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getSpendingPatterns:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get spending patterns' };
  }
};

/**
 * Get savings goal projections
 * @param {string} goalId - ID of the savings goal
 * @returns {Promise<Object>} - Savings goal projections data
 */
export const getGoalProjections = async (goalId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/insights/goal-projections/${goalId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getGoalProjections:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get goal projections' };
  }
};

/**
 * Get user's financial health score
 * @returns {Promise<Object>} - Financial health score data
 */
export const getFinancialHealthScore = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/insights/financial-health`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getFinancialHealthScore:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get financial health score' };
  }
};
