import { NextRequest, NextResponse } from 'next/server';
import { getAttendanceReportData } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;
    const { session } = auth;

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const department = searchParams.get('department') || undefined;
    const viewMode = (searchParams.get('viewMode') as 'daily' | 'weekly') || undefined;
    const search = searchParams.get('search') || undefined;

    let scopedEmployeeId = employeeId;
    if (session.role === 'employee') {
      scopedEmployeeId = session.employeeId; // Employee can only access their own attendance report
    }

    const report = await getAttendanceReportData({
      employeeId: scopedEmployeeId,
      dateFrom,
      dateTo,
      department,
      viewMode,
      search
    });

    return NextResponse.json({
      success: true,
      summary: report.summary,
      count: report.records.length,
      data: report.records
    });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to generate attendance report');
  }
}

