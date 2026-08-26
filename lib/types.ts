export type UserRole = 'employee' | 'admin' | 'hr';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  employeeId?: string;
}

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  avatarUrl?: string;
  personalDetails: PersonalDetails;
  jobDetails: JobDetails;
  salaryStructure: SalaryStructure;
  documents: Document[];
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface JobDetails {
  department: string;
  position: string;
  employmentType: string;
  joinDate: string;
  managerId?: string;
  managerName?: string;
  workLocation?: string;
  employeeGrade?: string;
}

export interface SalaryStructure {
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  grossSalary: number;
  netSalary: number;
  currency: string;
  payFrequency: string;
}

export interface Allowance {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface Deduction {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  status: 'active' | 'expired' | 'pending';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  hoursWorked?: number;
  notes?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave';

export interface WeeklyAttendance {
  weekStart: string;
  weekEnd: string;
  records: AttendanceRecord[];
  summary: AttendanceSummary;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  halfDay: number;
  leave: number;
  totalHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  remarks?: string;
  status: LeaveStatus;
  adminComment?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type LeaveType = 'paid' | 'sick' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  grossSalary: number;
  netSalary: number;
  currency: string;
  status: 'draft' | 'processed' | 'paid';
  generatedAt: string;
  paidAt?: string;
}

export interface DashboardStats {
  todayAttendance?: AttendanceRecord | null;
  recentLeaveRequests: LeaveRequest[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'attendance_checkin' | 'attendance_checkout' | 'leave_submitted' | 'leave_approved' | 'leave_rejected';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}