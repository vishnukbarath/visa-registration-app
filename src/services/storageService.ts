import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { STORAGE_KEYS } from '../utils/constants';
import { LoginCredentials, SessionData, RegistrationData } from '../types/auth.types';

export class StorageService {
  // Secure credential storage using Keychain
  static async saveCredentials(credentials: LoginCredentials): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(
        credentials.emailOrUsername,
        credentials.password,
        {
          service: STORAGE_KEYS.CREDENTIALS,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        }
      );
      return true;
    } catch (error) {
      console.error('Failed to save credentials:', error);
      return false;
    }
  }

  static async getCredentials(): Promise<LoginCredentials | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: STORAGE_KEYS.CREDENTIALS,
      });
      if (credentials) {
        return {
          emailOrUsername: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get credentials:', error);
      return null;
    }
  }

  static async clearCredentials(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({
        service: STORAGE_KEYS.CREDENTIALS,
      });
      return true;
    } catch (error) {
      console.error('Failed to clear credentials:', error);
      return false;
    }
  }

  // Session management
  static async saveSession(session: SessionData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  }

  static async getSession(): Promise<SessionData | null> {
    try {
      const session = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  static async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  // Registration draft persistence
  static async saveRegistrationDraft(data: Partial<RegistrationData>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REGISTRATION_DRAFT, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save registration draft:', error);
    }
  }

  static async getRegistrationDraft(): Promise<Partial<RegistrationData> | null> {
    try {
      const draft = await AsyncStorage.getItem(STORAGE_KEYS.REGISTRATION_DRAFT);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Failed to get registration draft:', error);
      return null;
    }
  }

  static async clearRegistrationDraft(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REGISTRATION_DRAFT);
    } catch (error) {
      console.error('Failed to clear registration draft:', error);
    }
  }

  // Login attempt tracking
  static async getLoginAttempts(): Promise<number> {
    try {
      const attempts = await AsyncStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
      return attempts ? parseInt(attempts, 10) : 0;
    } catch (error) {
      console.error('Failed to get login attempts:', error);
      return 0;
    }
  }

  static async incrementLoginAttempts(): Promise<number> {
    try {
      const currentAttempts = await this.getLoginAttempts();
      const newAttempts = currentAttempts + 1;
      await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts.toString());
      return newAttempts;
    } catch (error) {
      console.error('Failed to increment login attempts:', error);
      return 0;
    }
  }

  static async resetLoginAttempts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    } catch (error) {
      console.error('Failed to reset login attempts:', error);
    }
  }

  static async setLockoutTime(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, timestamp.toString());
    } catch (error) {
      console.error('Failed to set lockout time:', error);
    }
  }

  static async getLockoutTime(): Promise<number | null> {
    try {
      const time = await AsyncStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
      return time ? parseInt(time, 10) : null;
    } catch (error) {
      console.error('Failed to get lockout time:', error);
      return null;
    }
  }

  static async clearLockout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    } catch (error) {
      console.error('Failed to clear lockout:', error);
    }
  }

  // Theme preference
  static async saveThemeMode(mode: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  }

  static async getThemeMode(): Promise<'light' | 'dark' | null> {
    try {
      const mode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return mode as 'light' | 'dark' | null;
    } catch (error) {
      console.error('Failed to get theme mode:', error);
      return null;
    }
  }
}
