import { apiClient } from '@/lib/api-client';
import {
  AdminShipmentListParams,
  AdminShipmentListResponse,
  AdminShipmentDetail,
  StaffShipmentResult,
  UpdateShipmentTrackingInput,
} from '../types/shipment.types';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const shipmentService = {
  /** `GET /admin/shipments` — sorted `createdAt DESC, id DESC` (fixed server-side, not
   * client-configurable). No free-text search and no date-range filter exist — the query
   * schema is a `strictObject` that rejects anything beyond `status`/`orderNumber`/paging. */
  async getShipments(params: AdminShipmentListParams = {}): Promise<AdminShipmentListResponse> {
    const query = buildQuery({
      status: params.status,
      orderNumber: params.orderNumber,
      limit: params.limit ?? 25,
      offset: params.offset ?? 0,
    });
    const response = await apiClient.get<AdminShipmentListResponse>(`/admin/shipments${query}`);
    return response.data;
  },

  /** `GET /admin/shipments/:id` — includes the real transition `history`, oldest first. */
  async getShipment(id: string): Promise<AdminShipmentDetail> {
    const response = await apiClient.get<{ shipment: AdminShipmentDetail }>(`/admin/shipments/${id}`);
    return response.data.shipment;
  },

  /** `POST /admin/shipments/:id/ship` — moves stock and sets `shipped`.
   * `409` on an illegal/duplicate transition (only legal from `pending`). Returns the backend's
   * narrower `StaffShipmentResponse` — no `orderNumber`, no `history`. */
  async ship(id: string, note?: string): Promise<StaffShipmentResult> {
    const response = await apiClient.post<{ shipment: StaffShipmentResult }>(
      `/admin/shipments/${id}/ship`,
      note ? { note } : undefined,
    );
    return response.data.shipment;
  },

  /** `POST /admin/shipments/:id/deliver` — no stock movement. Only legal from `shipped`. */
  async deliver(id: string, note?: string): Promise<StaffShipmentResult> {
    const response = await apiClient.post<{ shipment: StaffShipmentResult }>(
      `/admin/shipments/${id}/deliver`,
      note ? { note } : undefined,
    );
    return response.data.shipment;
  },

  /** `PATCH /admin/shipments/:id` — carrier/tracking correction only. Allowed even once
   * `delivered`; cannot touch status. */
  async updateTracking(id: string, input: UpdateShipmentTrackingInput): Promise<StaffShipmentResult> {
    const response = await apiClient.patch<{ shipment: StaffShipmentResult }>(
      `/admin/shipments/${id}`,
      input,
    );
    return response.data.shipment;
  },
};
