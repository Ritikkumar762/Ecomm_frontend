/**
 * Mirrors syntellite-headless-ecomm's fulfilment module (`src/modules/fulfilment/dto.ts`).
 *
 * Only three real statuses exist — a linear chain with no branches:
 *   pending -> shipped -> delivered
 * There is no `cancelled`/`returned`/`in_transit`/`out_for_delivery` anywhere in the backend.
 */
export const SHIPMENT_STATUSES = ['pending', 'shipped', 'delivered'] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

/** `GET /admin/shipments` row. No customer name/address — the shipment record carries
 * none, and the list endpoint does not join the order for one. */
export interface AdminShipmentSummary {
  id: string;
  orderNumber: string;
  status: ShipmentStatus;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

/** One entry of a shipment's real transition history — `fromStatus`/`toStatus` pairs, not a
 * free-form human string. The frontend maps these to a label ("Shipment Created", etc). */
export interface ShipmentEvent {
  fromStatus: ShipmentStatus | null;
  toStatus: ShipmentStatus;
  actorType: string;
  note: string | null;
  occurredAt: string;
}

export interface AdminShipmentDetail extends AdminShipmentSummary {
  history: ShipmentEvent[];
}

/** What `POST .../ship`, `POST .../deliver`, and `PATCH /admin/shipments/:id` actually return
 * (`StaffShipmentResponse` on the backend) — no `orderNumber`, no `history`. Narrower than
 * {@link AdminShipmentSummary} on purpose, so a caller can't reach for a field these endpoints
 * never send. */
export interface StaffShipmentResult {
  id: string;
  status: ShipmentStatus;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

export interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
}

export interface AdminShipmentListResponse {
  shipments: AdminShipmentSummary[];
  pagination: PaginationInfo;
}

export interface AdminShipmentListParams {
  status?: ShipmentStatus;
  /** Exact match only — the backend validates this against the real order-number shape. */
  orderNumber?: string;
  limit?: number;
  offset?: number;
}

/** `PATCH /admin/shipments/:id` — a tracking-only correction. Every field nullable and
 * optional; `status` is deliberately absent, there is no such column to PATCH. */
export interface UpdateShipmentTrackingInput {
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
}
