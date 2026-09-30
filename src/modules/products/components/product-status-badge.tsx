import React from 'react';
import { ProductStatus } from '../types/product.types';

const STYLES: Record<ProductStatus, { dot: string; bg: string; text: string; label: string }> = {
  active: { dot: 'bg-[#39ad6f]', bg: 'bg-[#ecf9f2]', text: 'text-[#39ad6f]', label: 'Active' },
  draft: { dot: 'bg-[#7c818d]', bg: 'bg-[#e9eaec]', text: 'text-[#727783]', label: 'Draft' },
  archived: { dot: 'bg-[#df2e2e]', bg: 'bg-[#fceeee]', text: 'text-[#df2e2e]', label: 'Archived' },
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const style = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs ${style.bg} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
