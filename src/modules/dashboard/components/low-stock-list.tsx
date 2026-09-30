'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DashboardLowStockRow } from '../types/dashboard.types';

export function LowStockList({ rows }: { rows: DashboardLowStockRow[] }) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-[#7c818d]">Nothing is running low.</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.skuCode} className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#23272f]">{row.productName}</p>
            <p className="truncate text-xs text-[#7c818d]">
              {row.skuName} · {row.skuCode}
            </p>
          </div>
          <span
            className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
              row.available <= 0 ? 'bg-[#fceeee] text-[#df2e2e]' : 'bg-[#fbf7ef] text-[#f6a61b]'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            {row.available} left
          </span>
        </li>
      ))}
    </ul>
  );
}
