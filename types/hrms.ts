export type EmployeeStatus = 'Active' | 'On Leave' | 'Remote' | 'Probation' | 'Terminated';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern' | 'Full-Time Regular';

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
  | 'Background Verification'
  | 'Contract'
  | 'Identity'
  | 'Tax'
  | 'Education'
  | 'Certificates';

export type DocumentStatus = 'Verified' | 'Pending Review' | 'Rejected' | 'Required';

export interface DocumentRecord {
  id: string;
  name?: string;
  title?: string;
  type?: DocumentType;
  category?: DocumentType;
  fileName?: string;
  fileSize: string;
  uploadDate: string;
  fileUrl?: string;
  status: DocumentStatus;
}

export type EmployeeDocument = DocumentRecord;

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface PersonalData {
  dateOfBirth?: string;
  dob?: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  nationality: string;
  residentialAddress?: string;
  emergencyContact: EmergencyContact;
}

export type PersonalDetails = PersonalData;

export interface SalaryBreakdown {
  basicPay?: number | string;
  hra?: number | string;
  specialAllowance?: number | string;
  performanceBonus?: number | string;
  providentFundOr401k?: number | string;
  pfDeductions?: string;
  taxDeduction?: number | string;
  taxDeductions?: string;
  healthInsuranceDeduction?: number | string;
  netMonthlySalary?: number | string;
  netMonthlyPay?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber?: string;
  accountNumberMasked?: string;
  routingOrIfsc?: string;
  ifscCode?: string;
  accountType?: 'Checking' | 'Savings';
}

export interface SalaryStructure {
  annualBaseSalary?: number;
  annualCtc?: string;
  currency: string;
  basicSalary?: string;
  hra?: string;
  specialAllowance?: string;
  performanceBonus?: string;
  pfDeductions?: string;
  taxDeductions?: string;
  netMonthlyPay?: string;
  bankName?: string;
  accountNumberMasked?: string;
  ifscCode?: string;
  payFrequency?: 'Monthly' | 'Bi-Weekly' | 'Annual';
  paymentFrequency?: 'Monthly' | 'Bi-Weekly';
  breakdown?: SalaryBreakdown;
  bankDetails?: BankDetails;
}

export interface JobDetails {
  employeeId: string;
  designation: string;
  department: Department;
  reportingManager: string;
  employmentType: 'Full-Time Regular' | 'Contract' | 'Internship' | 'Part-Time' | string;
  workLocation: string;
  joiningDate: string;
  probationStatus: 'Confirmed' | 'In Probation' | 'Under Review';
  workEmail: string;
  workPhone?: string;
  slackHandle?: string;
}

export interface ActivityItem {
  id: string;
  type: 'attendance' | 'leave' | 'payroll' | 'profile' | 'system' | 'security';
  title: string;
  description: string;
  timestamp: string;
  iconType?: string;
  status?: 'success' | 'info' | 'warning';
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: 'urgent' | 'warning' | 'info' | 'notice';
  date: string;
  actionLabel?: string;
  actionUrl?: string;
  dismissible?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: Department;
  employmentType?: EmploymentType;
  status: EmployeeStatus;
  joinDate: string;
  salary: string;
  phone: string;
  location: string;
  address?: string;
  leaveBalance: LeaveBalance;
  attendanceToday: {
    checkIn?: string;
    checkOut?: string;
    status: AttendanceStatus;
  };
  directReportsCount: number;
  managerName?: string;
  skills: string[];
  
  // Full Dossier Extensions
  personalData?: PersonalData;
  personalDetails?: PersonalData;
  jobDetails?: JobDetails;
  salaryStructure?: SalaryStructure;
  documents?: DocumentRecord[];
  activities?: ActivityItem[];
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
