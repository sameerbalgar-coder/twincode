import { Department } from './hrms';

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'Savings' | 'Current' | 'Salary';
}

export interface SalaryComponentConfig {
  monthlyBaseWage: number;
  annualCTC: number;
  basic: number;
  hra: number;
  allowances: number;
  pfDeduction: number;
  taxDeduction: number;
  healthInsurance?: number;
  grossSalary: number;
  totalDeductions: number;
  netTakeHome: number;
  bankDetails?: BankAccountDetails;
}

export interface EmployeePayrollRecord {
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  role: string;
  baseWage: number;
  annualCTC: number;
  totalWorkingDays: number;
  payableDays: number;
  unpaidAbsenceDays: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  salaryStructure: SalaryComponentConfig;
  payrollStatus: 'Processed' | 'Pending' | 'On Hold';
  paymentDate?: string;
}

export interface PayrollSummaryMetrics {
  totalMonthlyOutflow: number;
  totalDeductions: number;
  averageNetPay: number;
  processedCount: number;
  totalEmployees: number;
  payrollCycle: string; // e.g. "August 2026"
}

export interface PayrollGeneratePayload {
  cycle: string;
  disbursementDate?: string;
  adminRemarks?: string;
}

