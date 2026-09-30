/** Mirrors syntellite-headless-ecomm's dashboard module (`src/modules/dashboard/dto.ts`). One
 * endpoint for the whole screen, so every widget shares one analytics window. */

export const DASHBOARD_INTERVALS = ['day', 'week', 'month'] as const;
export type DashboardInterval = (typeof DASHBOARD_INTERVALS)[number];

export interface DashboardQueryParams {
  /** ISO-8601 instant with an offset. Omitted, the window is the last 12 calendar months. */
  from?: string;
  to?: string;
  interval?: DashboardInterval;
  topProductsLimit?: number;
  lowStockLimit?: number;
  recentOrdersLimit?: number;
}

export interface DashboardKpiMoney {
  value: string;
  currency: string;
  previous: string;
}

export interface DashboardKpiCount {
  value: number;
  /** `null` for products/customers — cumulative facts with no recorded history, never a guess. */
  previous: number | null;
}

export interface DashboardSalesPoint {
  bucket: string;
  revenue: string;
  orders: number;
}

export interface DashboardTopProduct {
  skuCode: string;
  productName: string;
  skuName: string;
  quantitySold: number;
  revenue: string;
}

export interface DashboardLowStockRow {
  skuCode: string;
  productName: string;
  skuName: string;
  onHand: number;
  reserved: number;
  available: number;
  threshold: number;
}

/** The admin order list's own row shape, reused verbatim by the backend. Narrowed to just the
 * fields the dashboard's Recent Activity list actually renders. */
export interface DashboardRecentOrder {
  orderNumber: string;
  displayStatus: string;
  grandTotal: string;
  currency: string;
  placedAt: string;
  customer: { firstName: string; lastName: string; email: string };
}

export interface DashboardResponse {
  range: {
    from: string;
    to: string;
    previousFrom: string;
    previousTo: string;
    timezone: string;
    interval: string;
  };
  kpis: {
    revenue: DashboardKpiMoney;
    orders: DashboardKpiCount;
    products: DashboardKpiCount;
    customers: DashboardKpiCount;
  };
  salesSeries: DashboardSalesPoint[];
  orderStatusCounts: Record<string, number>;
  topProducts: DashboardTopProduct[];
  lowStock: DashboardLowStockRow[];
  recentOrders: DashboardRecentOrder[];
}
