import TouchID from 'react-native-touch-id';
import { Platform } from 'react-native';

export class BiometricService {
  static async isAvailable(): Promise<boolean> {
    try {
      const biometryType = await TouchID.isSupported();
      return !!biometryType;
    } catch (error) {
      return false;
    }
  }

  static async authenticate(reason: string = 'Authenticate to access your account'): Promise<boolean> {
    try {
      const config = {
        title: 'Authentication Required',
        imageColor: '#e00606',
        imageErrorColor: '#ff0000',
        sensorDescription: 'Touch sensor',
        sensorErrorDescription: 'Failed',
        cancelText: 'Cancel',
        fallbackLabel: 'Use Passcode',
        unifiedErrors: false,
        passcodeFallback: Platform.OS === 'ios',
      };

      await TouchID.authenticate(reason, config);
      return true;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }

  static async getBiometricType(): Promise<string | null> {
    try {
      const biometryType = await TouchID.isSupported();
      return biometryType as string;
    } catch (error) {
      return null;
    }
  }
}
