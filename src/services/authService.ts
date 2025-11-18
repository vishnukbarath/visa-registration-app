import { StorageService } from './storageService';
import { LoginCredentials, RegistrationData, User, SessionData } from '../types/auth.types';
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION_MS } from '../utils/constants';

export class AuthService {
  private static users: Map<string, { password: string; user: User }> = new Map();

  static async register(data: RegistrationData): Promise<User> {
    // Simulate user creation with unique ID
    const user: User = {
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      phoneNumber: data.phoneNumber,
      country: data.country,
      dateOfBirth: data.dateOfBirth,
      createdAt: new Date().toISOString(),
    };

    // Store user locally (in real app, this would be API call)
    this.users.set(data.email, { password: data.password, user });
    this.users.set(data.username, { password: data.password, user });

    // Clear registration draft after successful registration
    await StorageService.clearRegistrationDraft();

    return user;
  }

  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    // Check if account is locked
    const lockoutTime = await StorageService.getLockoutTime();
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingMinutes = Math.ceil((lockoutTime - Date.now()) / 60000);
      return {
        success: false,
        error: `Account locked. Try again in ${remainingMinutes} minute(s).`,
      };
    }

    // Clear lockout if expired
    if (lockoutTime && Date.now() >= lockoutTime) {
      await StorageService.clearLockout();
      await StorageService.resetLoginAttempts();
    }

    // Attempt authentication
    const userData = this.users.get(credentials.emailOrUsername);
    if (userData && userData.password === credentials.password) {
      // Successful login
      await StorageService.resetLoginAttempts();
      await StorageService.clearLockout();

      // Save session
      const session: SessionData = {
        user: userData.user,
        token: `token_${Date.now()}`, // In real app, this would be JWT
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      await StorageService.saveSession(session);

      // Optionally save credentials for biometric login
      await StorageService.saveCredentials(credentials);

      return { success: true, user: userData.user };
    }

    // Failed login
    const attempts = await StorageService.incrementLoginAttempts();
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      await StorageService.setLockoutTime(lockoutUntil);
      return {
        success: false,
        error: `Too many failed attempts. Account locked for 15 minutes.`,
      };
    }

    return {
      success: false,
      error: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - attempts} attempt(s) remaining.`,
    };
  }

  static async logout(): Promise<void> {
    await StorageService.clearSession();
  }

  static async restoreSession(): Promise<User | null> {
    const session = await StorageService.getSession();
    if (session && session.expiresAt > Date.now()) {
      return session.user;
    }
    // Session expired
    await StorageService.clearSession();
    return null;
  }

  static async checkLockoutStatus(): Promise<{ isLocked: boolean; remainingMinutes?: number }> {
    const lockoutTime = await StorageService.getLockoutTime();
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingMinutes = Math.ceil((lockoutTime - Date.now()) / 60000);
      return { isLocked: true, remainingMinutes };
    }
    return { isLocked: false };
  }
}
