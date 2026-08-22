import { NextRequest, NextResponse } from 'next/server';
import { getAttendanceReportData } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const department = searchParams.get('department') || undefined;
    const viewMode = (searchParams.get('viewMode') as 'daily' | 'weekly') || undefined;
    const search = searchParams.get('search') || undefined;

    // Permissions check
    const userRole = request.headers.get('x-user-role');
    const authEmployeeId = request.headers.get('x-employee-id');

    let scopedEmployeeId = employeeId;
    if (userRole === 'employee' && authEmployeeId) {
      scopedEmployeeId = authEmployeeId; // Employee can only access their own attendance report
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
    console.error('Error generating attendance report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate attendance report' },
      { status: 500 }
    );
  }
}

