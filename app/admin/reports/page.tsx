'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Clock, 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  CalendarClock, 
  TrendingUp, 
  Building2, 
  X, 
  FileText, 
  Plane, 
  Layers, 
  Printer, 
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { DayflowNavigation } from '@/components/DayflowNavigation';
import { SalarySlipModal } from '@/components/SalarySlipModal';
import { Employee } from '@/types/hrms';
import { EmployeePayrollRecord, PayrollSummaryMetrics } from '@/types/admin-payroll';
import { formatINR } from '@/lib/admin/payroll-helpers';
import { 
  fetchEmployeesApi, 
  fetchAttendanceReportApi, 
  fetchPayrollReportApi 
} from '@/lib/apiClient';

export default function AdminReportsPage() {
  // Navigation & Scope
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Active Main Tab: 'attendance' vs 'payroll'
  const [activeMainTab, setActiveMainTab] = useState<'attendance' | 'payroll'>('attendance');

  // Payroll Sub Tab: 'summary' vs 'structure'
  const [payrollSubTab, setPayrollSubTab] = useState<'summary' | 'structure'>('summary');

  // Attendance Report State
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    halfDay: 0,
    leave: 0,
    attendanceRate: 95
  });

  // Payroll Report State
  const [payrollRecords, setPayrollRecords] = useState<EmployeePayrollRecord[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummaryMetrics>({
    totalMonthlyOutflow: 0,
    totalDeductions: 0,
    averageNetPay: 0,
    processedCount: 0,
    totalEmployees: 0,
    payrollCycle: 'August 2026'
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [attendanceViewMode, setAttendanceViewMode] = useState<'daily' | 'weekly'>('weekly');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modals & UI States
  const [activeSlipRecord, setActiveSlipRecord] = useState<EmployeePayrollRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load All Reports
  const loadReportsData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      // 1. Fetch Employees for Switcher
      const emps = await fetchEmployeesApi();
      setEmployees(emps);

      const targetEmpId = selectedEmployee ? selectedEmployee.id : undefined;

      // 2. Fetch Attendance Report
      const attRes = await fetchAttendanceReportApi({
        employeeId: targetEmpId,
        department: selectedDepartment !== 'All' ? selectedDepartment : undefined,
        search: searchQuery || undefined,
        viewMode: attendanceViewMode,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      });
      setAttendanceRecords(attRes.data);
      if (attRes.summary) setAttendanceSummary(attRes.summary);

      // 3. Fetch Payroll Report
      const payRes = await fetchPayrollReportApi({
        employeeId: targetEmpId,
        department: selectedDepartment !== 'All' ? selectedDepartment : undefined,
        search: searchQuery || undefined
      });
      setPayrollRecords(payRes.data);
      if (payRes.summary) setPayrollSummary(payRes.summary);

    } catch (err: any) {
      console.error('Error loading reports:', err);
      setErrorMessage(err.message || 'Failed to load reports data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedEmployee, selectedDepartment, searchQuery, attendanceViewMode, dateFrom, dateTo]);

  useEffect(() => {
    loadReportsData(true);
  }, [loadReportsData]);

  // Departments List
  const departments = ['All', 'Engineering', 'Product', 'UI/UX Design', 'People Operations', 'Sales & Marketing', 'Finance', 'Customer Success'];

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Shared Navigation with Employee Switcher */}
      <DayflowNavigation
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={(emp) => {
          setSelectedEmployee(emp);
          if (emp) showToast(`Filtered reports for ${emp.name}`);
          else showToast('Viewing company-wide reports');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> HRMS Intelligence & Auditing
              </span>
              {selectedEmployee && (
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Scoped: {selectedEmployee.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Reports & Analytics Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Audit attendance trends, daily/weekly logs, salary structures, and employee payslips.
            </p>
          </div>

          {/* Tab Switcher: Attendance vs Payroll */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto">
            <button
              onClick={() => setActiveMainTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'attendance'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Attendance Report
            </button>
            <button
              onClick={() => setActiveMainTab('payroll')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'payroll'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Payroll Reports
            </button>
            <button
              onClick={() => loadReportsData(false)}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Report Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by employee name, role, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 text-[11px]">Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Date Range Picker (Attendance View) */}
          {activeMainTab === 'attendance' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <span className="text-[10px] font-bold text-slate-400">From:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-transparent text-slate-800 focus:outline-none text-xs cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <span className="text-[10px] font-bold text-slate-400">To:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-transparent text-slate-800 focus:outline-none text-xs cursor-pointer"
                />
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setAttendanceViewMode('weekly')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    attendanceViewMode === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setAttendanceViewMode('daily')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    attendanceViewMode === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>
          )}

          {/* Reset Filters */}
          {(searchQuery || selectedDepartment !== 'All' || dateFrom || dateTo || selectedEmployee) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('All');
                setDateFrom('');
                setDateTo('');
                setSelectedEmployee(null);
                showToast('Filters cleared');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-900 font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: ATTENDANCE REPORT SECTION                                          */}
        {/* ========================================================================= */}
        {activeMainTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* 1. Present */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  Present Logged
                </span>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {attendanceSummary.present}
                </div>
                <span className="text-[10px] text-emerald-700">On-time & remote shifts</span>
              </div>

              {/* 2. Absent */}
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                  Absent Unexcused
                </span>
                <div className="text-2xl font-black text-amber-950 mt-1">
                  {attendanceSummary.absent}
                </div>
                <span className="text-[10px] text-amber-700">Missed punches</span>
              </div>

              {/* 3. Half-Day */}
              <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider block">
                  Half-Day Shifts
                </span>
                <div className="text-2xl font-black text-sky-950 mt-1">
                  {attendanceSummary.halfDay}
                </div>
                <span className="text-[10px] text-sky-700">&lt; 4 hours logged</span>
              </div>

              {/* 4. On Leave */}
              <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider block">
                  Approved Leave
                </span>
                <div className="text-2xl font-black text-purple-950 mt-1">
                  {attendanceSummary.leave}
                </div>
                <span className="text-[10px] text-purple-700">Excused time-off</span>
              </div>

              {/* 5. Overall Rate */}
              <div className="col-span-2 sm:col-span-1 p-4 bg-indigo-50/80 rounded-2xl border border-indigo-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-indigo-800 tracking-wider block">
                  Attendance Rate
                </span>
                <div className="text-2xl font-black text-indigo-950 mt-1">
                  {attendanceSummary.attendanceRate}%
                </div>
                <span className="text-[10px] text-indigo-700">Punctuality index</span>
              </div>
            </div>

            {/* Attendance Report Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Attendance Audit Records ({attendanceRecords.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">Real biometric timestamps & calculated hours</p>
                </div>
              </div>

              {isLoading ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  <span>Generating attendance audit logs...</span>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No attendance records found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your filters or date range.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3.5">Employee</th>
                        <th className="px-4 py-3.5">Date</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Check In</th>
                        <th className="px-4 py-3.5">Check Out</th>
                        <th className="px-4 py-3.5">Work Hours</th>
                        <th className="px-4 py-3.5">Extra Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceRecords.map((r, idx) => (
                        <tr key={r.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={r.employeeAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                                alt={r.employeeName}
                                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{r.employeeName}</div>
                                <div className="text-[10px] text-slate-400">{r.employeeRole} • {r.employeeDepartment || r.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700">{r.date}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                              (r.status || '').includes('Leave') ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              (r.status || '').includes('Half') ? 'bg-sky-100 text-sky-800 border-sky-200' :
                              (r.status || '').includes('Absent') ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}>
                              {(r.status || '').includes('Leave') ? <Plane className="w-2.5 h-2.5" /> : null}
                              {r.status || 'Present'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-700">{r.checkIn || '--'}</td>
                          <td className="px-4 py-3 font-mono text-slate-700">{r.checkOut || '--'}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{r.workHours || '--'}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{r.extraHours || '0h 00m'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PAYROLL REPORTS SECTION                                            */}
        {/* ========================================================================= */}
        {activeMainTab === 'payroll' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Total Monthly Outflow (Net)
                </span>
                <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                  {formatINR(payrollSummary.totalMonthlyOutflow)}
                </div>
                <span className="text-[10px] text-slate-400">Direct deposit payroll fund</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Total Statutory Deductions
                </span>
                <div className="text-2xl font-black text-rose-600 mt-1 font-mono">
                  {formatINR(payrollSummary.totalDeductions)}
                </div>
                <span className="text-[10px] text-slate-400">PF + TDS + Health Insurance</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Average Net Salary
                </span>
                <div className="text-2xl font-black text-indigo-950 mt-1 font-mono">
                  {formatINR(payrollSummary.averageNetPay)}
                </div>
                <span className="text-[10px] text-indigo-600">Per employee monthly mean</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Processed Payroll Slips
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {payrollSummary.processedCount} / {payrollSummary.totalEmployees}
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">100% Disbursed (Aug 2026)</span>
              </div>
            </div>

            {/* Sub Tabs: Payroll Summary vs Salary Structure */}
            <div className="flex border-b border-slate-200 gap-4">
              <button
                onClick={() => setPayrollSubTab('summary')}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  payrollSubTab === 'summary'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Employee Payroll & Salary Report
              </button>
              <button
                onClick={() => setPayrollSubTab('structure')}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  payrollSubTab === 'structure'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Salary Structure Report (CTC Breakdown)
              </button>
            </div>

            {/* SUB TAB 1: EMPLOYEE PAYROLL TABLE */}
            {payrollSubTab === 'summary' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Disbursement Ledger ({payrollRecords.length})
                    </h3>
                    <p className="text-[11px] text-slate-500">Payable days, pro-rated gross, deductions & net salary</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3.5">Employee</th>
                        <th className="px-4 py-3.5">Department</th>
                        <th className="px-4 py-3.5">Monthly Base</th>
                        <th className="px-4 py-3.5">Payable Days</th>
                        <th className="px-4 py-3.5">Gross Pay</th>
                        <th className="px-4 py-3.5">Deductions</th>
                        <th className="px-4 py-3.5">Net Pay</th>
                        <th className="px-4 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payrollRecords.map((rec) => (
                        <tr key={rec.employeeId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={rec.employeeAvatar}
                                alt={rec.employeeName}
                                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{rec.employeeName}</div>
                                <div className="text-[10px] text-slate-400">{rec.employeeId} • {rec.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700">{rec.department}</td>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-800">{formatINR(rec.baseWage)}</td>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-100">
                              {rec.payableDays} / {rec.totalWorkingDays}d
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-900">{formatINR(rec.grossPay)}</td>
                          <td className="px-4 py-3 font-mono text-rose-700">-{formatINR(rec.totalDeductions)}</td>
                          <td className="px-4 py-3 font-mono font-black text-emerald-700 text-sm">{formatINR(rec.netPay)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setActiveSlipRecord(rec)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-all text-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Slip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB TAB 2: SALARY STRUCTURE ANALYSIS TABLE */}
            {payrollSubTab === 'structure' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Salary Structure & Statutory Allowances
                    </h3>
                    <p className="text-[11px] text-slate-500">Component-level breakdown: Basic (50%), HRA (25%), Allowances, PF & TDS</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3.5">Employee</th>
                        <th className="px-4 py-3.5">Basic Pay</th>
                        <th className="px-4 py-3.5">HRA</th>
                        <th className="px-4 py-3.5">Allowances</th>
                        <th className="px-4 py-3.5">PF Deduction</th>
                        <th className="px-4 py-3.5">TDS / Tax</th>
                        <th className="px-4 py-3.5">Annual CTC</th>
                        <th className="px-4 py-3.5 text-right">Payslip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payrollRecords.map((rec) => (
                        <tr key={rec.employeeId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3">
                            <div className="font-bold text-slate-900">{rec.employeeName}</div>
                            <div className="text-[10px] text-slate-400">{rec.employeeId}</div>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-800">{formatINR(rec.salaryStructure?.basic)}</td>
                          <td className="px-4 py-3 font-mono text-slate-800">{formatINR(rec.salaryStructure?.hra)}</td>
                          <td className="px-4 py-3 font-mono text-slate-800">{formatINR(rec.salaryStructure?.allowances)}</td>
                          <td className="px-4 py-3 font-mono text-rose-700">-{formatINR(rec.salaryStructure?.pfDeduction)}</td>
                          <td className="px-4 py-3 font-mono text-rose-700">-{formatINR(rec.salaryStructure?.taxDeduction)}</td>
                          <td className="px-4 py-3 font-mono font-bold text-indigo-900">{formatINR(rec.annualCTC)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setActiveSlipRecord(rec)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all text-xs cursor-pointer"
                            >
                              Slip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Salary Slip Modal Popup */}
      {activeSlipRecord && (
        <SalarySlipModal
          record={activeSlipRecord}
          isOpen={!!activeSlipRecord}
          onClose={() => setActiveSlipRecord(null)}
        />
      )}

    </div>
  );
}

