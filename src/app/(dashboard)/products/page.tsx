'use client';

import React, { useState } from 'react';
import { useProducts } from '@/modules/products/hooks/use-products';
import { ProductTable } from '@/modules/products/components/product-table';
import { ProductModal } from '@/modules/products/components/product-modal';
import { VariantModal } from '@/modules/products/components/variant-modal';
import { Product } from '@/modules/products/types/product.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';

export default function ProductsPage() {
  const {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addProduct,
    removeProduct,
    refresh,
  } = useProducts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products & Variants</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your catalog, stock inventory, and multi-option variants.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="apparel">Apparel</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
      ) : (
        <ProductTable
          products={products}
          onDelete={removeProduct}
          onManageVariants={(product) => setSelectedProductForVariants(product)}
        />
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (input) => {
          await addProduct(input);
        }}
      />

      {/* Variant Modal */}
      <VariantModal
        product={selectedProductForVariants}
        isOpen={!!selectedProductForVariants}
        onClose={() => setSelectedProductForVariants(null)}
        onVariantUpdated={refresh}
      />
    </div>
  );
}
