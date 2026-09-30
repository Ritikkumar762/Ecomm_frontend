'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/category-service';
import { Category } from '../types/category.types';
import { ApiError } from '@/lib/api-client';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string) => {
    const created = await categoryService.createCategory({ name });
    setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  };

  const toggleActive = async (category: Category) => {
    const updated = await categoryService.updateCategory(category.id, {
      isActive: !category.isActive,
    });
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    return updated;
  };

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    addCategory,
    toggleActive,
  };
}
