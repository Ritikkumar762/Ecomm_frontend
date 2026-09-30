'use client';

import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { Option } from '../types/product.types';

export interface OptionManagerProps {
  options: Option[];
  loading: boolean;
  error: string | null;
  addOption: (name: string) => Promise<unknown>;
  removeOption: (id: string) => Promise<void>;
  addValue: (optionId: string, value: string) => Promise<unknown>;
  removeValue: (optionId: string, valueId: string) => Promise<void>;
}

/**
 * Lets an admin create/manage a product's variant options (Color, Size, ...) and their
 * values (Red, Blue, ... / S, M, L, ...). Deleting an option or a value that a live SKU still
 * references is rejected by the backend with a 409 — surfaced here as an inline error rather
 * than a silent no-op, since "why won't this delete" is exactly what an admin needs to know.
 *
 * Purely presentational: the parent (`VariantModal`) owns `useOptions`, since it also needs
 * the same option/value list to build the per-SKU combination pickers.
 */
export function OptionManager({ options, loading, error, addOption, removeOption, addValue, removeValue }: OptionManagerProps) {
  const [newOptionName, setNewOptionName] = useState('');
  const [newValueDraft, setNewValueDraft] = useState<Record<string, string>>({});
  const [isAddingOption, setIsAddingOption] = useState(false);

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;
    setIsAddingOption(true);
    try {
      await addOption(newOptionName.trim());
      setNewOptionName('');
    } catch {
      // error surfaced via the hook's `error` state
    } finally {
      setIsAddingOption(false);
    }
  };

  const handleAddValue = async (optionId: string) => {
    const value = (newValueDraft[optionId] ?? '').trim();
    if (!value) return;
    try {
      await addValue(optionId, value);
      setNewValueDraft((prev) => ({ ...prev, [optionId]: '' }));
    } catch {
      // error surfaced via the hook's `error` state
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7c818d] flex items-center gap-1.5">
        <Tag className="w-4 h-4 text-[#2563eb]" />
        Variant Options
      </h4>

      {error && <p className="text-xs text-[#df2e2e]">{error}</p>}

      {loading && options.length === 0 ? (
        <p className="text-xs text-[#adb0b8]">Loading options…</p>
      ) : (
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="rounded-xl border border-[#e9eaec] bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#23272f]">{option.name}</span>
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  title="Delete option (blocked while any SKU uses one of its values)"
                  className="text-[#adb0b8] hover:text-[#df2e2e]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {option.values.map((v) => (
                  <span
                    key={v.id}
                    className="inline-flex items-center gap-1 rounded-full bg-[#f6f9fe] px-2.5 py-1 text-xs text-[#727783]"
                  >
                    {v.value}
                    <button
                      type="button"
                      onClick={() => removeValue(option.id, v.id)}
                      title="Delete value (blocked while any SKU uses it)"
                      className="text-[#adb0b8] hover:text-[#df2e2e]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    value={newValueDraft[option.id] ?? ''}
                    onChange={(e) => setNewValueDraft((prev) => ({ ...prev, [option.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddValue(option.id);
                      }
                    }}
                    placeholder="Add value"
                    className="h-7 w-24 rounded-full border border-dashed border-[#e9eaec] px-2.5 text-xs focus:outline-none focus:border-[#2563eb]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddValue(option.id)}
                    className="rounded-full bg-[#23272f] p-1 text-white hover:bg-[#1d4fd1]"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {options.length === 0 && (
            <p className="text-xs text-[#adb0b8] italic">
              No options yet — add one below, e.g. "Color" or "Size".
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleAddOption} className="flex items-center gap-2">
        <input
          value={newOptionName}
          onChange={(e) => setNewOptionName(e.target.value)}
          placeholder="New option name, e.g. Color"
          className="h-9 flex-1 rounded-lg border border-[#e9eaec] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
        />
        <button
          type="submit"
          disabled={isAddingOption || !newOptionName.trim()}
          className="flex h-9 items-center gap-1 rounded-lg bg-[#23272f] px-3 text-xs font-semibold text-white hover:bg-[#1d4fd1] disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Option
        </button>
      </form>
    </div>
  );
}
