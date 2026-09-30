'use client';

import React from 'react';
import { DashboardTopProduct } from '../types/dashboard.types';
import { formatCurrency } from '@/lib/utils';

export function TopSellingList({ products, currency }: { products: DashboardTopProduct[]; currency: string }) {
  if (products.length === 0) {
    return <p className="py-8 text-center text-sm text-[#7c818d]">No sales in this window yet.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="text-xs text-[#7c818d]">
          <th className="pb-2 font-medium">Product</th>
          <th className="pb-2 text-right font-medium">Sales</th>
          <th className="pb-2 text-right font-medium">Revenue</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#e9eaec]">
        {products.map((p) => (
          <tr key={p.skuCode}>
            <td className="py-2.5">
              <p className="font-medium text-[#23272f]">{p.productName}</p>
              <p className="text-xs text-[#7c818d]">
                {p.skuName} · {p.skuCode}
              </p>
            </td>
            <td className="py-2.5 text-right text-[#727783]">{p.quantitySold}</td>
            <td className="py-2.5 text-right font-medium text-[#23272f]">
              {formatCurrency(Number(p.revenue), currency)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
