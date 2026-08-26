'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { employeeApi } from '@/lib/api';
import type { LeaveRequest, PaginatedResponse } from '@/lib/types';
import { EmployeeLayout } from '@/components/employee/EmployeeLayout';
import { LeaveRequestList, LeaveRequestTable, ApplyLeaveForm, LeaveSummary } from '@/components/employee/LeaveComponents';
import { LoadingState, ErrorState, Modal, Button } from '@/components/employee/StateComponents';

export default function EmployeeLeavePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    if (!authLoading && user) {
      fetchLeaveRequests();
    }
  }, [user, authLoading, pagination.page]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeApi.getLeaveRequests({ page: pagination.page, pageSize: pagination.pageSize });
      if (response.success && response.data) {
        setRequests(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data!.total,
          totalPages: response.data!.totalPages,
        }));
      } else {
        setError(response.error || 'Failed to load leave requests');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (data: { leaveType: 'paid' | 'sick' | 'unpaid'; startDate: string; endDate: string; remarks?: string }) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await employeeApi.createLeaveRequest(data);
      if (response.success && response.data) {
        setRequests((prev) => [response.data!, ...prev]);
        setShowApplyModal(false);
        setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      } else {
        setError(response.error || 'Failed to submit leave request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <EmployeeLayout>
        <LoadingState message="Loading leave requests..." size="lg" />
      </EmployeeLayout>
    );
  }

  if (!user || user.role !== 'employee') {
    return (
      <EmployeeLayout>
        <ErrorState message="Unauthorized access. Employee role required." />
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Requests</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your leave requests</p>
          </div>
          <Button onClick={() => setShowApplyModal(true)}>
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Apply for Leave
          </Button>
        </div>

        {error && <ErrorState message={error} onRetry={fetchLeaveRequests} className="mb-6" />}

        <LeaveSummary requests={requests} />

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
        </div>

        {viewMode === 'cards' ? (
          <LeaveRequestList requests={requests} loading={loading} />
        ) : (
          <LeaveRequestTable requests={requests} loading={loading} />
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}

        <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for Leave" size="lg">
          <ApplyLeaveForm onSubmit={handleApplyLeave} onClose={() => setShowApplyModal(false)} submitting={submitting} />
        </Modal>
      </div>
    </EmployeeLayout>
  );
}