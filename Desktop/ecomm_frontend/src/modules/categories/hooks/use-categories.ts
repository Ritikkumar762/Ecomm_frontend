'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/category-service';
import { Category } from '../types/category.types';

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
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string, description?: string) => {
    const newCat = await categoryService.createCategory(name, description);
    setCategories((prev) => [...prev, newCat]);
  };

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    addCategory,
  };
}
