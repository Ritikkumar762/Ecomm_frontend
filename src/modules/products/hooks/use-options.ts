'use client';

import { useState, useCallback } from 'react';
import { productService } from '../services/product-service';
import { Option } from '../types/product.types';
import { ApiError } from '@/lib/api-client';

/**
 * Manages a single product's Options (Color, Size, ...) and their nested Values. Kept
 * separate from `useVariants` because an option belongs to the PRODUCT, not to any one SKU
 * — several SKUs pick values from the same shared list.
 */
export function useOptions(productSlug: string | null) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    if (!productSlug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getOptions(productSlug);
      setOptions(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load options.');
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  const addOption = async (name: string) => {
    if (!productSlug) throw new Error('No product selected');
    setError(null);
    try {
      const created = await productService.createOption(productSlug, { name });
      setOptions((prev) => [...prev, { ...created, values: [] }]);
      return created;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create option.');
      throw err;
    }
  };

  /** Refused with a 409 by the backend while any live SKU still uses one of its values. */
  const removeOption = async (id: string) => {
    setError(null);
    try {
      await productService.deleteOption(id);
      setOptions((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete option — it may still be in use.');
      throw err;
    }
  };

  const addValue = async (optionId: string, value: string) => {
    setError(null);
    try {
      const created = await productService.createOptionValue(optionId, { value });
      setOptions((prev) =>
        prev.map((o) => (o.id === optionId ? { ...o, values: [...o.values, created] } : o)),
      );
      return created;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add value.');
      throw err;
    }
  };

  /** Refused with a 409 by the backend while any live SKU still uses this value. */
  const removeValue = async (optionId: string, valueId: string) => {
    setError(null);
    try {
      await productService.deleteOptionValue(valueId);
      setOptions((prev) =>
        prev.map((o) =>
          o.id === optionId ? { ...o, values: o.values.filter((v) => v.id !== valueId) } : o,
        ),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete value — it may still be in use.');
      throw err;
    }
  };

  return {
    options,
    loading,
    error,
    fetchOptions,
    addOption,
    removeOption,
    addValue,
    removeValue,
  };
}
