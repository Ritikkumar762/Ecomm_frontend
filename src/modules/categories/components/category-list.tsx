'use client';

import React, { useState } from 'react';
import { useCategories } from '../hooks/use-categories';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderTree, Plus } from 'lucide-react';

export function CategoryList() {
  const { categories, loading, error, addCategory, toggleActive } = useCategories();
  const [newCatName, setNewCatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await addCategory(newCatName.trim());
      setNewCatName('');
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-medium text-[#23272f]">All Categories</h3>

        {error ? (
          <p className="text-sm text-[#df2e2e]">{error}</p>
        ) : loading ? (
          <div className="h-32 animate-pulse rounded-2xl bg-[#f6f9fe]" />
        ) : categories.length === 0 ? (
          <p className="text-sm text-[#7c818d]">No categories yet — add one from the form.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Card key={cat.id} className="hover:border-[#adb0b8] transition shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="p-2.5 rounded-xl bg-[#e4ebfb] text-[#2563eb] inline-block mb-3">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <h4 className="font-medium text-[#23272f]">{cat.name}</h4>
                    <p className="text-xs text-[#7c818d] mt-1">/{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => toggleActive(cat)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      cat.isActive ? 'bg-[#ecf9f2] text-[#39ad6f]' : 'bg-[#e9eaec] text-[#727783]'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#2563eb]" />
              Add Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              {formError && <p className="text-xs text-[#df2e2e]">{formError}</p>}
              <Input
                label="Category Name"
                placeholder="e.g. Footwear"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
              <Button type="submit" isLoading={isSubmitting} disabled={!newCatName.trim()} className="w-full">
                Create Category
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
