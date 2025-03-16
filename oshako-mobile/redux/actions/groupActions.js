// redux/actions/groupActions.js
import axios from 'axios';
import { BASE_URL } from '../../config/constants';
import {
  GET_GROUPS,
  GET_GROUP,
  CREATE_GROUP,
  JOIN_GROUP,
  INVITE_MEMBERS,
  REQUEST_WITHDRAWAL,
  GROUP_ERROR,
  SET_ERROR,
  CLEAR_ERROR
} from './types';

// Get all groups
export const getGroups = () => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.get(`${BASE_URL}/api/groups`);
    
    dispatch({
      type: GET_GROUPS,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : 'Failed to fetch groups';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    dispatch({
      type: GROUP_ERROR
    });
    
    throw err;
  }
};

// Get single group
export const getGroup = (groupId) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.get(`${BASE_URL}/api/groups/${groupId}`);
    
    dispatch({
      type: GET_GROUP,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : 'Failed to fetch group details';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    dispatch({
      type: GROUP_ERROR
    });
    
    throw err;
  }
};

// Create group
export const createGroup = (groupData) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.post(`${BASE_URL}/api/groups`, groupData);
    
    dispatch({
      type: CREATE_GROUP,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : 'Failed to create group';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    dispatch({
      type: GROUP_ERROR
    });
    
    throw err;
  }
};

// Join group
export const joinGroup = (invitationCode) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.post(`${BASE_URL}/api/groups/join`, { invitationCode });
    
    dispatch({
      type: JOIN_GROUP,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : 'Failed to join group';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    dispatch({
      type: GROUP_ERROR
    });
    
    throw err;
  }
};

// Invite members
export const inviteMembers = (groupId, emails) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.post(`${BASE_URL}/api/groups/${groupId}/invite`, { emails });
    
    dispatch({
      type: INVITE_MEMBERS,
      payload: {
        groupId,
        message: res.data.message
      }
    });
    
    return res.data;
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : 'Failed to send invitations';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    dispatch({
      type: GROUP_ERROR
    });
    
    throw err;
  }
};

// Request withdrawal
export const requestWithdrawal = (groupId, withdrawalData) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.post(`${BASE_URL}/api/groups/${groupId}/withdraw`, withdrawalData);
    
    dispatch({
      type: REQUEST_WITHDRAWAL,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : 'Failed to request withdrawal';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    dispatch({
      type: GROUP_ERROR
    });
    
    throw err;
  }
};
