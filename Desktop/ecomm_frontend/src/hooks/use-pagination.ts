'use client';

import { useState, useCallback } from 'react';

export function usePagination(initialPage: number = 1, initialLimit: number = 10) {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goToPage = useCallback((p: number) => setPage(p), []);
  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    setPage,
  };
}
