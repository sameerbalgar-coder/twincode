'use client';

import React, { useState, useMemo } from 'react';
import { 
  mockEmployees, 
  mockAttendanceRecords, 
  mockLeaveRequests, 
  mockDepartmentStats, 
  mockHRMetrics 
} from '../data/mockHrmsData';
import { Employee, AttendanceRecord, LeaveRequest, Department, EmployeeStatus } from '../types/hrms';
import { Header } from './Header';
import { Sidebar, TabType } from './Sidebar';
import { SummaryCards } from './SummaryCards';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import { LeaveApprovalModal } from './LeaveApprovalModal';
import { 
  Users, 
  Clock, 
  CalendarClock, 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  X, 
  Sparkles,
  MapPin,
  Mail,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const HRAdminDashboard: React.FC = () => {
  // Master State
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [metrics, setMetrics] = useState(mockHRMetrics);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [detailModalEmployee, setDetailModalEmployee] = useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [activeLeaveModalRequest, setActiveLeaveModalRequest] = useState<LeaveRequest | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Filter States for Directory & Tables
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Leave Approvals Handler
  const handleApproveLeave = (id: string, remarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Approved', adminRemarks: remarks } : req))
    );
    const target = leaveRequests.find(l => l.id === id);
    showToast(`Approved leave request ${id} for ${target?.employeeName || 'employee'}.`, 'success');
  };

  const handleRejectLeave = (id: string, remarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Rejected', adminRemarks: remarks } : req))
    );
    const target = leaveRequests.find(l => l.id === id);
    showToast(`Rejected leave request ${id} for ${target?.employeeName || 'employee'}.`, 'error');
  };

  const pendingLeaves = useMemo(() => {
    return leaveRequests.filter((req) => req.status === 'Pending');
  }, [leaveRequests]);

  // Handle Employee Switching with Toast feedback
  const handleSelectEmployee = (emp: Employee | null) => {
    setSelectedEmployee(emp);
    if (emp) {
      showToast(`Switched view to ${emp.name} (${emp.role})`, 'info');
    } else {
      showToast('Switched to All Company (Global Admin View)', 'info');
    }
  };

  // Open 360 Detail Modal
  const handleOpenDetailModal = (emp: Employee) => {
    setDetailModalEmployee(emp);
    setIsDetailModalOpen(true);
  };

  // Filtered lists based on search & employee context
  const filteredEmployeesList = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(globalSearch.toLowerCase()) ||
        emp.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
        emp.id.toLowerCase().includes(globalSearch.toLowerCase());

      const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, globalSearch, deptFilter, statusFilter]);

  const filteredAttendanceList = useMemo(() => {
    let list = attendanceRecords;
    if (selectedEmployee) {
      list = list.filter((a) => a.employeeId === selectedEmployee.id);
    }
    if (globalSearch) {
      list = list.filter(
        (a) =>
          a.employeeName.toLowerCase().includes(globalSearch.toLowerCase()) ||
          a.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
          a.employeeId.toLowerCase().includes(globalSearch.toLowerCase())
      );
    }
    return list;
  }, [attendanceRecords, selectedEmployee, globalSearch]);

  const filteredLeavesList = useMemo(() => {
    let list = leaveRequests;
    if (selectedEmployee) {
      list = list.filter((l) => l.employeeId === selectedEmployee.id);
    }
    if (globalSearch) {
      list = list.filter(
        (l) =>
          l.employeeName.toLowerCase().includes(globalSearch.toLowerCase()) ||
          l.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
          l.leaveType.toLowerCase().includes(globalSearch.toLowerCase())
      );
    }
    return list;
  }, [leaveRequests, selectedEmployee, globalSearch]);

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-800">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium flex items-center gap-2.5 ${
            toastMessage.type === 'success' ? 'bg-emerald-950 text-emerald-100 border-emerald-800' :
            toastMessage.type === 'error' ? 'bg-rose-950 text-rose-100 border-rose-800' :
            'bg-slate-900 text-white border-slate-700'
          }`}>
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingLeavesCount={pendingLeaves.length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        
        {/* Top Header */}
        <Header
          employees={employees}
          selectedEmployee={selectedEmployee}
          onSelectEmployee={handleSelectEmployee}
          onViewEmployeeDetails={handleOpenDetailModal}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          pendingLeavesCount={pendingLeaves.length}
        />

        {/* Dashboard Body Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* Focused Employee Context Banner (When an employee is selected from switcher) */}
          {selectedEmployee && (
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-lg border border-indigo-800/40 relative overflow-hidden animate-in fade-in zoom-in-98 duration-200">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedEmployee.avatar}
                      alt={selectedEmployee.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-400/50"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-slate-900 ${
                      selectedEmployee.status === 'Active' ? 'bg-emerald-500' :
                      selectedEmployee.status === 'Remote' ? 'bg-sky-500' :
                      selectedEmployee.status === 'On Leave' ? 'bg-amber-500' : 'bg-purple-500'
                    }`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">{selectedEmployee.name}</h2>
                      <span className="text-xs font-mono bg-white/10 text-indigo-200 px-2 py-0.5 rounded-md font-semibold">
                        {selectedEmployee.id}
                      </span>
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                        {selectedEmployee.status}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200 mt-0.5">
                      {selectedEmployee.role} • <strong className="text-white">{selectedEmployee.department}</strong> • {selectedEmployee.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleOpenDetailModal(selectedEmployee)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
                  >
                    View 360° Profile
                  </button>
                  <button
                    onClick={() => handleSelectEmployee(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Back to Company View
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW (Main HR Admin Dashboard) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Dashboard Title & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {selectedEmployee ? `Employee Focus: ${selectedEmployee.name}` : 'Dayflow HR Admin Hub'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time workforce intelligence, automated biometric attendance, and leave management.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Exporting comprehensive HR report (PDF/CSV)...', 'info')}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" /> Export Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('employees')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Manage Employees
                  </button>
                </div>
              </div>

              {/* The 3 Main Summary Cards + KPI ribbon */}
              <SummaryCards
                metrics={metrics}
                departmentStats={mockDepartmentStats}
                recentAttendance={attendanceRecords}
                pendingLeaves={pendingLeaves}
                employees={employees}
                selectedEmployee={selectedEmployee}
                onApproveLeave={handleApproveLeave}
                onRejectLeave={handleRejectLeave}
                onViewAllEmployees={() => setActiveTab('employees')}
                onViewAllAttendance={() => setActiveTab('attendance')}
                onViewAllLeaves={() => setActiveTab('leaves')}
                onSelectEmployee={handleSelectEmployee}
                onOpenLeaveModal={(req) => {
                  setActiveLeaveModalRequest(req);
                  setIsLeaveModalOpen(true);
                }}
              />

              {/* Bottom Quick Reference: Employee Roster Preview */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Key Personnel & Direct Reports</h3>
                    <p className="text-xs text-slate-500">Quick-access profile scorecards</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('employees')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
                  >
                    View directory table <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {employees.slice(0, 6).map((emp) => (
                    <div
                      key={emp.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{emp.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{emp.role}</div>
                          <div className="text-[10px] text-indigo-600 font-medium">{emp.department}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => handleSelectEmployee(emp)}
                          className="text-[11px] font-semibold bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Switch
                        </button>
                        <button
                          onClick={() => handleOpenDetailModal(emp)}
                          className="text-[10px] font-medium text-slate-400 hover:text-slate-600"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FULL EMPLOYEES DIRECTORY */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete company roster ({filteredEmployeesList.length} members matching filters)
                  </p>
                </div>
                
                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Remote">Remote</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>
              </div>

              {/* Employee Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Employee</th>
                        <th className="py-3.5 px-4">Department & Role</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Today's Check-in</th>
                        <th className="py-3.5 px-4">Leave Balances</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredEmployeesList.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                              <div>
                                <div className="font-bold text-slate-900">{emp.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{emp.id} • {emp.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{emp.role}</div>
                            <div className="text-[11px] text-slate-500">{emp.department}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                              emp.status === 'Remote' ? 'bg-sky-100 text-sky-800' :
                              emp.status === 'On Leave' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">
                              {emp.attendanceToday.checkIn || '--'}
                            </div>
                            <div className="text-[10px] text-slate-400">{emp.attendanceToday.status}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-[11px] text-slate-600">
                              Paid: <strong>{emp.leaveBalance.paid.total - emp.leaveBalance.paid.used}</strong> / {emp.leaveBalance.paid.total}d
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Casual: {emp.leaveBalance.casual.total - emp.leaveBalance.casual.used}d remaining
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSelectEmployee(emp)}
                                className="px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Switch Focus
                              </button>
                              <button
                                onClick={() => handleOpenDetailModal(emp)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                              >
                                360° Profile
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE RECORDS */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Logs & Timestamps</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Biometric & VPN automated check-ins for {selectedEmployee ? selectedEmployee.name : 'All Employees'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Attendance logs downloaded (CSV format)', 'success')}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Report
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Employee</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Check-in Time</th>
                        <th className="py-3.5 px-4">Location / IP Address</th>
                        <th className="py-3.5 px-4">Hardware Device</th>
                        <th className="py-3.5 px-4">Punctuality Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredAttendanceList.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={rec.employeeAvatar} alt={rec.employeeName} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <div className="font-bold text-slate-900">{rec.employeeName}</div>
                                <div className="text-[11px] text-slate-400">{rec.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">{rec.date}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{rec.checkInTime}</div>
                            <div className="text-[10px] text-slate-400">{rec.workHours}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{rec.ipLocation}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{rec.device}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              rec.status === 'On-Time' ? 'bg-emerald-100 text-emerald-800' :
                              rec.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                              'bg-sky-100 text-sky-800'
                            }`}>
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAVE APPROVALS */}
          {activeTab === 'leaves' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leave Approvals & Calendar</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review, approve, or reject employee absence applications
                  </p>
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-3">
                {filteredLeavesList.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img src={req.employeeAvatar} alt={req.employeeName} className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{req.employeeName}</h4>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 rounded font-semibold">
                            {req.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {req.role} • <strong>{req.department}</strong>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 italic">"{req.reason}"</p>
                        {req.conflictWarning && (
                          <div className="text-[11px] text-amber-800 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            {req.conflictWarning}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date Details & Actions */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <div className="text-xs font-bold text-slate-900">{req.startDate} to {req.endDate}</div>
                        <div className="text-[11px] text-indigo-600 font-semibold">{req.daysCount} Days • {req.leaveType}</div>
                      </div>

                      {req.status === 'Pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRejectLeave(req.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveLeave(req.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 italic">
                          Processed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ORG ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organization Analytics</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Department capacity, attendance trends, and resource allocation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Capacity Table */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Department Workforce Capacity</h3>
                  <div className="space-y-3">
                    {mockDepartmentStats.map((dept) => (
                      <div key={dept.name} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>{dept.name}</span>
                          <span>{dept.presentToday} / {dept.totalEmployees} Active Today</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${dept.color}`}
                            style={{ width: `${(dept.presentToday / dept.totalEmployees) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HR Compliance & System Health */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Compliance & Leave Health</h3>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Attendance Punctuality SLA Met: 94.6%
                    </div>
                    <p className="text-emerald-800">Minimum enterprise SLA is 90%. All teams are operating in healthy capacity.</p>
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-950 space-y-1">
                    <div className="font-bold text-indigo-900">Upcoming Holiday Calendar</div>
                    <p className="text-indigo-800">Labor Day (September 1) scheduled as company-wide paid day off.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 360° Employee Detail Modal */}
      <EmployeeDetailModal
        employee={detailModalEmployee}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onFocusEmployee={handleSelectEmployee}
      />

      {/* Leave Approval Modal */}
      <LeaveApprovalModal
        request={activeLeaveModalRequest}
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onApprove={handleApproveLeave}
        onReject={handleRejectLeave}
      />

    </div>
  );
};

