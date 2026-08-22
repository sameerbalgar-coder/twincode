'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { employeeApi } from '@/lib/api';
import type { PayrollRecord, PaginatedResponse } from '@/lib/types';
import { EmployeeLayout } from '@/components/employee/EmployeeLayout';
import { PayrollList, PayrollTable, PayrollDetailModal } from '@/components/employee/PayrollComponents';
import { LoadingState, ErrorState } from '@/components/employee/StateComponents';

export default function EmployeePayrollPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchPayroll();
    }
  }, [user, authLoading, pagination.page]);

  const fetchPayroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeApi.getPayroll({ page: pagination.page, pageSize: pagination.pageSize });
      if (response.success && response.data) {
        setPayrolls(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data!.total,
          totalPages: response.data!.totalPages,
        }));
      } else {
        setError(response.error || 'Failed to load payroll data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (payroll: PayrollRecord) => {
    setSelectedPayroll(payroll);
    setShowDetailModal(true);
  };

  if (authLoading) {
    return (
      <EmployeeLayout>
        <LoadingState message="Loading payroll..." size="lg" />
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View your salary and payroll information (read-only)</p>
        </div>

        {error && <ErrorState message={error} onRetry={fetchPayroll} className="mb-6" />}

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
          <PayrollList payrolls={payrolls} loading={loading} />
        ) : (
          <PayrollTable payrolls={payrolls} loading={loading} />
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

        <PayrollDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPayroll(null);
          }}
          payroll={selectedPayroll}
        />
      </div>
    </EmployeeLayout>
  );
}