'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthUser } from '@/modules/auth/types/auth.types';
import { authService } from '@/modules/auth/services/auth-service';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore the session from what `login()` persisted. No mock/demo fallback: the absence
    // of a stored session means signed out, full stop — the login screen decides what
    // happens next, not this hook.
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: AuthUser, token: string, refreshToken?: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    if (refreshToken) localStorage.setItem('auth_refresh_token', refreshToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    // Best-effort: revoke the session server-side, but the local sign-out must not hang on
    // the network — an already-expired token would otherwise strand the user on the page.
    void authService.logout().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('auth_refresh_token');
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
