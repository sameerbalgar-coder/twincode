'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { employeeApi } from '@/lib/api';
import type { AttendanceRecord, WeeklyAttendance } from '@/lib/types';
import { EmployeeLayout } from '@/components/employee/EmployeeLayout';
import { TodayAttendance, WeeklyAttendance as WeeklyAttendanceCard, AttendanceHistory, CheckInOutModal } from '@/components/employee/AttendanceComponents';
import { LoadingState, ErrorState } from '@/components/employee/StateComponents';

export default function EmployeeAttendancePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [weeklyAttendance, setWeeklyAttendance] = useState<WeeklyAttendance | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    return date.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAllData();
    }
  }, [user, authLoading, currentWeekStart]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayRes, weeklyRes, historyRes] = await Promise.all([
        employeeApi.getTodayAttendance(),
        employeeApi.getWeeklyAttendance(currentWeekStart),
        employeeApi.getAttendance(),
      ]);

      if (todayRes.success) setTodayAttendance(todayRes.data);
      if (weeklyRes.success) setWeeklyAttendance(weeklyRes.data);
      if (historyRes.success) setHistory(historyRes.data || []);
      if (!todayRes.success || !weeklyRes.success || !historyRes.success) {
        setError(todayRes.error || weeklyRes.error || historyRes.error || 'Failed to load attendance data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleWeekChange = (weekStart: string) => {
    setCurrentWeekStart(weekStart);
  };

  const handleCheckIn = async () => {
    setShowCheckInModal(false);
    setCheckInLoading(true);
    try {
      const response = await employeeApi.checkIn();
      if (response.success && response.data) {
        setTodayAttendance(response.data);
        await fetchAllData();
      } else {
        setError(response.error || 'Check in failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check in failed');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setShowCheckOutModal(false);
    setCheckOutLoading(true);
    try {
      const response = await employeeApi.checkOut();
      if (response.success && response.data) {
        setTodayAttendance(response.data);
        await fetchAllData();
      } else {
        setError(response.error || 'Check out failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check out failed');
    } finally {
      setCheckOutLoading(false);
    }
  };

  if (authLoading) {
    return (
      <EmployeeLayout>
        <LoadingState message="Loading attendance..." size="lg" />
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your daily and weekly attendance</p>
        </div>

        {error && <ErrorState message={error} onRetry={fetchAllData} className="mb-6" />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodayAttendance
            attendance={todayAttendance}
            loading={loading}
            onCheckIn={() => setShowCheckInModal(true)}
            onCheckOut={() => setShowCheckOutModal(true)}
            checkInLoading={checkInLoading}
            checkOutLoading={checkOutLoading}
          />
          <WeeklyAttendanceCard
            weeklyData={weeklyAttendance}
            loading={loading}
            onWeekChange={handleWeekChange}
          />
        </div>

        <AttendanceHistory records={history} loading={loading} />

        <CheckInOutModal
          isOpen={showCheckInModal}
          onClose={() => setShowCheckInModal(false)}
          onConfirm={handleCheckIn}
          type="checkin"
          loading={checkInLoading}
        />

        <CheckInOutModal
          isOpen={showCheckOutModal}
          onClose={() => setShowCheckOutModal(false)}
          onConfirm={handleCheckOut}
          type="checkout"
          loading={checkOutLoading}
        />
      </div>
    </EmployeeLayout>
  );
}