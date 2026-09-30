'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-[#2563eb] text-white hover:bg-[#1d4fd1] focus:ring-[#2563eb]',
      secondary: 'bg-[#f6f9fe] text-[#23272f] hover:bg-[#e9eaec] focus:ring-[#adb0b8]',
      outline: 'border border-[#e9eaec] text-[#23272f] hover:bg-[#f6f9fe] focus:ring-[#adb0b8]',
      danger: 'bg-[#df2e2e] text-white hover:bg-[#c92727] focus:ring-[#df2e2e]',
      ghost: 'text-[#7c818d] hover:bg-[#f6f9fe] focus:ring-[#adb0b8]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
