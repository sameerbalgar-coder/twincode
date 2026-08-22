'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Calendar, 
  Users, 
  Search, 
  Filter, 
  Plane, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  Loader2,
  CalendarDays,
  UserCheck,
  UserX,
  Plus
} from 'lucide-react';
import { DayflowNavigation } from '@/components/DayflowNavigation';
import { Employee } from '@/types/hrms';
import { 
  AttendanceRecordItem, 
  AttendanceSummaryStats, 
  AttendanceViewMode 
} from '@/types/admin-attendance-leave';
import { fetchEmployeesApi, fetchMetricsApi } from '@/lib/apiClient';

export default function AdminAttendancePage() {
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [records, setRecords] = useState<AttendanceRecordItem[]>([]);
  const [viewMode, setViewMode] = useState<AttendanceViewMode>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2026-08-22');

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load dynamic data from APIs
  const loadAttendanceData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      // 1. Fetch Employees
      const emps = await fetchEmployeesApi();
      setEmployees(emps);

      // 2. Fetch Attendance Records from API
      const params = new URLSearchParams();
      if (selectedEmployee) params.set('employeeId', selectedEmployee.id);
      params.set('viewMode', viewMode);
      params.set('date', selectedDate);
      if (searchQuery) params.set('search', searchQuery);
      if (selectedDepartment !== 'All') params.set('department', selectedDepartment);

      const res = await fetch(`/api/attendance?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch attendance');

      setRecords(json.data);
    } catch (err: any) {
      console.error('Error loading attendance records:', err);
      setErrorMessage(err.message || 'Failed to load attendance records from server.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedEmployee, viewMode, selectedDate, searchQuery, selectedDepartment]);

  useEffect(() => {
    loadAttendanceData(true);
  }, [loadAttendanceData]);

  // Compute Summary Statistics
  const summaryStats: AttendanceSummaryStats = useMemo(() => {
    const totalWorkingDays = 22; // Standard monthly working days
    const daysPresent = records.filter(r => r.status === 'Present' || r.status === 'Remote' || r.status === 'Late').length;
    const leavesCount = records.filter(r => r.status === 'Approved Leave').length;
    const activeAbsentCount = records.filter(r => r.status === 'Absent').length;

    return {
      daysPresent,
      leavesCount,
      totalWorkingDays,
      activeAbsentCount
    };
  }, [records]);

  // Filtered display list
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = 
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDepartment === 'All' || r.department === selectedDepartment;
      return matchSearch && matchDept;
    });
  }, [records, searchQuery, selectedDepartment]);

  // Render visual status indicator
  const renderStatusIndicator = (record: AttendanceRecordItem) => {
    switch (record.statusIndicator) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {record.status}
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {record.status}
          </span>
        );
      case 'airplane':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Plane className="w-3 h-3 text-purple-600" />
            Approved Leave
          </span>
        );
      case 'half-day':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            Half-Day
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {record.status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Shared Top Navigation & Employee Switcher */}
      <DayflowNavigation
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={(emp) => {
          setSelectedEmployee(emp);
          if (emp) showToast(`Filtered attendance for ${emp.name}`);
          else showToast('Viewing company-wide attendance records');
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        
        {/* Header & View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Attendance Viewer</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Live Timestamps
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedEmployee 
                ? `Showing personal punch logs & working hours for ${selectedEmployee.name} (${selectedEmployee.id})`
                : 'Monitor company-wide biometric check-ins, overtime, and punctuality logs.'}
            </p>
          </div>

          {/* Toggle Daily vs Weekly & Refresh */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* View Mode Toggle */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('daily')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'daily'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daily View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('weekly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'weekly'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weekly View
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadAttendanceData(false)}
              disabled={isRefreshing}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              title="Refresh attendance records"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* Export Report */}
            <button
              onClick={() => showToast('Attendance report exported to CSV')}
              className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
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
              onClick={() => loadAttendanceData(false)}
              className="font-bold underline hover:text-rose-950"
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Days Present */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Present</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{summaryStats.daysPresent}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Checked-in today
            </div>
          </div>

          {/* Leaves Count */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leaves Count</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{summaryStats.leavesCount}</span>
              <span className="text-xs text-purple-700 font-medium">Approved off</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Authorized absence logs
            </div>
          </div>

          {/* Total Working Days */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Working Days</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{summaryStats.totalWorkingDays}</span>
              <span className="text-xs text-slate-500">Days / Cycle</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              August 2026 Calendar
            </div>
          </div>

          {/* Active Absent Count */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Absent</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{summaryStats.activeAbsentCount}</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Unapproved
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Requires follow-up / check-in
            </div>
          </div>

        </div>

        {/* Filter Bar & Date Selector */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search & Department */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by name, employee ID, role..."
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

          {/* Date Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>{viewMode === 'daily' ? 'Date:' : 'Week Range:'}</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Attendance Records Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            /* Loading Skeleton */
            <div className="p-8 space-y-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
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
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-4 bg-slate-200 rounded-full w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Employee Name</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Check-In</th>
                    <th className="py-3.5 px-4">Check-Out</th>
                    <th className="py-3.5 px-4">Work Hours</th>
                    <th className="py-3.5 px-4">Extra Hours</th>
                    <th className="py-3.5 px-5 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-semibold text-slate-700">No attendance records found</p>
                        <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or date selection.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Employee Name & Role */}
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
                              <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                                <span>{record.employeeName}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                <span className="font-mono">{record.employeeId}</span> • {record.department}
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {record.date}
                        </td>

                        {/* Check-In */}
                        <td className="py-3.5 px-4">
                          <span className={`font-bold ${record.checkIn === '--' ? 'text-slate-300' : 'text-slate-900'}`}>
                            {record.checkIn}
                          </span>
                        </td>

                        {/* Check-Out */}
                        <td className="py-3.5 px-4">
                          <span className={`font-bold ${record.checkOut === '--' ? 'text-slate-300' : 'text-slate-900'}`}>
                            {record.checkOut}
                          </span>
                        </td>

                        {/* Work Hours */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {record.workHours}
                        </td>

                        {/* Extra Hours */}
                        <td className="py-3.5 px-4">
                          <span className={`font-bold ${record.extraHours.startsWith('+') ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {record.extraHours}
                          </span>
                        </td>

                        {/* Visual Status Indicator */}
                        <td className="py-3.5 px-5 text-right">
                          {renderStatusIndicator(record)}
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

    </div>
  );
}

