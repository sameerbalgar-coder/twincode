import { NextRequest, NextResponse } from 'next/server';
import { getPayrollReportData } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId') || undefined;
    const department = searchParams.get('department') || undefined;
    const search = searchParams.get('search') || undefined;

    // Permissions check
    const userRole = request.headers.get('x-user-role');
    const authEmployeeId = request.headers.get('x-employee-id');

    let scopedEmployeeId = employeeId;
    if (userRole === 'employee' && authEmployeeId) {
      scopedEmployeeId = authEmployeeId; // Employee can only access their own payroll report
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
    console.error('Error generating payroll report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate payroll report' },
      { status: 500 }
    );
  }
}

