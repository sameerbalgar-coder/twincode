'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Clock,
  Calendar,
  CheckCircle2,
  User,
  LogOut,
  Shield,
  FileText,
  CalendarClock,
  ChevronRight,
  Sparkles,
  CreditCard,
  Building,
  DollarSign,
  AlertCircle,
  Loader2,
  Lock,
  Download,
  Info
} from 'lucide-react';
import { SalaryComponentConfig } from '@/types/admin-payroll';
import { formatINR } from '@/lib/admin/payroll-helpers';
import { NotificationBell } from '@/components/NotificationBell';

interface ActiveUser {
  userId?: string;
  employeeId?: string;
  email?: string;
  name?: string;
  role?: string;
}

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<ActiveUser | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'payroll'>('overview');

  // Employee Payroll State
  const [salaryStructure, setSalaryStructure] = useState<SalaryComponentConfig | null>(null);
  const [isLoadingSalary, setIsLoadingSalary] = useState(false);
  const [salaryError, setSalaryError] = useState<string | null>(null);

  // Load Session User
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error('Error fetching employee session:', err);
      }
    }
    loadUser();
  }, []);

  // Load Employee's Own Salary Structure (Read-Only)
  useEffect(() => {
    if (!currentUser) return;

    const empId = currentUser.employeeId || 'EMP-1001';
    setIsLoadingSalary(true);
    setSalaryError(null);

    fetch(`/api/payroll/${empId}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to fetch your salary details');
        }
        if (json.data && json.data.salaryStructure) {
          setSalaryStructure(json.data.salaryStructure);
        } else {
          setSalaryStructure(null);
        }
      })
      .catch((err) => {
        console.error('Error loading employee payroll:', err);
        setSalaryError(err.message || 'Unable to retrieve salary records.');
      })
      .finally(() => {
        setIsLoadingSalary(false);
      });
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Error during logout:', err);
      router.push('/auth/login');
    }
  };

  const displayName = currentUser?.name || 'Sarah Jenkins';
  const displayRole = currentUser?.role === 'admin' ? 'Administrator' : 'Principal Frontend Architect';
  const displayEmpId = currentUser?.employeeId || 'EMP-1001';

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Dayflow Employee Portal</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                  {currentUser?.role || 'EMPLOYEE'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome back, <span className="font-semibold text-slate-700">{displayName}</span> ({displayRole}) • <span className="font-mono">{displayEmpId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Notification Center */}
            <NotificationBell />

            {currentUser?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200/60 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Switch to Admin Panel</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 bg-white px-3.5 py-2 rounded-xl border border-rose-200/80 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Segmented View Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            type="button"
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeView === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Overview &amp; Attendance
          </button>
          <button
            type="button"
            onClick={() => setActiveView('payroll')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'payroll'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>My Salary &amp; Payroll</span>
          </button>
        </div>

        {/* VIEW 1: OVERVIEW & ATTENDANCE */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Today&apos;s Attendance</span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 text-xl font-bold text-slate-900">08:52 AM</div>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Checked In • On-Time
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Available Leaves</span>
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="mt-2 text-xl font-bold text-slate-900">18 Days</div>
                <span className="inline-block mt-1 text-[11px] font-medium text-slate-500">
                  Casual (9) • Sick (8) • Annual (14)
                </span>
              </div>

              <div 
                onClick={() => setActiveView('payroll')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-indigo-600">My Net Take-Home</span>
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="mt-2 text-xl font-bold text-slate-900">
                  {salaryStructure ? formatINR(salaryStructure.netTakeHome) : '₹55,200'}
                </div>
                <span className="inline-block mt-1 text-[11px] font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
                  View Compensation Breakdown <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Action Cards & Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Actions</h2>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      alert('Time Off Request submitted for review by HR Operations!');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <CalendarClock className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Apply for Time Off</div>
                        <div className="text-[11px] text-slate-500">Submit vacation, sick leave, or casual time off</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button 
                    onClick={() => setActiveView('payroll')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">View Salary Structure</div>
                        <div className="text-[11px] text-slate-500">View tax breakdown &amp; take-home pay details</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Security &amp; Session</h2>
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-emerald-950">Active SSL Protected Session</div>
                    <p className="text-emerald-800 text-[11px] mt-0.5">
                      Your identity is verified via 256-bit encrypted HTTP-only session tokens.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  Logged in as <span className="font-mono text-slate-600">{currentUser?.email || 'sarah.jenkins@dayflow.com'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: READ-ONLY PAYROLL & SALARY DETAILS */}
        {activeView === 'payroll' && (
          <div className="space-y-6">
            
            {/* Loading State */}
            {isLoadingSalary && (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">Loading your official salary structure...</p>
              </div>
            )}

            {/* Error State */}
            {salaryError && !isLoadingSalary && (
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Unable to Load Salary Structure</div>
                  <p className="mt-0.5 text-rose-800">{salaryError}</p>
                </div>
              </div>
            )}

            {/* Empty State: Salary data does not exist */}
            {!isLoadingSalary && !salaryError && !salaryStructure && (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Salary Structure Configured</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your compensation records have not yet been initialized in the system. Please reach out to your HR Operations team to configure your salary breakdown.
                </p>
              </div>
            )}

            {/* Read-Only Salary Structure View */}
            {!isLoadingSalary && !salaryError && salaryStructure && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                
                {/* Confidential Header Notice */}
                <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold">My Compensation &amp; Salary Structure</h2>
                        <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Read-Only View
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Official INR (₹) monthly compensation schedule</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Downloading official payslip for ${displayName}...`)}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Payslip
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  
                  {/* Top Highlighting Metrics Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-sm border border-indigo-950">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Gross Monthly Salary</span>
                      <div className="text-xl font-black text-white mt-0.5">
                        {formatINR(salaryStructure.grossSalary)}
                      </div>
                      <span className="text-[10px] text-indigo-300">Basic + HRA + Allowances</span>
                    </div>

                    <div className="border-t sm:border-t-0 sm:border-x border-slate-800 pt-2 sm:pt-0 sm:px-4">
                      <span className="text-[10px] uppercase font-bold text-rose-300">Total Deductions</span>
                      <div className="text-xl font-black text-rose-400 mt-0.5">
                        -{formatINR(salaryStructure.totalDeductions)}
                      </div>
                      <span className="text-[10px] text-slate-400">PF + TDS + Health Insurance</span>
                    </div>

                    <div className="pt-2 sm:pt-0 sm:pl-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">Net Monthly Take-Home</span>
                      <div className="text-2xl font-black text-emerald-400 mt-0.5">
                        {formatINR(salaryStructure.netTakeHome)}
                      </div>
                      <span className="text-[10px] text-slate-400">Direct Deposit</span>
                    </div>
                  </div>

                  {/* Summary Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Monthly Base Wage</span>
                      <div className="text-xl font-black text-slate-900 mt-1">
                        {formatINR(salaryStructure.monthlyBaseWage)}
                      </div>
                      <span className="text-[10px] text-slate-400">Standard monthly benchmark</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Annual CTC Equivalent</span>
                      <div className="text-xl font-black text-indigo-700 mt-1">
                        {formatINR(salaryStructure.annualCTC)}
                      </div>
                      <span className="text-[10px] text-slate-400">Total yearly compensation</span>
                    </div>
                  </div>

                  {/* Component Breakdown Table */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Detailed Component Breakdown
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Earnings Column */}
                      <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-3">
                        <div className="text-xs font-bold text-emerald-950 flex items-center justify-between">
                          <span>Monthly Earnings</span>
                          <span>{formatINR(salaryStructure.grossSalary)}</span>
                        </div>
                        <div className="space-y-2 text-xs divide-y divide-emerald-100">
                          <div className="pt-1.5 flex items-center justify-between text-slate-700">
                            <span>Basic Pay (50%)</span>
                            <span className="font-bold text-slate-900">{formatINR(salaryStructure.basic)}</span>
                          </div>
                          <div className="pt-1.5 flex items-center justify-between text-slate-700">
                            <span>House Rent Allowance (HRA 25%)</span>
                            <span className="font-bold text-slate-900">{formatINR(salaryStructure.hra)}</span>
                          </div>
                          <div className="pt-1.5 flex items-center justify-between text-slate-700">
                            <span>Special / Other Allowances (25%)</span>
                            <span className="font-bold text-slate-900">{formatINR(salaryStructure.allowances)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Deductions Column */}
                      <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-2xl space-y-3">
                        <div className="text-xs font-bold text-rose-950 flex items-center justify-between">
                          <span>Statutory Deductions</span>
                          <span>-{formatINR(salaryStructure.totalDeductions)}</span>
                        </div>
                        <div className="space-y-2 text-xs divide-y divide-rose-100">
                          <div className="pt-1.5 flex items-center justify-between text-slate-700">
                            <span>Provident Fund (PF Contribution)</span>
                            <span className="font-bold text-rose-700">-{formatINR(salaryStructure.pfDeduction)}</span>
                          </div>
                          <div className="pt-1.5 flex items-center justify-between text-slate-700">
                            <span>Income Tax / TDS Deduction</span>
                            <span className="font-bold text-rose-700">-{formatINR(salaryStructure.taxDeduction)}</span>
                          </div>
                          <div className="pt-1.5 flex items-center justify-between text-slate-700">
                            <span>Health &amp; Medical Insurance</span>
                            <span className="font-bold text-rose-700">-{formatINR(salaryStructure.healthInsurance || 1500)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Deposit Bank Routing */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-indigo-600" /> Direct Deposit Bank Account
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified for Payout
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-semibold">Bank Name</span>
                        <span className="font-bold text-slate-900">{salaryStructure.bankDetails?.bankName || 'HDFC Bank Ltd.'}</span>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-semibold">Account Number</span>
                        <span className="font-mono font-bold text-slate-900">{salaryStructure.bankDetails?.accountNumber || '•••••••• 4892'}</span>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-semibold">IFSC / Routing Code</span>
                        <span className="font-mono font-bold text-slate-900">{salaryStructure.bankDetails?.ifscCode || 'HDFC0001234'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read-Only Notice Footer */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                    <Info className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      This view is read-only. For any queries regarding your compensation or bank details, please contact your People Operations department.
                    </span>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

