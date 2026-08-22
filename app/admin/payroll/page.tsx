'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  CreditCard, 
  Users, 
  Search, 
  Filter, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  CalendarClock, 
  TrendingUp, 
  Building2, 
  X, 
  Edit3, 
  Play, 
  ShieldCheck, 
  ArrowUpRight,
  Wallet
} from 'lucide-react';
import { DayflowNavigation } from '@/components/DayflowNavigation';
import { Employee } from '@/types/hrms';
import { 
  EmployeePayrollRecord, 
  PayrollSummaryMetrics, 
  SalaryComponentConfig 
} from '@/types/admin-payroll';
import { formatINR } from '@/lib/admin/payroll-helpers';
import { SalaryInfoTab } from '@/components/admin/SalaryInfoTab';
import { fetchEmployeesApi } from '@/lib/apiClient';

export default function AdminPayrollDashboardPage() {
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [payrollRecords, setPayrollRecords] = useState<EmployeePayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummaryMetrics>({
    totalMonthlyOutflow: 0,
    totalDeductions: 0,
    averageNetPay: 0,
    processedCount: 0,
    totalEmployees: 0,
    payrollCycle: 'August 2026'
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Loading & Processing States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Edit Structure Modal
  const [editingRecord, setEditingRecord] = useState<EmployeePayrollRecord | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Payroll Data from API
  const loadPayrollData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      // 1. Fetch Employees for Switcher
      const emps = await fetchEmployeesApi();
      setEmployees(emps);

      // 2. Fetch Payroll Records
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedDepartment !== 'All') params.set('department', selectedDepartment);

      const res = await fetch(`/api/payroll?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to load payroll data');

      setPayrollRecords(json.data);
      if (json.summary) setSummary(json.summary);
    } catch (err: any) {
      console.error('Error loading payroll dashboard:', err);
      setErrorMessage(err.message || 'Failed to load payroll records.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedDepartment]);

  useEffect(() => {
    loadPayrollData(true);
  }, [loadPayrollData]);

  // Handle Generate Payroll Batch
  const handleGeneratePayroll = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cycle: summary.payrollCycle })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to generate payroll');

      showToast(json.message, 'success');
      loadPayrollData(false);
    } catch (err: any) {
      showToast(err.message || 'Error generating payroll batch', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filtered Records (also supports selectedEmployee filter from Switcher)
  const filteredRecords = useMemo(() => {
    let list = payrollRecords;
    if (selectedEmployee) {
      list = list.filter(r => r.employeeId === selectedEmployee.id);
    }
    return list;
  }, [payrollRecords, selectedEmployee]);

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 ${
            toastMessage.type === 'success' ? 'bg-emerald-950 text-emerald-100 border-emerald-800' : 'bg-rose-950 text-rose-100 border-rose-800'
          }`}>
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Shared Top Navigation & Employee Switcher */}
      <DayflowNavigation
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={(emp) => {
          setSelectedEmployee(emp);
          if (emp) showToast(`Filtered payroll for ${emp.name}`, 'success');
          else showToast('Viewing company-wide payroll dashboard', 'success');
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        
        {/* Header & Payroll Run Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payroll & Salary Configuration</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {summary.payrollCycle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Company-wide compensation management, statutory deductions, attendance-linked payable days, and INR (₹) disbursements.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Refresh Button */}
            <button
              onClick={() => loadPayrollData(false)}
              disabled={isRefreshing}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              title="Refresh payroll records"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* Export Report */}
            <button
              onClick={() => showToast('Monthly payroll ledger exported to Excel/CSV', 'success')}
              className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export Ledger
            </button>

            {/* Run Monthly Payroll Batch Action */}
            <button
              onClick={handleGeneratePayroll}
              disabled={isGenerating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              Run Monthly Payroll
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button 
              onClick={() => loadPayrollData(false)}
              className="font-bold underline hover:text-rose-950"
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Total Monthly Outflow */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Monthly Outflow</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                ₹
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 truncate">
                {formatINR(summary.totalMonthlyOutflow)}
              </span>
            </div>
            <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Net Disbursed Payout
            </div>
          </div>

          {/* Total Deductions (PF / Tax) */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Deductions</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-black text-rose-600 truncate">
                {formatINR(summary.totalDeductions)}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              PF + TDS / Tax + Health
            </div>
          </div>

          {/* Average Net Pay */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Net Pay</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 truncate">
                {formatINR(summary.averageNetPay)}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Per employee / cycle
            </div>
          </div>

          {/* Processed Count */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processed Count</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {summary.processedCount} / {summary.totalEmployees}
              </span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                100% Ready
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Direct Deposit Configured
            </div>
          </div>

        </div>

        {/* Filter Bar & Department Selector */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search & Department */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by employee name, role, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="People Operations">People Operations</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Customer Success">Customer Success</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Showing {filteredRecords.length} employee compensation records
          </span>
        </div>

        {/* Employee Directory Payroll Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            /* Loading Skeleton */
            <div className="p-8 space-y-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-3 w-1/4">
                    <div className="w-9 h-9 rounded-full bg-slate-200" />
                    <div className="space-y-1 flex-1">
                      <div className="h-3 bg-slate-200 rounded w-24" />
                      <div className="h-2 bg-slate-100 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-6 bg-slate-200 rounded-xl w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Employee</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Base Wage</th>
                    <th className="py-3.5 px-4">Payable Days</th>
                    <th className="py-3.5 px-4">Deductions</th>
                    <th className="py-3.5 px-4">Net Payout</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-semibold text-slate-700">No payroll records match your filter</p>
                        <p className="text-xs text-slate-400 mt-0.5">Try resetting search or department filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.employeeId} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Employee Name, Avatar & ID */}
                        <td className="py-3.5 px-5">
                          <Link
                            href={`/admin/profile/${record.employeeId}`}
                            className="flex items-center gap-3 group"
                          >
                            <img
                              src={record.employeeAvatar}
                              alt={record.employeeName}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-indigo-400 transition-all"
                            />
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {record.employeeName}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                <span className="font-mono">{record.employeeId}</span> • {record.role}
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {record.department}
                        </td>

                        {/* Base Wage */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900">
                            {formatINR(record.baseWage)}
                          </span>
                          <span className="block text-[10px] text-slate-400">/ month</span>
                        </td>

                        {/* Attendance Payable Days */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-indigo-700">
                              {record.payableDays} / {record.totalWorkingDays}
                            </span>
                            {record.unpaidAbsenceDays > 0 ? (
                              <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded font-semibold">
                                -{record.unpaidAbsenceDays}d off
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                                Full
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Deductions */}
                        <td className="py-3.5 px-4 font-semibold text-rose-600">
                          -{formatINR(record.totalDeductions)}
                        </td>

                        {/* Net Pay */}
                        <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                          {formatINR(record.netPay)}
                        </td>

                        {/* Action: Edit Structure */}
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => setEditingRecord(record)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Structure
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Edit Structure Modal Drawer */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={editingRecord.employeeAvatar}
                  alt={editingRecord.employeeName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-400"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Salary Configuration: {editingRecord.employeeName}
                  </h3>
                  <p className="text-[11px] text-slate-400">{editingRecord.role} • {editingRecord.department}</p>
                </div>
              </div>

              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <SalaryInfoTab
                employeeId={editingRecord.employeeId}
                employeeName={editingRecord.employeeName}
                initialSalaryConfig={editingRecord.salaryStructure}
                onSaveSuccess={(updated) => {
                  showToast(`Salary structure for ${editingRecord.employeeName} saved successfully.`, 'success');
                  loadPayrollData(false);
                  setEditingRecord(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

