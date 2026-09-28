'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';

const mockCustomers = [
  { id: '1', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', ordersCount: 5, spent: '$620.00', status: 'active' },
  { id: '2', name: 'Priya Patel', email: 'priya.patel@example.com', ordersCount: 3, spent: '$410.50', status: 'active' },
  { id: '3', name: 'Rahul Verma', email: 'rahul.verma@example.com', ordersCount: 1, spent: '$79.00', status: 'new' },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
        <p className="text-sm text-slate-500 mt-1">
          View registered customer accounts and order purchasing histories.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-6">Customer</th>
              <th className="py-3.5 px-4">Total Orders</th>
              <th className="py-3.5 px-4">Total Spent</th>
              <th className="py-3.5 px-4">Account Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {mockCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 font-medium text-slate-700">{customer.ordersCount} orders</td>
                <td className="py-4 px-4 font-bold text-slate-900">{customer.spent}</td>
                <td className="py-4 px-4">
                  <Badge variant="success">{customer.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
