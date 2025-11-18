import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX, USERNAME_REGEX, ERROR_MESSAGES } from './constants';

export const validateEmail = (email: string): string | undefined => {
  if (!email) return ERROR_MESSAGES.REQUIRED;
  if (!EMAIL_REGEX.test(email)) return ERROR_MESSAGES.EMAIL_INVALID;
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return ERROR_MESSAGES.REQUIRED;
  if (!PASSWORD_REGEX.test(password)) return ERROR_MESSAGES.PASSWORD_WEAK;
  return undefined;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return ERROR_MESSAGES.REQUIRED;
  if (password !== confirmPassword) return ERROR_MESSAGES.PASSWORD_MISMATCH;
  return undefined;
};

export const validatePhoneNumber = (phone: string): string | undefined => {
  if (!phone) return ERROR_MESSAGES.REQUIRED;
  if (!PHONE_REGEX.test(phone)) return ERROR_MESSAGES.PHONE_INVALID;
  return undefined;
};

export const validateUsername = (username: string): string | undefined => {
  if (!username) return ERROR_MESSAGES.REQUIRED;
  if (!USERNAME_REGEX.test(username)) return ERROR_MESSAGES.USERNAME_INVALID;
  return undefined;
};

export const validateRequired = (value: string | boolean): string | undefined => {
  if (!value) return ERROR_MESSAGES.REQUIRED;
  return undefined;
};

export const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  if (strength <= 2) return { strength, label: 'Weak', color: '#ff4444' };
  if (strength <= 3) return { strength, label: 'Medium', color: '#ffbb33' };
  return { strength, label: 'Strong', color: '#00C851' };
};
