import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; city?: string; preferred_locality?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('needradar_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (localStorage.getItem('needradar_token')) {
        const userData = await api.get<User>('/auth/me');
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      localStorage.removeItem('needradar_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ access_token: string; user: User }>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('needradar_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: {
    email: string;
    password: string;
    full_name: string;
    city?: string;
    preferred_locality?: string;
  }) => {
    const res = await api.post<{ access_token: string; user: User }>('/auth/register', data);
    localStorage.setItem('needradar_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('needradar_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
