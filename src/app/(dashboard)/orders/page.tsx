'use client';

import React, { useState } from 'react';
import { Search, Upload, Plus, Calendar } from 'lucide-react';
import { useOrders } from '@/modules/orders/hooks/use-orders';
import { OrderTable } from '@/modules/orders/components/order-table';
import { Pagination } from '@/components/ui/pagination';
import { ORDER_DISPLAY_STATUSES, OrderDisplayStatus } from '@/modules/orders/types/order.types';

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OrdersPage() {
  const {
    orders,
    summary,
    total,
    page,
    setPage,
    pageSize,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    displayStatus,
    setDisplayStatus,
    placedFrom,
    setPlacedFrom,
    placedTo,
    setPlacedTo,
    cancellingOrder,
    cancelOrder,
  } = useOrders();

  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const hasDateRange = Boolean(placedFrom || placedTo);

  const pageStart = total === 0 ? 0 : page * pageSize + 1;
  const pageEnd = Math.min(total, (page + 1) * pageSize);

  const tabs: { label: string; value: OrderDisplayStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    ...ORDER_DISPLAY_STATUSES.map((s) => ({ label: titleCase(s), value: s })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-[#23272f]">Orders List</h1>
          <p className="mt-1 text-xs text-[#7c818d]">
            Live from the backend order ledger — placed, paid, shipped and cancelled state.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled
            title="Export is not available yet"
            className="flex h-10 cursor-not-allowed items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 text-sm text-[#7c818d] opacity-60"
          >
            <Upload className="h-4 w-4" />
            Export
          </button>
          <button
            disabled
            title="Orders are created by customers at checkout; there is no staff-side create-order endpoint yet"
            className="flex h-10 cursor-not-allowed items-center gap-2 rounded-2xl bg-[#2563eb] px-4 text-sm text-white opacity-60"
          >
            <Plus className="h-4 w-4" />
            Create Order
          </button>
        </div>
      </div>

      {/* Lifecycle tabs, backed by the real, zero-filled `GET /admin/orders/summary` counts */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const isActive = displayStatus === tab.value;
          const count = summary ? (tab.value === 'all' ? total : (summary.byDisplayStatus[tab.value] ?? 0)) : undefined;
          return (
            <button
              key={tab.value}
              onClick={() => setDisplayStatus(tab.value)}
              className={`flex h-10 items-center gap-2 rounded-2xl px-4 text-sm ${
                isActive ? 'bg-[#2563eb] text-white' : 'border border-[#e9eaec] bg-white text-[#727783]'
              }`}
            >
              {tab.label}
              {count !== undefined && (
                <span
                  className={`flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-xs ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#f6f9fe] text-[#adb0b8]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-[#e9eaec] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e9eaec] px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 py-3 sm:w-[347px]">
            <Search className="h-5 w-5 shrink-0 text-[#7c818d]" />
            <input
              type="text"
              placeholder="Search order ID or customer email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#23272f] placeholder:text-[#7c818d] focus:outline-none"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setDateRangeOpen((v) => !v)}
              onBlur={() => setTimeout(() => setDateRangeOpen(false), 150)}
              className={`flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm ${
                hasDateRange ? 'border-[#2563eb] text-[#2563eb]' : 'border-[#e9eaec] text-[#23272f]'
              }`}
            >
              {hasDateRange ? `${placedFrom || '…'} – ${placedTo || '…'}` : 'Date Range'}
              <Calendar className="h-4 w-4" />
            </button>
            {dateRangeOpen && (
              <div className="absolute left-0 top-12 z-10 w-64 space-y-3 rounded-2xl border border-[#e9eaec] bg-white p-4 shadow-lg">
                <div className="space-y-1">
                  <label className="text-xs text-[#7c818d]">From</label>
                  <input
                    type="date"
                    value={placedFrom}
                    onChange={(e) => setPlacedFrom(e.target.value)}
                    className="w-full rounded-lg border border-[#e9eaec] px-2 py-1.5 text-sm text-[#23272f] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#7c818d]">To</label>
                  <input
                    type="date"
                    value={placedTo}
                    onChange={(e) => setPlacedTo(e.target.value)}
                    className="w-full rounded-lg border border-[#e9eaec] px-2 py-1.5 text-sm text-[#23272f] focus:outline-none"
                  />
                </div>
                {hasDateRange && (
                  <button
                    onClick={() => {
                      setPlacedFrom('');
                      setPlacedTo('');
                    }}
                    className="w-full rounded-lg border border-[#e9eaec] py-1.5 text-xs text-[#7c818d] hover:bg-slate-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {error ? (
          <div className="px-6 py-10 text-center text-sm text-rose-600">{error}</div>
        ) : loading ? (
          <div className="h-64 animate-pulse bg-slate-50" />
        ) : (
          <OrderTable orders={orders} cancellingOrder={cancellingOrder} onCancel={cancelOrder} />
        )}

        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-[#7c818d]">
            {total === 0 ? 'No orders' : `Showing ${pageStart}-${pageEnd} of ${total} orders`}
          </p>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
