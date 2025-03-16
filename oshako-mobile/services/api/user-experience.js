import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';

/**
 * Get available tutorials
 * @returns {Promise<Array>} - List of available tutorials
 */
export const getTutorials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tutorials`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch tutorials');
  }
};

/**
 * Get user's onboarding progress
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Onboarding progress data
 */
export const getOnboardingProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/onboarding-progress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch onboarding progress');
  }
};

/**
 * Mark a tutorial as complete
 * @param {string} userId - User ID
 * @param {string} tutorialId - Tutorial ID
 * @returns {Promise<Object>} - Updated tutorial status
 */
export const markTutorialComplete = async (userId, tutorialId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/tutorials/${tutorialId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error marking tutorial as complete:', error);
    throw new Error(error.response?.data?.message || 'Failed to complete tutorial');
  }
};

/**
 * Get user's dashboard widgets
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Dashboard widgets configuration
 */
export const getDashboardWidgets = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/dashboard-widgets`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard widgets:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard widgets');
  }
};

/**
 * Update dashboard layout
 * @param {string} userId - User ID
 * @param {Array} widgets - Updated widgets configuration
 * @returns {Promise<Object>} - Updated dashboard configuration
 */
export const updateDashboardLayout = async (userId, widgets) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/dashboard-widgets`, {
      widgets
    });
    return response.data;
  } catch (error) {
    console.error('Error updating dashboard layout:', error);
    throw new Error(error.response?.data?.message || 'Failed to update dashboard layout');
  }
};

/**
 * Get user's notification settings
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Notification settings
 */
export const getNotificationSettings = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/notification-settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch notification settings');
  }
};

/**
 * Update notification settings
 * @param {string} userId - User ID
 * @param {Array} settings - Updated notification settings
 * @returns {Promise<Object>} - Updated notification settings
 */
export const updateNotificationSettings = async (userId, settings) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/notification-settings`, {
      settings
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw new Error(error.response?.data?.message || 'Failed to update notification settings');
  }
};

/**
 * Get available feature flags
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Available feature flags
 */
export const getFeatureFlags = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/feature-flags`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch feature flags');
  }
};

/**
 * Enable a specific feature
 * @param {string} userId - User ID
 * @param {string} featureId - Feature ID
 * @returns {Promise<Object>} - Updated feature status
 */
export const enableFeature = async (userId, featureId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/feature-flags/${featureId}/enable`);
    return response.data;
  } catch (error) {
    console.error('Error enabling feature:', error);
    throw new Error(error.response?.data?.message || 'Failed to enable feature');
  }
};

/**
 * Submit user feedback
 * @param {string} userId - User ID
 * @param {Object} feedbackData - Feedback data
 * @returns {Promise<Object>} - Submission confirmation
 */
export const submitFeedback = async (userId, feedbackData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit feedback');
  }
};

/**
 * Complete onboarding flow
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Updated onboarding status
 */
export const completeOnboarding = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/complete-onboarding`);
    return response.data;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw new Error(error.response?.data?.message || 'Failed to complete onboarding');
  }
};