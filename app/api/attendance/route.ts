import { NextRequest, NextResponse } from 'next/server';
import { getAttendanceRecords, logAttendance, checkInAttendance, checkOutAttendance } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId') || undefined;
    const viewMode = (searchParams.get('viewMode') as 'daily' | 'weekly') || undefined;
    const date = searchParams.get('date') || undefined;
    const search = searchParams.get('search') || undefined;
    const department = searchParams.get('department') || undefined;

    // Permission enforcement: Check if employee role header is sent
    const userRole = request.headers.get('x-user-role');
    const authEmployeeId = request.headers.get('x-employee-id');

    let scopedEmployeeId = employeeId;
    if (userRole === 'employee' && authEmployeeId) {
      scopedEmployeeId = authEmployeeId; // Employee can only access their own records
    }

    const records = await getAttendanceRecords({
      employeeId: scopedEmployeeId,
      viewMode,
      date,
      search,
      department
    });

    return NextResponse.json({ success: true, count: records.length, data: records });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, employeeId, location, device } = body;

    if (!employeeId) {
      return NextResponse.json(
        { success: false, message: 'Employee ID is required.' },
        { status: 400 }
      );
    }

    // Permission check if employee role
    const userRole = request.headers.get('x-user-role');
    const authEmployeeId = request.headers.get('x-employee-id');
    if (userRole === 'employee' && authEmployeeId && authEmployeeId !== employeeId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: You can only record attendance for your own account.' },
        { status: 403 }
      );
    }

    if (action === 'check-in') {
      const result = await checkInAttendance(employeeId, location, device);
      if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: result.message, data: result.record, employee: result.employee }, { status: 200 });
    }

    if (action === 'check-out') {
      const result = await checkOutAttendance(employeeId);
      if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: result.message, data: result.record, employee: result.employee }, { status: 200 });
    }

    // Standard fallback log
    const created = await logAttendance(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record attendance' },
      { status: 500 }
    );
  }
}
