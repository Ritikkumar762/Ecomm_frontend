'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Categories', href: '/categories', icon: FolderTree },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'relative bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-800 z-30 min-h-screen',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="bg-sky-500 text-white p-2 rounded-lg font-bold flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-white tracking-tight text-lg whitespace-nowrap">
              EcommAdmin
            </span>
          )}
        </Link>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav links */}
      <div className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p className="font-medium text-slate-400">Ecomm Store v1.0.0</p>
          <p>Admin Dashboard System</p>
        </div>
      )}
    </aside>
  );
}
