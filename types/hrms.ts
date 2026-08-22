export type EmployeeStatus = 'Active' | 'On Leave' | 'Remote' | 'Probation' | 'Terminated';

export type Department = 
  | 'Engineering'
  | 'Product'
  | 'UI/UX Design'
  | 'People Operations'
  | 'Sales & Marketing'
  | 'Finance'
  | 'Customer Success';

export type AttendanceStatus = 'On-Time' | 'Late' | 'Half-Day' | 'Remote' | 'Absent';

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Paid Annual Leave' | 'Maternity/Paternity' | 'Emergency Leave';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveBalance {
  casual: { total: number; used: number };
  sick: { total: number; used: number };
  paid: { total: number; used: number };
  emergency: { total: number; used: number };
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: Department;
  status: EmployeeStatus;
  joinDate: string;
  salary: string;
  phone: string;
  location: string;
  leaveBalance: LeaveBalance;
  attendanceToday: {
    checkIn?: string;
    checkOut?: string;
    status: AttendanceStatus;
  };
  directReportsCount: number;
  managerName?: string;
  skills: string[];
}

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
  conflictWarning?: string; // e.g. "2 other Engineers on leave on these dates"
  adminRemarks?: string;
}

export interface DepartmentStat {
  name: Department;
  totalEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  color: string;
}

export interface HRMetrics {
  totalEmployees: number;
  activeToday: number;
  remoteToday: number;
  onLeaveToday: number;
  lateArrivalsToday: number;
  pendingLeavesCount: number;
  attendanceRate: number; // percentage e.g. 95.4
  newHiresThisMonth: number;
}

