'use client';

import React from 'react';

/** The exact dot colors `orders/status-badge.tsx` already uses for these statuses — color
 * follows the entity everywhere in this app, so a status means the same hue on every screen. */
const STATUS_COLORS: Record<string, string> = {
  pending: '#7c3aed',
  confirmed: '#2563eb',
  processing: '#2563eb',
  shipped: '#6366f1',
  delivered: '#39ad6f',
  cancelled: '#f37216',
  failed: '#df2e2e',
};

function titleCase(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface OrderStatusDonutProps {
  counts: Record<string, number>;
}

/** A share-of-whole read — the one case a ring chart earns its place, per the dataviz skill's
 * form guidance. A legend is always present (never color-alone for identity), and every slice
 * is also direct-labeled since there are at most 7 of them. */
export function OrderStatusDonut({ counts }: OrderStatusDonutProps) {
  const entries = Object.entries(counts).filter(([, count]) => count > 0);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) {
    return <p className="py-10 text-center text-sm text-[#7c818d]">No orders in this window yet.</p>;
  }

  const radius = 60;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0 -rotate-90">
        <circle cx={80} cy={80} r={radius} fill="none" stroke="#f6f9fe" strokeWidth={strokeWidth} />
        {entries.map(([status, count]) => {
          const fraction = count / total;
          const dash = fraction * circumference;
          const gap = 2; /* a thin surface gap between segments */
          const segment = (
            <circle
              key={status}
              cx={80}
              cy={80}
              r={radius}
              fill="none"
              stroke={STATUS_COLORS[status] ?? '#7c818d'}
              strokeWidth={strokeWidth}
              strokeDasharray={`${Math.max(dash - gap, 0)} ${circumference - dash + gap}`}
              strokeDashoffset={-cumulative}
              strokeLinecap="round"
            />
          );
          cumulative += dash;
          return segment;
        })}
      </svg>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-1">
        {entries
          .sort((a, b) => b[1] - a[1])
          .map(([status, count]) => (
            <li key={status} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[status] ?? '#7c818d' }}
              />
              <span className="text-[#23272f]">{titleCase(status)}</span>
              <span className="text-[#7c818d]">
                {count} · {Math.round((count / total) * 100)}%
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
