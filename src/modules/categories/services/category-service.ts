import { apiClient } from '@/lib/api-client';
import { Category } from '../types/category.types';

let mockCategories: Category[] = [
  { id: 'cat_1', name: 'Electronics', slug: 'electronics', productCount: 42, description: 'Gadgets, audio, and devices' },
  { id: 'cat_2', name: 'Accessories', slug: 'accessories', productCount: 18, description: 'Keyboards, stands, and cables' },
  { id: 'cat_3', name: 'Apparel', slug: 'apparel', productCount: 35, description: 'T-shirts, hoodies, and jackets' },
  { id: 'cat_4', name: 'Footwear', slug: 'footwear', productCount: 12, description: 'Sneakers and boots' },
  { id: 'cat_5', name: 'Home & Kitchen', slug: 'home-kitchen', productCount: 24, description: 'Smart appliances and decor' },
];

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/admin/categories');
      return response.data;
    } catch {
      return [...mockCategories];
    }
  },

  async createCategory(name: string, description?: string): Promise<Category> {
    try {
      const response = await apiClient.post<Category>('/admin/categories', { name, description });
      return response.data;
    } catch {
      const newCat: Category = {
        id: `cat_${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        productCount: 0,
        description,
      };
      mockCategories.push(newCat);
      return newCat;
    }
  },
};
