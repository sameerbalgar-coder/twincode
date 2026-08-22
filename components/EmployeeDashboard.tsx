'use client';

import React, { useState, useEffect } from 'react';
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
  Check
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
  // Navigation: 'dashboard' vs 'profile' vs 'attendance-history'
  const [activeMainView, setActiveMainView] = useState<'dashboard' | 'profile'>('dashboard');

  // Real-time Clock for Live Attendance
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isPunchedIn, setIsPunchedIn] = useState<boolean>(
    !!currentEmployee.attendanceToday.checkIn && currentEmployee.attendanceToday.status !== 'Absent'
  );
  const [punchInTime, setPunchInTime] = useState<string>(
    currentEmployee.attendanceToday.checkIn || '08:52 AM'
  );

  // Modals
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Leave Form State
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

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

  // Attendance Punch Action
  const handleTogglePunch = () => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (isPunchedIn) {
      setIsPunchedIn(false);
      showToast(`Clocked Out successfully at ${timeStr}. Have a great evening!`, 'info');
      // Update employee activities
      const newActivity: ActivityItem = {
        id: `ACT-${Date.now()}`,
        type: 'attendance',
        title: 'Biometric Clock-Out Recorded',
        description: `Clocked out at ${timeStr} from ${currentEmployee.location}`,
        timestamp: 'Just now',
        status: 'info'
      };
      onUpdateEmployee({
        ...currentEmployee,
        activities: [newActivity, ...(currentEmployee.activities || [])]
      });
    } else {
      setIsPunchedIn(true);
      setPunchInTime(timeStr);
      showToast(`Clocked In successfully at ${timeStr}! Status: On-Time`, 'success');
      const newActivity: ActivityItem = {
        id: `ACT-${Date.now()}`,
        type: 'attendance',
        title: 'Biometric Clock-In Recorded',
        description: `Clocked in at ${timeStr} at ${currentEmployee.location}`,
        timestamp: 'Just now',
        status: 'success'
      };
      onUpdateEmployee({
        ...currentEmployee,
        attendanceToday: {
          checkIn: timeStr,
          status: 'On-Time'
        },
        activities: [newActivity, ...(currentEmployee.activities || [])]
      });
    }
  };

  // Submit Leave Request
  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !leaveReason) {
      showToast('Please fill in all leave request fields.', 'error');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newActivity: ActivityItem = {
      id: `ACT-${Date.now()}`,
      type: 'leave',
      title: `${leaveType} Submitted`,
      description: `${diffDays} day(s) requested from ${startDate} to ${endDate}`,
      timestamp: 'Just now',
      status: 'info'
    };

    onUpdateEmployee({
      ...currentEmployee,
      activities: [newActivity, ...(currentEmployee.activities || [])]
    });

    setIsApplyLeaveOpen(false);
    setStartDate('');
    setEndDate('');
    setLeaveReason('');
    showToast(`Leave application (${diffDays} days) submitted to ${currentEmployee.managerName || 'Manager'}!`, 'success');
  };

  // Profile Update Handler with Toast
  const handleProfileUpdated = (updated: Employee) => {
    onUpdateEmployee(updated);
    showToast('Profile updated successfully! Address and phone number have been saved.', 'success');
  };

  const remainingPaidLeave = currentEmployee.leaveBalance.paid.total - currentEmployee.leaveBalance.paid.used;
  const remainingCasualLeave = currentEmployee.leaveBalance.casual.total - currentEmployee.leaveBalance.casual.used;
  const remainingSickLeave = currentEmployee.leaveBalance.sick.total - currentEmployee.leaveBalance.sick.used;

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
            <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveMainView('dashboard')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeMainView === 'dashboard'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveMainView('profile')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeMainView === 'profile'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My 360° Profile
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
                    <div className="text-[10px] text-emerald-300 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {isPunchedIn ? `Punched in @ ${punchInTime}` : 'Currently Clocked Out'}
                    </div>
                  </div>

                  <button
                    onClick={handleTogglePunch}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      isPunchedIn
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 font-extrabold'
                    }`}
                  >
                    {isPunchedIn ? (
                      <>
                        <Square className="w-3.5 h-3.5" /> Clock Out
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
                  badge={{ text: isPunchedIn ? 'Active Shift' : 'Clocked Out', variant: 'emerald' }}
                  highlightMetric={{ 
                    label: "Today's Status", 
                    value: currentEmployee.attendanceToday.status || 'On-Time' 
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
                  highlightMetric={{ label: 'Paid Time-Off', value: `${remainingPaidLeave} / ${currentEmployee.leaveBalance.paid.total} Days` }}
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
      {/* MODAL: APPLY FOR LEAVE                                                    */}
      {/* ========================================================================= */}
      {isApplyLeaveOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5" />
                <h3 className="text-base font-bold">Apply for Time Off</h3>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Paid Annual Leave">Paid Annual Leave ({remainingPaidLeave} days left)</option>
                  <option value="Casual Leave">Casual Leave ({remainingCasualLeave} days left)</option>
                  <option value="Sick Leave">Sick Leave ({remainingSickLeave} days left)</option>
                  <option value="Emergency Leave">Emergency Leave (5 days left)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Absence</label>
                <textarea
                  required
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g. Attending family wedding, personal recovery..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ATTENDANCE TIMESTAMPS                                              */}
      {/* ========================================================================= */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <h3 className="text-base font-bold">Attendance & Biometrics</h3>
              </div>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-semibold block">Today's Check-in</span>
                  <div className="text-xl font-mono font-extrabold text-emerald-950 mt-0.5">{punchInTime}</div>
                  <span className="text-[10px] text-emerald-700">Hardware Terminal: Gate 3 HQ</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Check className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Recent Check-in Logs (This Week)
                </h4>
                <div className="space-y-1.5">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span>Yesterday (Aug 21)</span>
                    <span className="font-mono font-bold text-slate-900">08:48 AM • 8h 12m</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span>Wednesday (Aug 20)</span>
                    <span className="font-mono font-bold text-slate-900">08:55 AM • 8h 05m</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span>Tuesday (Aug 19)</span>
                    <span className="font-mono font-bold text-slate-900">08:50 AM • 8h 20m</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
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

