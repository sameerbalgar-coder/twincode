'use client';

import React, { useState } from 'react';
import { 
  X, 
  CalendarClock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Clock, 
  FileText,
  User
} from 'lucide-react';
import { LeaveRequest } from '../types/hrms';

interface LeaveApprovalModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, remarks?: string) => void;
  onReject: (id: string, remarks?: string) => void;
}

export const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const [remarks, setRemarks] = useState('');

  if (!isOpen || !request) return null;

  const handleApprove = () => {
    onApprove(request.id, remarks);
    onClose();
    setRemarks('');
  };

  const handleReject = () => {
    onReject(request.id, remarks);
    onClose();
    setRemarks('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <CalendarClock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Leave Request Review</h3>
              <p className="text-xs text-amber-100">Application ID: {request.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Employee Badge */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={request.employeeAvatar}
              alt={request.employeeName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{request.employeeName}</h4>
              <p className="text-xs text-slate-500">{request.role} • {request.department}</p>
              <span className="text-[10px] font-mono text-slate-400">ID: {request.employeeId}</span>
            </div>
          </div>

          {/* Leave Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block mb-1">Leave Category</span>
              <span className="font-bold text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md inline-block">
                {request.leaveType}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block mb-1">Duration</span>
              <span className="font-bold text-slate-900 text-sm">
                {request.daysCount} Day{request.daysCount > 1 ? 's' : ''}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
              <span className="text-slate-500 block mb-1">Requested Dates</span>
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>{request.startDate}</span>
                <span className="text-slate-400">to</span>
                <span>{request.endDate}</span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-slate-700">Applicant Reason:</span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 italic">
              "{request.reason}"
            </div>
          </div>

          {/* Conflict Warning */}
          {request.conflictWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Team Coverage Warning:</span>
                <p className="text-[11px] text-amber-800 mt-0.5">{request.conflictWarning}</p>
              </div>
            </div>
          )}

          {/* Admin Remarks Input */}
          <div className="space-y-1 text-xs">
            <label htmlFor="adminRemarks" className="font-semibold text-slate-700 block">
              Admin Remarks / Notes (Optional)
            </label>
            <textarea
              id="adminRemarks"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Approved provided handoff notes are shared before Friday."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" /> Reject Request
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Leave
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

