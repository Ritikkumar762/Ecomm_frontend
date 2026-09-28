'use client';

import { useState, useCallback } from 'react';

export function useSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return {
    isOpen,
    isCollapsed,
    toggleOpen,
    toggleCollapse,
    setIsOpen,
    setIsCollapsed,
  };
}
