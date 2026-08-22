import { NextRequest, NextResponse } from 'next/server';
import { getPayrollReportData } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;
    const { session } = auth;

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId') || undefined;
    const department = searchParams.get('department') || undefined;
    const search = searchParams.get('search') || undefined;

    let scopedEmployeeId = employeeId;
    if (session.role === 'employee') {
      scopedEmployeeId = session.employeeId; // Employee can only access their own payroll report
    }

    const report = await getPayrollReportData({
      employeeId: scopedEmployeeId,
      department,
      search
    });

    return NextResponse.json({
      success: true,
      summary: report.summary,
      count: report.records.length,
      data: report.records
    });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to generate payroll report');
  }
}

