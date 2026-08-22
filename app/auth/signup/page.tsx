'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Briefcase,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Send,
} from 'lucide-react';

type RoleOption = 'EMPLOYEE' | 'ADMIN';

interface SignupResponse {
  success?: boolean;
  message?: string;
  user?: {
    id: string;
    employeeId: string;
    email: string;
    role: string;
  };
}

export default function SignUpPage() {
  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleOption>('EMPLOYEE');
  const [showPassword, setShowPassword] = useState(false);

  // Status & UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field-specific validation errors
  const [employeeIdError, setEmployeeIdError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Password Strength Calculation & Rule Validation
  const passwordRules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (passwordRules.minLength) score += 1;
    if (passwordRules.hasNumber) score += 1;
    if (passwordRules.hasSpecialChar) score += 1;
    if (passwordRules.hasUppercase) score += 1;
    return score;
  }, [passwordRules]);

  const strengthLabel = useMemo(() => {
    if (!password) return { text: 'None', color: 'text-slate-400', bar: 'bg-slate-200' };
    if (strengthScore <= 1) return { text: 'Weak', color: 'text-rose-500', bar: 'bg-rose-500' };
    if (strengthScore === 2) return { text: 'Fair', color: 'text-amber-500', bar: 'bg-amber-500' };
    if (strengthScore === 3) return { text: 'Good', color: 'text-blue-500', bar: 'bg-blue-500' };
    return { text: 'Strong', color: 'text-emerald-500', bar: 'bg-emerald-500' };
  }, [password, strengthScore]);

  // Alphanumeric validator
  const validateEmployeeId = (val: string) => {
    const alphanumericRegex = /^[a-zA-Z0-9_-]+$/;
    return alphanumericRegex.test(val.trim());
  };

  // Email format validator
  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmployeeId(val);
    if (errorMessage) setErrorMessage(null);

    if (val.trim() && !validateEmployeeId(val)) {
      setEmployeeIdError('Employee ID must be alphanumeric (letters, numbers, hyphens only)');
    } else {
      setEmployeeIdError(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (errorMessage) setErrorMessage(null);

    if (val.trim() && !validateEmail(val)) {
      setEmailError('Please enter a valid work email address (e.g. name@company.com)');
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmployeeId = employeeId.trim();
    const cleanEmail = email.trim();

    // Validate Employee ID
    if (!cleanEmployeeId) {
      setEmployeeIdError('Employee ID is required');
      return;
    }
    if (!validateEmployeeId(cleanEmployeeId)) {
      setEmployeeIdError('Employee ID must be alphanumeric');
      return;
    }

    // Validate Email
    if (!cleanEmail) {
      setEmailError('Work email is required');
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setEmailError('Please enter a valid work email address');
      return;
    }

    // Validate Password requirements
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }
    if (!passwordRules.hasNumber || !passwordRules.hasSpecialChar) {
      setErrorMessage('Password must include at least one number and one special character');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: cleanEmployeeId,
          email: cleanEmail,
          password,
          role,
        }),
      });

      const data: SignupResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          // Specific duplicate conflict error
          if (data.message?.toLowerCase().includes('employee id')) {
            setEmployeeIdError('This Employee ID is already registered in the system.');
          } else if (data.message?.toLowerCase().includes('email')) {
            setEmailError('An account with this email address already exists.');
          }
          setErrorMessage(data.message || 'An account with this Employee ID or Email already exists.');
        } else {
          setErrorMessage(
            data.message || 'Registration could not be completed. Please check your inputs and try again.'
          );
        }
        setIsLoading(false);
        return;
      }

      // Success
      setRegisteredEmail(cleanEmail);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage('Unable to connect to the server. Please check your network connection.');
      setIsLoading(false);
    }
  };

  // SUCCESS VIEW: Verification Email Prompt
  if (isSuccess) {
    return (
      <div className="w-full text-center py-2 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50 shadow-inner">
          <Send className="w-7 h-7 animate-pulse" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Verify Your Email
        </h2>

        <p className="mt-2 text-xs text-slate-600 leading-relaxed px-2">
          Verification email sent to <br />
          <span className="font-bold text-slate-900">{registeredEmail}</span>.
        </p>

        <div className="my-5 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 text-left flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Please click the verification link sent to your inbox to activate your{' '}
            <span className="font-bold">{role === 'ADMIN' ? 'HR / Admin' : 'Employee'}</span>{' '}
            account before logging in.
          </p>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/auth/login"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => {
              alert(`Verification email resent to ${registeredEmail}`);
            }}
            className="text-xs text-slate-500 hover:text-indigo-600 font-medium py-1 transition-colors cursor-pointer"
          >
            Didn&apos;t receive an email? Click to resend
          </button>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM VIEW
  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-5 text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Create Dayflow Account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Join your organization&apos;s HRMS portal
        </p>
      </div>

      {/* Inline Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-4 p-3.5 rounded-xl border bg-rose-50/90 border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Registration Issue</p>
            <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Role Selector (Segmented Toggle) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Your Role <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => setRole('EMPLOYEE')}
              disabled={isLoading}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === 'EMPLOYEE'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 font-medium'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Employee</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              disabled={isLoading}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === 'ADMIN'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 font-medium'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>HR / Admin</span>
            </button>
          </div>
        </div>

        {/* Employee ID Field */}
        <div>
          <label
            htmlFor="employeeId"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Employee ID <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="employeeId"
              name="employeeId"
              type="text"
              required
              disabled={isLoading}
              value={employeeId}
              onChange={handleEmployeeIdChange}
              placeholder="e.g. EMP-1042"
              className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 uppercase disabled:opacity-60 ${
                employeeIdError
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900'
              }`}
            />
          </div>
          {employeeIdError && (
            <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{employeeIdError}</span>
            </p>
          )}
        </div>

        {/* Work Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
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
              placeholder="alex.rivera@dayflow.internal"
              className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 ${
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

        {/* Password Field with Toggle & Live Strength Indicator */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Create Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Min. 8 characters"
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Live Password Strength Progress Bar */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Password Strength</span>
                <span className={`font-bold ${strengthLabel.color}`}>
                  {strengthLabel.text}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    strengthScore >= 1 ? strengthLabel.bar : 'bg-slate-200'
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    strengthScore >= 2 ? strengthLabel.bar : 'bg-slate-200'
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    strengthScore >= 3 ? strengthLabel.bar : 'bg-slate-200'
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    strengthScore >= 4 ? strengthLabel.bar : 'bg-slate-200'
                  }`}
                />
              </div>

              {/* Requirement Rule Indicators */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px]">
                <div
                  className={`flex items-center gap-1 ${
                    passwordRules.minLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {passwordRules.minLength ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <X className="w-3 h-3 text-slate-400" />
                  )}
                  <span>8+ characters</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    passwordRules.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {passwordRules.hasNumber ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <X className="w-3 h-3 text-slate-400" />
                  )}
                  <span>Includes a number</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    passwordRules.hasSpecialChar ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {passwordRules.hasSpecialChar ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <X className="w-3 h-3 text-slate-400" />
                  )}
                  <span>Special character (@, #, $)</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    passwordRules.hasUppercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {passwordRules.hasUppercase ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <X className="w-3 h-3 text-slate-400" />
                  )}
                  <span>Uppercase letter</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation: Already have an account? Sign In */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
