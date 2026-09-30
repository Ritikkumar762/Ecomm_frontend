import { apiClient } from '@/lib/api-client';
import { DashboardQueryParams, DashboardResponse } from '../types/dashboard.types';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const dashboardService = {
  /** `GET /admin/dashboard` — every figure the dashboard screen renders, in one call, so all
   * seven widgets share one analytics window rather than each re-deriving it. */
  async getOverview(params: DashboardQueryParams = {}): Promise<DashboardResponse> {
    const query = buildQuery({
      from: params.from,
      to: params.to,
      interval: params.interval,
      topProductsLimit: params.topProductsLimit,
      lowStockLimit: params.lowStockLimit,
      recentOrdersLimit: params.recentOrdersLimit,
    });
    const response = await apiClient.get<DashboardResponse>(`/admin/dashboard${query}`);
    return response.data;
  },
};
