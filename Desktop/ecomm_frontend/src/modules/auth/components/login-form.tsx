'use client';

import React from 'react';
import { useLogin } from '../hooks/use-login';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Store, Lock, Mail } from 'lucide-react';

export function LoginForm() {
  const { email, setEmail, password, setPassword, isLoading, error, handleLogin } = useLogin();

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-slate-900 text-white mb-3 shadow-md">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal Login</h2>
        <p className="text-sm text-slate-500 mt-1">Sign in to manage your e-commerce platform</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@ecomm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full mt-6 py-2.5">
          Sign In to Dashboard
        </Button>
      </form>
    </div>
  );
}
