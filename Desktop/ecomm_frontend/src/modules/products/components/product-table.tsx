'use client';

import React from 'react';
import { Product } from '../types/product.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Edit2, Trash2, Layers, Package } from 'lucide-react';

export interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onManageVariants: (product: Product) => void;
}

export function ProductTable({ products, onDelete, onManageVariants }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No products found</h3>
        <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or add a new product.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Variants</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Image + Title */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-slate-400 m-auto" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 leading-tight">{product.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{product.slug}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 text-slate-600 font-medium">{product.category}</td>
                <td className="py-4 px-4 font-semibold text-slate-900">{formatCurrency(product.price)}</td>
                <td className="py-4 px-4">
                  <span className={`font-medium ${product.stock > 10 ? 'text-slate-700' : 'text-rose-600 font-bold'}`}>
                    {product.stock} in stock
                  </span>
                </td>

                {/* Variants Badge / Action */}
                <td className="py-4 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageVariants(product)}
                    className="gap-1.5 text-xs font-semibold py-1 px-2.5 bg-slate-50 hover:bg-slate-100"
                  >
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    <span>{product.variants?.length || 0} Variants</span>
                  </Button>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <Badge variant={product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'default'}>
                    {product.status}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right space-x-2">
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
