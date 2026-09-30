'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useShipments } from '@/modules/shipments/hooks/use-shipments';
import { ShipmentTable } from '@/modules/shipments/components/shipment-table';
import { ShipmentDetailModal } from '@/modules/shipments/components/shipment-detail-modal';
import { FilterSelect } from '@/components/ui/filter-select';
import { Pagination } from '@/components/ui/pagination';
import { SHIPMENT_STATUSES, ShipmentStatus, AdminShipmentSummary } from '@/modules/shipments/types/shipment.types';

const STATUS_FILTERS: { label: string; value: ShipmentStatus | 'all' }[] = [
  { label: 'All statuses', value: 'all' },
  ...SHIPMENT_STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s })),
];

export default function ShipmentsPage() {
  const {
    shipments,
    total,
    page,
    setPage,
    pageSize,
    statusFilter,
    setStatusFilter,
    orderNumberQuery,
    setOrderNumberQuery,
    loading,
    error,
    actioningId,
    ship,
    deliver,
    refresh,
  } = useShipments();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pageStart = total === 0 ? 0 : page * pageSize + 1;
  const pageEnd = Math.min(total, (page + 1) * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-[#23272f]">Shipments</h1>
        <p className="mt-1 text-xs text-[#7c818d]">
          Live from the backend fulfilment ledger — pending, shipped and delivered state.
        </p>
      </div>

      <div className="rounded-3xl border border-[#e9eaec] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e9eaec] px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-[#e9eaec] px-4 py-3 sm:w-[320px]">
            <Search className="h-5 w-5 shrink-0 text-[#7c818d]" />
            <input
              type="text"
              placeholder="Search by exact order number"
              value={orderNumberQuery}
              onChange={(e) => setOrderNumberQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#23272f] placeholder:text-[#7c818d] focus:outline-none"
            />
          </div>
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | 'all')}>
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </FilterSelect>
        </div>

        {error ? (
          <div className="px-6 py-10 text-center text-sm text-rose-600">{error}</div>
        ) : loading ? (
          <div className="h-64 animate-pulse bg-slate-50" />
        ) : (
          <ShipmentTable
            shipments={shipments}
            actioningId={actioningId}
            onShip={ship}
            onDeliver={deliver}
            onView={(shipment: AdminShipmentSummary) => setSelectedId(shipment.id)}
          />
        )}

        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-[#7c818d]">
            {total === 0 ? 'No shipments' : `Showing ${pageStart}-${pageEnd} of ${total} shipments`}
          </p>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </div>

      <ShipmentDetailModal shipmentId={selectedId} onClose={() => setSelectedId(null)} onChanged={refresh} />
    </div>
  );
}
