'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Employee, 
  LeaveRequest, 
  LeaveType, 
  SystemAlert, 
  ActivityItem 
} from '../types/hrms';
import { mockSystemAlerts } from '../data/mockHrmsData';
import { QuickAccessCard } from './QuickAccessCard';
import { ActivityFeed } from './ActivityFeed';
import { EmployeeProfileView } from './EmployeeProfileView';
import { AvatarUpload } from './AvatarUpload';
import { SalarySlipModal } from './SalarySlipModal';
import { 
  checkInApi, 
  checkOutApi, 
  fetchAttendanceApi, 
  fetchLeavesApi, 
  createLeaveApi,
  fetchAttendanceReportApi,
  fetchPayrollReportApi
} from '../lib/apiClient';
import { formatINR } from '../lib/admin/payroll-helpers';
import { EmployeePayrollRecord } from '../types/admin-payroll';
import { 
  User, 
  Clock, 
  CalendarClock, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Play, 
  Square, 
  Calendar, 
  Plus, 
  X, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Building2, 
  TrendingUp, 
  FileText,
  HelpCircle,
  Bell,
  Search,
  Check,
  Plane,
  Loader2,
  AlertTriangle,
  History,
  BarChart3,
  Printer,
  Eye,
  DollarSign,
  CreditCard
} from 'lucide-react';

