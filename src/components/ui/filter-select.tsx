'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

/** A native `<select>` styled as the bordered pill-with-chevron filter button Figma uses
 * throughout the Products and Inventory screens — `appearance-none` hides the browser's own
 * arrow so the chevron icon can take its place, but the element underneath is still a real,
 * keyboard- and screen-reader-accessible select. */
export const FilterSelect = React.forwardRef<HTMLSelectElement, FilterSelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={
          'h-11 appearance-none rounded-2xl border border-[#e9eaec] bg-white pl-4 pr-10 text-sm text-[#23272f] focus:outline-none ' +
          (className ?? '')
        }
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7c818d]" />
    </div>
  ),
);
FilterSelect.displayName = 'FilterSelect';
