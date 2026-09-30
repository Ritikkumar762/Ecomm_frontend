/**
 * Mirrors syntellite-headless-ecomm's orders module (`src/modules/orders/dto.ts`).
 *
 * `displayStatus` is COMPOSED on the backend from three separate lifecycles (order/payment/
 * shipment) and stored nowhere — see `order-display-status.ts`. `ready_to_ship` and `returned`
 * are deliberately absent from that composition (not derivable yet), so this frontend never
 * shows them either.
 */
export const ORDER_DISPLAY_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'failed',
] as const;
export type OrderDisplayStatus = (typeof ORDER_DISPLAY_STATUSES)[number];

/** The filterable payment/shipment vocabularies `GET /admin/orders` accepts as query params —
 * narrower than every value that can ever appear in a `payment`/`shipment` block. */
export const ADMIN_FILTER_PAYMENT_STATUSES = ['pending', 'succeeded', 'failed', 'expired'] as const;
export const ADMIN_FILTER_SHIPMENT_STATUSES = ['pending', 'shipped', 'delivered'] as const;

export interface OrderCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderPayment {
  status: string;
  method: string;
}

export interface OrderShipment {
  status: string;
}

/** One row of `GET /admin/orders` — no line items, no address (§ the list carries identity,
 * status and money only; the detail endpoint carries the rest). */
export interface AdminOrderSummary {
  orderNumber: string;
  displayStatus: OrderDisplayStatus;
  /** The underlying `order.status`: `placed` or `cancelled`. */
  status: string;
  currency: string;
  total: string;
  taxTotal: string;
  grandTotal: string;
  placedAt: string;
  customer: OrderCustomer;
  payment: OrderPayment | null;
  shipment: OrderShipment | null;
}

export interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
}

export interface AdminOrderListResponse {
  orders: AdminOrderSummary[];
  pagination: PaginationInfo;
}

export interface AdminOrderListParams {
  q?: string;
  displayStatus?: OrderDisplayStatus;
  paymentStatus?: (typeof ADMIN_FILTER_PAYMENT_STATUSES)[number];
  shipmentStatus?: (typeof ADMIN_FILTER_SHIPMENT_STATUSES)[number];
  placedFrom?: string;
  placedTo?: string;
  limit?: number;
  offset?: number;
}

/** `GET /admin/orders/summary` — zero-filled counts for every status bucket. */
export interface AdminOrderStatusSummary {
  byDisplayStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
  byShipmentStatus: Record<string, number>;
}
