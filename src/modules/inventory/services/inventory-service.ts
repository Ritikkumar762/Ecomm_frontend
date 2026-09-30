import { apiClient } from '@/lib/api-client';
import {
  StockListParams,
  StockListResponse,
  StockAdjustmentInput,
  StockAdjustmentResult,
  InventorySummary,
  SkuCatalogueInfo,
} from '../types/inventory.types';

/** The shape `GET /admin/products` returns — only the fields this module reads. */
interface AdminProductListSku {
  id: string;
  name: string;
  lowStockThreshold: number | null;
  options: { optionName: string; value: string }[];
}
interface AdminProductListItem {
  slug: string;
  name: string;
  skus: AdminProductListSku[];
}
interface AdminProductListResponse {
  products: AdminProductListItem[];
  pagination: { limit: number; offset: number; total: number };
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const inventoryService = {
  /** `GET /admin/inventory` — the store's stock rows, paged. */
  async getStock(params: StockListParams = {}): Promise<StockListResponse> {
    const query = buildQuery({
      q: params.q,
      stockState: params.stockState,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    });
    const response = await apiClient.get<StockListResponse>(`/admin/inventory${query}`);
    return response.data;
  },

  /** `GET /admin/inventory/summary` — store-wide out-of-stock SKU count. */
  async getSummary(): Promise<InventorySummary> {
    const response = await apiClient.get<{ inventory: InventorySummary }>('/admin/inventory/summary');
    return response.data.inventory;
  },

  /** `POST /admin/inventory/adjustments` — the only way to change on-hand stock. Takes a
   * signed delta, never a target: the caller computes the delta from what changed. */
  async adjustStock(input: StockAdjustmentInput): Promise<StockAdjustmentResult> {
    const response = await apiClient.post<StockAdjustmentResult>('/admin/inventory/adjustments', input);
    return response.data;
  },

  /**
   * Builds a `skuId -> { productName, variantLabel, lowStockThreshold }` lookup from
   * `GET /admin/products`, which is the only endpoint that carries both a SKU and the
   * product it belongs to. `GET /admin/inventory` itself only knows `skuId`/`skuCode`.
   *
   * Capped at the list's own maximum page size (100). For a store with more products than
   * that, later pages fall back to the SKU code alone — a real limitation of the current
   * backend contract, not a mistake to hide.
   */
  async getSkuCatalogueLookup(): Promise<Map<string, SkuCatalogueInfo>> {
    const response = await apiClient.get<AdminProductListResponse>('/admin/products?limit=100&offset=0');
    const lookup = new Map<string, SkuCatalogueInfo>();

    for (const product of response.data.products) {
      for (const sku of product.skus) {
        const optionLabel = sku.options.map((o) => o.value).join(' / ');
        lookup.set(sku.id, {
          productName: product.name,
          productSlug: product.slug,
          variantLabel: optionLabel || sku.name || '—',
          lowStockThreshold: sku.lowStockThreshold,
        });
      }
    }

    return lookup;
  },
};
