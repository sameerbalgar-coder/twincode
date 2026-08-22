import { Department, EmployeeStatus } from './hrms';

export type AttendanceViewMode = 'daily' | 'weekly';

export type AttendanceVisualStatus = 'Present' | 'Absent' | 'Approved Leave' | 'Half-Day' | 'Late' | 'Remote';

export type StatusIndicatorType = 'green' | 'yellow' | 'airplane' | 'half-day';

export interface AttendanceRecordItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  date: string; // ISO date e.g. "2026-08-22" or formatted
  checkIn: string; // e.g. "08:52 AM" or "--"
  checkOut: string; // e.g. "05:30 PM" or "--"
  workHours: string; // e.g. "8h 38m"
  extraHours: string; // e.g. "+38m" or "0h"
  status: AttendanceVisualStatus;
  statusIndicator: StatusIndicatorType;
  ipLocation?: string;
  device?: string;
}

export interface AttendanceSummaryStats {
  daysPresent: number;
  leavesCount: number;
  totalWorkingDays: number;
  activeAbsentCount: number;
}

export type LeaveCategory = 'All' | 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leave';

export type LeaveApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface AdminLeaveItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  role: string;
  leaveType: 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leave' | 'Casual Leave' | 'Emergency Leave';
  validityFrom: string; // Start date
  validityTo: string; // End date
  allocationDays: number; // Days count
  remarks: string; // Reason provided by applicant
  attachmentUrl?: string;
  attachmentName?: string;
  status: LeaveApprovalStatus;
  conflictWarning?: string;
  appliedDate: string;
  adminRemarks?: string;
}

export interface LeaveActionPayload {
  adminRemarks?: string;
}

