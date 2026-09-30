'use client';

import React, { useState } from 'react';
import { Pencil, AlertCircle, Package } from 'lucide-react';
import { StockBadge } from './stock-badge';
import { EnrichedStockRow } from '../hooks/use-inventory';

export interface InventoryTableProps {
  rows: EnrichedStockRow[];
  savingSkuCode: string | null;
  onSave: (row: EnrichedStockRow, newOnHand: number) => Promise<unknown>;
}

export function InventoryTable({ rows, savingSkuCode, onSave }: InventoryTableProps) {
  const [editingSkuId, setEditingSkuId] = useState<string | null>(null);
  const [draftOnHand, setDraftOnHand] = useState('');

  const startEdit = (row: EnrichedStockRow) => {
    setEditingSkuId(row.skuId);
    setDraftOnHand(String(row.onHand));
  };

  const cancelEdit = () => {
    setEditingSkuId(null);
    setDraftOnHand('');
  };

  const handleSave = async (row: EnrichedStockRow) => {
    const parsed = Number(draftOnHand);
    if (!Number.isInteger(parsed) || parsed < 0) return;
    await onSave(row, parsed);
    cancelEdit();
  };

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <Package className="h-10 w-10 text-[#adb0b8]" />
        <p className="text-sm font-medium text-[#23272f]">No matching SKUs</p>
        <p className="text-xs text-[#7c818d]">Try a different search term or clear the stock filter.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#e9eaec] bg-[#f6f9fe] text-[16px] font-medium text-[#23272f]">
            <th className="px-6 py-3 font-medium">Product &amp; Variant</th>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-center font-medium">Available</th>
            <th className="px-4 py-3 text-center font-medium">Committed</th>
            <th className="px-4 py-3 text-center font-medium">On Hand</th>
            <th className="px-4 py-3 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e9eaec] text-[16px]">
          {rows.map((row) => {
            const isEditing = editingSkuId === row.skuId;
            const isSaving = savingSkuCode === row.skuCode;

            return (
              <tr key={row.skuId} className="hover:bg-[#f6f9fe]/60">
                <td className="px-6 py-4">
                  <p className="font-medium text-[#23272f]">{row.productName}</p>
                  <p className="text-xs text-[#7c818d]">{row.variantLabel}</p>
                </td>
                <td className="px-4 py-4 text-[#23272f]">{row.skuCode}</td>
                <td className="px-4 py-4">
                  <StockBadge status={row.status} />
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${row.status === 'out_of_stock' || row.status === 'low_stock' ? 'text-[#f37216]' : 'text-[#23272f]'}`}
                  >
                    {row.available}
                    {row.status !== 'in_stock' && <AlertCircle className="h-3 w-3" />}
                  </span>
                </td>
                <td className="px-4 py-4 text-center text-[#7c818d]">{row.reserved}</td>
                <td className="px-4 py-4 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      min={0}
                      autoFocus
                      value={draftOnHand}
                      onChange={(e) => setDraftOnHand(e.target.value)}
                      className="w-20 rounded-lg border border-[#2563eb] px-2 py-1 text-center text-sm focus:outline-none"
                    />
                  ) : (
                    <span className="font-medium text-[#23272f]">{row.onHand}</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg border border-[#e9eaec] px-3 py-1.5 text-xs text-[#7c818d] hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(row)}
                        disabled={isSaving}
                        className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs text-white hover:bg-[#1d4fd1] disabled:opacity-60"
                      >
                        {isSaving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(row)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#7c818d] px-3 py-1.5 text-xs text-[#7c818d] hover:border-[#2563eb] hover:text-[#2563eb]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
