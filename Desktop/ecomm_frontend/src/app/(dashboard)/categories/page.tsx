'use client';

import React from 'react';
import { CategoryList } from '@/modules/categories/components/category-list';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Category Structure</h1>
        <p className="text-sm text-slate-500 mt-1">
          Organize your e-commerce products into searchable category taxonomies.
        </p>
      </div>

      <CategoryList />
    </div>
  );
}
