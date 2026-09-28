'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
}

export function StatsCard({ title, value, change, isPositive, icon: Icon }: StatsCardProps) {
  return (
    <Card className="hover:border-slate-300 transition-all shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
          {change && (
            <p className={`text-xs font-medium mt-1.5 flex items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <span>{isPositive ? '↑' : '↓'} {change}</span>
              <span className="text-slate-400 ml-1">vs last month</span>
            </p>
          )}
        </div>
        <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
