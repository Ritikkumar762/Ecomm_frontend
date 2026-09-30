'use client';

import { useState, useCallback } from 'react';
import { productService } from '../services/product-service';
import { Sku, CreateSkuInput } from '../types/product.types';
import { ApiError } from '@/lib/api-client';

export function useVariants(productSlug: string | null) {
  const [variants, setVariants] = useState<Sku[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = useCallback(async () => {
    if (!productSlug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getSkus(productSlug);
      setVariants(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load product variants.');
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  const addVariant = async (input: CreateSkuInput) => {
    if (!productSlug) throw new Error('No product selected');
    setLoading(true);
    setError(null);
    try {
      const created = await productService.createSku(productSlug, input);
      setVariants((prev) => [...prev, created]);
      return created;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create variant.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeVariant = async (code: string) => {
    try {
      await productService.deleteSku(code);
      setVariants((prev) => prev.filter((v) => v.code !== code));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete variant.');
      throw err;
    }
  };

  return {
    variants,
    /** Exposed so a caller that already has a fresh SKU record (e.g. from
     * `replaceSkuOptions`, which returns the whole updated SKU) can patch it in without a
     * network round trip. */
    setVariants,
    loading,
    error,
    fetchVariants,
    addVariant,
    removeVariant,
  };
}
