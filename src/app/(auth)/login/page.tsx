import React from 'react';
import { Store } from 'lucide-react';
import { LoginForm } from '@/modules/auth/components/login-form';

export default function LoginPage() {
  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen">
      {/* Floating brand bar */}
      <div className="absolute inset-x-6 top-7 z-20 flex items-center justify-between gap-4 rounded-[32px] border border-white/60 bg-white/70 p-4 backdrop-blur-md sm:inset-x-10 lg:inset-x-16">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] text-white">
            <Store className="h-5 w-5" />
          </div>
          <span className="hidden text-lg text-[#23272f] sm:inline">E-Commerce Admin Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hidden text-xs text-[#2563eb] hover:underline sm:inline">
            Need Help?
          </a>
          <a
            href="#"
            className="flex h-[35px] items-center justify-center rounded-2xl bg-[#2563eb] px-4 text-xs text-white hover:bg-[#1d4fd1]"
          >
            Contact Support
          </a>
        </div>
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Form panel */}
        <div className="relative flex flex-col justify-center px-6 py-28 sm:px-12 lg:px-16 xl:pl-24">
          <LoginForm />
          <p className="absolute bottom-8 left-6 text-xs text-[#727783] sm:left-12 lg:left-16 xl:left-24">
            © {year} EcommAdmin. All rights reserved.
          </p>
        </div>

        {/* Decorative panel */}
        <div className="relative hidden overflow-hidden rounded-bl-[32px] bg-[#2563eb] lg:block">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/3 top-1/4 h-[900px] w-[900px] rotate-[-35deg] rounded-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 blur-2xl" />
            <div className="absolute -right-1/4 top-1/3 h-[700px] w-[700px] rotate-[25deg] rounded-full bg-gradient-to-bl from-white/0 via-white/15 to-white/0 blur-2xl" />
            <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(115deg,transparent,transparent_46px,rgba(255,255,255,0.25)_47px,transparent_49px)]" />
          </div>

          <p className="absolute bottom-24 left-16 max-w-[430px] font-serif text-4xl font-semibold italic text-white">
            Manage Your Store, Smarter
          </p>
        </div>
      </div>
    </div>
  );
}
