// File: services/api/auth.js
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key
const TOKEN_KEY = '@app_token';

/**
 * Get authentication header with token
 * @returns {Promise<Object>} Headers object with authorization token
 */
export const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with token and user data
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Registration failed' };
  }
};

/**
 * Logout user
 * @param {string} token - User authentication token
 * @returns {Promise<void>}
 */
export const logout = async (token) => {
  try {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    // We don't throw here since we want logout to succeed even if the API call fails
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Response data
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to request password reset' };
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response data
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Password reset error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_BASE_URL}/users/me`, { headers });
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.put(`${API_BASE_URL}/users/me`, profileData, { headers });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<string>} New token
 */
export const refreshToken = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { headers });
    
    // Store the new token
    const newToken = response.data.token;
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    
    return newToken;
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to refresh token' };
  }
};
