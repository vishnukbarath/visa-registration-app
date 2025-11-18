export const STORAGE_KEYS = {
  CREDENTIALS: 'app_credentials',
  SESSION: 'app_session',
  REGISTRATION_DRAFT: 'registration_draft',
  LOGIN_ATTEMPTS: 'login_attempts',
  LOCKOUT_UNTIL: 'lockout_until',
  THEME_MODE: 'theme_mode',
} as const;

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[\d\s\-()]{10,}$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PHONE_INVALID: 'Please enter a valid phone number',
  USERNAME_INVALID: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
  LOGIN_FAILED: 'Invalid credentials',
  ACCOUNT_LOCKED: 'Account locked due to multiple failed attempts. Try again later.',
} as const;
