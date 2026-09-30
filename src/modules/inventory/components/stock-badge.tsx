import React from 'react';

const STYLES = {
  in_stock: { dot: 'bg-[#39ad6f]', bg: 'bg-[#ecf9f2]', text: 'text-[#39ad6f]', label: 'In stock' },
  low_stock: { dot: 'bg-[#f6a61b]', bg: 'bg-[#fbf7ef]', text: 'text-[#f6a61b]', label: 'Low stock' },
  out_of_stock: { dot: 'bg-[#df2e2e]', bg: 'bg-[#fceeee]', text: 'text-[#df2e2e]', label: 'Out of stock' },
} as const;

export function StockBadge({ status }: { status: keyof typeof STYLES }) {
  const style = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
