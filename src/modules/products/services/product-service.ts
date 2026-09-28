import { apiClient } from '@/lib/api-client';
import { Product, CreateProductInput, ProductVariant, CreateVariantInput } from '../types/product.types';

// Mock initial data for local state fallback
let mockProducts: Product[] = [
  {
    id: 'prod_01',
    title: 'Minimalist Wireless Headphones',
    slug: 'minimalist-wireless-headphones',
    description: 'High fidelity audio with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    compareAtPrice: 249.99,
    category: 'Electronics',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 45,
    hasVariants: true,
    variants: [
      {
        id: 'var_01',
        productId: 'prod_01',
        sku: 'HEAD-BLK-01',
        name: 'Matte Black',
        price: 199.99,
        stock: 25,
        attributes: { color: 'Black' },
      },
      {
        id: 'var_02',
        productId: 'prod_01',
        sku: 'HEAD-SLV-02',
        name: 'Silver Edition',
        price: 219.99,
        stock: 20,
        attributes: { color: 'Silver' },
      },
    ],
    createdAt: '2026-09-15',
  },
  {
    id: 'prod_02',
    title: 'Ergonomic Mechanical Keyboard',
    slug: 'ergonomic-mechanical-keyboard',
    description: 'Hot-swappable switches, RGB backlighting, and aluminum chassis.',
    price: 149.50,
    category: 'Accessories',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
    stock: 80,
    hasVariants: true,
    variants: [
      {
        id: 'var_03',
        productId: 'prod_02',
        sku: 'KEY-RED-01',
        name: 'Linear Red Switches',
        price: 149.50,
        stock: 50,
        attributes: { switch: 'Red' },
      },
      {
        id: 'var_04',
        productId: 'prod_02',
        sku: 'KEY-BLU-02',
        name: 'Tactile Blue Switches',
        price: 149.50,
        stock: 30,
        attributes: { switch: 'Blue' },
      },
    ],
    createdAt: '2026-09-18',
  },
  {
    id: 'prod_03',
    title: 'Organic Cotton Premium Hoodie',
    slug: 'organic-cotton-premium-hoodie',
    description: 'Ultra-soft heavyweight fleece hoodie crafted from 100% organic cotton.',
    price: 79.00,
    compareAtPrice: 95.00,
    category: 'Apparel',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500'],
    stock: 120,
    hasVariants: true,
    variants: [
      {
        id: 'var_05',
        productId: 'prod_03',
        sku: 'HOOD-GRY-M',
        name: 'Heather Gray / Medium',
        price: 79.00,
        stock: 60,
        attributes: { color: 'Gray', size: 'M' },
      },
      {
        id: 'var_06',
        productId: 'prod_03',
        sku: 'HOOD-GRY-L',
        name: 'Heather Gray / Large',
        price: 79.00,
        stock: 60,
        attributes: { color: 'Gray', size: 'L' },
      },
    ],
    createdAt: '2026-09-20',
  },
];

export const productService = {
  // --- Product Operations ---
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/admin/products');
      return response.data;
    } catch {
      // Fallback to local mock data if backend service is connecting/offline
      return [...mockProducts];
    }
  },

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const response = await apiClient.get<Product>(`/admin/products/${id}`);
      return response.data;
    } catch {
      return mockProducts.find((p) => p.id === id);
    }
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/admin/products', input);
      return response.data;
    } catch {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        title: input.title,
        slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: input.description,
        price: Number(input.price),
        compareAtPrice: input.compareAtPrice ? Number(input.compareAtPrice) : undefined,
        category: input.category,
        status: input.status,
        images: input.images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        stock: Number(input.stock || 0),
        variants: [],
        hasVariants: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
      mockProducts.unshift(newProduct);
      return newProduct;
    }
  },

  async updateProduct(id: string, input: Partial<CreateProductInput>): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(`/admin/products/${id}`, input);
      return response.data;
    } catch {
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Product not found');
      mockProducts[index] = { ...mockProducts[index], ...input };
      return mockProducts[index];
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/admin/products/${id}`);
      return true;
    } catch {
      mockProducts = mockProducts.filter((p) => p.id !== id);
      return true;
    }
  },

  // --- Product Variant Operations ---
  async getVariants(productId: string): Promise<ProductVariant[]> {
    try {
      const response = await apiClient.get<ProductVariant[]>(`/admin/products/${productId}/variants`);
      return response.data;
    } catch {
      const product = mockProducts.find((p) => p.id === productId);
      return product ? product.variants : [];
    }
  },

  async createVariant(input: CreateVariantInput): Promise<ProductVariant> {
    try {
      const response = await apiClient.post<ProductVariant>(
        `/admin/products/${input.productId}/variants`,
        input
      );
      return response.data;
    } catch {
      const newVariant: ProductVariant = {
        id: `var_${Date.now()}`,
        productId: input.productId,
        sku: input.sku,
        name: input.name,
        price: Number(input.price),
        compareAtPrice: input.compareAtPrice ? Number(input.compareAtPrice) : undefined,
        stock: Number(input.stock),
        attributes: input.attributes,
      };

      const product = mockProducts.find((p) => p.id === input.productId);
      if (product) {
        product.variants.push(newVariant);
        product.hasVariants = true;
      }
      return newVariant;
    }
  },

  async deleteVariant(productId: string, variantId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/admin/products/${productId}/variants/${variantId}`);
      return true;
    } catch {
      const product = mockProducts.find((p) => p.id === productId);
      if (product) {
        product.variants = product.variants.filter((v) => v.id !== variantId);
        if (product.variants.length === 0) product.hasVariants = false;
      }
      return true;
    }
  },
};
