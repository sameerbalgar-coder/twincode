'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, ShieldCheck, Lock, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();

  // Dynamic detection for active tab (Sign In vs Sign Up)
  const isSignUp =
    pathname?.includes('/signup') || pathname?.includes('/register');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Decorative ambient background gradients */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-blue-200/40 blur-3xl rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/4 w-[400px] h-[250px] bg-gradient-to-br from-indigo-100/40 to-slate-200/40 blur-3xl rounded-full -z-10"
        aria-hidden="true"
      />

      {/* Header Section: Brand Logo, Subtitle & Official Tagline */}
      <header className="w-full max-w-md mx-auto pt-4 sm:pt-8 flex flex-col items-center">
        <Link
          href="/"
          className="group flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl p-2 transition-transform hover:scale-[1.01]"
        >
          {/* DAYFLOW Logo Icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <Layers className="w-6 h-6 transform group-hover:rotate-6 transition-transform duration-300" />
          </div>

          {/* DAYFLOW Title & HRMS Tag */}
          <div className="mt-3 flex items-center gap-2">
            <span className="font-black text-slate-900 text-2xl tracking-tight">
              DAYFLOW
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/50">
              HRMS
            </span>
          </div>

          {/* Subtitle */}
          <h1 className="mt-1 text-xs font-semibold text-slate-600 tracking-wide uppercase">
            Human Resource Management System
          </h1>

          {/* Official Tagline */}
          <p className="mt-1 text-sm italic text-slate-500 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>&ldquo;Every workday, perfectly aligned.&rdquo;</span>
          </p>
        </Link>
      </header>

      {/* Main Authentication Card Container */}
      <main className="w-full max-w-md mx-auto my-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 p-6 sm:p-8 backdrop-blur-xs transition-all">
          {/* Dynamic Tab / Toggle Switcher (Sign In vs Sign Up) */}
          <div
            className="grid grid-cols-2 p-1 mb-6 bg-slate-100/90 rounded-xl border border-slate-200/70 text-xs font-bold"
            role="tablist"
            aria-label="Authentication Switcher"
          >
            <Link
              href="/auth/login"
              role="tab"
              aria-selected={!isSignUp}
              className={`flex items-center justify-center py-2.5 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                !isSignUp
                  ? 'bg-white text-indigo-700 shadow-xs font-bold ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 font-medium'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              role="tab"
              aria-selected={isSignUp}
              className={`flex items-center justify-center py-2.5 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isSignUp
                  ? 'bg-white text-indigo-700 shadow-xs font-bold ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 font-medium'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Child Form/Content */}
          <div className="relative">{children}</div>
        </div>
      </main>

      {/* Footer Section with Security Notices */}
      <footer className="w-full max-w-md mx-auto pb-4 text-center">
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Enterprise-Grade 256-Bit SSL Encrypted</span>
        </div>

        {/* System Access Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Restricted to authorized Dayflow HR personnel &amp; employees.</span>
        </div>

        {/* Legal Links & Copyright */}
        <div className="mt-3 text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a href="#" className="hover:text-slate-600 hover:underline transition-colors">
            Privacy Policy
          </a>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-600 hover:underline transition-colors">
            Terms of Service
          </a>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-600 hover:underline transition-colors">
            Security Overview
          </a>
        </div>

        <p className="mt-2 text-[10px] text-slate-400">
          &copy; {new Date().getFullYear()} Dayflow Technologies Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

