'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVariants } from '../hooks/use-variants';
import { Product } from '../types/product.types';
import { Plus, Trash2, Tag, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface VariantModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onVariantUpdated?: () => void;
}

export function VariantModal({ product, isOpen, onClose, onVariantUpdated }: VariantModalProps) {
  const { variants, fetchVariants, addVariant, removeVariant } = useVariants(product?.id || null);

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('20');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      fetchVariants();
    }
  }, [isOpen, product, fetchVariants]);

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      await addVariant({
        productId: product.id,
        sku,
        name,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        attributes: {
          ...(color ? { color } : {}),
          ...(size ? { size } : {}),
        },
      });

      // Reset form
      setSku('');
      setName('');
      setPrice('');
      setColor('');
      setSize('');
      if (onVariantUpdated) onVariantUpdated();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (variantId: string) => {
    await removeVariant(variantId);
    if (onVariantUpdated) onVariantUpdated();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Variants — ${product?.title || ''}`}>
      <div className="space-y-6">
        {/* Current Variants List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-600" />
            Existing Product Variants ({variants.length})
          </h4>

          {variants.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
              No variants configured for this product yet. Add one below.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{v.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">SKU: {v.sku}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">{formatCurrency(v.price)}</span>
                    <span className="text-slate-500">{v.stock} pcs</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(v.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded transition"
                      title="Delete Variant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Variant Form */}
        <form onSubmit={handleCreateVariant} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <Plus className="w-4 h-4 text-emerald-600" />
            Add Variant
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU Code"
              placeholder="PROD-BLK-XL"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
            <Input
              label="Variant Name"
              placeholder="e.g. Midnight Black / XL"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              placeholder="49.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Stock Qty"
              type="number"
              placeholder="25"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Color (Optional)"
              placeholder="Black"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <Input
              label="Size (Optional)"
              placeholder="XL"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full mt-2 py-2 text-xs font-semibold">
            Save Variant
          </Button>
        </form>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
