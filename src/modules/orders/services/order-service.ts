import { apiClient } from '@/lib/api-client';
import { AdminOrderListParams, AdminOrderListResponse, AdminOrderStatusSummary } from '../types/order.types';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const orderService = {
  /** `GET /admin/orders` — a page of the store's orders, filtered and sorted server-side. */
  async getOrders(params: AdminOrderListParams = {}): Promise<AdminOrderListResponse> {
    const query = buildQuery({
      q: params.q,
      displayStatus: params.displayStatus,
      paymentStatus: params.paymentStatus,
      shipmentStatus: params.shipmentStatus,
      placedFrom: params.placedFrom,
      placedTo: params.placedTo,
      limit: params.limit ?? 25,
      offset: params.offset ?? 0,
    });
    const response = await apiClient.get<AdminOrderListResponse>(`/admin/orders${query}`);
    return response.data;
  },

  /** `GET /admin/orders/summary` — the tab counts, zero-filled for every status. */
  async getSummary(): Promise<AdminOrderStatusSummary> {
    const response = await apiClient.get<{ orders: AdminOrderStatusSummary }>('/admin/orders/summary');
    return response.data.orders;
  },

  /** `POST /admin/orders/:orderNumber/cancel` — refused (409) once paid or already cancelled. */
  async cancelOrder(orderNumber: string): Promise<void> {
    await apiClient.post(`/admin/orders/${orderNumber}/cancel`);
  },
};
