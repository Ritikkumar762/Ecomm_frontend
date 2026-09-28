'use client';

import React from 'react';
import { Order, OrderStatus } from '../types/order.types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';

export interface OrderTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No orders placed yet</h3>
        <p className="text-sm text-slate-500 mt-1">Orders from your store will appear here.</p>
      </div>
    );
  }

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'processing':
      case 'shipped':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-6">Order ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Fulfillment Status</th>
              <th className="py-3.5 px-6 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">{order.orderNumber}</td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-900 leading-tight">{order.customerName}</p>
                  <p className="text-xs text-slate-500">{order.customerEmail}</p>
                </td>
                <td className="py-4 px-4 text-slate-600">{formatDate(order.createdAt)}</td>
                <td className="py-4 px-4 font-bold text-slate-900">{formatCurrency(order.totalAmount)}</td>
                <td className="py-4 px-4">
                  <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </td>
                <td className="py-4 px-6 text-right">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                    className="text-xs font-medium rounded-lg border border-slate-300 bg-white py-1 px-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
