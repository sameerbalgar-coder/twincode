'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Clock, 
  CalendarClock, 
  TrendingUp, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Laptop, 
  MapPin, 
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Employee, AttendanceRecord, LeaveRequest, DepartmentStat, HRMetrics } from '../types/hrms';

interface SummaryCardsProps {
  metrics: HRMetrics;
  departmentStats: DepartmentStat[];
  recentAttendance: AttendanceRecord[];
  pendingLeaves: LeaveRequest[];
  employees: Employee[];
  selectedEmployee: Employee | null;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  onViewAllEmployees: () => void;
  onViewAllAttendance: () => void;
  onViewAllLeaves: () => void;
  onSelectEmployee: (emp: Employee | null) => void;
  onOpenLeaveModal: (req: LeaveRequest) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  metrics,
  departmentStats,
  recentAttendance,
  pendingLeaves,
  employees,
  selectedEmployee,
  onApproveLeave,
  onRejectLeave,
  onViewAllEmployees,
  onViewAllAttendance,
  onViewAllLeaves,
  onSelectEmployee,
  onOpenLeaveModal
}) => {
  // If an employee is focused, filter relevant items
  const filteredAttendance = selectedEmployee
    ? recentAttendance.filter(a => a.employeeId === selectedEmployee.id)
    : recentAttendance;

  const filteredLeaves = selectedEmployee
    ? pendingLeaves.filter(l => l.employeeId === selectedEmployee.id)
    : pendingLeaves;

  return (
    <div className="space-y-6">
      {/* KPI Top Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Headcount</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.totalEmployees}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{metrics.newHiresThisMonth} this mo.
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% active staff tracked</span>
          </div>
        </div>

        {/* Present Today */}
        <Link 
          href="/admin/attendance"
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-emerald-700">
              Present Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.activeToday}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              {metrics.attendanceRate}% Rate
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>{metrics.remoteToday} Remote</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold group-hover:underline flex items-center gap-0.5">
              Open Viewer <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Pending Leave Approvals */}
        <Link 
          href="/admin/leaves"
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-200 transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-amber-700">
              Pending Leaves
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingLeaves.length}</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
              Action Required
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Review Inbox</span>
            </div>
            <span className="text-amber-600 font-semibold group-hover:underline flex items-center gap-0.5">
              Open <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* On Leave Today */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Currently On Leave</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.onLeaveToday}</span>
            <span className="text-xs text-slate-500">Employees</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Engineering (3), Sales (2), Others (3)</span>
          </div>
        </div>
      </div>

      {/* Main 3 Summary Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ========================================================= */}
        {/* CARD 1: OVERALL EMPLOYEE LIST & DEPARTMENT SUMMARY        */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
          <div>
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Employee Directory</h3>
                  <p className="text-xs text-slate-500">Headcount & department breakdown</p>
                </div>
              </div>
              <button
                onClick={onViewAllEmployees}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content: Department Breakdown & Key Highlights */}
            <div className="p-5 space-y-4">
              {/* Quick Summary Pill Bar */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Active</div>
                  <div className="text-base font-bold text-emerald-600">134</div>
                </div>
                <div className="border-x border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Remote</div>
                  <div className="text-base font-bold text-sky-600">34</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Probation</div>
                  <div className="text-base font-bold text-purple-600">6</div>
                </div>
              </div>

              {/* Department Distribution Bars */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Department Distribution</span>
                  <span className="text-slate-400">Headcount</span>
                </div>
                
                <div className="space-y-2.5">
                  {departmentStats.slice(0, 5).map((dept) => {
                    const percentage = Math.round((dept.totalEmployees / Math.max(metrics.totalEmployees, 1)) * 100);
                    return (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700 truncate">{dept.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">{percentage}%</span>
                            <span className="font-semibold text-slate-900 w-6 text-right">{dept.totalEmployees}</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${dept.color} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Featured Key Personnel Preview */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Quick Select Team Lead</span>
                  <span className="text-[11px] text-slate-400">Click to switch</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {employees.slice(0, 4).map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp)}
                      title={`${emp.name} (${emp.role})`}
                      className={`flex items-center gap-1.5 p-1.5 pr-2.5 rounded-full border transition-all shrink-0 ${
                        selectedEmployee?.id === emp.id
                          ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-medium text-slate-800">{emp.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Full registered roster</span>
            <button
              onClick={onViewAllEmployees}
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              Browse Directory <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 2: ATTENDANCE RECORDS & LIVE CHECK-IN FEED           */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
          <div>
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Attendance Records</h3>
                  <p className="text-xs text-slate-500">Live check-ins & presence logs</p>
                </div>
              </div>
              <Link
                href="/admin/attendance"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Open Viewer <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-4">
              {/* Daily Attendance Progress Bar */}
              <div className="p-3.5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-950">Today's Attendance Rate</span>
                  <span className="text-sm font-extrabold text-emerald-700">94.6%</span>
                </div>
                <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: '94.6%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-800 font-medium mt-2">
                  <span>140 / 148 Checked in</span>
                  <span>Target: &gt; 92%</span>
                </div>
              </div>

              {/* Real-time Check-in Activity Stream */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Check-in Stream
                  </span>
                  <Link href="/admin/attendance" className="text-[11px] text-emerald-700 font-semibold hover:underline">
                    View full logs &gt;
                  </Link>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {filteredAttendance.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                      No attendance records found for current filter.
                    </div>
                  ) : (
                    filteredAttendance.slice(0, 4).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={record.employeeAvatar}
                            alt={record.employeeName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 truncate">
                              {record.employeeName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                              <MapPin className="w-2.5 h-2.5 text-slate-400" />
                              <span className="truncate">{record.ipLocation.split('(')[0]}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-slate-900">{record.checkInTime}</div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                              record.status === 'On-Time'
                                ? 'bg-emerald-100 text-emerald-800'
                                : record.status === 'Late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Daily & Weekly view available</span>
            <Link
              href="/admin/attendance"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-600 flex items-center gap-1"
            >
              Open Attendance Viewer <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 3: PENDING LEAVE APPROVALS & ACTION CENTER           */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
          <div>
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Leave Approvals</h3>
                    {pendingLeaves.length > 0 && (
                      <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                        {pendingLeaves.length} Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Quick decision & conflict review</p>
                </div>
              </div>
              <Link
                href="/admin/leaves"
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Open Inbox <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card Content: Pending Requests with Inline 1-Click Actions */}
            <div className="p-5 space-y-3">
              {filteredLeaves.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <div className="text-sm font-semibold text-slate-800">All caught up!</div>
                  <p className="text-xs text-slate-500 mt-0.5">No pending leave requests awaiting approval.</p>
                </div>
              ) : (
                filteredLeaves.slice(0, 2).map((request) => (
                  <div
                    key={request.id}
                    className="p-3 rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-50/40 via-white to-white space-y-2.5 shadow-xs"
                  >
                    {/* Header: Employee & Leave Type */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={request.employeeAvatar}
                          alt={request.employeeName}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {request.employeeName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate">
                            {request.role} • {request.department}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                        {request.leaveType}
                      </span>
                    </div>

                    {/* Date & Reason */}
                    <div className="text-xs bg-slate-50 p-2 rounded-lg text-slate-700">
                      <div className="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                        <span>{request.startDate} to {request.endDate}</span>
                        <span className="text-indigo-600">{request.daysCount} Day{request.daysCount > 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                        "{request.reason}"
                      </p>
                    </div>

                    {/* Conflict Alert If Applicable */}
                    {request.conflictWarning && (
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-800 bg-amber-100/70 px-2 py-1 rounded-md">
                        <ShieldAlert className="w-3 h-3 text-amber-700 shrink-0" />
                        <span className="truncate">{request.conflictWarning}</span>
                      </div>
                    )}

                    {/* Quick Inline Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onOpenLeaveModal(request)}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline"
                      >
                        Inspect details
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onRejectLeave(request.id)}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => onApproveLeave(request.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Categorized by PTO, Sick, Unpaid</span>
            <Link
              href="/admin/leaves"
              className="text-xs font-semibold text-slate-700 hover:text-amber-600 flex items-center gap-1"
            >
              Open Leave Inbox <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
