'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth-service';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api-client';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { login: setAuthSession } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      setAuthSession(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        // 401 covers both "no such account" and "wrong password" — the backend deliberately
        // keeps those indistinguishable so a login form can't be used to enumerate accounts.
        setError(
          err.status === 401
            ? 'Incorrect email or password.'
            : err.status === 0
              ? err.message
              : err.message || 'Login failed. Please try again.',
        );
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    error,
    handleLogin,
  };
}
