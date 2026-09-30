import { apiClient } from '@/lib/api-client';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';

export const categoryService = {
  /** `GET /admin/categories` — every category this store has, alphabetically, inactive ones
   * included. No mock fallback: an unreachable backend must surface as a real error. */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<{ categories: Category[] }>('/admin/categories');
    return response.data.categories;
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const response = await apiClient.post<{ category: Category }>('/admin/categories', input);
    return response.data.category;
  },

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const response = await apiClient.patch<{ category: Category }>(`/admin/categories/${id}`, input);
    return response.data.category;
  },
};
