'use client';

import { useState } from 'react';
import type { AttendanceRecord, WeeklyAttendance, AttendanceStatus } from '@/lib/types';
import { StatusBadge } from './UIComponents';
import { Skeleton, TableSkeleton } from './UIComponents';
import { Button, Modal } from './StateComponents';

interface TodayAttendanceProps {
  attendance: AttendanceRecord | null;
  loading?: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  checkInLoading: boolean;
  checkOutLoading: boolean;
}

export function TodayAttendance({ attendance, loading, onCheckIn, onCheckOut, checkInLoading, checkOutLoading }: TodayAttendanceProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Attendance</h2>
        <div className="space-y-4">
          <Skeleton variant="rectangular" height="120px" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton variant="rectangular" height="100px" />
            <Skeleton variant="rectangular" height="100px" />
          </div>
        </div>
      </div>
    );
  }

  const hasCheckedIn = !!attendance?.checkIn;
  const hasCheckedOut = !!attendance?.checkOut;
  const isCurrentlyCheckedIn = hasCheckedIn && !hasCheckedOut;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Attendance</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{today}</span>
      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center ${
            isCurrentlyCheckedIn ? 'bg-green-100 dark:bg-green-900/30' : hasCheckedOut ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {isCurrentlyCheckedIn ? (
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ) : hasCheckedOut ? (
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isCurrentlyCheckedIn ? 'Currently Checked In' : hasCheckedOut ? 'Checked Out for the Day' : 'Not Checked In Yet'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {attendance?.status ? `Status: ${attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1).replace('-', ' ')}` : 'No attendance record for today'}
            </p>
          </div>
          {attendance?.status && <StatusBadge status={attendance.status} variant="attendance" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${hasCheckedIn ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Check In</p>
          <p className="font-mono text-2xl font-semibold text-gray-900 dark:text-white">
            {attendance?.checkIn
              ? new Date(`1970-01-01T${attendance.checkIn}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '—'}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${hasCheckedOut ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Check Out</p>
          <p className="font-mono text-2xl font-semibold text-gray-900 dark:text-white">
            {attendance?.checkOut
              ? new Date(`1970-01-01T${attendance.checkOut}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '—'}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {!hasCheckedIn && (
          <Button onClick={onCheckIn} loading={checkInLoading} size="lg" className="flex-1">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Check In
          </Button>
        )}
        {isCurrentlyCheckedIn && (
          <Button onClick={onCheckOut} loading={checkOutLoading} variant="secondary" size="lg" className="flex-1">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Check Out
          </Button>
        )}
        {hasCheckedOut && (
          <Button variant="ghost" disabled size="lg" className="flex-1">
            Day Complete
          </Button>
        )}
      </div>

      {attendance?.notes && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Notes: {attendance.notes}</p>
        </div>
      )}
    </div>
  );
}

interface WeeklyAttendanceProps {
  weeklyData: WeeklyAttendance | null;
  loading?: boolean;
  onWeekChange: (weekStart: string) => void;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeeklyAttendance({ weeklyData, loading, onWeekChange }: WeeklyAttendanceProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(weeklyData?.weekStart || new Date().toISOString().split('T')[0]);

  const handlePrevWeek = () => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() - 7);
    const weekStart = date.toISOString().split('T')[0];
    setCurrentWeekStart(weekStart);
    onWeekChange(weekStart);
  };

  const handleNextWeek = () => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + 7);
    const weekStart = date.toISOString().split('T')[0];
    setCurrentWeekStart(weekStart);
    onWeekChange(weekStart);
  };

  const getWeekEnd = (weekStart: string) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + 6);
    return date.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Attendance</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm" disabled>Next</Button>
          </div>
        </div>
        <TableSkeleton rows={7} columns={5} />
      </div>
    );
  }

  if (!weeklyData || weeklyData.records.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Attendance</h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handlePrevWeek}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Button>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(currentWeekStart).toLocaleDateString()} - {new Date(getWeekEnd(currentWeekStart)).toLocaleDateString()}
            </span>
            <Button variant="ghost" size="sm" onClick={handleNextWeek}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No attendance records for this week</div>
      </div>
    );
  }

  const recordsByDate = new Map(weeklyData.records.map((r) => [r.date, r]));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Attendance</h2>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handlePrevWeek}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Button>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(currentWeekStart).toLocaleDateString()} - {new Date(getWeekEnd(currentWeekStart)).toLocaleDateString()}
          </span>
          <Button variant="ghost" size="sm" onClick={handleNextWeek}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check In</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check Out</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {weekDays.map((date, index) => {
              const record = recordsByDate.get(date);
              const isToday = date === new Date().toISOString().split('T')[0];

              return (
                <tr key={date} className={isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {dayNames[new Date(date).getDay()]}
                    {isToday && <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Today</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">
                    {record?.checkIn
                      ? new Date(`1970-01-01T${record.checkIn}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">
                    {record?.checkOut
                      ? new Date(`1970-01-01T${record.checkOut}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {record ? (
                      <StatusBadge status={record.status} variant="attendance" />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {record?.hoursWorked ? `${record.hoursWorked.toFixed(1)}h` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{weeklyData.summary.present}</p>
          <p className="text-xs text-green-600 dark:text-green-400">Present</p>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{weeklyData.summary.absent}</p>
          <p className="text-xs text-red-600 dark:text-red-400">Absent</p>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{weeklyData.summary.halfDay}</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">Half Day</p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{weeklyData.summary.totalHours.toFixed(1)}h</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">Total Hours</p>
        </div>
      </div>
    </div>
  );
}

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  loading?: boolean;
}

export function AttendanceHistory({ records, loading }: AttendanceHistoryProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance History</h2>
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance History</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No attendance history found</div>
      </div>
    );
  }

  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance History</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check In</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check Out</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {sortedRecords.slice(0, 30).map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {dayNames[new Date(record.date).getDay()]}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">
                  {record.checkIn
                    ? new Date(`1970-01-01T${record.checkIn}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">
                  {record.checkOut
                    ? new Date(`1970-01-01T${record.checkOut}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={record.status} variant="attendance" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {record.hoursWorked ? `${record.hoursWorked.toFixed(1)}h` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CheckInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'checkin' | 'checkout';
  loading: boolean;
}

export function CheckInOutModal({ isOpen, onClose, onConfirm, type, loading }: CheckInOutModalProps) {
  const messages = {
    checkin: 'Are you sure you want to check in now?',
    checkout: 'Are you sure you want to check out now?',
  };

  const titles = {
    checkin: 'Confirm Check In',
    checkout: 'Confirm Check Out',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titles[type]} size="sm">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">{messages[type]}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={type === 'checkin' ? 'primary' : 'secondary'} onClick={onConfirm} loading={loading}>
            {type === 'checkin' ? 'Check In' : 'Check Out'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}