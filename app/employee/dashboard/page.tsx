'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { employeeApi } from '@/lib/api';
import type { DashboardStats, AttendanceRecord, LeaveRequest } from '@/lib/types';
import { EmployeeLayout } from '@/components/employee/EmployeeLayout';
import {
  AttendanceSummaryCard,
  LeaveSummaryCard,
  ProfileSummaryCard,
  PayrollSummaryCard,
  RecentActivity,
} from '@/components/employee/DashboardComponents';
import { LoadingState, ErrorState } from '@/components/employee/StateComponents';

export default function EmployeeDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardStats();
    }
  }, [user, authLoading]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeApi.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to load dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <EmployeeLayout>
        <LoadingState message="Loading dashboard..." size="lg" />
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

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user.name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AttendanceSummaryCard attendance={null} loading />
            <LeaveSummaryCard leaveRequests={[]} loading />
            <ProfileSummaryCard name={user.name} employeeId={user.employeeId} loading />
            <PayrollSummaryCard loading />
          </div>
          <RecentActivity activities={[]} loading />
        </div>
      </EmployeeLayout>
    );
  }

  if (error) {
    return (
      <EmployeeLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user.name}</p>
          </div>
          <ErrorState message={error} onRetry={fetchDashboardStats} />
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AttendanceSummaryCard attendance={stats?.todayAttendance || null} />
          <LeaveSummaryCard leaveRequests={stats?.recentLeaveRequests || []} />
          <ProfileSummaryCard
            name={user.name}
            employeeId={user.employeeId}
            avatarUrl={user.avatarUrl}
          />
          <PayrollSummaryCard />
        </div>

        <RecentActivity activities={stats?.recentActivity || []} />
      </div>
    </EmployeeLayout>
  );
}