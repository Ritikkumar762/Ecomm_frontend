'use client';

import React, { useState } from 'react';
import { useCategories } from '../hooks/use-categories';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderTree, Plus } from 'lucide-react';

export function CategoryList() {
  const { categories, loading, addCategory } = useCategories();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory(newCatName, newCatDesc);
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">All Categories</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:border-slate-300 transition shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 inline-block mb-3">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900">{cat.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{cat.description || 'No description provided'}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                  {cat.productCount} products
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add New Category Sidebar Form */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" />
              Add Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                label="Category Name"
                placeholder="e.g. Footwear"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
              <Input
                label="Description"
                placeholder="Short category summary"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
              />
              <Button type="submit" isLoading={loading} className="w-full">
                Create Category
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
