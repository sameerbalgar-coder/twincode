import { SalaryComponentConfig } from '@/types/admin-payroll';

/**
 * Format currency in Indian Rupees (INR - ₹) using standard Indian numbering system
 * Example: 145000 -> ₹1,45,000
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Calculates default statutory components from a given Monthly Base Wage
 * Standard Structure:
 * - Basic Pay: 50%
 * - House Rent Allowance (HRA): 25%
 * - Special / Other Allowances: 25%
 * - Provident Fund (PF): 12% of Basic (or 6% of gross)
 * - Tax / TDS: progressive or estimated 10%
 * - Health Insurance / Medical: ₹1,500
 */
export function calculateSalaryBreakdown(
  monthlyWage: number,
  overrides?: Partial<SalaryComponentConfig>
): SalaryComponentConfig {
  const sanitizedMonthly = Math.max(0, monthlyWage || 0);
  const annualCTC = sanitizedMonthly * 12;

  // Defaults
  const defaultBasic = Math.round(sanitizedMonthly * 0.50);
  const defaultHra = Math.round(sanitizedMonthly * 0.25);
  const defaultAllowances = Math.round(sanitizedMonthly * 0.25);
  const defaultPf = Math.round(defaultBasic * 0.12);
  const defaultTax = Math.round(sanitizedMonthly * 0.10);
  const defaultHealthInsurance = 1500;

  const basic = overrides?.basic !== undefined ? Math.max(0, overrides.basic) : defaultBasic;
  const hra = overrides?.hra !== undefined ? Math.max(0, overrides.hra) : defaultHra;
  const allowances = overrides?.allowances !== undefined ? Math.max(0, overrides.allowances) : defaultAllowances;
  const pfDeduction = overrides?.pfDeduction !== undefined ? Math.max(0, overrides.pfDeduction) : defaultPf;
  const taxDeduction = overrides?.taxDeduction !== undefined ? Math.max(0, overrides.taxDeduction) : defaultTax;
  const healthInsurance = overrides?.healthInsurance !== undefined ? Math.max(0, overrides.healthInsurance) : defaultHealthInsurance;

  const grossSalary = basic + hra + allowances;
  const totalDeductions = pfDeduction + taxDeduction + healthInsurance;
  const netTakeHome = Math.max(0, grossSalary - totalDeductions);

  return {
    monthlyBaseWage: sanitizedMonthly,
    annualCTC,
    basic,
    hra,
    allowances,
    pfDeduction,
    taxDeduction,
    healthInsurance,
    grossSalary,
    totalDeductions,
    netTakeHome,
    bankDetails: overrides?.bankDetails || {
      bankName: 'HDFC Bank Ltd.',
      accountNumber: '•••••••• 4892',
      ifscCode: 'HDFC0001234',
      accountType: 'Salary'
    }
  };
}

/**
 * Calculates authoritative payable days derived directly from attendance records
 * Total Working Days - Unapproved Absences - Unpaid Leaves
 */
export function calculatePayableDays(
  totalWorkingDays: number,
  unapprovedAbsences: number = 0,
  unpaidLeaveDays: number = 0
): number {
  const deductions = unapprovedAbsences + unpaidLeaveDays;
  return Math.max(0, Math.min(totalWorkingDays, totalWorkingDays - deductions));
}

/**
 * Calculates pro-rated gross and net pay based on actual attendance payable days
 */
export function calculateProRatedPay(
  grossSalary: number,
  totalDeductions: number,
  totalWorkingDays: number,
  payableDays: number
): { proRatedGross: number; proRatedDeductions: number; netPay: number } {
  if (totalWorkingDays <= 0) {
    return { proRatedGross: grossSalary, proRatedDeductions: totalDeductions, netPay: grossSalary - totalDeductions };
  }

  const factor = Math.min(1, Math.max(0, payableDays / totalWorkingDays));
  const proRatedGross = Math.round(grossSalary * factor);
  // Fixed statutory deductions or pro-rated
  const proRatedDeductions = Math.round(totalDeductions * factor);
  const netPay = Math.max(0, proRatedGross - proRatedDeductions);

  return {
    proRatedGross,
    proRatedDeductions,
    netPay
  };
}

/**
 * Validates salary structure inputs (ensures no negative figures and valid components)
 */
export function validateSalaryStructure(config: Partial<SalaryComponentConfig>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.monthlyBaseWage !== undefined && config.monthlyBaseWage < 0) {
    errors.push('Monthly Base Wage cannot be negative.');
  }
  if (config.basic !== undefined && config.basic < 0) {
    errors.push('Basic pay cannot be negative.');
  }
  if (config.hra !== undefined && config.hra < 0) {
    errors.push('HRA cannot be negative.');
  }
  if (config.allowances !== undefined && config.allowances < 0) {
    errors.push('Special allowances cannot be negative.');
  }
  if (config.pfDeduction !== undefined && config.pfDeduction < 0) {
    errors.push('PF deduction cannot be negative.');
  }
  if (config.taxDeduction !== undefined && config.taxDeduction < 0) {
    errors.push('Tax / TDS deduction cannot be negative.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

