export type EmployeeStatus = 'Active' | 'On Leave' | 'Remote' | 'Probation' | 'Terminated';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';

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

export type DocumentType = 
  | 'Offer Letter'
  | 'Identity Proof / Passport'
  | 'Employment Contract'
  | 'Tax Document (W-4 / Form 16)'
  | 'Non-Disclosure Agreement (NDA)'
  | 'Educational Degree'
  | 'Background Verification';

export type DocumentStatus = 'Verified' | 'Pending Review' | 'Rejected';

export interface DocumentRecord {
  id: string;
  name: string;
  type: DocumentType;
  fileSize: string;
  uploadDate: string;
  fileUrl?: string;
  status: DocumentStatus;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface PersonalData {
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  bloodGroup: string;
  nationality: string;
  residentialAddress: string;
  emergencyContact: EmergencyContact;
}

export interface SalaryBreakdown {
  basicPay: number; // e.g. 50% of monthly
  hra: number; // House Rent Allowance (25%)
  specialAllowance: number; // 15%
  performanceBonus: number; // monthly accrual
  providentFundOr401k: number; // deduction
  taxDeduction: number; // deduction
  healthInsuranceDeduction: number; // deduction
  netMonthlySalary: number; // take-home
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  routingOrIfsc: string;
  accountType: 'Checking' | 'Savings';
}

export interface SalaryStructure {
  annualBaseSalary: number;
  currency: string;
  payFrequency: 'Monthly' | 'Bi-Weekly' | 'Annual';
  breakdown: SalaryBreakdown;
  bankDetails: BankDetails;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: Department;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  joinDate: string;
  salary: string; // formatted e.g. "$145,000"
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
  
  // Full Dossier Extensions:
  personalData?: PersonalData;
  salaryStructure?: SalaryStructure;
  documents?: DocumentRecord[];
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
  conflictWarning?: string;
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
  attendanceRate: number;
  newHiresThisMonth: number;
}
