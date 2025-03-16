// File: services/api/support.js
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { getAuthHeader } from './auth';

/**
 * Get a support ticket by ID
 * @param {string} ticketId - The ID of the support ticket
 * @returns {Promise<Object>} - The support ticket details
 */
export const getSupportTicket = async (ticketId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/support/tickets/${ticketId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getSupportTicket:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to get support ticket' };
  }
};

/**
 * Get all support tickets for the current user
 * @param {Object} filters - Optional filters for tickets
 * @returns {Promise<Array>} - List of support tickets
 */
export const getUserSupportTickets = async (filters = {}) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(
      `${API_BASE_URL}/support/tickets`,
      { 
        headers,
        params: filters
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - getUserSupportTickets:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch support tickets' };
  }
};

/**
 * Create a new support ticket
 * @param {Object} ticketData - The ticket data
 * @param {string} ticketData.subject - Ticket subject
 * @param {string} ticketData.category - Ticket category
 * @param {string} ticketData.message - Initial message
 * @param {string} [ticketData.priority] - Ticket priority (default: MEDIUM)
 * @param {string} [ticketData.relatedGroupId] - ID of related group (if applicable)
 * @returns {Promise<Object>} - The created ticket
 */
export const createSupportTicket = async (ticketData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/support/tickets`,
      ticketData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - createSupportTicket:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to create support ticket' };
  }
};

/**
 * Add a message to a support ticket
 * @param {string} ticketId - The ID of the support ticket
 * @param {Object} messageData - The message data
 * @param {string} messageData.content - Message content
 * @returns {Promise<Object>} - The created message
 */
export const addMessageToTicket = async (ticketId, messageData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/support/tickets/${ticketId}/messages`,
      messageData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - addMessageToTicket:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to add message' };
  }
};

/**
 * Close a support ticket
 * @param {string} ticketId - The ID of the support ticket
 * @returns {Promise<Object>} - The updated ticket
 */
export const closeTicket = async (ticketId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/support/tickets/${ticketId}/close`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - closeTicket:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to close ticket' };
  }
};

/**
 * Reopen a closed support ticket
 * @param {string} ticketId - The ID of the support ticket
 * @returns {Promise<Object>} - The updated ticket
 */
export const reopenTicket = async (ticketId) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/support/tickets/${ticketId}/reopen`,
      {},
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - reopenTicket:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to reopen ticket' };
  }
};

/**
 * Create a dispute support ticket for a withdrawal
 * @param {string} groupId - The ID of the group
 * @param {string} withdrawalId - The ID of the withdrawal
 * @param {Object} disputeData - The dispute data
 * @returns {Promise<Object>} - The created ticket
 */
export const createDisputeTicket = async (groupId, withdrawalId, disputeData) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/support/disputes`,
      {
        groupId,
        withdrawalId,
        ...disputeData
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('API Error - createDisputeTicket:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to create dispute ticket' };
  }
};
