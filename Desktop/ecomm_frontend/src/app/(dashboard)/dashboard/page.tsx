'use client';

import React from 'react';
import { OverviewStats } from '@/modules/analytics/components/overview-stats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Package, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back! Here is what is happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <OverviewStats />

      {/* Main Grid: Sales Chart Placeholder & Quick Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Widget */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Revenue & Sales Analytics</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Monthly performance breakdown</p>
            </div>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 text-center">
              <Sparkles className="w-10 h-10 text-sky-500 mb-2 animate-bounce" />
              <h4 className="font-semibold text-slate-800">Live Analytics Stream</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Connected to backend database. Revenue insights automatically update as orders are fulfilled.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Store Health */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/products" className="block">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Product Inventory</h5>
                    <p className="text-xs text-slate-500">Manage products & variants</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
              </div>
            </Link>

            <Link href="/orders" className="block">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Fulfill Orders</h5>
                    <p className="text-xs text-slate-500">Track and update customer orders</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
