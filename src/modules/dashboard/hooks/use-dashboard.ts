'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboard-service';
import { DashboardResponse } from '../types/dashboard.types';
import { ApiError } from '@/lib/api-client';

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** Plain `YYYY-MM-DD` from a `<input type="date">`, or `''` for the backend's own default
   * (the last 12 calendar months). Widened to a full-day instant range at the edge, in the
   * browser's own offset — matching how the Orders page's date range already does this. */
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.getOverview({
        from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
        to: to ? new Date(`${to}T23:59:59.999`).toISOString() : undefined,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { data, loading, error, from, setFrom, to, setTo, refresh: fetchOverview };
}
