import { apiClient } from '@/lib/api-client';
import {
  Product,
  ProductListParams,
  ProductListResponse,
  CreateProductInput,
  UpdateProductInput,
  ProductBulkAction,
  Sku,
  CreateSkuInput,
  UpdateSkuInput,
  Option,
  CreateOptionInput,
  UpdateOptionInput,
  OptionValue,
  CreateOptionValueInput,
  UpdateOptionValueInput,
  ProductMedia,
} from '../types/product.types';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

/** Turns a product name into the slug `CreateProductRequestSchema` accepts: lowercase,
 * digits and single hyphens only, no leading/trailing/doubled hyphen. */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const productService = {
  // --- Products ---

  async getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
    const query = buildQuery({
      q: params.q,
      status: params.status,
      stockState: params.stockState,
      categoryId: params.categoryId,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    });
    const response = await apiClient.get<ProductListResponse>(`/admin/products${query}`);
    return response.data;
  },

  /** `GET /admin/products/:slug/media` — the product's gallery, unpaginated. Used to pull the
   * primary image for the list thumbnail; `url` is `null` where no object storage is configured. */
  async getProductMedia(slug: string): Promise<ProductMedia[]> {
    const response = await apiClient.get<{ media: ProductMedia[] }>(`/admin/products/${slug}/media`);
    return response.data.media;
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await apiClient.get<{ product: Product }>(`/admin/products/${slug}`);
    return response.data.product;
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    const response = await apiClient.post<{ product: Product }>('/admin/products', input);
    return response.data.product;
  },

  async updateProduct(slug: string, input: UpdateProductInput): Promise<Product> {
    const response = await apiClient.patch<{ product: Product }>(`/admin/products/${slug}`, input);
    return response.data.product;
  },

  async deleteProduct(slug: string): Promise<void> {
    await apiClient.delete(`/admin/products/${slug}`);
  },

  async publishProduct(slug: string): Promise<Product> {
    const response = await apiClient.post<{ product: Product }>(`/admin/products/${slug}/publish`);
    return response.data.product;
  },

  async archiveProduct(slug: string): Promise<Product> {
    const response = await apiClient.post<{ product: Product }>(`/admin/products/${slug}/archive`);
    return response.data.product;
  },

  /** `POST /admin/products/bulk` — all-or-nothing across the given slugs. */
  async bulkAction(
    slugs: string[],
    action: ProductBulkAction,
  ): Promise<{ action: string; affected: number; slugs: string[] }> {
    const response = await apiClient.post<{ action: string; affected: number; slugs: string[] }>(
      '/admin/products/bulk',
      { slugs, action },
    );
    return response.data;
  },

  // --- SKUs / variants ---

  async getSkus(productSlug: string): Promise<Sku[]> {
    const response = await apiClient.get<{ skus: Sku[] }>(`/admin/products/${productSlug}/skus`);
    return response.data.skus;
  },

  async createSku(productSlug: string, input: CreateSkuInput): Promise<Sku> {
    const response = await apiClient.post<{ sku: Sku }>(`/admin/products/${productSlug}/skus`, input);
    return response.data.sku;
  },

  async updateSku(code: string, input: UpdateSkuInput): Promise<Sku> {
    const response = await apiClient.patch<{ sku: Sku }>(`/admin/skus/${encodeURIComponent(code)}`, input);
    return response.data.sku;
  },

  async deleteSku(code: string): Promise<void> {
    await apiClient.delete(`/admin/skus/${encodeURIComponent(code)}`);
  },

  // --- Variant options (Color, Size, ...) ---

  /** `GET /admin/products/:slug/options` — every option on the product, values nested. */
  async getOptions(productSlug: string): Promise<Option[]> {
    const response = await apiClient.get<{ options: Option[] }>(`/admin/products/${productSlug}/options`);
    return response.data.options;
  },

  async createOption(productSlug: string, input: CreateOptionInput): Promise<Option> {
    const response = await apiClient.post<{ option: Option }>(`/admin/products/${productSlug}/options`, input);
    return response.data.option;
  },

  async updateOption(id: string, input: UpdateOptionInput): Promise<Option> {
    const response = await apiClient.patch<{ option: Option }>(`/admin/options/${id}`, input);
    return response.data.option;
  },

  /** 204. Refused (409) while a live SKU still uses one of this option's values. */
  async deleteOption(id: string): Promise<void> {
    await apiClient.delete(`/admin/options/${id}`);
  },

  async createOptionValue(optionId: string, input: CreateOptionValueInput): Promise<OptionValue> {
    const response = await apiClient.post<{ value: OptionValue }>(`/admin/options/${optionId}/values`, input);
    return response.data.value;
  },

  async updateOptionValue(id: string, input: UpdateOptionValueInput): Promise<OptionValue> {
    const response = await apiClient.patch<{ value: OptionValue }>(`/admin/option-values/${id}`, input);
    return response.data.value;
  },

  /** 204. Refused (409) while a live SKU still uses this value. */
  async deleteOptionValue(id: string): Promise<void> {
    await apiClient.delete(`/admin/option-values/${id}`);
  },

  /**
   * `PUT /admin/skus/:code/options` — REPLACES the SKU's whole combination in one call.
   * `optionValueIds: []` is how a caller deliberately clears every option from a SKU; the
   * field is required rather than optional so that intent is always explicit on the wire.
   */
  async replaceSkuOptions(code: string, optionValueIds: string[]): Promise<Sku> {
    const response = await apiClient.put<{ sku: Sku }>(
      `/admin/skus/${encodeURIComponent(code)}/options`,
      { optionValueIds },
    );
    return response.data.sku;
  },
};
