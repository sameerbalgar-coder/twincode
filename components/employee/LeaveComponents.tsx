'use client';

import { useState } from 'react';
import type { LeaveRequest, LeaveType, LeaveStatus } from '@/lib/types';
import { StatusBadge } from './UIComponents';
import { Skeleton, TableSkeleton } from './UIComponents';
import { Button, Input, Textarea, Select, Modal } from './StateComponents';

const leaveTypeOptions = [
  { value: 'paid', label: 'Paid Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

const leaveTypeLabels: Record<LeaveType, string> = {
  paid: 'Paid Leave',
  sick: 'Sick Leave',
  unpaid: 'Unpaid Leave',
};

interface LeaveRequestCardProps {
  request: LeaveRequest;
}

export function LeaveRequestCard({ request }: LeaveRequestCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {leaveTypeLabels[request.leaveType]}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Applied on {new Date(request.appliedAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={request.status} variant="leave" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
          <p className="font-medium text-gray-900 dark:text-white">{new Date(request.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">End Date</p>
          <p className="font-medium text-gray-900 dark:text-white">{new Date(request.endDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Days</p>
          <p className="font-medium text-gray-900 dark:text-white">{request.totalDays}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-medium text-gray-900 dark:text-white capitalize">{request.status}</p>
        </div>
      </div>

      {request.remarks && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Remarks</p>
          <p className="text-sm text-gray-900 dark:text-white">{request.remarks}</p>
        </div>
      )}

      {request.adminComment && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Admin Comment</p>
          <p className="text-sm text-blue-900 dark:text-blue-300 mt-1">{request.adminComment}</p>
          {request.reviewedAt && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Reviewed on {new Date(request.reviewedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {request.status === 'pending' && (
        <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          Pending review by HR/Admin
        </p>
      )}
    </div>
  );
}

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  loading?: boolean;
}

export function LeaveRequestList({ requests, loading }: LeaveRequestListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between">
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80px" />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No leave requests</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't submitted any leave requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <LeaveRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}

interface LeaveRequestTableProps {
  requests: LeaveRequest[];
  loading?: boolean;
}

export function LeaveRequestTable({ requests, loading }: LeaveRequestTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No leave requests</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't submitted any leave requests yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{leaveTypeLabels[request.leaveType]}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{new Date(request.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{new Date(request.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{request.totalDays}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={request.status} variant="leave" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{new Date(request.appliedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ApplyLeaveFormProps {
  onSubmit: (data: { leaveType: LeaveType; startDate: string; endDate: string; remarks?: string }) => Promise<void>;
  onClose: () => void;
  submitting: boolean;
}

export function ApplyLeaveForm({ onSubmit, onClose, submitting }: ApplyLeaveFormProps) {
  const [formData, setFormData] = useState<{
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    remarks: string;
  }>({
    leaveType: 'paid',
    startDate: '',
    endDate: '',
    remarks: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after or equal to start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Apply for Leave</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <Select
        label="Leave Type"
        value={formData.leaveType}
        onChange={(e) => setFormData((prev) => ({ ...prev, leaveType: e.target.value as LeaveType }))}
        options={leaveTypeOptions}
        placeholder="Select leave type"
        error={errors.leaveType}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
          min={today}
          required
          error={errors.startDate}
        />
        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
          min={formData.startDate || today}
          required
          error={errors.endDate}
        />
      </div>

      <Textarea
        label="Remarks (Optional)"
        value={formData.remarks}
        onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
        placeholder="Add any additional information..."
        rows={4}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Submit Request
        </Button>
      </div>
    </form>
  );
}

interface LeaveSummaryProps {
  requests: LeaveRequest[];
}

export function LeaveSummary({ requests }: LeaveSummaryProps) {
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
      </div>
    </div>
  );
}