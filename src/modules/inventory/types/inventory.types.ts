/**
 * Mirrors the syntellite-headless-ecomm inventory module's wire contracts
 * (`src/modules/inventory/dto.ts`). `available` is a DB-generated column — never
 * recomputed here — and there is deliberately no `incoming`/on-order figure: the backend
 * has no purchase-order or restock-ETA concept, so nothing here invents one.
 */
export interface StockItem {
  skuId: string;
  skuCode: string;
  onHand: number;
  reserved: number;
  available: number;
  createdAt: string;
  updatedAt: string;
}

export type StockStateFilter = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface StockListParams {
  q?: string;
  stockState?: StockStateFilter;
  limit?: number;
  offset?: number;
}

export interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
}

export interface StockListResponse {
  inventory: StockItem[];
  pagination: PaginationInfo;
}

/** The five reasons the backend's ledger accepts (`STOCK_REASONS` in `inventory.repository.ts`). */
export type StockAdjustmentReason =
  | 'manual_increase'
  | 'manual_decrease'
  | 'correction'
  | 'shipment'
  | 'return_restock';

export interface StockAdjustmentInput {
  skuCode: string;
  /** A signed delta, never a target quantity — the backend has no "set to" endpoint. */
  delta: number;
  reason: StockAdjustmentReason;
  note?: string;
}

export interface StockLedgerEntry {
  id: string;
  skuId: string;
  delta: number;
  onHandBefore: number;
  onHandAfter: number;
  reason: string;
  note: string;
  actorUserId: string;
  requestId: string | null;
  createdAt: string;
}

export interface StockAdjustmentResult {
  inventory: StockItem;
  adjustment: StockLedgerEntry;
}

export interface InventorySummary {
  outOfStockSkus: number;
}

/**
 * SKU/product facts this module needs but the stock endpoint does not carry — sourced from
 * `catalogue`'s admin product list and joined in on `skuId` client-side. `null`
 * `lowStockThreshold` means the merchant never configured one, and such a SKU is never "low".
 */
export interface SkuCatalogueInfo {
  productName: string;
  productSlug: string;
  variantLabel: string;
  lowStockThreshold: number | null;
}
