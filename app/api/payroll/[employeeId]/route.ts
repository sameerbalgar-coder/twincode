import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeById, updateEmployee } from '@/lib/db';
import { calculateSalaryBreakdown, validateSalaryStructure } from '@/lib/admin/payroll-helpers';
import { SalaryComponentConfig } from '@/types/admin-payroll';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

interface RouteContext {
  params: Promise<{ employeeId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;
    const { session } = auth;

    const { employeeId } = await context.params;

    // IDOR Protection: Employee can only view their own salary structure
    if (session.role === 'employee' && session.employeeId !== employeeId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You cannot inspect another employee\'s compensation record.' },
        { status: 403 }
      );
    }

    const employee = await getEmployeeById(employeeId);

    if (!employee) {
      return NextResponse.json(
        { success: false, message: `Employee with ID ${employeeId} not found` },
        { status: 404 }
      );
    }

    const baseWage = employee.salaryStructure?.annualBaseSalary 
      ? Math.round(employee.salaryStructure.annualBaseSalary / 12) 
      : 120000;

    const breakdown = employee.salaryStructure?.breakdown;
    const salaryStructure = calculateSalaryBreakdown(baseWage, {
      basic: typeof breakdown?.basicPay === 'number' ? breakdown.basicPay : undefined,
      hra: typeof breakdown?.hra === 'number' ? breakdown.hra : undefined,
      allowances: typeof breakdown?.specialAllowance === 'number' ? breakdown.specialAllowance : undefined,
      pfDeduction: typeof breakdown?.providentFundOr401k === 'number' ? breakdown.providentFundOr401k : undefined,
      taxDeduction: typeof breakdown?.taxDeduction === 'number' ? breakdown.taxDeduction : undefined
    });

    return NextResponse.json({
      success: true,
      data: {
        employeeId: employee.id,
        employeeName: employee.name,
        salaryStructure
      }
    });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch salary structure');
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // Only Administrators can modify employee salary structures
    const auth = requireAdmin(request);
    if ('errorResponse' in auth) return auth.errorResponse;

    const { employeeId } = await context.params;
    const body = await request.json() as SalaryComponentConfig;

    // Validate inputs (e.g. no negative figures)
    const validation = validateSalaryStructure(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const calculated = calculateSalaryBreakdown(body.monthlyBaseWage, body);

    // Save to employee record in DB
    const updated = await updateEmployee(employeeId, {
      salary: `₹${calculated.annualCTC.toLocaleString('en-IN')}`,
      salaryStructure: {
        annualBaseSalary: calculated.annualCTC,
        currency: '₹',
        payFrequency: 'Monthly',
        breakdown: {
          basicPay: calculated.basic,
          hra: calculated.hra,
          specialAllowance: calculated.allowances,
          performanceBonus: 0,
          providentFundOr401k: calculated.pfDeduction,
          taxDeduction: calculated.taxDeduction,
          healthInsuranceDeduction: calculated.healthInsurance || 1500,
          netMonthlySalary: calculated.netTakeHome
        },
        bankDetails: calculated.bankDetails ? {
          bankName: calculated.bankDetails.bankName,
          accountNumber: calculated.bankDetails.accountNumber,
          routingOrIfsc: calculated.bankDetails.ifscCode,
          accountType: calculated.bankDetails.accountType as any
        } : {
          bankName: 'HDFC Bank Ltd.',
          accountNumber: '•••••••• 4892',
          routingOrIfsc: 'HDFC0001234',
          accountType: 'Savings'
        }
      }
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Employee with ID ${employeeId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Salary structure for ${updated.name} updated successfully`,
      data: calculated
    });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to update salary structure');
  }
}

