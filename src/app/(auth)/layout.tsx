import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full bg-[#f3f4f6]">{children}</div>;
}
