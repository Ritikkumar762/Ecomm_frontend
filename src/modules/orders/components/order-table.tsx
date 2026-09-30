'use client';

import React from 'react';
import { ShoppingBag, Ban } from 'lucide-react';
import { AdminOrderSummary } from '../types/order.types';
import { StatusBadge } from './status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export interface OrderTableProps {
  orders: AdminOrderSummary[];
  cancellingOrder: string | null;
  onCancel: (orderNumber: string) => void;
}

export function OrderTable({ orders, cancellingOrder, onCancel }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <ShoppingBag className="h-10 w-10 text-[#adb0b8]" />
        <p className="text-sm font-medium text-[#23272f]">No orders found</p>
        <p className="text-xs text-[#7c818d]">Try a different search term or clear the status filter.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#e9eaec] bg-[#f6f9fe] text-[16px] font-medium text-[#23272f]">
            <th className="px-6 py-3 font-medium">Order ID</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Payment</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Shipment</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e9eaec] text-[14px]">
          {orders.map((order) => {
            const canCancel = order.status === 'placed';
            const isCancelling = cancellingOrder === order.orderNumber;

            return (
              <tr key={order.orderNumber} className="hover:bg-[#f6f9fe]/60">
                <td className="px-6 py-4 font-medium text-[#23272f]">{order.orderNumber}</td>
                <td className="px-4 py-4 text-[#7c818d]">{formatDate(order.placedAt)}</td>
                <td className="px-4 py-4">
                  <p className="text-[#23272f]">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-xs text-[#7c818d]">{order.customer.email}</p>
                </td>
                <td className="px-4 py-4 font-medium text-[#23272f]">
                  {formatCurrency(Number(order.grandTotal), order.currency)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={order.payment?.status ?? null} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={order.displayStatus} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={order.shipment?.status ?? null} />
                </td>
                <td className="px-4 py-4 text-right">
                  {canCancel ? (
                    <button
                      onClick={() => onCancel(order.orderNumber)}
                      disabled={isCancelling}
                      title="Cancel order"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      {isCancelling ? 'Cancelling…' : 'Cancel'}
                    </button>
                  ) : (
                    <span className="text-xs text-[#adb0b8]">—</span>
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
