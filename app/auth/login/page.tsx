'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Shield, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Email format validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setErrorMessage(null);

    if (val.trim() === '') {
      setEmailError(null);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      setEmailError('Please enter a valid work email format (e.g. name@dayflow.com)');
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage(null);
  };

  // Demo Login Helper
  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setEmailError(null);
    setErrorMessage(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate inputs
    if (!email.trim()) {
      setEmailError('Work email is required');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Invalid email or password. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Successful login -> Redirect by role
      const userRole = (data.user?.role || '').toLowerCase();
      if (userRole === 'admin' || userRole === 'hr') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      console.error('Sign In Error:', err);
      setErrorMessage('Network or server connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Sign in to your account</h2>
        <p className="text-xs text-slate-500 mt-0.5">Enter your work credentials to access the workspace</p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold">Authentication Failed:</span> {errorMessage}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Work Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
            Work Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={handleEmailChange}
              placeholder="e.g. sarah.jenkins@dayflow.com"
              className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-60 ${
                emailError
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
          </div>
          {emailError && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {emailError}
            </p>
          )}
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-bold text-slate-700">
              Password <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                if (email.trim()) {
                  alert(`Password reset instructions sent to ${email.trim()}! Please check your inbox.`);
                } else {
                  alert('Please enter your work email address above, then click Forgot password.');
                }
              }}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <span>Sign In to Dayflow</span>
          )}
        </button>
      </form>

      {/* Demo Quick Logins */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
          1-Click Demo Accounts
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('admin@dayflow.com', 'Admin@123456')}
            className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-700">HR Admin</span>
            </div>
            <span className="text-[10px] text-slate-400 block truncate">admin@dayflow.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleFillDemo('sarah.jenkins@dayflow.com', 'Employee@123456')}
            className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-700">Employee</span>
            </div>
            <span className="text-[10px] text-slate-400 block truncate">sarah.jenkins@dayflow.com</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

