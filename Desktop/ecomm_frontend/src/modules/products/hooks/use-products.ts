'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/product-service';
import { Product, CreateProductInput } from '../types/product.types';
import { useDebounce } from '@/hooks/use-debounce';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, selectedCategory]);

  const addProduct = async (input: CreateProductInput) => {
    const newProduct = await productService.createProduct(input);
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const removeProduct = async (id: string) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refresh: fetchProducts,
    addProduct,
    removeProduct,
  };
}
