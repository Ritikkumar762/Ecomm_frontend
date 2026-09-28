'use client';

import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analytics-service';
import { DashboardOverviewStats } from '../types/analytics.types';

export function useAnalyticsData() {
  const [stats, setStats] = useState<DashboardOverviewStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return { stats, loading };
}
