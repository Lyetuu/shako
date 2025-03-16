// redux/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Import reducers
import authReducer from './reducers/authReducer';
import groupReducer from './reducers/groupReducer';
import savingsReducer from './reducers/savingsReducer';
import paymentReducer from './reducers/paymentReducer';
import errorReducer from './reducers/errorReducer';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  groups: groupReducer,
  savings: savingsReducer,
  payments: paymentReducer,
  errors: errorReducer
});

// Create store
export const store = createStore(rootReducer, applyMiddleware(thunk));