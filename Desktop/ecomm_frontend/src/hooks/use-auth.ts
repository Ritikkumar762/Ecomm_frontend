'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/common.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage or Auth session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    } else {
      // Default fallback mock user for admin demo
      const mockAdmin: User = {
        id: 'usr_admin_01',
        name: 'Ritik Admin',
        email: 'admin@ecomm.com',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      };
      setUser(mockAdmin);
      localStorage.setItem('auth_user', JSON.stringify(mockAdmin));
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };
}
