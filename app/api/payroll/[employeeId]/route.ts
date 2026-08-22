import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeById, updateEmployee } from '@/lib/db';
import { calculateSalaryBreakdown, validateSalaryStructure } from '@/lib/admin/payroll-helpers';
import { SalaryComponentConfig } from '@/types/admin-payroll';
import { getAuthenticatedUser } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ employeeId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = getAuthenticatedUser(request);

    // 1. Authentication Enforcement
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in to view payroll information.' },
        { status: 401 }
      );
    }

    const { employeeId } = await context.params;
    const cleanParamId = employeeId.trim().toUpperCase();

    // 2. Authorization / Security Enforcement (Employee can see ONLY their own payroll)
    if (user.role === 'EMPLOYEE') {
      const userEmpId = (user.employeeId || '').toUpperCase();
      const userId = (user.id || '').toUpperCase();

      if (cleanParamId !== userEmpId && cleanParamId !== userId) {
        return NextResponse.json(
          { success: false, message: 'Forbidden. You are only authorized to view your own salary and payroll details.' },
          { status: 403 }
        );
      }
    }

    // 3. Database Lookup
    const employee = await getEmployeeById(employeeId);

    if (!employee) {
      return NextResponse.json(
        { success: false, message: `Employee record with ID ${employeeId} not found in database.` },
        { status: 404 }
      );
    }

    // If salary structure doesn't exist or is empty, return null structure
    if (!employee.salaryStructure && !employee.salary) {
      return NextResponse.json({
        success: true,
        data: {
          employeeId: employee.id,
          employeeName: employee.name,
          salaryStructure: null
        }
      });
    }

    const baseWage = employee.salaryStructure?.annualBaseSalary 
      ? Math.round(employee.salaryStructure.annualBaseSalary / 12) 
      : 120000;

    const salaryStructure = calculateSalaryBreakdown(baseWage, {
      basic: employee.salaryStructure?.breakdown.basicPay,
      hra: employee.salaryStructure?.breakdown.hra,
      allowances: employee.salaryStructure?.breakdown.specialAllowance,
      pfDeduction: employee.salaryStructure?.breakdown.providentFundOr401k,
      taxDeduction: employee.salaryStructure?.breakdown.taxDeduction,
      healthInsurance: employee.salaryStructure?.breakdown.healthInsuranceDeduction,
      bankDetails: employee.salaryStructure?.bankDetails ? {
        bankName: employee.salaryStructure.bankDetails.bankName,
        accountNumber: employee.salaryStructure.bankDetails.accountNumber,
        ifscCode: employee.salaryStructure.bankDetails.routingOrIfsc,
        accountType: employee.salaryStructure.bankDetails.accountType as any
      } : undefined
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
    console.error('Error fetching employee salary structure:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch salary structure.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = getAuthenticatedUser(request);

    // 1. Authentication Enforcement
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // 2. Authorization / Security Enforcement (Employee cannot edit payroll)
    if (user.role !== 'ADMIN' && user.role !== 'HR') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Employees are not permitted to modify salary configurations.' },
        { status: 403 }
      );
    }

    const { employeeId } = await context.params;
    const body = await request.json() as SalaryComponentConfig;

    // 3. Validate Monetary Inputs (reject negative / invalid values)
    const validation = validateSalaryStructure(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.errors.join(' ') },
        { status: 400 }
      );
    }

    const calculated = calculateSalaryBreakdown(body.monthlyBaseWage, body);

    // 4. Persist to existing Employee DB store
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
        { success: false, message: `Employee with ID ${employeeId} not found in database.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Salary structure for ${updated.name} updated and persisted successfully.`,
      data: calculated
    });
  } catch (error) {
    console.error('Error updating salary structure:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update salary structure.' },
      { status: 500 }
    );
  }
}
