'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/product-service';
import { inventoryService } from '@/modules/inventory/services/inventory-service';
import {
  Product,
  ProductStatus,
  ProductStockStateFilter,
  ProductCounts,
  CreateProductInput,
} from '../types/product.types';
import { useDebounce } from '@/hooks/use-debounce';
import { ApiError } from '@/lib/api-client';

const PAGE_SIZE = 5;

export interface EnrichedProduct extends Product {
  /** Sum of `available` across the product's SKUs, from `GET /admin/inventory`. `null` when
   * the stock lookup hasn't resolved yet (or failed) — never fabricated as 0. */
  totalAvailable: number | null;
  /** The product's primary image, from `GET /admin/products/:slug/media`. `null` until the
   * per-row fetch resolves, or when the product genuinely has no gallery image. */
  primaryImageUrl: string | null;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockBySkuId, setStockBySkuId] = useState<Map<string, number>>(new Map());
  const [primaryImageBySlug, setPrimaryImageBySlug] = useState<Map<string, string | null>>(new Map());
  const [counts, setCounts] = useState<ProductCounts | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [stockStateFilter, setStockStateFilter] = useState<ProductStockStateFilter | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts({
        q: debouncedSearch || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        stockState: stockStateFilter === 'all' ? undefined : stockStateFilter,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setProducts(result.products);
      setTotal(result.pagination.total);
      setCounts(result.counts);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, stockStateFilter, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(0);
    setSelected(new Set());
  }, [debouncedSearch, statusFilter, stockStateFilter]);

  // Best-effort stock enrichment: the product list carries SKUs but not their on-hand
  // figures, so a separate, capped read of the inventory table fills in "N in stock".
  useEffect(() => {
    inventoryService
      .getStock({ limit: 100 })
      .then((result) => {
        setStockBySkuId(new Map(result.inventory.map((row) => [row.skuId, row.available])));
      })
      .catch(() => {});
  }, [products]);

  // The list endpoint carries no media (it's a separate gallery resource per product), so the
  // row thumbnail is a per-product fetch — bounded by the page size, never more than PAGE_SIZE
  // requests. A product with no gallery, or a deployment with no object storage, gets `null`
  // and falls back to a placeholder rather than a broken image.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      products.map((product) =>
        productService
          .getProductMedia(product.slug)
          .then((media) => [product.slug, media.find((m) => m.isPrimary)?.url ?? media[0]?.url ?? null] as const)
          .catch(() => [product.slug, null] as const),
      ),
    ).then((entries) => {
      if (!cancelled) setPrimaryImageBySlug(new Map(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [products]);

  const enrichedProducts: EnrichedProduct[] = useMemo(
    () =>
      products.map((product) => {
        const primaryImageUrl = primaryImageBySlug.get(product.slug) ?? null;
        if (product.skus.length === 0) return { ...product, totalAvailable: null, primaryImageUrl };
        let sum = 0;
        let known = 0;
        for (const sku of product.skus) {
          const available = stockBySkuId.get(sku.id);
          if (available !== undefined) {
            sum += available;
            known += 1;
          }
        }
        return { ...product, totalAvailable: known > 0 ? sum : null, primaryImageUrl };
      }),
    [products, stockBySkuId, primaryImageBySlug],
  );

  const addProduct = async (input: CreateProductInput) => {
    const created = await productService.createProduct(input);
    await fetchProducts();
    return created;
  };

  const removeProduct = async (slug: string) => {
    await productService.deleteProduct(slug);
    await fetchProducts();
  };

  const publishProduct = async (slug: string) => {
    await productService.publishProduct(slug);
    await fetchProducts();
  };

  const archiveProduct = async (slug: string) => {
    await productService.archiveProduct(slug);
    await fetchProducts();
  };

  const toggleSelected = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => (prev.size === products.length ? new Set() : new Set(products.map((p) => p.slug))));
  };

  const bulkDeleteSelected = async () => {
    if (selected.size === 0) return;
    await productService.bulkAction(Array.from(selected), 'delete');
    setSelected(new Set());
    await fetchProducts();
  };

  return {
    products: enrichedProducts,
    counts,
    total,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stockStateFilter,
    setStockStateFilter,
    selected,
    toggleSelected,
    toggleSelectAll,
    bulkDeleteSelected,
    addProduct,
    removeProduct,
    publishProduct,
    archiveProduct,
    refresh: fetchProducts,
  };
}
