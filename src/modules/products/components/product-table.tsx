'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Package, MoreVertical, Layers, Eye, Archive as ArchiveIcon, Trash2 } from 'lucide-react';
import { ProductStatusBadge } from './product-status-badge';
import { EnrichedProduct } from '../hooks/use-products';
import { formatCurrency } from '@/lib/utils';

export interface ProductTableProps {
  products: EnrichedProduct[];
  selected: Set<string>;
  onToggleSelected: (slug: string) => void;
  onToggleSelectAll: () => void;
  onManageVariants: (product: EnrichedProduct) => void;
  onPublish: (slug: string) => void;
  onArchive: (slug: string) => void;
  onDelete: (slug: string) => void;
}

function priceLabel(product: EnrichedProduct): string {
  if (product.skus.length === 0) return '—';
  const prices = product.skus.map((s) => Number(s.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatCurrency(min, product.currency);
  return `${formatCurrency(min, product.currency)} – ${formatCurrency(max, product.currency)}`;
}

function RowActions({
  product,
  onManageVariants,
  onPublish,
  onArchive,
  onDelete,
}: {
  product: EnrichedProduct;
  onManageVariants: () => void;
  onPublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // A ref-scoped "click outside" listener, rather than the toggle button's own onBlur: a blur
  // fires the instant focus moves to the menu item being clicked, and closing on that (even via
  // a short setTimeout) races the click event that should still fire on that same item — in some
  // browsers/timings the menu unmounts first and the click never lands.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-[#7c818d] hover:bg-slate-100"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-[#e9eaec] bg-white py-1 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onManageVariants();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#23272f] hover:bg-slate-50"
          >
            <Layers className="h-3.5 w-3.5" /> Manage variants
          </button>
          {product.status !== 'active' && (
            <button
              onClick={() => {
                setOpen(false);
                onPublish();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#39ad6f] hover:bg-slate-50"
            >
              <Eye className="h-3.5 w-3.5" /> Publish
            </button>
          )}
          {product.status === 'active' && (
            <button
              onClick={() => {
                setOpen(false);
                onArchive();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#727783] hover:bg-slate-50"
            >
              <ArchiveIcon className="h-3.5 w-3.5" /> Archive
            </button>
          )}
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#df2e2e] hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductTable({
  products,
  selected,
  onToggleSelected,
  onToggleSelectAll,
  onManageVariants,
  onPublish,
  onArchive,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <Package className="h-10 w-10 text-[#adb0b8]" />
        <p className="text-sm font-medium text-[#23272f]">No products found</p>
        <p className="text-xs text-[#7c818d]">Try adjusting your search or filters, or add a new product.</p>
      </div>
    );
  }

  const allSelected = selected.size === products.length && products.length > 0;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#e9eaec] bg-[#f6f9fe] text-[16px] font-medium text-[#23272f]">
            <th className="w-10 px-4 py-3">
              <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} className="h-4 w-4" />
            </th>
            <th className="px-2 py-3 font-medium">Products</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Inventory</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e9eaec] text-[16px]">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-[#f6f9fe]/60">
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={selected.has(product.slug)}
                  onChange={() => onToggleSelected(product.slug)}
                  className="h-4 w-4"
                />
              </td>
              <td className="px-2 py-4">
                <div className="flex items-center gap-3">
                  {product.primaryImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.primaryImageUrl}
                      alt={product.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f6f9fe]">
                      <Package className="h-6 w-6 text-[#adb0b8]" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#23272f]">{product.name}</p>
                    <p className="text-xs text-[#7c818d]">{product.skus[0]?.code ?? product.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <ProductStatusBadge status={product.status} />
              </td>
              <td className="px-4 py-4">
                {product.skus.length === 0 ? (
                  <span className="text-sm text-[#7c818d]">No variants</span>
                ) : product.totalAvailable === null ? (
                  <span className="text-sm text-[#7c818d]">
                    {product.skus.length} variant{product.skus.length === 1 ? '' : 's'}
                  </span>
                ) : (
                  <span className={`text-sm ${product.totalAvailable > 0 ? 'text-[#39ad6f]' : 'text-[#df2e2e]'}`}>
                    {product.totalAvailable} in stock for {product.skus.length} variant
                    {product.skus.length === 1 ? '' : 's'}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-sm text-[#727783]">{priceLabel(product)}</td>
              <td className="px-4 py-4 text-right">
                <RowActions
                  product={product}
                  onManageVariants={() => onManageVariants(product)}
                  onPublish={() => onPublish(product.slug)}
                  onArchive={() => onArchive(product.slug)}
                  onDelete={() => onDelete(product.slug)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
