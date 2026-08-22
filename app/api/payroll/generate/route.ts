import { NextRequest, NextResponse } from 'next/server';
import { getEmployees } from '@/lib/db';
import { PayrollGeneratePayload } from '@/types/admin-payroll';

export async function POST(request: NextRequest) {
  try {
    let payload: PayrollGeneratePayload = {
      cycle: 'August 2026',
      disbursementDate: new Date().toISOString().split('T')[0]
    };

    try {
      const body = await request.json();
      payload = { ...payload, ...body };
    } catch {
      // Empty body is acceptable
    }

    const employees = await getEmployees();

    return NextResponse.json({
      success: true,
      message: `Payroll for cycle ${payload.cycle} successfully generated & approved for ${employees.length} employees.`,
      disbursementDate: payload.disbursementDate,
      processedEmployeesCount: employees.length
    });
  } catch (error) {
    console.error('Error generating payroll batch:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate payroll batch' },
      { status: 500 }
    );
  }
}

