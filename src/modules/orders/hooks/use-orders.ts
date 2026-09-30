'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/order-service';
import {
  AdminOrderSummary,
  AdminOrderStatusSummary,
  OrderDisplayStatus,
} from '../types/order.types';
import { useDebounce } from '@/hooks/use-debounce';
import { ApiError } from '@/lib/api-client';

const PAGE_SIZE = 7;

export function useOrders() {
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [summary, setSummary] = useState<AdminOrderStatusSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayStatus, setDisplayStatus] = useState<OrderDisplayStatus | 'all'>('all');
  /** ISO date strings (`YYYY-MM-DD`), or `''` for no bound. Sent as `placedFrom`/`placedTo`. */
  const [placedFrom, setPlacedFrom] = useState('');
  const [placedTo, setPlacedTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.getOrders({
        q: debouncedSearch || undefined,
        displayStatus: displayStatus === 'all' ? undefined : displayStatus,
        placedFrom: placedFrom || undefined,
        placedTo: placedTo || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setOrders(result.orders);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, displayStatus, placedFrom, placedTo, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    orderService
      .getSummary()
      .then(setSummary)
      .catch(() => {});
  }, [orders]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, displayStatus, placedFrom, placedTo]);

  const cancelOrder = async (orderNumber: string) => {
    setCancellingOrder(orderNumber);
    setError(null);
    try {
      await orderService.cancelOrder(orderNumber);
      await fetchOrders();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to cancel order.');
      throw err;
    } finally {
      setCancellingOrder(null);
    }
  };

  return {
    orders,
    summary,
    total,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    displayStatus,
    setDisplayStatus,
    placedFrom,
    setPlacedFrom,
    placedTo,
    setPlacedTo,
    cancellingOrder,
    cancelOrder,
    refresh: fetchOrders,
  };
}