interface EmployeeDashboardProps {
  currentEmployee: Employee;
  onUpdateEmployee: (updated: Employee) => void;
  onSwitchToAdmin?: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentEmployee,
  onUpdateEmployee,
  onSwitchToAdmin
}) => {
  // Navigation: 'dashboard' vs 'profile'
  const [activeMainView, setActiveMainView] = useState<'dashboard' | 'profile'>('dashboard');

  // Real-time Clock for Live Attendance
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Biometric Shift State
  const isCheckedIn = !!currentEmployee.attendanceToday?.checkIn && currentEmployee.attendanceToday?.checkIn !== '--';
  const isCheckedOut = !!currentEmployee.attendanceToday?.checkOut && currentEmployee.attendanceToday?.checkOut !== '--';
  const isShiftActive = isCheckedIn && !isCheckedOut;
  const isShiftDone = isCheckedIn && isCheckedOut;

  const [punchInTime, setPunchInTime] = useState<string>(
    currentEmployee.attendanceToday?.checkIn || '08:52 AM'
  );
  const [isPunching, setIsPunching] = useState<boolean>(false);

  // Modals
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isSalarySlipModalOpen, setIsSalarySlipModalOpen] = useState(false);

  // Attendance History State
  const [attendanceViewMode, setAttendanceViewMode] = useState<'daily' | 'weekly'>('weekly');
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);

  // Reports & Analytics State
  const [reportsModalTab, setReportsModalTab] = useState<'attendance' | 'payroll'>('attendance');
  const [myAttendanceReport, setMyAttendanceReport] = useState<{
    summary: { total: number; present: number; absent: number; halfDay: number; leave: number; attendanceRate: number };
    records: any[];
  }>({
    summary: { total: 7, present: 4, absent: 1, halfDay: 1, leave: 1, attendanceRate: 92 },
    records: []
  });
  const [myPayrollRecord, setMyPayrollRecord] = useState<EmployeePayrollRecord | null>(null);
  const [isReportsLoading, setIsReportsLoading] = useState(false);

  // Leave Form & History State
  const [leaveModalTab, setLeaveModalTab] = useState<'apply' | 'history'>('apply');
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [isLeavesLoading, setIsLeavesLoading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Attendance logs for Modal
  const loadAttendanceLogs = useCallback(async (mode: 'daily' | 'weekly') => {
    setIsAttendanceLoading(true);
    try {
      const data = await fetchAttendanceApi({
        employeeId: currentEmployee.id,
        viewMode: mode
      });
      setAttendanceLogs(data);
    } catch (err: any) {
      console.error('Error fetching attendance logs:', err);
    } finally {
      setIsAttendanceLoading(false);
    }
  }, [currentEmployee.id]);

  // Fetch Leave History for Modal
  const loadLeaveHistory = useCallback(async () => {
    setIsLeavesLoading(true);
    try {
      const data = await fetchLeavesApi({
        employeeId: currentEmployee.id
      });
      setLeaveHistory(data);
    } catch (err: any) {
      console.error('Error fetching leave history:', err);
    } finally {
      setIsLeavesLoading(false);
    }
  }, [currentEmployee.id]);

  // Fetch Personal Reports & Analytics
  const loadPersonalReports = useCallback(async () => {
    setIsReportsLoading(true);
    try {
      const [attRes, payRes] = await Promise.all([
        fetchAttendanceReportApi({ employeeId: currentEmployee.id }, 'employee', currentEmployee.id),
        fetchPayrollReportApi({ employeeId: currentEmployee.id }, 'employee', currentEmployee.id)
      ]);

      if (attRes.success) {
        setMyAttendanceReport({
          summary: attRes.summary,
          records: attRes.data
        });
      }

      if (payRes.success && payRes.data && payRes.data.length > 0) {
        setMyPayrollRecord(payRes.data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching personal reports:', err);
    } finally {
      setIsReportsLoading(false);
    }
  }, [currentEmployee.id]);

  useEffect(() => {
    if (isAttendanceModalOpen) {
      loadAttendanceLogs(attendanceViewMode);
    }
  }, [isAttendanceModalOpen, attendanceViewMode, loadAttendanceLogs]);

  useEffect(() => {
    if (isApplyLeaveOpen) {
      loadLeaveHistory();
    }
  }, [isApplyLeaveOpen, loadLeaveHistory]);

  useEffect(() => {
    if (isReportsModalOpen || isSalarySlipModalOpen) {
      loadPersonalReports();
    }
  }, [isReportsModalOpen, isSalarySlipModalOpen, loadPersonalReports]);

  // Attendance Clock-In / Clock-Out Handler
  const handleTogglePunch = async () => {
    setIsPunching(true);
    try {
      if (isShiftActive) {
        // Clock Out
        const res = await checkOutApi(currentEmployee.id);
        if (res.employee) {
          onUpdateEmployee(res.employee);
        }
        showToast(res.message, 'info');
      } else if (!isCheckedIn) {
        // Clock In
        const res = await checkInApi(currentEmployee.id, currentEmployee.location, 'Workstation');
        if (res.employee) {
          onUpdateEmployee(res.employee);
          setPunchInTime(res.employee.attendanceToday?.checkIn || '');
        }
        showToast(res.message, 'success');
      } else if (isShiftDone) {
        showToast('Shift already completed for today. Duplicate clock-in is prevented.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Attendance action failed.', 'error');
    } finally {
      setIsPunching(false);
    }
  };

  // Submit Leave Request
  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !leaveReason.trim()) {
      showToast('Please fill in all required fields (Start date, End date, and remarks).', 'error');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      showToast('Start date cannot be after end date.', 'error');
      return;
    }

    setIsSubmittingLeave(true);
    try {
      const res = await createLeaveApi({
        employeeId: currentEmployee.id,
        leaveType,
        startDate,
        endDate,
        reason: leaveReason.trim()
      });

      showToast(res.message || 'Leave application submitted successfully!', 'success');
      setStartDate('');
      setEndDate('');
      setLeaveReason('');
      setLeaveModalTab('history');
      loadLeaveHistory();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit leave application.', 'error');
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  // Profile Update Handler with Toast
  const handleProfileUpdated = (updated: Employee) => {
    onUpdateEmployee(updated);
    showToast('Profile updated successfully! Address and phone number have been saved.', 'success');
  };

  const remainingPaidLeave = currentEmployee.leaveBalance?.paid ? currentEmployee.leaveBalance.paid.total - currentEmployee.leaveBalance.paid.used : 20;
  const remainingCasualLeave = currentEmployee.leaveBalance?.casual ? currentEmployee.leaveBalance.casual.total - currentEmployee.leaveBalance.casual.used : 12;
  const remainingSickLeave = currentEmployee.leaveBalance?.sick ? currentEmployee.leaveBalance.sick.total - currentEmployee.leaveBalance.sick.used : 10;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* ========================================================================= */}
      {/* TOAST NOTIFICATION POPUP                                                  */}
      {/* ========================================================================= */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`px-4.5 py-3.5 rounded-2xl shadow-2xl border text-xs font-semibold flex items-center gap-3 backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-950/30'
              : toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-800 shadow-rose-950/30'
              : 'bg-slate-900 text-white border-slate-700 shadow-slate-950/30'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              toast.type === 'success' ? 'bg-emerald-500 text-slate-950' :
              toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'
            }`}>
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="leading-snug">{toast.text}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP HEADER BAR                                                            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-lg tracking-tight">Dayflow</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                    HRMS
                  </span>
                </div>
                <div className="text-[10px] font-medium text-slate-400">Employee Workspace Portal</div>
              </div>
            </div>

            {/* Center Navigation Switcher */}
            <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200 text-xs font-bold gap-1">
              <button
                onClick={() => setActiveMainView('dashboard')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeMainView === 'dashboard'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveMainView('profile')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeMainView === 'profile'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My 360° Profile
              </button>
              <button
                onClick={() => setIsReportsModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-white/80 flex items-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Reports & Payslips</span>
              </button>
            </div>

            {/* Right Actions & User Badge */}
            <div className="flex items-center gap-3">
              
              {/* HR Admin Portal Switcher button */}
              {onSwitchToAdmin && (
                <button
                  onClick={onSwitchToAdmin}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>HR Admin Portal</span>
                </button>
              )}

              {/* Employee Avatar & Info */}
              <div 
                onClick={() => setActiveMainView('profile')}
                className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group"
                title="View Profile"
              >
                <div className="relative">
                  <img
                    src={currentEmployee.avatar}
                    alt={currentEmployee.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {currentEmployee.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                    {currentEmployee.role}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER                                                            */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* VIEW 1: DASHBOARD VIEW */}
        {activeMainView === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Welcome Greeting Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full">
                      Welcome to Dayflow
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Good Day, {currentEmployee.name.split(' ')[0]} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal">
                    {currentEmployee.role} • <strong className="text-indigo-300">{currentEmployee.department}</strong> • {currentEmployee.location}
                  </p>
                </div>

                {/* Live Biometric Punch Widget */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-4 shrink-0">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-slate-300">
                      Active Shift Clock
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                      {currentTime || '08:52:00 AM'}
                    </div>
                    <div className="text-[10px] flex items-center gap-1 mt-0.5">
                      {isShiftActive ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-emerald-300">Active Shift • Punched @ {punchInTime}</span>
                        </>
                      ) : isShiftDone ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span className="text-sky-300">Shift Completed ({currentEmployee.attendanceToday?.checkOut})</span>
                        </>
                      ) : currentEmployee.status === 'On Leave' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          <span className="text-purple-300">On Approved Leave</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-slate-300">Currently Clocked Out</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleTogglePunch}
                    disabled={isPunching || currentEmployee.status === 'On Leave'}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isShiftActive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : isShiftDone
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 font-extrabold'
                    }`}
                  >
                    {isPunching ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                      </>
                    ) : isShiftActive ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" /> Clock Out
                      </>
                    ) : isShiftDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Shift Done
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" /> Clock In
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* CORE FUNCTIONAL REQUIREMENT: 4 QUICK-ACCESS INTERACTIVE CARDS             */}
            {/* ========================================================================= */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Quick Access Modules
                </h2>
                <span className="text-xs text-slate-400 font-medium">Interactive workspace shortcuts</span>
              </div>

              {/* Responsive Grid: 1 col on mobile, 2 on sm, 4 on lg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. PROFILE CARD */}
                <QuickAccessCard
                  title="My Profile"
                  subtitle="View and manage personal, job, and compensation dossier."
                  icon={User}
                  accentColor="indigo"
                  badge={{ text: '95% Complete', variant: 'indigo' }}
                  highlightMetric={{ label: 'Employee ID', value: currentEmployee.id }}
                  onClick={() => setActiveMainView('profile')}
                />

                {/* 2. ATTENDANCE CARD */}
                <QuickAccessCard
                  title="Attendance"
                  subtitle="Biometric timestamps, daily punctuality, and hours logged."
                  icon={Clock}
                  accentColor="emerald"
                  badge={{ 
                    text: isShiftActive ? 'Active Shift' : isShiftDone ? 'Shift Done' : currentEmployee.status === 'On Leave' ? 'On Leave' : 'Clocked Out', 
                    variant: isShiftActive ? 'emerald' : 'slate' 
                  }}
                  highlightMetric={{ 
                    label: "Today's Status", 
                    value: currentEmployee.attendanceToday?.status || 'Present' 
                  }}
                  onClick={() => setIsAttendanceModalOpen(true)}
                />

                {/* 3. LEAVE REQUESTS CARD */}
                <QuickAccessCard
                  title="Leave Requests"
                  subtitle="Check paid balances, apply for time off, and track approvals."
                  icon={CalendarClock}
                  accentColor="amber"
                  badge={{ text: `${remainingPaidLeave}d Available`, variant: 'amber' }}
                  highlightMetric={{ label: 'Paid Time-Off', value: `${remainingPaidLeave} / ${currentEmployee.leaveBalance?.paid?.total || 20} Days` }}
                  onClick={() => setIsApplyLeaveOpen(true)}
                />

                {/* 4. LOGOUT CARD */}
                <QuickAccessCard
                  title="Logout"
                  subtitle="Securely conclude your Dayflow workstation session."
                  icon={LogOut}
                  accentColor="rose"
                  badge={{ text: 'Active Session', variant: 'rose' }}
                  highlightMetric={{ label: 'Security Level', value: 'OAuth 2.0 SSL' }}
                  onClick={() => setIsLogoutModalOpen(true)}
                />

              </div>
            </div>

            {/* ========================================================================= */}
            {/* WORKSPACE MAIN BODY: LEAVE & ATTENDANCE PREVIEW + ACTIVITY FEED SIDEBAR    */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Detailed Summaries */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Leave Balances Breakdown Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Leave Balance Summary</h3>
                      <p className="text-xs text-slate-500">Accrued time-off for Calendar Year 2026</p>
                    </div>
                    <button
                      onClick={() => setIsApplyLeaveOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Apply for Leave
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    
                    <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                      <span className="text-[11px] font-bold text-indigo-900 block">Paid Leave</span>
                      <div className="text-xl font-extrabold text-indigo-950 mt-1 font-mono">
                        {remainingPaidLeave} <span className="text-xs text-indigo-700 font-sans font-normal">/ {currentEmployee.leaveBalance.paid.total}d</span>
                      </div>
                      <span className="text-[10px] text-indigo-700 mt-1 block">Annual Allowance</span>
                    </div>

                    <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                      <span className="text-[11px] font-bold text-emerald-900 block">Casual Leave</span>
                      <div className="text-xl font-extrabold text-emerald-950 mt-1 font-mono">
                        {remainingCasualLeave} <span className="text-xs text-emerald-700 font-sans font-normal">/ {currentEmployee.leaveBalance.casual.total}d</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 mt-1 block">Short personal leave</span>
                    </div>

                    <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100">
                      <span className="text-[11px] font-bold text-rose-900 block">Sick Leave</span>
                      <div className="text-xl font-extrabold text-rose-950 mt-1 font-mono">
                        {remainingSickLeave} <span className="text-xs text-rose-700 font-sans font-normal">/ {currentEmployee.leaveBalance.sick.total}d</span>
                      </div>
                      <span className="text-[10px] text-rose-700 mt-1 block">Medical recovery</span>
                    </div>

                    <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100">
                      <span className="text-[11px] font-bold text-amber-900 block">Emergency</span>
                      <div className="text-xl font-extrabold text-amber-950 mt-1 font-mono">
                        {currentEmployee.leaveBalance.emergency.total - currentEmployee.leaveBalance.emergency.used} <span className="text-xs text-amber-700 font-sans font-normal">/ 5d</span>
                      </div>
                      <span className="text-[10px] text-amber-700 mt-1 block">Urgent family matters</span>
                    </div>

                  </div>
                </div>

                {/* Profile Overview Quick Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <AvatarUpload
                      avatarUrl={currentEmployee.avatar}
                      name={currentEmployee.name}
                      isEditable={false}
                      size="md"
                      status={currentEmployee.status}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{currentEmployee.name}</h4>
                      <p className="text-xs text-slate-500">{currentEmployee.role} • {currentEmployee.department}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{currentEmployee.address || currentEmployee.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveMainView('profile')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Open 360° Profile <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Right 1 Col: Activity Feed & System Alerts Sidebar */}
              <div className="lg:col-span-1">
                <ActivityFeed
                  activities={currentEmployee.activities || []}
                  alerts={mockSystemAlerts}
                  onAlertAction={(alert) => {
                    if (alert.id === 'ALT-1') {
                      showToast('Holiday Calendar opened: Labor Day on Sep 01.', 'info');
                    } else if (alert.id === 'ALT-2') {
                      setActiveMainView('profile');
                      showToast('Navigating to Documents section to upload tax declarations.', 'info');
                    } else {
                      showToast(`Navigating to ${alert.title}...`, 'info');
                    }
                  }}
                />
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: FULL PROFILE SECTION */}
        {activeMainView === 'profile' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveMainView('dashboard')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                ← Back to Employee Dashboard
              </button>
            </div>

            <EmployeeProfileView
              employee={currentEmployee}
              onUpdateProfile={handleProfileUpdated}
              showBackButton={false}
            />
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: APPLY FOR LEAVE & LEAVE HISTORY                                    */}
      {/* ========================================================================= */}
      {isApplyLeaveOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarClock className="w-5 h-5" />
                <div>
                  <h3 className="text-base font-bold">Leave & Time Off Management</h3>
                  <p className="text-[11px] text-indigo-200">Employee portal request desk</p>
                </div>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/80 px-6 pt-3 gap-2">
              <button
                onClick={() => setLeaveModalTab('apply')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  leaveModalTab === 'apply'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Apply for Leave
              </button>
              <button
                onClick={() => setLeaveModalTab('history')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  leaveModalTab === 'history'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>My Leave History</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                  {leaveHistory.length}
                </span>
              </button>
            </div>

            {/* TAB 1: APPLY FOR LEAVE FORM */}
            {leaveModalTab === 'apply' && (
              <form onSubmit={handleSubmitLeave} className="p-6 space-y-4 text-xs">
                
                {/* Leave Category Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">Leave Category</label>
                    <span className="text-[11px] text-indigo-600 font-semibold">
                      {leaveType === 'Paid Leave' || leaveType === 'Paid Annual Leave'
                        ? `${remainingPaidLeave} days available`
                        : leaveType === 'Sick Leave'
                        ? `${remainingSickLeave} days available`
                        : leaveType === 'Unpaid Leave'
                        ? 'Unlimited allocation (Loss of Pay)'
                        : 'Standard quota'}
                    </span>
                  </div>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Paid Leave">Paid Leave ({remainingPaidLeave} days remaining)</option>
                    <option value="Sick Leave">Sick Leave ({remainingSickLeave} days remaining)</option>
                    <option value="Unpaid Leave">Unpaid Leave (No balance deduction)</option>
                    <option value="Casual Leave">Casual Leave ({remainingCasualLeave} days remaining)</option>
                    <option value="Emergency Leave">Emergency Leave (5 days quota)</option>
                  </select>
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                    />
                  </div>
                </div>

                {/* Calculated Days Duration Badge */}
                {startDate && endDate && (
                  <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between text-[11px] text-indigo-900">
                    <span className="font-medium">Total Absence Duration:</span>
                    <span className="font-bold bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                      {Math.max(1, Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)} Day(s)
                    </span>
                  </div>
                )}

                {/* Reason & Remarks */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reason for Absence / Remarks</label>
                  <textarea
                    required
                    rows={3}
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="e.g. Attending urgent family matter, doctor consultation..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyLeaveOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingLeave}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingLeave ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: MY LEAVE HISTORY */}
            {leaveModalTab === 'history' && (
              <div className="p-6 space-y-3 max-h-[460px] overflow-y-auto">
                {isLeavesLoading ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    <span>Loading your leave requests...</span>
                  </div>
                ) : leaveHistory.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <CalendarClock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">No leave requests found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">You haven't submitted any time off applications yet.</p>
                  </div>
                ) : (
                  leaveHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2 text-xs transition-all hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.leaveType}</span>
                          <span className="text-[10px] font-mono text-slate-400">ID: {item.id}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          item.status === 'Rejected' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                          'bg-amber-100 text-amber-900 border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" /> {item.validityFrom || item.startDate} to {item.validityTo || item.endDate}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-900">
                          {item.allocationDays || item.daysCount} Day(s)
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60 italic">
                        "{item.remarks || item.reason}"
                      </div>

                      {/* Admin Remarks / Reviewer Notes */}
                      {item.adminRemarks && (
                        <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                          <strong className="block text-[10px] uppercase font-bold text-amber-800 mb-0.5">
                            HR Reviewer Comments:
                          </strong>
                          {item.adminRemarks}
                        </div>
                      )}
                    </div>
                  ))
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => setIsApplyLeaveOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ATTENDANCE & BIOMETRIC HISTORY                                     */}
      {/* ========================================================================= */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5" />
                <div>
                  <h3 className="text-base font-bold">Attendance & Biometrics</h3>
                  <p className="text-[11px] text-emerald-200">Daily verification & shift logs</p>
                </div>
              </div>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              {/* Today's Active Punch Status Card */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-semibold block">Today's Check-in & Status</span>
                  <div className="text-xl font-mono font-extrabold text-emerald-950 mt-0.5">
                    {currentEmployee.attendanceToday?.checkIn || '--'}
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">
                    Check-out: <strong>{currentEmployee.attendanceToday?.checkOut || 'In Progress'}</strong> • Status: <strong>{currentEmployee.attendanceToday?.status || 'Present'}</strong>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Check className="w-5 h-5" />
                </div>
              </div>

              {/* View Switcher: Weekly History vs Daily */}
              <div className="flex items-center justify-between pt-1">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Attendance History (Past 7 Days)
                </h4>
                <div className="flex bg-slate-100 p-0.5 rounded-xl text-[11px] font-semibold">
                  <button
                    onClick={() => setAttendanceViewMode('weekly')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      attendanceViewMode === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Weekly Log
                  </button>
                  <button
                    onClick={() => setAttendanceViewMode('daily')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      attendanceViewMode === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Attendance Records List */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {isAttendanceLoading ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Loading logs...</span>
                  </div>
                ) : attendanceLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    <p className="font-bold text-slate-700">No attendance logs available</p>
                  </div>
                ) : (
                  attendanceLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{log.date}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          In: <strong className="font-mono text-slate-700">{log.checkIn}</strong> • Out: <strong className="font-mono text-slate-700">{log.checkOut}</strong> • {log.workHours}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                          log.status === 'Approved Leave' || log.status === 'Leave' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          log.status === 'Half-day' || log.status === 'Half-Day' ? 'bg-sky-100 text-sky-800 border-sky-200' :
                          log.status === 'Absent' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {log.status === 'Approved Leave' || log.status === 'Leave' ? (
                            <>
                              <Plane className="w-2.5 h-2.5" /> Leave
                            </>
                          ) : log.status === 'Half-day' || log.status === 'Half-Day' ? (
                            <>
                              <Clock className="w-2.5 h-2.5" /> Half-day
                            </>
                          ) : (
                            log.status
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PERSONAL REPORTS & PAYSLIPS                                        */}
      {/* ========================================================================= */}
      {isReportsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">My Reports & Payslip Dossier</h3>
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.2 rounded-full font-bold">
                      {currentEmployee.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Personal attendance analytics and compensation statement</p>
                </div>
              </div>
              <button
                onClick={() => setIsReportsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/80 px-6 pt-3 gap-3">
              <button
                onClick={() => setReportsModalTab('attendance')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  reportsModalTab === 'attendance'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Attendance Analytics
              </button>
              <button
                onClick={() => setReportsModalTab('payroll')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  reportsModalTab === 'payroll'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Payroll & Payslip
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto text-xs">
              
              {isReportsLoading ? (
                <div className="py-12 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  <span>Loading your analytics...</span>
                </div>
              ) : reportsModalTab === 'attendance' ? (
                /* TAB 1: ATTENDANCE REPORT */
                <div className="space-y-4">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block">Present</span>
                      <div className="text-xl font-bold text-emerald-950 mt-0.5">{myAttendanceReport.summary.present} Days</div>
                      <span className="text-[10px] text-emerald-700">Logged Shifts</span>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">Absent</span>
                      <div className="text-xl font-bold text-amber-950 mt-0.5">{myAttendanceReport.summary.absent} Days</div>
                      <span className="text-[10px] text-amber-700">Unexcused</span>
                    </div>

                    <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100">
                      <span className="text-[10px] uppercase font-bold text-sky-800 block">Half-day</span>
                      <div className="text-xl font-bold text-sky-950 mt-0.5">{myAttendanceReport.summary.halfDay} Days</div>
                      <span className="text-[10px] text-sky-700">&lt; 4 Hours</span>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-purple-800 block">Leave</span>
                      <div className="text-xl font-bold text-purple-950 mt-0.5">{myAttendanceReport.summary.leave} Days</div>
                      <span className="text-[10px] text-purple-700">Approved</span>
                    </div>
                  </div>

                  {/* Attendance Rate Banner */}
                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-indigo-950 font-bold block">Punctuality & Attendance Score</span>
                      <span className="text-[11px] text-indigo-700">Based on past 7 verification cycles</span>
                    </div>
                    <div className="text-xl font-black text-indigo-900 font-mono">
                      {myAttendanceReport.summary.attendanceRate}%
                    </div>
                  </div>

                  {/* Recent Logs Table */}
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Recent Attendance Records
                    </h4>
                    <div className="space-y-1.5">
                      {myAttendanceReport.records.slice(0, 5).map((log, idx) => (
                        <div
                          key={log.id || idx}
                          className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{log.date}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              In: {log.checkIn} • Out: {log.checkOut} • {log.workHours}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            (log.status || '').includes('Leave') ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            (log.status || '').includes('Half') ? 'bg-sky-100 text-sky-800 border-sky-200' :
                            (log.status || '').includes('Absent') ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            {log.status || 'Present'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: PAYROLL & SALARY REPORT */
                <div className="space-y-4">
                  
                  {/* Monthly Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Gross Earnings</span>
                      <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                        {myPayrollRecord ? formatINR(myPayrollRecord.grossPay) : '₹1,25,000'}
                      </div>
                      <span className="text-[10px] text-slate-400">Basic + HRA + Allowances</span>
                    </div>

                    <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100">
                      <span className="text-[10px] uppercase font-bold text-rose-700 block">Total Deductions</span>
                      <div className="text-lg font-black text-rose-600 font-mono mt-0.5">
                        {myPayrollRecord ? `-${formatINR(myPayrollRecord.totalDeductions)}` : '-₹20,000'}
                      </div>
                      <span className="text-[10px] text-slate-400">PF + TDS + Health</span>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block">Net Take-Home Pay</span>
                      <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">
                        {myPayrollRecord ? formatINR(myPayrollRecord.netPay) : '₹1,05,000'}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium">Direct Deposit</span>
                    </div>
                  </div>

                  {/* Salary Structure Breakdown Table */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center justify-between">
                      <span>Salary Structure Breakdown (August 2026)</span>
                      <span className="text-indigo-600 font-semibold font-mono">
                        CTC: {myPayrollRecord ? formatINR(myPayrollRecord.annualCTC) : '₹15,00,000'} / yr
                      </span>
                    </h4>

                    <div className="divide-y divide-slate-200/60 bg-white rounded-xl border border-slate-200/60 p-2.5 space-y-1">
                      <div className="flex justify-between py-1 text-[11px]">
                        <span className="text-slate-600">Basic Pay (50%)</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {myPayrollRecord?.salaryStructure ? formatINR(myPayrollRecord.salaryStructure.basic) : '₹62,500'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-[11px]">
                        <span className="text-slate-600">House Rent Allowance (HRA)</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {myPayrollRecord?.salaryStructure ? formatINR(myPayrollRecord.salaryStructure.hra) : '₹31,250'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-[11px]">
                        <span className="text-slate-600">Special Allowances</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {myPayrollRecord?.salaryStructure ? formatINR(myPayrollRecord.salaryStructure.allowances) : '₹31,250'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-[11px] text-rose-700 font-medium">
                        <span>Provident Fund (PF) Deduction</span>
                        <span className="font-mono">
                          {myPayrollRecord?.salaryStructure ? `-${formatINR(myPayrollRecord.salaryStructure.pfDeduction)}` : '-₹7,500'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-[11px] text-rose-700 font-medium">
                        <span>Income Tax / TDS</span>
                        <span className="font-mono">
                          {myPayrollRecord?.salaryStructure ? `-${formatINR(myPayrollRecord.salaryStructure.taxDeduction)}` : '-₹12,500'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Salary Slip Action */}
                  <div className="p-4 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs block">August 2026 Salary Statement</span>
                      <span className="text-[10px] text-indigo-300">Generated & verified by Dayflow Payroll Engine</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsReportsModalOpen(false);
                        setIsSalarySlipModalOpen(true);
                      }}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Payslip
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setIsReportsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Salary Slip Modal for Employee */}
      {isSalarySlipModalOpen && myPayrollRecord && (
        <SalarySlipModal
          record={myPayrollRecord}
          isOpen={isSalarySlipModalOpen}
          onClose={() => setIsSalarySlipModalOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: LOGOUT CONFIRMATION                                                */}
      {/* ========================================================================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Sign Out of Dayflow?</h3>
              <p className="text-xs text-slate-500">
                You will need to sign back in with your corporate SSO credentials to access your portal.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  showToast('You have been safely signed out. Redirecting to SSO login...', 'info');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

