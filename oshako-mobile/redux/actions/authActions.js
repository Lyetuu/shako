// redux/actions/authActions.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config/constants';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_ERROR,
  CLEAR_ERROR,
  TWO_FACTOR_REQUIRED,
  TWO_FACTOR_SETUP_SUCCESS,
  TWO_FACTOR_VERIFY_SUCCESS
} from './types';

// Set auth token
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    AsyncStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    AsyncStorage.removeItem('token');
  }
};

// Load user
export const loadUser = () => async dispatch => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      
      const res = await axios.get(`${BASE_URL}/api/auth/user`);
      
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });

      return res.data;
    }
    
    return null;
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });

    throw err;
  }
};

// Register user
export const register = (userData) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    
    setAuthToken(res.data.token);
    
    return dispatch(loadUser());
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : 'Registration failed';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    dispatch({
      type: REGISTER_FAIL
    });
    
    throw err;
  }
};

// Login user
export const login = (email, password) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
    
    // Check if 2FA is required
    if (res.data.twoFactorRequired) {
      dispatch({
        type: TWO_FACTOR_REQUIRED,
        payload: {
          userId: res.data.userId
        }
      });
      
      return { twoFactorRequired: true };
    }
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    
    setAuthToken(res.data.token);
    
    return dispatch(loadUser());
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : 'Login failed';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    dispatch({
      type: LOGIN_FAIL
    });
    
    throw err;
  }
};

// Verify 2FA
export const verify2FA = (userId, token) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/verify-2fa`, { userId, token });
    
    dispatch({
      type: TWO_FACTOR_VERIFY_SUCCESS,
      payload: res.data
    });
    
    setAuthToken(res.data.token);
    
    return dispatch(loadUser());
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : '2FA verification failed';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    throw err;
  }
};

// Setup 2FA
export const setup2FA = (method) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/setup-2fa`, { twoFactorMethod: method });
    
    return res.data;
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : '2FA setup failed';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    throw err;
  }
};

// Confirm 2FA setup
export const confirm2FA = (token) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  
  try {
    await axios.post(`${BASE_URL}/api/auth/confirm-2fa`, { token });
    
    dispatch({
      type: TWO_FACTOR_SETUP_SUCCESS
    });
    
    return true;
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data.message : '2FA confirmation failed';
    
    dispatch({
      type: SET_ERROR,
      payload: message
    });
    
    throw err;
  }
};

// Logout
export const logout = () => dispatch => {
  setAuthToken(null);
  dispatch({ type: LOGOUT });
};