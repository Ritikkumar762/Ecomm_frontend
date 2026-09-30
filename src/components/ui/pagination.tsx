'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

/** Numbered page pills + prev/next icon buttons, matching the Figma pagination control used
 * on both the Products and Inventory tables. Windows to at most 5 numbers around the current
 * page so it stays usable on a catalogue with many pages. */
export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const windowSize = 5;
  let start = Math.max(0, page - Math.floor(windowSize / 2));
  const end = Math.min(pageCount, start + windowSize);
  start = Math.max(0, end - windowSize);
  const pages = Array.from({ length: end - start }, (_, i) => start + i);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9eaec] bg-[#f6f9fe] text-[#7c818d] disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium ${
            p === page ? 'bg-[#23272f] text-white' : 'border border-[#e9eaec] bg-white text-[#23272f]'
          }`}
        >
          {p + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(pageCount - 1, page + 1))}
        disabled={page >= pageCount - 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9eaec] bg-white text-[#23272f] disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
