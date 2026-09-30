'use client';

import React, { useState } from 'react';
import { useLogin } from '../hooks/use-login';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

/**
 * The left-panel form content for `/login`. The surrounding split-screen shell (the blue
 * decorative panel, the floating brand bar, the footer) lives in the page itself — this
 * component only owns the fields, matching the Figma "Login" frame's form block.
 */
export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    error,
    handleLogin,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-[351px]">
      <div className="mb-10">
        <h1 className="text-[28px] font-medium text-[#2563eb] tracking-tight">Welcome Back</h1>
        <p className="mt-2 text-sm text-[#727783]">Enter your email and password to sign in</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-7">
        <div className="space-y-3">
          <label htmlFor="email" className="block text-sm text-[#23272f]">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 py-3 focus-within:border-[#2563eb] transition-colors">
            <Mail className="h-5 w-5 shrink-0 text-[#adb0b8]" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-[#23272f] placeholder:text-[#adb0b8] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="password" className="block text-sm text-[#23272f]">
            Password
          </label>
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#e9eaec] px-4 py-3 focus-within:border-[#2563eb] transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <Lock className="h-5 w-5 shrink-0 text-[#adb0b8]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-[#23272f] placeholder:text-[#adb0b8] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 text-[#adb0b8] hover:text-[#727783]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs text-[#23272f] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded-[5px] border-[#2563eb] text-[#2563eb] focus:ring-[#2563eb]"
            />
            Remember me
          </label>
          <a href="#" className="text-xs text-[#2563eb] hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center rounded-2xl bg-[#2563eb] text-sm font-medium tracking-wide text-white transition hover:bg-[#1d4fd1] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            'LOGIN'
          )}
        </button>
      </form>
    </div>
  );
}
