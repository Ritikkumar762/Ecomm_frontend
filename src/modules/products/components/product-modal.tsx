'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateProductInput, ProductStatus } from '../types/product.types';
import { slugify } from '../services/product-service';

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProductInput) => Promise<void>;
}

export function ProductModal({ isOpen, onClose, onSubmit }: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProductStatus>('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugPreview = slugify(name) || 'your-product-name';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        slug: slugify(name),
        name,
        ...(description ? { description } : {}),
        status,
      });
      setName('');
      setDescription('');
      setStatus('draft');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-[#f7c9c9] bg-[#fceeee] px-4 py-3 text-xs font-medium text-[#df2e2e]">
            {error}
          </div>
        )}

        <div>
          <Input
            label="Product Name"
            placeholder="e.g. Self Priming Monoblock Pump"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-[#adb0b8]">URL slug: /{slugPreview}</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#727783]">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Detailed product features and specification..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-[#e9eaec] p-2.5 text-sm text-[#23272f] focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#727783]">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            className="w-full h-10 rounded-lg border border-[#e9eaec] px-3 text-sm text-[#23272f] focus:ring-2 focus:ring-[#2563eb] focus:outline-none bg-white"
          >
            <option value="draft">Draft (not visible to customers)</option>
            <option value="active">Active (published)</option>
          </select>
          <p className="text-xs text-[#adb0b8]">
            Prices and stock are set per variant after creating the product.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e9eaec]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!name.trim()}>
            Save Product
          </Button>
        </div>
      </form>
    </Modal>
  );
}
