'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  BadgeCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Check, 
  X, 
  User, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function SignUpPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'HR_ADMIN'>('EMPLOYEE');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Password validation rules calculation
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      letter: /[a-zA-Z]/.test(password),
    };
  }, [password]);

  // Score from 0 to 4
  const passwordStrengthScore = useMemo(() => {
    let score = 0;
    if (passwordChecks.length) score++;
    if (passwordChecks.number) score++;
    if (passwordChecks.special) score++;
    if (passwordChecks.letter) score++;
    return score;
  }, [passwordChecks]);

  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-slate-200',
    'bg-rose-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-emerald-500'
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!employeeId.trim()) {
      setErrorMessage('Employee ID is required.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Work email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid work email format.');
      return;
    }

    if (passwordStrengthScore < 2 || password.length < 8) {
      setErrorMessage('Please create a stronger password with at least 8 characters including numbers or symbols.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employeeId.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          password,
          role: role === 'HR_ADMIN' ? 'admin' : 'employee',
          name: employeeId.trim().toUpperCase()
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Registration failed. Please verify your details.');
        setIsLoading(false);
        return;
      }

      // Success
      setIsSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Sign Up Error:', err);
      setErrorMessage('Network or server connection error. Please try again.');
      setIsLoading(false);
    }
  };

  // If successfully registered, show verification view
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">Account Registered!</h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Verification email sent. Please verify your email before logging in. We sent a secure activation link to{' '}
            <strong className="text-slate-900 font-mono">{email}</strong>.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span>Employee ID</span>
            <span className="font-mono font-bold text-slate-800">{employeeId.toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span>Account Type</span>
            <span className="font-bold text-indigo-700">{role === 'HR_ADMIN' ? 'HR / Administrator' : 'Staff Employee'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span>Status</span>
            <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
              Pending Email Verification
            </span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            href="/auth/login"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setResendStatus('A new verification email has been resent to your inbox.');
              setTimeout(() => setResendStatus(null), 4000);
            }}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resend verification email</span>
          </button>

          {resendStatus && (
            <p className="text-[11px] text-emerald-600 font-semibold animate-in fade-in">
              {resendStatus}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Create your account</h2>
        <p className="text-xs text-slate-500 mt-0.5">Register with your company employee credentials</p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold">Registration Error:</span> {errorMessage}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Role Selector Segmented Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Workplace Role <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setRole('EMPLOYEE')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'EMPLOYEE'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Employee</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('HR_ADMIN')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'HR_ADMIN'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HR / Admin</span>
            </button>
          </div>
        </div>

        {/* Employee ID Field */}
        <div>
          <label htmlFor="employeeId" className="block text-xs font-bold text-slate-700 mb-1.5">
            Employee ID <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="employeeId"
              name="employeeId"
              type="text"
              required
              disabled={isLoading}
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value.toUpperCase());
                setErrorMessage(null);
              }}
              placeholder="e.g. EMP-1001 or ADM-1001"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 uppercase font-mono placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Work Email Field */}
        <div>
          <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 mb-1.5">
            Work Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="e.g. alex.rivera@dayflow.com"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="signup-password" className="block text-xs font-bold text-slate-700 mb-1.5">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Minimum 8 characters"
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

          {/* Live Password Strength Meter */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                <span>Password Strength</span>
                <span className="font-bold text-slate-700">
                  {strengthLabels[passwordStrengthScore]}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`rounded-full transition-all duration-300 ${
                      passwordStrengthScore >= step
                        ? strengthColors[passwordStrengthScore]
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Requirement Checklist */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px]">
                <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  {passwordChecks.length ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.number ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  {passwordChecks.number ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                  <span>At least 1 number</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.letter ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  {passwordChecks.letter ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                  <span>Letters (a-z, A-Z)</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.special ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  {passwordChecks.special ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                  <span>Special character</span>
                </div>
              </div>
            </div>
          )}
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
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Dayflow Account</span>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

