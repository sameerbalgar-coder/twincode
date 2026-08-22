'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  CalendarClock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Paperclip, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  X,
  Clock,
  Eye,
  Check
} from 'lucide-react';
import { DayflowNavigation } from '@/components/DayflowNavigation';
import { Employee } from '@/types/hrms';
import { AdminLeaveItem, LeaveCategory, LeaveApprovalStatus } from '@/types/admin-attendance-leave';
import { fetchEmployeesApi } from '@/lib/apiClient';

export default function AdminLeaveApprovalPage() {
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<AdminLeaveItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<LeaveCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Loading & Processing States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Review Remarks Modal State
  const [activeModalRequest, setActiveModalRequest] = useState<AdminLeaveItem | null>(null);
  const [modalActionType, setModalActionType] = useState<'approve' | 'reject'>('approve');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Attachment Preview Modal State
  const [previewAttachment, setPreviewAttachment] = useState<{ name: string; url: string; employee: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Leave Requests from API
  const loadLeaveData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      // 1. Fetch Employees for Switcher
      const emps = await fetchEmployeesApi();
      setEmployees(emps);

      // 2. Fetch Leaves
      const params = new URLSearchParams();
      if (selectedEmployee) params.set('employeeId', selectedEmployee.id);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (activeCategory !== 'All') params.set('category', activeCategory);

      const res = await fetch(`/api/leaves?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch leave requests');

      setLeaveRequests(json.data);
    } catch (err: any) {
      console.error('Error loading leave requests:', err);
      setErrorMessage(err.message || 'Failed to load leave requests.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedEmployee, statusFilter, activeCategory]);

  useEffect(() => {
    loadLeaveData(true);
  }, [loadLeaveData]);

  // Handle Approve with Instant Sync
  const executeApprove = async (id: string, remarks?: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/leaves/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminRemarks: remarks })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Approval failed');

      // Update state locally
      setLeaveRequests(prev => prev.map(l => (l.id === id ? { ...l, status: 'Approved', adminRemarks: remarks } : l)));
      showToast(`Leave request ${id} approved & synced with attendance logs & leave balances.`, 'success');
    } catch (err: any) {
      console.error('Error approving leave:', err);
      showToast(err.message || 'Failed to approve leave request', 'error');
    } finally {
      setProcessingId(null);
      setIsModalOpen(false);
      setReviewRemarks('');
    }
  };

  // Handle Reject
  const executeReject = async (id: string, remarks?: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/leaves/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminRemarks: remarks })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Rejection failed');

      setLeaveRequests(prev => prev.map(l => (l.id === id ? { ...l, status: 'Rejected', adminRemarks: remarks } : l)));
      showToast(`Leave request ${id} rejected.`, 'error');
    } catch (err: any) {
      console.error('Error rejecting leave:', err);
      showToast(err.message || 'Failed to reject leave request', 'error');
    } finally {
      setProcessingId(null);
      setIsModalOpen(false);
      setReviewRemarks('');
    }
  };

  // Open Review Comments Modal
  const openActionModal = (request: AdminLeaveItem, action: 'approve' | 'reject') => {
    setActiveModalRequest(request);
    setModalActionType(action);
    setReviewRemarks('');
    setIsModalOpen(true);
  };

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(req => {
      const matchesCategory = 
        activeCategory === 'All' || 
        req.leaveType === activeCategory;
      
      const matchesSearch = 
        req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.remarks.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [leaveRequests, activeCategory, searchQuery]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    return {
      all: leaveRequests.length,
      pto: leaveRequests.filter(l => l.leaveType === 'Paid Time Off').length,
      sick: leaveRequests.filter(l => l.leaveType === 'Sick Leave').length,
      unpaid: leaveRequests.filter(l => l.leaveType === 'Unpaid Leave').length
    };
  }, [leaveRequests]);

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
          if (emp) showToast(`Filtered leave requests for ${emp.name}`, 'success');
          else showToast('Viewing all company leave requests', 'success');
        }}
        pendingLeavesCount={leaveRequests.filter(l => l.status === 'Pending').length}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        
        {/* Header & Status Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leave Approval Inbox</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                {leaveRequests.filter(l => l.status === 'Pending').length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and act on incoming leave requests with automatic attendance synchronization & team clash protection.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status Filter Pill */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs flex items-center">
              {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadLeaveData(false)}
              disabled={isRefreshing}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              title="Refresh inbox"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
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
              onClick={() => loadLeaveData(false)}
              className="font-bold underline hover:text-rose-950"
            >
              Retry
            </button>
          </div>
        )}

        {/* Category Tabs: Paid Time Off, Sick Leave, Unpaid Leave */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>All Requests</span>
            <span className="text-[10px] opacity-70">({categoryCounts.all})</span>
          </button>

          <button
            onClick={() => setActiveCategory('Paid Time Off')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'Paid Time Off'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Paid Time Off (PTO)</span>
            <span className="text-[10px] opacity-70">({categoryCounts.pto})</span>
          </button>

          <button
            onClick={() => setActiveCategory('Sick Leave')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'Sick Leave'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Sick Leave</span>
            <span className="text-[10px] opacity-70">({categoryCounts.sick})</span>
          </button>

          <button
            onClick={() => setActiveCategory('Unpaid Leave')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'Unpaid Leave'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Unpaid Leave</span>
            <span className="text-[10px] opacity-70">({categoryCounts.unpaid})</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by applicant, department, reason, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Showing {filteredRequests.length} applications
          </span>
        </div>

        {/* Leave Requests Review List / Table */}
        <div className="space-y-3">
          {isLoading ? (
            /* Skeleton */
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-5 bg-white rounded-3xl border border-slate-200 animate-pulse space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div className="space-y-1">
                        <div className="h-3.5 bg-slate-200 rounded w-32" />
                        <div className="h-2.5 bg-slate-100 rounded w-24" />
                      </div>
                    </div>
                    <div className="h-6 bg-slate-200 rounded-full w-24" />
                  </div>
                  <div className="h-10 bg-slate-50 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="text-base font-bold text-slate-800">Inbox is all clear!</h3>
              <p className="text-xs text-slate-400 mt-1">No leave requests matching your active filters.</p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isProcessing = processingId === req.id;
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all p-5 space-y-4"
                >
                  {/* Top Row: Applicant, Role, Category Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link 
                      href={`/admin/profile/${req.employeeId}`}
                      className="flex items-center gap-3.5 group"
                    >
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 shadow-2xs shrink-0 group-hover:ring-indigo-300 transition-all"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {req.employeeName}
                          </h3>
                          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
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
                        <p className="text-xs text-slate-500 font-medium">
                          {req.role} • <strong>{req.department}</strong>
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-xl">
                        {req.leaveType}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid: Validity From, Validity To, Allocation Day Count, Attachment */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Validity From</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {req.validityFrom}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Validity To</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {req.validityTo}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Allocation Days</span>
                      <span className="font-black text-indigo-700 text-sm mt-0.5 block">
                        {req.allocationDays} {req.allocationDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Attachment</span>
                      {req.attachmentName ? (
                        <button
                          type="button"
                          onClick={() => setPreviewAttachment({
                            name: req.attachmentName!,
                            url: req.attachmentUrl || '#',
                            employee: req.employeeName
                          })}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 mt-0.5 hover:underline cursor-pointer truncate max-w-[140px]"
                        >
                          <Paperclip className="w-3 h-3 shrink-0" />
                          <span className="truncate">{req.attachmentName}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px] mt-0.5 block">No attachment</span>
                      )}
                    </div>
                  </div>

                  {/* Remarks & Conflict Warning */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700">Remarks / Reason:</span>
                      <p className="text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100 mt-1">
                        "{req.remarks}"
                      </p>
                    </div>

                    {req.conflictWarning && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-[11px] font-semibold">{req.conflictWarning}</span>
                      </div>
                    )}

                    {req.adminRemarks && (
                      <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] text-indigo-900">
                        <strong>Admin Notes:</strong> {req.adminRemarks}
                      </div>
                    )}
                  </div>

                  {/* Bottom Instant Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Applied on {req.appliedDate}
                    </span>

                    {req.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        {/* Reject Button */}
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => openActionModal(req, 'reject')}
                          className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>

                        {/* Approve Button */}
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => openActionModal(req, 'approve')}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                        >
                          {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 italic">
                        Decision Finalized ({req.status})
                      </span>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>

      {/* Review Comments / Decision Modal */}
      {isModalOpen && activeModalRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className={`p-5 text-white flex items-center justify-between ${
              modalActionType === 'approve' ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-rose-600 to-red-700'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  {modalActionType === 'approve' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {modalActionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                  </h3>
                  <p className="text-xs opacity-90">{activeModalRequest.employeeName} ({activeModalRequest.allocationDays} Days)</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                {modalActionType === 'approve' 
                  ? 'Approving this request will immediately deduct the days from the employee’s leave balance and update their attendance roster.'
                  : 'Please state the rationale for rejecting this leave application.'}
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Review Remarks (Optional)</label>
                <textarea
                  rows={3}
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder={modalActionType === 'approve' ? 'e.g. Approved. Please coordinate handover.' : 'e.g. Inadequate team coverage during sprint release.'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (modalActionType === 'approve') {
                      executeApprove(activeModalRequest.id, reviewRemarks);
                    } else {
                      executeReject(activeModalRequest.id, reviewRemarks);
                    }
                  }}
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-xs cursor-pointer ${
                    modalActionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {modalActionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold truncate max-w-[280px]">{previewAttachment.name}</span>
              </div>
              <button onClick={() => setPreviewAttachment(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{previewAttachment.name}</h4>
                <p className="text-xs text-slate-500">Submitted by {previewAttachment.employee}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                Document verified & encrypted in Dayflow HRMS compliance storage.
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Downloading verified copy of ${previewAttachment.name}`);
                    setPreviewAttachment(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download File
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

