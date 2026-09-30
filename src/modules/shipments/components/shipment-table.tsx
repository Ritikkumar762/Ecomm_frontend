'use client';

import React from 'react';
import { Truck, ExternalLink, Eye } from 'lucide-react';
import { StatusBadge } from '@/modules/orders/components/status-badge';
import { AdminShipmentSummary } from '../types/shipment.types';
import { formatDate } from '@/lib/utils';

export interface ShipmentTableProps {
  shipments: AdminShipmentSummary[];
  actioningId: string | null;
  onShip: (id: string) => void;
  onDeliver: (id: string) => void;
  onView: (shipment: AdminShipmentSummary) => void;
}

export function ShipmentTable({ shipments, actioningId, onShip, onDeliver, onView }: ShipmentTableProps) {
  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <Truck className="h-10 w-10 text-[#adb0b8]" />
        <p className="text-sm font-medium text-[#23272f]">No shipments found</p>
        <p className="text-xs text-[#7c818d]">Try a different order number or clear the status filter.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#e9eaec] bg-[#f6f9fe] text-[16px] font-medium text-[#23272f]">
            <th className="px-6 py-3 font-medium">Order Number</th>
            <th className="px-4 py-3 font-medium">Courier</th>
            <th className="px-4 py-3 font-medium">Tracking Number</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e9eaec] text-[14px]">
          {shipments.map((shipment) => {
            const isActioning = actioningId === shipment.id;
            return (
              <tr key={shipment.id} className="hover:bg-[#f6f9fe]/60">
                <td className="px-6 py-4 font-medium text-[#23272f]">{shipment.orderNumber}</td>
                <td className="px-4 py-4 text-[#727783]">{shipment.carrier ?? '—'}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#727783]">{shipment.trackingNumber ?? '—'}</span>
                    {shipment.trackingUrl && (
                      <a
                        href={shipment.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Track with courier"
                        className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Track
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={shipment.status} />
                </td>
                <td className="px-4 py-4 text-[#7c818d]">{formatDate(shipment.createdAt)}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(shipment)}
                      title="View details and tracking history"
                      className="rounded-lg p-1.5 text-[#7c818d] hover:bg-slate-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {shipment.status === 'pending' && (
                      <button
                        onClick={() => onShip(shipment.id)}
                        disabled={isActioning}
                        className="rounded-lg border border-[#e9eaec] px-3 py-1.5 text-xs text-[#23272f] hover:bg-slate-50 disabled:opacity-50"
                      >
                        {isActioning ? 'Shipping…' : 'Ship'}
                      </button>
                    )}
                    {shipment.status === 'shipped' && (
                      <button
                        onClick={() => onDeliver(shipment.id)}
                        disabled={isActioning}
                        className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs text-white hover:bg-[#1d4fd1] disabled:opacity-50"
                      >
                        {isActioning ? 'Delivering…' : 'Deliver'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
