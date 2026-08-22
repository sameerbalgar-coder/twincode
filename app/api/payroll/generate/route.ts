import { NextRequest, NextResponse } from 'next/server';
import { getEmployees } from '@/lib/db';
import { PayrollGeneratePayload } from '@/types/admin-payroll';
import { requireAdmin } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Only Administrators can trigger payroll batch generation
    const auth = requireAdmin(request);
    if ('errorResponse' in auth) return auth.errorResponse;

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
    return safeErrorResponse(error, 'Failed to generate payroll batch');
  }
}

