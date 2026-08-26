'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, ShieldCheck, Lock } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname.includes('/login') || pathname === '/auth';
  const isSignup = pathname.includes('/signup');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card Container */}
      <main className="w-full max-w-md mx-auto my-auto relative z-10">
        
        {/* Card Component */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          
          {/* Header Section: Branding Logo, Title & Tagline */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-xl tracking-tight">DAYFLOW</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                    HRMS
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500">Human Resource Management</div>
              </div>
            </Link>

            <p className="text-xs text-slate-500 font-medium italic pt-1">
              &ldquo;Every workday, perfectly aligned.&rdquo;
            </p>
          </div>

          {/* Dynamic Tab Switcher: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70 text-xs font-bold">
            <Link
              href="/auth/login"
              className={`py-2 text-center rounded-xl transition-all ${
                isLogin
                  ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className={`py-2 text-center rounded-xl transition-all ${
                isSignup
                  ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Child Form / Content */}
          <div className="relative">{children}</div>
        </div>
      </main>

      {/* Footer Section with Security Notices */}
      <footer className="w-full max-w-md mx-auto pt-6 pb-2 text-center relative z-10">
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Enterprise-Grade 256-Bit SSL Encrypted</span>
        </div>

        {/* System Access Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Restricted to authorized Dayflow HR personnel &amp; employees.</span>
        </div>

        {/* Copyright */}
        <p className="mt-2 text-[10px] text-slate-400">
          &copy; {new Date().getFullYear()} Dayflow Technologies Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

