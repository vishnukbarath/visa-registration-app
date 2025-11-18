import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const restoredUser = await AuthService.restoreSession();
      setUser(restoredUser);
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    const result = await AuthService.login({ emailOrUsername, password });
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (data: any) => {
    try {
      const newUser = await AuthService.register(data);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
