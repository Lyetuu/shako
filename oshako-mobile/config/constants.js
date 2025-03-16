// API configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yoursavingsapp.com/v1'
  : 'https://dev-api.yoursavingsapp.com/v1';

// App constants
export const APP_NAME = 'Group Savings';
export const APP_VERSION = '1.0.0';

// Authentication
export const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

// Contributions
export const MIN_CONTRIBUTION_AMOUNT = 5; // Minimum amount for a contribution
export const DEFAULT_CONTRIBUTION_FREQUENCY = 'MONTHLY';
export const CONTRIBUTION_FREQUENCIES = [
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Bi-weekly', value: 'BIWEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' }
];

// Withdrawals
export const MIN_WITHDRAWAL_AMOUNT = 10; // Minimum amount for a withdrawal
export const WITHDRAWAL_PROCESSING_TIME = '1-3 business days';

// UI Constants
export const THEME_COLORS = {
  primary: '#6200ee',
  secondary: '#03dac6',
  error: '#b00020',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#000000',
  disabled: '#9e9e9e',
  placeholder: '#9e9e9e',
  backdrop: 'rgba(0, 0, 0, 0.5)'
};

// Form validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_REGEX: /^\(\d{3}\) \d{3}-\d{4}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Withdrawal Fees
export const WITHDRAWAL_FEES = {
  EARLY_WITHDRAWAL: 20, // 20% fee for withdrawing before reaching goal
  PROCESSING_TIMES: {
    INSTANT: 20, // 20% fee for instant processing
    DAYS_7: 15,  // 15% fee for 7-day processing
    DAYS_14: 10, // 10% fee for 14-day processing
    DAYS_30: 5,  // 5% fee for 30-day processing
  }
};

// Service Fee
export const SERVICE_FEE_PERCENTAGE = 10; // 10% service fee on all contributions
