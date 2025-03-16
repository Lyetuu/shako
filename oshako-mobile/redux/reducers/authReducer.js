// redux/reducers/authReducer.js
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  TWO_FACTOR_REQUIRED,
  TWO_FACTOR_SETUP_SUCCESS,
  TWO_FACTOR_VERIFY_SUCCESS
} from '../actions/types';

const initialState = {
  token: null,
  isAuthenticated: false,
  loading: true,
  user: null,
  twoFactorRequired: false,
  userId: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case TWO_FACTOR_VERIFY_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        twoFactorRequired: false
      };
    case TWO_FACTOR_REQUIRED:
      return {
        ...state,
        loading: false,
        twoFactorRequired: true,
        userId: payload.userId
      };
    case TWO_FACTOR_SETUP_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          twoFactorEnabled: true
        }
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        twoFactorRequired: false,
        userId: null
      };
    default:
      return state;
  }
}