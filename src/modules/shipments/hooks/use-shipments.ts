'use client';

import { useState, useEffect, useCallback } from 'react';
import { shipmentService } from '../services/shipment-service';
import { AdminShipmentSummary, ShipmentStatus } from '../types/shipment.types';
import { useDebounce } from '@/hooks/use-debounce';
import { ApiError } from '@/lib/api-client';

const PAGE_SIZE = 25;

export function useShipments() {
  const [shipments, setShipments] = useState<AdminShipmentSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [orderNumberQuery, setOrderNumberQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const debouncedOrderNumber = useDebounce(orderNumberQuery, 300);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await shipmentService.getShipments({
        status: statusFilter === 'all' ? undefined : statusFilter,
        orderNumber: debouncedOrderNumber.trim() || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setShipments(result.shipments);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedOrderNumber, page]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, debouncedOrderNumber]);

  const ship = async (id: string) => {
    setActioningId(id);
    setError(null);
    try {
      await shipmentService.ship(id);
      await fetchShipments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to mark shipment as shipped.');
      throw err;
    } finally {
      setActioningId(null);
    }
  };

  const deliver = async (id: string) => {
    setActioningId(id);
    setError(null);
    try {
      await shipmentService.deliver(id);
      await fetchShipments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to mark shipment as delivered.');
      throw err;
    } finally {
      setActioningId(null);
    }
  };

  return {
    shipments,
    total,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    statusFilter,
    setStatusFilter,
    orderNumberQuery,
    setOrderNumberQuery,
    loading,
    error,
    actioningId,
    ship,
    deliver,
    refresh: fetchShipments,
  };
}
