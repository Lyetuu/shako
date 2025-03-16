// File: utils/notificationHelper.js
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const NOTIFICATION_TOKEN_KEY = '@app_notification_token';
const NOTIFICATIONS_ENABLED_KEY = '@app_notifications_enabled';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and return the token
 * @returns {Promise<string|null>} The push notification token
 */
export const registerForPushNotificationsAsync = async () => {
  // Check if notifications are enabled
  const notificationsEnabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  if (notificationsEnabled === 'false') {
    return null;
  }
  
  // Check stored token first
  const existingToken = await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);
  if (existingToken) return existingToken;
  
  // Device must be physical (not simulator) and have the capability
  if (!Constants.isDevice) {
    console.log('Must use physical device for push notifications');
    return null;
  }

  // Request permissions
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  // Get push notification token
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Store the token for future use
    await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
    
    // Platform-specific setup
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6200EE',
      });
    }
    
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

/**
 * Set whether notifications are enabled
 * @param {boolean} enabled Whether notifications should be enabled
 */
export const setNotificationsEnabled = async (enabled) => {
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled ? 'true' : 'false');
  
  if (enabled) {
    // Register for notifications if enabling
    await registerForPushNotificationsAsync();
  }
};

/**
 * Check if notifications are enabled
 * @returns {Promise<boolean>} Whether notifications are enabled
 */
export const areNotificationsEnabled = async () => {
  const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return enabled !== 'false'; // Default to true if not set
};

/**
 * Schedule a local notification
 * @param {string} title The notification title
 * @param {string} body The notification body
 * @param {Object} data Additional data to include with the notification
 * @param {number} seconds Seconds from now to show the notification
 * @returns {Promise<string>} The notification identifier
 */
export const scheduleLocalNotification = async (title, body, data = {}, seconds = 5) => {
  const notificationsEnabled = await areNotificationsEnabled();
  if (!notificationsEnabled) return null;
  
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: { seconds },
  });
};

/**
 * Cancel a scheduled notification
 * @param {string} notificationId The notification identifier
 */
export const cancelNotification = async (notificationId) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Set the badge count on the app icon
 * @param {number} count The badge count to set
 */
export const setBadgeCount = async (count) => {
  await Notifications.setBadgeCountAsync(count);
};

/**
 * Get the current badge count
 * @returns {Promise<number>} The current badge count
 */
export const getBadgeCount = async () => {
  return await Notifications.getBadgeCountAsync();
};

/**
 * Clear the badge count
 */
export const clearBadgeCount = async () => {
  await Notifications.setBadgeCountAsync(0);
};
