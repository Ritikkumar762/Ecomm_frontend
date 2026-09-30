'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#727783]">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-[#e9eaec] bg-white px-3 py-2 text-sm text-[#23272f] placeholder:text-[#adb0b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition',
            error && 'border-[#df2e2e] focus:ring-[#df2e2e]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#df2e2e] font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
