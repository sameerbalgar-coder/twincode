import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeById, updateEmployee } from '@/lib/db';
import { calculateSalaryBreakdown, validateSalaryStructure } from '@/lib/admin/payroll-helpers';
import { SalaryComponentConfig } from '@/types/admin-payroll';

interface RouteContext {
  params: Promise<{ employeeId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { employeeId } = await context.params;
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

    const salaryStructure = calculateSalaryBreakdown(baseWage, {
      basic: employee.salaryStructure?.breakdown.basicPay,
      hra: employee.salaryStructure?.breakdown.hra,
      allowances: employee.salaryStructure?.breakdown.specialAllowance,
      pfDeduction: employee.salaryStructure?.breakdown.providentFundOr401k,
      taxDeduction: employee.salaryStructure?.breakdown.taxDeduction
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
      { success: false, message: 'Failed to fetch salary structure' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
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
    console.error('Error updating salary structure:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update salary structure' },
      { status: 500 }
    );
  }
}

