'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string;
  /** Percent change vs. the equal-length prior period. `null` when no comparison exists (the
   * backend never invents one for products/customers) — rendered as no badge at all, not 0%. */
  changePercent?: number | null;
}

export function KpiCard({ title, value, changePercent }: KpiCardProps) {
  const hasChange = changePercent !== undefined && changePercent !== null && Number.isFinite(changePercent);
  const isPositive = hasChange && changePercent! >= 0;

  return (
    <div className="flex-1 rounded-2xl border border-[#e9eaec] bg-white p-5">
      <p className="text-xs text-[#7c818d]">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-xl font-medium text-[#23272f]">{value}</p>
        {hasChange && (
          <span
            className={`flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-xs font-medium ${
              isPositive ? 'bg-[#ecf9f2] text-[#39ad6f]' : 'bg-[#fceeee] text-[#df2e2e]'
            }`}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(changePercent!).toFixed(1)}%
          </span>
        )}
      </div>
      {hasChange && <p className="mt-1 text-[11px] text-[#adb0b8]">vs. previous period</p>}
    </div>
  );
}
