'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ExternalLink, Trash2 } from 'lucide-react';
import { useProducts, EnrichedProduct } from '@/modules/products/hooks/use-products';
import { ProductTable } from '@/modules/products/components/product-table';
import { VariantModal } from '@/modules/products/components/variant-modal';
import { FilterSelect } from '@/components/ui/filter-select';
import { Pagination } from '@/components/ui/pagination';
import { ProductStatus, ProductStockStateFilter } from '@/modules/products/types/product.types';

const TABS: { label: string; value: ProductStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
];

const STOCK_FILTERS: { label: string; value: ProductStockStateFilter | 'all' }[] = [
  { label: 'All stock levels', value: 'all' },
  { label: 'In stock', value: 'in_stock' },
  { label: 'Low stock', value: 'low_stock' },
  { label: 'Out of stock', value: 'out_of_stock' },
];

export default function ProductsPage() {
  const {
    products,
    counts,
    total,
    page,
    setPage,
    pageSize,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stockStateFilter,
    setStockStateFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    selected,
    toggleSelected,
    toggleSelectAll,
    bulkDeleteSelected,
    removeProduct,
    publishProduct,
    archiveProduct,
    refresh,
  } = useProducts();

  const [selectedProductForVariants, setSelectedProductForVariants] = useState<EnrichedProduct | null>(null);

  const pageStart = total === 0 ? 0 : page * pageSize + 1;
  const pageEnd = Math.min(total, (page + 1) * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-[#23272f]">Products</h1>
          <p className="mt-1 text-xs text-[#7c818d]">{counts?.total ?? total} products</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="flex h-10 items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 text-sm text-[#7c818d] hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            Inventory
          </Link>
          <Link
            href="/products/new"
            className="flex h-10 items-center gap-2 rounded-2xl bg-[#2563eb] px-4 text-sm text-white hover:bg-[#1d4fd1]"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </div>
      </div>

      {/* Lifecycle tabs, backed by the real per-store counts */}
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => {
          const isActive = statusFilter === tab.value;
          const count = counts
            ? tab.value === 'all'
              ? counts.total
              : counts[tab.value]
            : undefined;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
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
        <button
          disabled
          title="Top-selling ranking needs a sales-aggregation report this backend doesn't expose yet"
          className="flex h-10 cursor-not-allowed items-center gap-2 rounded-2xl border border-[#e9eaec] bg-white px-4 text-sm text-[#adb0b8]"
        >
          Top selling
        </button>
        <Link
          href="/inventory"
          className="flex h-10 items-center gap-2 rounded-2xl border border-[#e9eaec] bg-white px-4 text-sm text-[#727783] hover:bg-slate-50"
        >
          Inventory
        </Link>
      </div>

      <div className="rounded-3xl border border-[#e9eaec] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e9eaec] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 py-3 sm:w-[292px]">
              <Search className="h-5 w-5 shrink-0 text-[#7c818d]" />
              <input
                type="text"
                placeholder="Search products by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#23272f] placeholder:text-[#7c818d] focus:outline-none"
              />
            </div>
            <FilterSelect
              value={stockStateFilter}
              onChange={(e) => setStockStateFilter(e.target.value as ProductStockStateFilter | 'all')}
            >
              {STOCK_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FilterSelect>
          </div>
          {selected.size > 0 && (
            <button
              onClick={bulkDeleteSelected}
              className="flex h-10 items-center gap-2 rounded-2xl border border-rose-300 px-4 text-sm text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete {selected.size} selected
            </button>
          )}
        </div>

        {error ? (
          <div className="px-6 py-10 text-center text-sm text-rose-600">{error}</div>
        ) : loading ? (
          <div className="h-64 animate-pulse bg-slate-50" />
        ) : (
          <ProductTable
            products={products}
            selected={selected}
            onToggleSelected={toggleSelected}
            onToggleSelectAll={toggleSelectAll}
            onManageVariants={setSelectedProductForVariants}
            onPublish={publishProduct}
            onArchive={archiveProduct}
            onDelete={removeProduct}
          />
        )}

        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-[#7c818d]">
            {total === 0 ? 'No products' : `Showing ${pageStart}-${pageEnd} of ${total} products`}
          </p>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </div>

      <VariantModal
        product={selectedProductForVariants}
        isOpen={!!selectedProductForVariants}
        onClose={() => setSelectedProductForVariants(null)}
        onVariantUpdated={refresh}
      />
    </div>
  );
}
