'use client';

import Link from 'next/link';
import type { AttendanceRecord, LeaveRequest, ActivityItem } from '@/lib/types';
import { StatusBadge } from './UIComponents';
import { Skeleton } from './UIComponents';

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, description, href, icon, children, className = '' }: DashboardCardProps) {
  return (
    <Link
      href={href}
      className={`group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          {children && <div className="mt-4">{children}</div>}
        </div>
        <svg
          className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}

interface AttendanceSummaryCardProps {
  attendance: AttendanceRecord | null;
  loading?: boolean;
}

export function AttendanceSummaryCard({ attendance, loading }: AttendanceSummaryCardProps) {
  if (loading) {
    return (
      <DashboardCard
        title="Today's Attendance"
        description="View your check-in and check-out status"
        href="/employee/attendance"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
      >
        <Skeleton variant="text" width="100%" />
      </DashboardCard>
    );
  }

  const hasCheckedIn = !!attendance?.checkIn;
  const hasCheckedOut = !!attendance?.checkOut;
  const isCurrentlyCheckedIn = hasCheckedIn && !hasCheckedOut;

  return (
    <DashboardCard
      title="Today's Attendance"
      description="View your check-in and check-out status"
      href="/employee/attendance"
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            isCurrentlyCheckedIn ? 'bg-green-100 dark:bg-green-900/30' : hasCheckedOut ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {isCurrentlyCheckedIn ? (
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ) : hasCheckedOut ? (
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {isCurrentlyCheckedIn ? 'Checked In' : hasCheckedOut ? 'Checked Out' : 'Not Checked In'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {attendance?.status ? `Status: ${attendance.status}` : 'No attendance record yet'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg ${hasCheckedIn ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">Check In</p>
            <p className="font-mono text-lg font-medium text-gray-900 dark:text-white">
              {attendance?.checkIn ? new Date(`1970-01-01T${attendance.checkIn}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${hasCheckedOut ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">Check Out</p>
            <p className="font-mono text-lg font-medium text-gray-900 dark:text-white">
              {attendance?.checkOut ? new Date(`1970-01-01T${attendance.checkOut}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
            </p>
          </div>
        </div>

        {attendance?.status && (
          <StatusBadge status={attendance.status} variant="attendance" className="w-fit" />
        )}
      </div>
    </DashboardCard>
  );
}

interface LeaveSummaryCardProps {
  leaveRequests: LeaveRequest[];
  loading?: boolean;
}

export function LeaveSummaryCard({ leaveRequests, loading }: LeaveSummaryCardProps) {
  if (loading) {
    return (
      <DashboardCard
        title="Leave Requests"
        description="View and manage your leave requests"
        href="/employee/leave"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        }
      >
        <Skeleton variant="text" width="100%" />
      </DashboardCard>
    );
  }

  const recentRequest = leaveRequests[0];
  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;

  return (
    <DashboardCard
      title="Leave Requests"
      description="View and manage your leave requests"
      href="/employee/leave"
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      }
    >
      <div className="space-y-3">
        {recentRequest ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {recentRequest.leaveType.charAt(0).toUpperCase() + recentRequest.leaveType.slice(1)} Leave
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(recentRequest.startDate).toLocaleDateString()} - {new Date(recentRequest.endDate).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={recentRequest.status} variant="leave" />
            </div>
            {recentRequest.adminComment && (
              <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <span className="font-medium">Admin comment:</span> {recentRequest.adminComment}
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-2">No leave requests yet</p>
        )}

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            {pendingCount} request{pendingCount > 1 ? 's' : ''} pending
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

interface ProfileSummaryCardProps {
  name: string;
  employeeId?: string;
  avatarUrl?: string;
  loading?: boolean;
}

export function ProfileSummaryCard({ name, employeeId, avatarUrl, loading }: ProfileSummaryCardProps) {
  if (loading) {
    return (
      <DashboardCard
        title="Profile"
        description="View and edit your profile information"
        href="/employee/profile"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        }
      >
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width="48px" height="48px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Profile"
      description="View and edit your profile information"
      href="/employee/profile"
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      }
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">{name}</p>
          {employeeId && <p className="text-sm text-gray-500 dark:text-gray-400">Employee ID: {employeeId}</p>}
        </div>
      </div>
    </DashboardCard>
  );
}

interface PayrollSummaryCardProps {
  loading?: boolean;
}

export function PayrollSummaryCard({ loading }: PayrollSummaryCardProps) {
  if (loading) {
    return (
      <DashboardCard
        title="Payroll"
        description="View your salary and payroll information"
        href="/employee/payroll"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 0-2.25 2.25v11.25c0 1.032.704 1.873 1.638 2.148a12.061 12.061 0 0 0 3.493 1.074.04.04 0 0 0 .08 0 12.06 12.06 0 0 0 3.493-1.074A2.244 2.244 0 0 0 18 16.5V3m-14.25 0h14.25" />
          </svg>
        }
      >
        <Skeleton variant="text" width="100%" />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Payroll"
      description="View your salary and payroll information"
      href="/employee/payroll"
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 0-2.25 2.25v11.25c0 1.032.704 1.873 1.638 2.148a12.061 12.061 0 0 0 3.493 1.074.04.04 0 0 0 .08 0 12.06 12.06 0 0 0 3.493-1.074A2.244 2.244 0 0 0 18 16.5V3m-14.25 0h14.25" />
        </svg>
      }
    >
      <div className="text-center py-2">
        <p className="text-gray-500 dark:text-gray-400">Salary information is read-only</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click to view your payroll details</p>
      </div>
    </DashboardCard>
  );
}

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
}

const activityIcons: Record<string, React.ReactNode> = {
  attendance_checkin: (
    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  attendance_checkout: (
    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  leave_submitted: (
    <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 0-2.25 2.25v11.25c0 1.032.704 1.873 1.638 2.148a12.061 12.061 0 0 0 3.493 1.074.04.04 0 0 0 .08 0 12.06 12.06 0 0 0 3.493-1.074A2.244 2.244 0 0 0 18 16.5V3m-14.25 0h14.25" />
    </svg>
  ),
  leave_approved: (
    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  leave_rejected: (
    <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
};

const activityLabels: Record<string, string> = {
  attendance_checkin: 'Checked in',
  attendance_checkout: 'Checked out',
  leave_submitted: 'Leave request submitted',
  leave_approved: 'Leave request approved',
  leave_rejected: 'Leave request rejected',
};

export function RecentActivity({ activities, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton variant="circular" width="40px" height="40px" />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No recent activity</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {activityIcons[activity.type] || activityIcons.leave_submitted}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activityLabels[activity.type] || activity.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
              {activity.metadata && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {JSON.stringify(activity.metadata)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}