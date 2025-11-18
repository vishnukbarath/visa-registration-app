export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
  dateOfBirth: string;
  agreeToTerms: boolean;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  country: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loginAttempts: number;
  isLocked: boolean;
  lockoutUntil: number | null;
}

export interface SessionData {
  user: User;
  token: string;
  expiresAt: number;
}
