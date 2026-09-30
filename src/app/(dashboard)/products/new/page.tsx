'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ImagePlus } from 'lucide-react';
import { useProducts } from '@/modules/products/hooks/use-products';
import { useCategories } from '@/modules/categories/hooks/use-categories';
import { productService, slugify } from '@/modules/products/services/product-service';
import { inventoryService } from '@/modules/inventory/services/inventory-service';
import { ProductStatus } from '@/modules/products/types/product.types';

/**
 * Matches the Figma "Add New Product" screen: General Information, Media Gallery, Enable
 * Variants, Pricing & Inventory on the left; Product Status and Product Organization on the
 * right.
 *
 * Two things Figma shows that are deliberately absent:
 *  - Brand/Vendor and Tags fields under Product Organization — there is no column for either on
 *    the product table, so an input here would accept a value and silently discard it on save.
 *    A disabled dropzone at least explains itself; a text field that quietly eats what you type
 *    does not.
 *  - A separate "Selling Price" alongside "Price" — the backend has one price per SKU, not a
 *    list/sale pair.
 */
export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const { categories } = useCategories();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProductStatus>('draft');
  const [categoryId, setCategoryId] = useState('');
  const [enableVariants, setEnableVariants] = useState(false);
  const [price, setPrice] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [initialStock, setInitialStock] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugPreview = slugify(name) || 'your-product-name';

  const handleSave = async (nextStatus: ProductStatus) => {
    if (!name.trim()) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const created = await addProduct({
        slug: slugify(name),
        name,
        ...(description ? { description } : {}),
        status: nextStatus,
        ...(categoryId ? { categoryId } : {}),
      });

      // The simple, no-variants case: attach one SKU (and its opening stock) right here,
      // rather than making every product creation a two-trip process through "Manage
      // variants". Skipped entirely when variants are enabled — a real option grid is a
      // multi-row builder that belongs in that dedicated flow, not squeezed onto this form.
      if (!enableVariants && price.trim()) {
        const sku = await productService.createSku(created.slug, {
          price: price.trim(),
          ...(skuCode.trim() ? { code: skuCode.trim() } : {}),
        });

        const openingStock = Number(initialStock);
        if (Number.isFinite(openingStock) && openingStock > 0) {
          await inventoryService.adjustStock({
            skuCode: sku.code,
            delta: openingStock,
            reason: 'shipment',
            note: 'Opening stock set from Add Product.',
          });
        }
      }

      router.push('/products');
    } catch (err: any) {
      setError(err?.message || 'Failed to create product.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9eaec] text-[#7c818d] hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs text-[#7c818d]">
              <Link href="/products" className="hover:underline">
                Products
              </Link>{' '}
              / Add New Product
            </p>
            <h1 className="text-2xl font-medium tracking-tight text-[#23272f]">Add New Product</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="flex h-10 items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 text-sm text-[#727783] hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            onClick={() => handleSave('draft')}
            disabled={isSubmitting || !name.trim()}
            className="flex h-10 items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 text-sm text-[#23272f] hover:bg-slate-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave('active')}
            disabled={isSubmitting || !name.trim()}
            className="flex h-10 items-center gap-2 rounded-2xl bg-[#2563eb] px-4 text-sm text-white hover:bg-[#1d4fd1] disabled:opacity-50"
          >
            Publish Product
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#f7c9c9] bg-[#fceeee] px-4 py-3 text-sm font-medium text-[#df2e2e]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-[#e9eaec] bg-white p-6">
            <h2 className="text-lg font-medium text-[#23272f]">General Information</h2>
            <p className="mt-1 text-xs text-[#7c818d]">
              Core product details used across the catalog, search, and storefront.
            </p>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#727783]">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Self Priming Monoblock Pump"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-[#e9eaec] px-4 py-3 text-sm text-[#23272f] placeholder:text-[#adb0b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <p className="text-xs text-[#adb0b8]">URL slug: /{slugPreview}</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#727783]">Description</label>
                <textarea
                  rows={5}
                  placeholder="Describe the core features, specifications, and primary applications of your product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-[#e9eaec] px-4 py-3 text-sm text-[#23272f] placeholder:text-[#adb0b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e9eaec] bg-white p-6">
            <h2 className="text-lg font-medium text-[#23272f]">Media Gallery</h2>
            <p className="mt-1 text-xs text-[#7c818d]">Upload product images. The first image becomes the primary thumbnail.</p>
            <div
              title="Image uploads need object storage, which this deployment doesn't have configured yet"
              className="mt-4 flex cursor-not-allowed flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#e9eaec] bg-[#f6f9fe] px-6 py-10 text-center opacity-70"
            >
              <ImagePlus className="h-8 w-8 text-[#adb0b8]" />
              <p className="text-sm font-medium text-[#23272f]">Drag and drop product images here</p>
              <p className="text-xs text-[#adb0b8]">JPG, PNG or WEBP — 1:1 aspect ratio recommended</p>
              <span className="mt-1 rounded-xl border border-[#e9eaec] bg-white px-4 py-2 text-xs text-[#adb0b8]">
                Upload files
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e9eaec] bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-[#23272f]">Enable Variants</h2>
                <p className="mt-1 text-xs text-[#7c818d]">
                  Turn on when this product has multiple sizes, materials, or colour options.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enableVariants}
                onClick={() => setEnableVariants((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  enableVariants ? 'bg-[#2563eb]' : 'bg-[#e9eaec]'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    enableVariants ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {enableVariants ? (
              <p className="mt-4 rounded-2xl border border-dashed border-[#e9eaec] bg-[#f6f9fe] px-4 py-4 text-xs text-[#7c818d]">
                Save this product first, then use <span className="font-medium text-[#23272f]">Manage variants</span>{' '}
                from the products list to build the option grid (e.g. Size × Colour) and each variant's own SKU,
                price and stock.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#727783]">Pricing &amp; Inventory</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#727783]">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-2xl border border-[#e9eaec] px-4 py-2.5 text-sm text-[#23272f] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#727783]">Opening Inventory</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={initialStock}
                      onChange={(e) => setInitialStock(e.target.value)}
                      className="w-full rounded-2xl border border-[#e9eaec] px-4 py-2.5 text-sm text-[#23272f] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#727783]">SKU (optional)</label>
                  <input
                    type="text"
                    placeholder="auto-generated if left blank"
                    value={skuCode}
                    onChange={(e) => setSkuCode(e.target.value)}
                    className="w-full rounded-2xl border border-[#e9eaec] px-4 py-2.5 text-sm text-[#23272f] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
                <p className="text-xs text-[#adb0b8]">
                  Leave price blank to skip creating a SKU now — you can always add one later from Manage variants.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[#e9eaec] bg-white p-6">
            <h2 className="text-lg font-medium text-[#23272f]">Product Status</h2>
            <p className="mt-1 text-xs text-[#7c818d]">Control visibility and publishing state for this product.</p>
            <div className="mt-4 space-y-1.5">
              <label className="block text-xs font-medium text-[#727783]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full h-10 rounded-2xl border border-[#e9eaec] px-3 text-sm text-[#23272f] focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white"
              >
                <option value="draft">Draft (not visible to customers)</option>
                <option value="active">Active (published)</option>
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e9eaec] bg-white p-6">
            <h2 className="text-lg font-medium text-[#23272f]">Product Organization</h2>
            <p className="mt-1 text-xs text-[#7c818d]">Categorization used for filtering and discovery.</p>
            <div className="mt-4 space-y-1.5">
              <label className="block text-xs font-medium text-[#727783]">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 rounded-2xl border border-[#e9eaec] px-3 text-sm text-[#23272f] focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white"
              >
                <option value="">Uncategorised</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
