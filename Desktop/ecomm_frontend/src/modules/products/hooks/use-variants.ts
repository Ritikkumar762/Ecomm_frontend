'use client';

import { useState, useCallback } from 'react';
import { productService } from '../services/product-service';
import { ProductVariant, CreateVariantInput } from '../types/product.types';

export function useVariants(productId: string | null) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getVariants(productId);
      setVariants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load product variants');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const addVariant = async (input: CreateVariantInput) => {
    setLoading(true);
    try {
      const newVar = await productService.createVariant(input);
      setVariants((prev) => [...prev, newVar]);
      return newVar;
    } catch (err: any) {
      setError(err.message || 'Failed to create variant');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeVariant = async (variantId: string) => {
    if (!productId) return;
    try {
      await productService.deleteVariant(productId, variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete variant');
    }
  };

  return {
    variants,
    loading,
    error,
    fetchVariants,
    addVariant,
    removeVariant,
  };
}
