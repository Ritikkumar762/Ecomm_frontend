export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string; // e.g. "Red / Large" or "128GB / Black"
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>; // e.g. { color: 'Red', size: 'L' }
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  category: string;
  categoryId?: string;
  status: 'active' | 'draft' | 'archived';
  images: string[];
  stock: number;
  variants: ProductVariant[];
  hasVariants: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
  images?: string[];
  stock?: number;
}

export interface CreateVariantInput {
  productId: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
}
