'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Archive,
  AlertTriangle,
  XCircle,
  PackageCheck,
  ExternalLink,
  Download,
  Upload,
} from 'lucide-react';
import { useInventory } from '@/modules/inventory/hooks/use-inventory';
import { InventoryTable } from '@/modules/inventory/components/inventory-table';
import { FilterSelect } from '@/components/ui/filter-select';
import { Pagination } from '@/components/ui/pagination';
import { StockStateFilter } from '@/modules/inventory/types/inventory.types';

const STOCK_FILTERS: { label: string; value: StockStateFilter | 'all' }[] = [
  { label: 'All stock levels', value: 'all' },
  { label: 'In stock', value: 'in_stock' },
  { label: 'Low stock', value: 'low_stock' },
  { label: 'Out of stock', value: 'out_of_stock' },
];

function KpiCard({
  title,
  value,
  valueClassName,
  icon: Icon,
}: {
  title: string;
  value: string;
  valueClassName?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-[#e9eaec] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#7c818d]">{title}</p>
        <Icon className="h-4 w-4 text-[#7c818d]" />
      </div>
      <p className={`mt-3 text-base font-medium ${valueClassName ?? 'text-[#23272f]'}`}>{value}</p>
    </div>
  );
}

export default function InventoryPage() {
  const {
    rows,
    loading,
    error,
    summary,
    lowStockCount,
    reservedUnits,
    total,
    searchQuery,
    setSearchQuery,
    stockState,
    setStockState,
    page,
    setPage,
    pageSize,
    savingSkuCode,
    setOnHand,
  } = useInventory();

  const pageStart = total === 0 ? 0 : page * pageSize + 1;
  const pageEnd = Math.min(total, (page + 1) * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-[#23272f]">Inventory</h1>
          <p className="mt-1 text-xs text-[#7c818d]">
            Manage stock levels and variant availability from the live backend.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="flex h-10 items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 text-sm text-[#7c818d] hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            Products
          </Link>
          <button
            disabled
            title="Bulk import is not available yet"
            className="flex h-10 cursor-not-allowed items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 text-sm text-[#7c818d] opacity-60"
          >
            <Download className="h-4 w-4" />
            Import
          </button>
          <button
            disabled
            title="Export is not available yet"
            className="flex h-10 cursor-not-allowed items-center gap-2 rounded-2xl bg-[#2563eb] px-4 text-sm text-white opacity-60"
          >
            <Upload className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI grid — every figure here is read from the backend; there is no "incoming
          restocks" card because the API has no purchase-order/ETA concept to source it from. */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <KpiCard title="Total SKUs Monitored" value={`${total} Items`} icon={Archive} />
        <KpiCard
          title="Low Stock Alerts (this page)"
          value={`${lowStockCount} SKUs`}
          valueClassName="text-[#f37216]"
          icon={AlertTriangle}
        />
        <KpiCard
          title="Out of Stock"
          value={`${summary?.outOfStockSkus ?? '—'} SKUs`}
          valueClassName="text-[#df2e2e]"
          icon={XCircle}
        />
        <KpiCard title="Reserved Units (this page)" value={`${reservedUnits} Units`} icon={PackageCheck} />
      </div>

      <div className="rounded-3xl border border-[#e9eaec] bg-white">
        <div className="space-y-4 border-b border-[#e9eaec] px-6 py-5">
          <p className="text-lg text-[#2563eb]">All Warehouses</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 py-3 sm:w-[292px]">
              <Search className="h-5 w-5 shrink-0 text-[#7c818d]" />
              <input
                type="text"
                placeholder="Search by SKU code or name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#23272f] placeholder:text-[#7c818d] focus:outline-none"
              />
            </div>
            <FilterSelect value={stockState} onChange={(e) => setStockState(e.target.value as StockStateFilter | 'all')}>
              {STOCK_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>

        {error ? (
          <div className="px-6 py-10 text-center text-sm text-rose-600">{error}</div>
        ) : loading ? (
          <div className="h-64 animate-pulse bg-slate-50" />
        ) : (
          <InventoryTable rows={rows} savingSkuCode={savingSkuCode} onSave={setOnHand} />
        )}

        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-[#7c818d]">
            {total === 0 ? 'No variants' : `Showing ${pageStart}-${pageEnd} of ${total} variants`}
          </p>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
