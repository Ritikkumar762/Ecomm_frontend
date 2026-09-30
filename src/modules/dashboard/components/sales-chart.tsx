'use client';

import React, { useState } from 'react';
import { DashboardSalesPoint } from '../types/dashboard.types';
import { formatCurrency } from '@/lib/utils';

export interface SalesChartProps {
  series: DashboardSalesPoint[];
  currency: string;
}

/** A single-series magnitude chart — one hue, per the dataviz skill's rule that a sequential/
 * single-series measure never gets a categorical palette. Thin bars, rounded data-ends, a
 * recessive baseline, and a per-bar hover tooltip rather than a number crammed onto every bar. */
export function SalesChart({ series, currency }: SalesChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (series.length === 0) {
    return <p className="py-16 text-center text-sm text-[#7c818d]">No sales in this window yet.</p>;
  }

  const values = series.map((p) => Number(p.revenue));
  const max = Math.max(...values, 1);
  const width = 640;
  const height = 220;
  const paddingLeft = 8;
  const paddingBottom = 24;
  const chartHeight = height - paddingBottom;
  const barGap = 12;
  const barWidth = (width - paddingLeft * 2 - barGap * (series.length - 1)) / series.length;

  const hovered = hoverIndex !== null ? series[hoverIndex] : null;

  return (
    <div className="relative">
      {hovered && (
        <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 rounded-lg bg-[#23272f] px-3 py-1.5 text-xs text-white shadow-lg">
          <p className="font-medium">{formatCurrency(Number(hovered.revenue), currency)}</p>
          <p className="text-white/70">
            {hovered.bucket} · {hovered.orders} order{hovered.orders === 1 ? '' : 's'}
          </p>
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
        {/* Recessive baseline */}
        <line x1={0} y1={chartHeight} x2={width} y2={chartHeight} stroke="#e9eaec" strokeWidth={1} />
        {series.map((point, i) => {
          const value = Number(point.revenue);
          const barHeight = max > 0 ? Math.max((value / max) * (chartHeight - 12), value > 0 ? 3 : 0) : 0;
          const x = paddingLeft + i * (barWidth + barGap);
          const y = chartHeight - barHeight;
          const isHovered = hoverIndex === i;
          return (
            <g key={point.bucket}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={isHovered ? '#1d4fd1' : '#2563eb'}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer transition-colors"
              />
              {/* Bigger-than-mark hit target for the hover */}
              <rect
                x={x}
                y={0}
                width={barWidth}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              />
              <text
                x={x + barWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize={11}
                fill="#7c818d"
              >
                {point.bucket}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
