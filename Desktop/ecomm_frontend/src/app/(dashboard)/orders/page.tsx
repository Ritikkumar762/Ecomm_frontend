'use client';

import React from 'react';
import { useOrders } from '@/modules/orders/hooks/use-orders';
import { OrderTable } from '@/modules/orders/components/order-table';

export default function OrdersPage() {
  const { orders, loading, changeOrderStatus } = useOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review placed orders, update status, and manage payment fulfillments.
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
      ) : (
        <OrderTable orders={orders} onStatusChange={changeOrderStatus} />
      )}
    </div>
  );
}
