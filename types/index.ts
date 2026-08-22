// ============================================================================
// DAYFLOW HRMS — CONSOLIDATED SHARED TYPE DEFINITIONS
// ============================================================================

import {
  UserRole,
  SessionUser,
  SignInRequest,
  SignUpRequest,
  AuthResponse
} from './auth';

import {
  Employee,
  Department,
  EmployeeStatus,
  EmploymentType,
  AttendanceStatus,
  LeaveType,
  LeaveStatus,
  LeaveBalance,
  PersonalData,
  EmergencyContact,
  SalaryBreakdown,
  SalaryStructure,
  DocumentRecord,
  HRMetrics,
  DepartmentStat
} from './hrms';

import {
  AttendanceRecordItem,
  AttendanceSummaryStats,
  AdminLeaveItem,
  LeaveApprovalStatus,
  LeaveCategory
} from './admin-attendance-leave';

import {
  AdminEmployeeCard,
  FullAdminEmployeeProfile,
  PrivateInfoData,
  SecuritySettings,
  CreateEmployeeInput
} from './admin-employee';

import {
  EmployeePayrollRecord,
  SalaryComponentConfig,
  BankAccountDetails,
  PayrollSummaryMetrics,
  PayrollGeneratePayload
} from './admin-payroll';

// ----------------------------------------------------------------------------
// Core Domain Aliases & Common Interfaces
// ----------------------------------------------------------------------------

export type Role = UserRole;
export type User = SessionUser;

export type PayrollRecord = EmployeePayrollRecord;
export type EmployeeProfile = FullAdminEmployeeProfile;

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  workHours: string;
  status: AttendanceStatus;
  ipLocation: string;
  device: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  role: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  appliedDate: string;
  status: LeaveStatus;
  conflictWarning?: string;
  adminRemarks?: string;
}

// ----------------------------------------------------------------------------
// Re-export Modular Types for Clean Barrel Imports
// ----------------------------------------------------------------------------
export * from './auth';
export * from './hrms';
export * from './admin-attendance-leave';
export * from './admin-employee';
export * from './admin-payroll';
export * from './notification';

