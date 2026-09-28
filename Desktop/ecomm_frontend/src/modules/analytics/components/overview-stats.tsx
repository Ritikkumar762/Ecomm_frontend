'use client';

import React from 'react';
import { useAnalyticsData } from '../hooks/use-analytics-data';
import { StatsCard } from '@/components/ui/stats-card';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export function OverviewStats() {
  const { stats, loading } = useAnalyticsData();

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        change={stats.revenueChange}
        isPositive={true}
        icon={DollarSign}
      />
      <StatsCard
        title="Total Orders"
        value={stats.totalOrders}
        change={stats.ordersChange}
        isPositive={true}
        icon={ShoppingCart}
      />
      <StatsCard
        title="Active Customers"
        value={stats.totalCustomers}
        change={stats.customersChange}
        isPositive={true}
        icon={Users}
      />
      <StatsCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        change={stats.conversionChange}
        isPositive={true}
        icon={TrendingUp}
      />
    </div>
  );
}
