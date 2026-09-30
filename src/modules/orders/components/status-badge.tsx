import React from 'react';

/** Colour tokens lifted from the Figma "Orders" frame's status pills. Keyed by the RAW backend
 * value (lowercase), never invented — `default` covers any value this list doesn't name yet,
 * so an unrecognised status still renders instead of crashing the table. */
const STYLES: Record<string, { dot: string; bg: string; text: string }> = {
  pending: { dot: 'bg-[#7c3aed]', bg: 'bg-[#efe8fd]', text: 'text-[#7c3aed]' },
  confirmed: { dot: 'bg-[#2563eb]', bg: 'bg-[#e4ebfb]', text: 'text-[#2563eb]' },
  processing: { dot: 'bg-[#2563eb]', bg: 'bg-[#e4ebfb]', text: 'text-[#2563eb]' },
  shipped: { dot: 'bg-[#6366f1]', bg: 'bg-[#e8e8fd]', text: 'text-[#6366f1]' },
  delivered: { dot: 'bg-[#39ad6f]', bg: 'bg-[#ecf9f2]', text: 'text-[#39ad6f]' },
  succeeded: { dot: 'bg-[#39ad6f]', bg: 'bg-[#ecf9f2]', text: 'text-[#39ad6f]' },
  paid: { dot: 'bg-[#39ad6f]', bg: 'bg-[#ecf9f2]', text: 'text-[#39ad6f]' },
  cancelled: { dot: 'bg-[#f37216]', bg: 'bg-[#fef0e7]', text: 'text-[#f37216]' },
  expired: { dot: 'bg-[#f37216]', bg: 'bg-[#fef0e7]', text: 'text-[#f37216]' },
  failed: { dot: 'bg-[#df2e2e]', bg: 'bg-[#fceeee]', text: 'text-[#df2e2e]' },
  refunded: { dot: 'bg-[#f6a61b]', bg: 'bg-[#fbf7ef]', text: 'text-[#f6a61b]' },
  partial_refund: { dot: 'bg-[#f6a61b]', bg: 'bg-[#fbf7ef]', text: 'text-[#f6a61b]' },
  default: { dot: 'bg-[#7c818d]', bg: 'bg-[#e9eaec]', text: 'text-[#727783]' },
};

function titleCase(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-xs text-[#adb0b8]">—</span>;
  const style = STYLES[status] ?? STYLES.default;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs whitespace-nowrap ${style.bg} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {titleCase(status)}
    </span>
  );
}
