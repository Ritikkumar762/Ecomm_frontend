'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { inventoryService } from '../services/inventory-service';
import {
  StockItem,
  StockStateFilter,
  SkuCatalogueInfo,
  InventorySummary,
  StockAdjustmentReason,
} from '../types/inventory.types';
import { useDebounce } from '@/hooks/use-debounce';
import { ApiError } from '@/lib/api-client';

const PAGE_SIZE = 5;

export interface EnrichedStockRow extends StockItem {
  productName: string;
  productSlug: string | null;
  variantLabel: string;
  lowStockThreshold: number | null;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

function deriveStatus(available: number, threshold: number | null): EnrichedStockRow['status'] {
  if (available <= 0) return 'out_of_stock';
  if (threshold !== null && available <= threshold) return 'low_stock';
  return 'in_stock';
}

export function useInventory() {
  const [rows, setRows] = useState<StockItem[]>([]);
  const [skuLookup, setSkuLookup] = useState<Map<string, SkuCatalogueInfo>>(new Map());
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0); // zero-indexed offset multiplier
  const [searchQuery, setSearchQuery] = useState('');
  const [stockState, setStockState] = useState<StockStateFilter | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSkuCode, setSavingSkuCode] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // The SKU -> product lookup rarely changes within a session; fetch it once rather than on
  // every page/filter change.
  useEffect(() => {
    inventoryService
      .getSkuCatalogueLookup()
      .then(setSkuLookup)
      .catch(() => {
        // Best-effort enrichment: if the product list can't be read (e.g. the caller lacks
        // the staff scope, or it 500s), the table still renders — just by SKU code alone.
      });
  }, []);

  useEffect(() => {
    inventoryService
      .getSummary()
      .then(setSummary)
      .catch(() => {});
  }, []);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await inventoryService.getStock({
        q: debouncedSearch || undefined,
        stockState: stockState === 'all' ? undefined : stockState,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setRows(result.inventory);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, stockState, page]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  // A new search or filter always restarts at page 1 — staying on page 3 of a filter that
  // now has one page would just show an empty table.
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, stockState]);

  const enrichedRows: EnrichedStockRow[] = useMemo(
    () =>
      rows.map((row) => {
        const info = skuLookup.get(row.skuId);
        return {
          ...row,
          productName: info?.productName ?? row.skuCode,
          productSlug: info?.productSlug ?? null,
          variantLabel: info?.variantLabel ?? '—',
          lowStockThreshold: info?.lowStockThreshold ?? null,
          status: deriveStatus(row.available, info?.lowStockThreshold ?? null),
        };
      }),
    [rows, skuLookup],
  );

  const lowStockCount = useMemo(
    () => enrichedRows.filter((r) => r.status === 'low_stock').length,
    [enrichedRows],
  );
  const reservedUnits = useMemo(() => rows.reduce((sum, r) => sum + r.reserved, 0), [rows]);

  /**
   * Set a SKU's on-hand quantity to `newOnHand`. The backend only accepts a signed delta, so
   * this computes one from the row's current value and picks the matching manual reason —
   * the read-then-write happens here, once, rather than the backend recreating a lost-update
   * bug by accepting a target directly.
   */
  const setOnHand = useCallback(
    async (row: EnrichedStockRow, newOnHand: number, note?: string) => {
      const delta = newOnHand - row.onHand;
      if (delta === 0) return;

      const reason: StockAdjustmentReason = delta > 0 ? 'manual_increase' : 'manual_decrease';
      setSavingSkuCode(row.skuCode);
      try {
        const result = await inventoryService.adjustStock({
          skuCode: row.skuCode,
          delta,
          reason,
          ...(note ? { note } : {}),
        });
        setRows((prev) => prev.map((r) => (r.skuId === row.skuId ? result.inventory : r)));
        return result;
      } finally {
        setSavingSkuCode(null);
      }
    },
    [],
  );

  return {
    rows: enrichedRows,
    loading,
    error,
    summary,
    lowStockCount,
    reservedUnits,
    totalMonitored: total,
    searchQuery,
    setSearchQuery,
    stockState,
    setStockState,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    total,
    savingSkuCode,
    setOnHand,
    refresh: fetchStock,
  };
}
