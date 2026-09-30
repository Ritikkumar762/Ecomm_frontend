'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVariants } from '../hooks/use-variants';
import { useOptions } from '../hooks/use-options';
import { EnrichedProduct } from '../hooks/use-products';
import { productService } from '../services/product-service';
import { Plus, Trash2, Layers, Pencil, Check, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { OptionManager } from './option-manager';

export interface VariantModalProps {
  product: EnrichedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onVariantUpdated?: () => void;
}

/** One `<select>` per option, so a caller picks at most one value per option — matching the
 * backend's own rule that a SKU can never carry two values of the same option. Empty string
 * means "no value chosen for this option". */
function OptionValuePickers({
  options,
  selection,
  onChange,
}: {
  options: ReturnType<typeof useOptions>['options'];
  selection: Record<string, string>;
  onChange: (optionId: string, valueId: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <div key={option.id} className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#727783]">
            {option.name}
          </label>
          <select
            value={selection[option.id] ?? ''}
            onChange={(e) => onChange(option.id, e.target.value)}
            className="w-full h-10 rounded-lg border border-[#e9eaec] px-3 text-sm text-[#23272f] focus:ring-2 focus:ring-[#2563eb] focus:outline-none bg-white"
          >
            <option value="">— none —</option>
            {option.values.map((v) => (
              <option key={v.id} value={v.id}>
                {v.value}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

/** Inline "Edit options" row for an existing SKU, matching its current combination. */
function EditSkuOptions({
  code,
  options,
  initialSelection,
  onSaved,
  onCancel,
}: {
  code: string;
  options: ReturnType<typeof useOptions>['options'];
  initialSelection: Record<string, string>;
  onSaved: (sku: Awaited<ReturnType<typeof productService.replaceSkuOptions>>) => void;
  onCancel: () => void;
}) {
  const [selection, setSelection] = useState(initialSelection);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const ids = Object.values(selection).filter(Boolean);
      const updated = await productService.replaceSkuOptions(code, ids);
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update variant options.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-2 space-y-2 rounded-lg border border-dashed border-[#2563eb] bg-[#f6f9fe] p-3">
      <OptionValuePickers
        options={options}
        selection={selection}
        onChange={(optionId, valueId) => setSelection((prev) => ({ ...prev, [optionId]: valueId }))}
      />
      {error && <p className="text-xs text-[#df2e2e]">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="p-1.5 text-[#adb0b8] hover:text-[#7c818d]">
          <X className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="p-1.5 text-[#39ad6f] hover:text-[#2f8f5c] disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function VariantModal({ product, isOpen, onClose, onVariantUpdated }: VariantModalProps) {
  const { variants, fetchVariants, addVariant, removeVariant, error, setVariants } = useVariants(
    product?.slug ?? null,
  );
  const {
    options,
    loading: optionsLoading,
    error: optionsError,
    fetchOptions,
    addOption,
    removeOption,
    addValue,
    removeValue,
  } = useOptions(product?.slug ?? null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      fetchVariants();
      fetchOptions();
    }
  }, [isOpen, product, fetchVariants, fetchOptions]);

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      const created = await addVariant({
        ...(code.trim() ? { code: code.trim() } : {}),
        ...(name.trim() ? { name: name.trim() } : {}),
        price,
        ...(lowStockThreshold ? { lowStockThreshold: parseInt(lowStockThreshold, 10) } : {}),
      });

      // Attach the chosen combination, if any option value was picked, in a second call —
      // the create endpoint itself has no field for it (§ PUT .../options is a separate,
      // explicit replacement operation).
      const chosenIds = Object.values(selection).filter(Boolean);
      if (chosenIds.length > 0) {
        const withOptions = await productService.replaceSkuOptions(created.code, chosenIds);
        setVariants((prev) => prev.map((v) => (v.code === withOptions.code ? withOptions : v)));
      }

      setCode('');
      setName('');
      setPrice('');
      setLowStockThreshold('');
      setSelection({});
      if (onVariantUpdated) onVariantUpdated();
    } catch {
      // error state is already surfaced by useVariants / the inline catch above
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (skuCode: string) => {
    await removeVariant(skuCode);
    if (onVariantUpdated) onVariantUpdated();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Variants — ${product?.name || ''}`}>
      <div className="space-y-6">
        <OptionManager
          options={options}
          loading={optionsLoading}
          error={optionsError}
          addOption={addOption}
          removeOption={removeOption}
          addValue={addValue}
          removeValue={removeValue}
        />

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7c818d] mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#2563eb]" />
            Existing SKUs ({variants.length})
          </h4>

          {variants.length === 0 ? (
            <p className="text-xs text-[#adb0b8] italic bg-[#f6f9fe] p-3 rounded-lg border border-dashed border-[#e9eaec]">
              No SKUs configured for this product yet. Add one below.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {variants.map((v) => {
                const combination = [...v.options]
                  .sort((a, b) => a.optionSortOrder - b.optionSortOrder)
                  .map((o) => o.value)
                  .join(' / ');

                return (
                  <div key={v.id} className="p-3 rounded-xl bg-[#f6f9fe] border border-[#e9eaec] text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#23272f] block">
                          {combination || v.name || v.code}
                        </span>
                        <span className="text-[#7c818d] font-mono text-[11px]">SKU: {v.code}</span>
                        {!v.isActive && <span className="ml-2 text-[#df2e2e]">(inactive)</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#23272f]">
                          {formatCurrency(Number(v.price), product?.currency)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingCode(editingCode === v.code ? null : v.code)}
                          title="Edit variant options"
                          className="p-1 text-[#adb0b8] hover:text-[#2563eb] hover:bg-[#e4ebfb] rounded transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(v.code)}
                          title="Delete SKU"
                          className="p-1 text-[#adb0b8] hover:text-[#df2e2e] hover:bg-[#fceeee] rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingCode === v.code && (
                      <EditSkuOptions
                        code={v.code}
                        options={options}
                        initialSelection={Object.fromEntries(v.options.map((o) => [o.optionId, o.valueId]))}
                        onSaved={(updated) => {
                          setVariants((prev) => prev.map((row) => (row.code === updated.code ? updated : row)));
                          setEditingCode(null);
                        }}
                        onCancel={() => setEditingCode(null)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={handleCreateVariant} className="bg-[#f6f9fe] p-4 rounded-xl border border-[#e9eaec] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#23272f] flex items-center gap-1">
            <Plus className="w-4 h-4 text-[#39ad6f]" />
            Add SKU
          </h4>

          {error && <p className="text-xs text-[#df2e2e]">{error}</p>}

          <OptionValuePickers
            options={options}
            selection={selection}
            onChange={(optionId, valueId) => setSelection((prev) => ({ ...prev, [optionId]: valueId }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU Code (optional)"
              placeholder="auto-generated if left blank"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Input
              label="Variant Name (optional)"
              placeholder="e.g. Midnight Black / XL"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price"
              type="number"
              step="0.01"
              min="0"
              placeholder="49.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Low Stock Threshold (optional)"
              type="number"
              min="0"
              placeholder="10"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} disabled={!price} className="w-full mt-2 py-2 text-xs font-semibold">
            Save SKU
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
