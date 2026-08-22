'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AuthResponse {
  success?: boolean;
  message?: string;
  role?: 'ADMIN' | 'HR' | 'EMPLOYEE' | string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'HR' | 'EMPLOYEE' | string;
  };
  token?: string;
}

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Status & Validation State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isUnverifiedEmail, setIsUnverifiedEmail] = useState(false);

  // Email format regex validation helper
  const validateEmailFormat = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (errorMessage) setErrorMessage(null);
    if (isUnverifiedEmail) setIsUnverifiedEmail(false);

    if (val.trim() && !validateEmailFormat(val)) {
      setEmailError('Please enter a valid work email address (e.g. name@company.com)');
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsUnverifiedEmail(false);

    // Client-side validation checks
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Work email is required');
      return;
    }

    if (!validateEmailFormat(trimmedEmail)) {
      setEmailError('Please enter a valid work email address');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          rememberMe,
        }),
      });

      const data: AuthResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Handle specific server-side error statuses
        if (response.status === 403 || data.message?.toLowerCase().includes('unverified')) {
          setIsUnverifiedEmail(true);
          setErrorMessage(
            data.message ||
              'Your email address has not been verified. Please check your inbox for the verification link.'
          );
        } else if (response.status === 401 || response.status === 400) {
          setErrorMessage(data.message || 'Invalid email or password. Please try again.');
        } else {
          setErrorMessage(
            data.message || 'An unexpected error occurred during sign in. Please try again later.'
          );
        }
        setIsLoading(false);
        return;
      }

      // Role extraction & redirection
      const userRole = (data.user?.role || data.role || 'EMPLOYEE').toUpperCase();

      if (userRole === 'ADMIN' || userRole === 'HR') {
        router.push('/admin/dashboard');
      } else if (userRole === 'EMPLOYEE') {
        router.push('/employee/dashboard');
      } else {
        // Fallback default
        router.push('/employee/dashboard');
      }
    } catch (err) {
      console.error('Authentication request error:', err);
      setErrorMessage('Unable to connect to the authentication server. Please check your network connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your Dayflow HRMS workspace and employee portal
        </p>
      </div>

      {/* Inline Error Alert Banner */}
      {errorMessage && (
        <div
          role="alert"
          className={`mb-5 p-3.5 rounded-xl border flex items-start gap-3 text-xs animate-in fade-in slide-in-from-top-1 duration-200 ${
            isUnverifiedEmail
              ? 'bg-amber-50/90 border-amber-200 text-amber-900'
              : 'bg-rose-50/90 border-rose-200 text-rose-800'
          }`}
        >
          {isUnverifiedEmail ? (
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{isUnverifiedEmail ? 'Email Verification Required' : 'Authentication Error'}</p>
            <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Work Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Work Email <span className="text-rose-500">*</span>
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
              placeholder="alex.rivera@dayflow.internal"
              className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed ${
                emailError
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900'
              }`}
            />
          </div>
          {emailError && (
            <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{emailError}</span>
            </p>
          )}
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700"
            >
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
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me Option */}
        <div className="flex items-center gap-2 pt-0.5">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            disabled={isLoading}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <label
            htmlFor="rememberMe"
            className="text-xs text-slate-600 cursor-pointer select-none"
          >
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit Button with Loading Spinner */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dayflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Footer Action: Don't have an account? Sign Up */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
