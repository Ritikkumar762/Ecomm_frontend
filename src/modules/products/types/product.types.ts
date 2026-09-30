/**
 * Mirrors syntellite-headless-ecomm's catalogue module (`src/modules/catalogue/dto.ts`).
 * Products are addressed by SLUG, not id, everywhere the API is concerned, and a product
 * has no price of its own — only its SKUs do, as decimal STRINGS (never a JSON number; see
 * `priceField`'s comment in the backend for why).
 */
export type ProductStatus = 'draft' | 'active' | 'archived';

/** `in_stock`/`low_stock` deliberately overlap (a low SKU is still sellable); a product with
 * no live SKUs at all is `out_of_stock`. */
export type ProductStockStateFilter = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface SkuOption {
  optionId: string;
  optionName: string;
  optionSortOrder: number;
  valueId: string;
  value: string;
  valueSortOrder: number;
}

export interface Sku {
  id: string;
  productId: string;
  code: string;
  name: string;
  /** Decimal string at the store's currency scale, e.g. "199.99". */
  price: string;
  isActive: boolean;
  lowStockThreshold: number | null;
  options: SkuOption[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: ProductStatus;
  skus: Sku[];
  /** `null` when the merchant has not categorised this product. */
  categoryId: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCounts {
  total: number;
  draft: number;
  active: number;
  archived: number;
}

export interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: PaginationInfo;
  counts: ProductCounts;
}

export interface ProductListParams {
  q?: string;
  status?: ProductStatus;
  stockState?: ProductStockStateFilter;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

/** Mirrors `MediaResponse` (`GET /admin/products/:slug/media`) — only the fields the product
 * list's thumbnail needs. `url` is `null` when this deployment has no object storage. */
export interface ProductMedia {
  id: string;
  url: string | null;
  isPrimary: boolean;
  altText: string;
}

/** `POST /admin/products` — `slug`/`name` required, everything else optional. */
export interface CreateProductInput {
  slug: string;
  name: string;
  description?: string;
  status?: ProductStatus;
  categoryId?: string | null;
}

/** `PATCH /admin/products/:slug` — at least one field required (enforced server-side too). */
export interface UpdateProductInput {
  name?: string;
  description?: string;
  /** `null` clears the category; `undefined` leaves it untouched. */
  categoryId?: string | null;
}

export const PRODUCT_BULK_ACTIONS = ['publish', 'archive', 'delete'] as const;
export type ProductBulkAction = (typeof PRODUCT_BULK_ACTIONS)[number];

/** `POST /admin/products/:slug/skus` */
export interface CreateSkuInput {
  /** Absent means the server generates one from the product slug. */
  code?: string;
  name?: string;
  price: string;
  lowStockThreshold?: number;
  isActive?: boolean;
}

/** `PATCH /admin/skus/:code` — at least one field required. */
export interface UpdateSkuInput {
  name?: string;
  price?: string;
  isActive?: boolean;
  /** `null` explicitly clears the threshold; `undefined` leaves it untouched. */
  lowStockThreshold?: number | null;
}

/* ── Variant options (Color, Size, ...) ──────────────────────────────────── */

export interface OptionValue {
  id: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** An option, with its values nested — the same shape `GET /admin/products/:slug/options`
 * and `POST /admin/products/:slug/options` both return. */
export interface Option {
  id: string;
  productId: string;
  name: string;
  sortOrder: number;
  values: OptionValue[];
  createdAt: string;
  updatedAt: string;
}

/** `POST /admin/products/:slug/options` */
export interface CreateOptionInput {
  name: string;
  sortOrder?: number;
}

/** `PATCH /admin/options/:id` — at least one field required. */
export interface UpdateOptionInput {
  name?: string;
  sortOrder?: number;
}

/** `POST /admin/options/:id/values` */
export interface CreateOptionValueInput {
  value: string;
  sortOrder?: number;
}

/** `PATCH /admin/option-values/:id` — at least one field required. */
export interface UpdateOptionValueInput {
  value?: string;
  sortOrder?: number;
}
