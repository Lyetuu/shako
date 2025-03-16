import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';

/**
 * Send a notification through multiple channels (app, email, WhatsApp)
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.userId - User ID to notify
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.message - Notification message
 * @param {string[]} notificationData.channels - Notification channels ['app', 'email', 'whatsapp']
 * @param {Object} notificationData.data - Additional data for the notification
 * @returns {Promise<Object>} Notification status for each channel
 */
export const sendMultiChannelNotification = async (notificationData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/notifications/multi-channel`,
      notificationData
    );
    return response.data;
  } catch (error) {
    console.error('Error sending multi-channel notification:', error);
    throw new Error(error.response?.data?.message || 'Failed to send notification');
  }
};

/**
 * Send a payment reminder notification through configured channels
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member ID to remind
 * @param {Object} reminderData - Reminder data
 * @param {string} reminderData.message - Reminder message
 * @param {string[]} reminderData.channels - Notification channels ['app', 'email', 'whatsapp']
 * @returns {Promise<Object>} Notification status for each channel
 */
export const sendPaymentReminderNotification = async (groupId, memberId, reminderData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/groups/${groupId}/members/${memberId}/remind-multi-channel`,
      reminderData
    );
    return response.data;
  } catch (error) {
    console.error('Error sending payment reminder notification:', error);
    throw new Error(error.response?.data?.message || 'Failed to send reminder');
  }
};

/**
 * Send group-wide payment reminder notifications
 * @param {string} groupId - Group ID
 * @param {Object} reminderData - Reminder data
 * @param {string} reminderData.message - Reminder message
 * @param {string[]} reminderData.channels - Notification channels ['app', 'email', 'whatsapp']
 * @returns {Promise<Object>} Notification status with count
 */
export const sendGroupReminderNotifications = async (groupId, reminderData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/groups/${groupId}/remind-all-multi-channel`,
      reminderData
    );
    return response.data;
  } catch (error) {
    console.error('Error sending group-wide reminders:', error);
    throw new Error(error.response?.data?.message || 'Failed to send reminders');
  }
};

/**
 * Send payment retry notification through configured channels
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member ID
 * @param {Object} retryData - Retry notification data
 * @param {string} retryData.message - Notification message
 * @param {string[]} retryData.channels - Notification channels ['app', 'email', 'whatsapp']
 * @returns {Promise<Object>} Notification status for each channel
 */
export const sendPaymentRetryNotification = async (groupId, memberId, retryData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/groups/${groupId}/members/${memberId}/retry-notification`,
      retryData
    );
    return response.data;
  } catch (error) {
    console.error('Error sending payment retry notification:', error);
    throw new Error(error.response?.data?.message || 'Failed to send retry notification');
  }
};

/**
 * Get user notification preferences
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User notification preferences
 */
export const getUserNotificationPreferences = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/${userId}/notification-preferences`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch notification preferences');
  }
};

/**
 * Update user notification preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Notification preferences
 * @param {boolean} preferences.enableAppNotifications - Enable in-app notifications
 * @param {boolean} preferences.enableEmailNotifications - Enable email notifications
 * @param {boolean} preferences.enableWhatsAppNotifications - Enable WhatsApp notifications
 * @param {boolean} preferences.enablePaymentReminders - Enable payment reminder notifications
 * @param {boolean} preferences.enableGroupUpdates - Enable group update notifications
 * @returns {Promise<Object>} Updated notification preferences
 */
export const updateNotificationPreferences = async (userId, preferences) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}/notification-preferences`,
      preferences
    );
    return response.data;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw new Error(error.response?.data?.message || 'Failed to update notification preferences');
  }
};

/**
 * Verify and connect WhatsApp number for notifications
 * @param {string} userId - User ID
 * @param {string} phoneNumber - WhatsApp phone number with country code
 * @returns {Promise<Object>} WhatsApp verification status
 */
export const connectWhatsAppNotifications = async (userId, phoneNumber) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/${userId}/connect-whatsapp`,
      { phoneNumber }
    );
    return response.data;
  } catch (error) {
    console.error('Error connecting WhatsApp notifications:', error);
    throw new Error(error.response?.data?.message || 'Failed to connect WhatsApp');
  }
};

/**
 * Verify WhatsApp number with OTP
 * @param {string} userId - User ID
 * @param {string} otp - One-time password received on WhatsApp
 * @returns {Promise<Object>} Verification status
 */
export const verifyWhatsAppOTP = async (userId, otp) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/${userId}/verify-whatsapp`,
      { otp }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying WhatsApp OTP:', error);
    throw new Error(error.response?.data?.message || 'Failed to verify WhatsApp');
  }
};

/**
 * Configure group notification settings
 * @param {string} groupId - Group ID
 * @param {Object} settings - Notification settings
 * @param {string[]} settings.defaultChannels - Default notification channels ['app', 'email', 'whatsapp']
 * @param {boolean} settings.allowMemberOptOut - Allow members to opt out of notifications
 * @param {boolean} settings.sendPaymentReminders - Send payment reminders
 * @param {boolean} settings.sendDefaulterNotifications - Send defaulter notifications to all members
 * @returns {Promise<Object>} Updated notification settings
 */
export const configureGroupNotificationSettings = async (groupId, settings) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/groups/${groupId}/notification-settings`,
      settings
    );
    return response.data;
  } catch (error) {
    console.error('Error updating group notification settings:', error);
    throw new Error(error.response?.data?.message || 'Failed to update notification settings');
  }
};

/**
 * Get group notification settings
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Group notification settings
 */
export const getGroupNotificationSettings = async (groupId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/groups/${groupId}/notification-settings`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching group notification settings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch notification settings');
  }
};
