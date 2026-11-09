import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  storeName: string;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storeName, setStoreName] = useState<string>('CLEVARA');

  const checkAuth = async (): Promise<boolean> => {
    try {
      const res = await api.verifyAuth();
      setIsAuthenticated(res.authenticated);
      if (res.storeName) setStoreName(res.storeName);
      return res.authenticated;
    } catch {
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (password: string) => {
    const res = await api.login(password);
    localStorage.setItem('clevara_admin_token', res.token);
    setIsAuthenticated(true);
    setStoreName(res.storeName || 'CLEVARA');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('clevara_admin_token');
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        storeName,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
