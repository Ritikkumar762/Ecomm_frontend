'use client';

import React from 'react';
import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, logout } = useAuth();
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <header className="h-16 bg-white border-b border-[#e9eaec] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 py-2.5 max-w-md w-full">
        <Search className="h-4 w-4 shrink-0 text-[#7c818d]" />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="w-full bg-transparent text-sm text-[#23272f] placeholder:text-[#7c818d] focus:outline-none"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative rounded-xl p-2 text-[#7c818d] transition hover:bg-[#f6f9fe] hover:text-[#23272f]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#df2e2e] rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-[#e9eaec]" />

        {/* User Profile info */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#2563eb] text-sm font-medium text-white">
            {initials || <UserIcon className="h-5 w-5 text-white/70" />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium leading-tight text-[#23272f]">{fullName || 'Admin User'}</p>
            <p className="text-xs text-[#7c818d]">{user?.email || ''}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="ml-1 rounded-xl p-2 text-[#adb0b8] transition hover:bg-[#fceeee] hover:text-[#df2e2e]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
