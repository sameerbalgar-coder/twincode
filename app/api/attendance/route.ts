import { NextRequest, NextResponse } from 'next/server';
import { getAttendanceRecords, logAttendance, checkInAttendance, checkOutAttendance } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;
    const { session } = auth;

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId') || undefined;
    const viewMode = (searchParams.get('viewMode') as 'daily' | 'weekly') || undefined;
    const date = searchParams.get('date') || undefined;
    const search = searchParams.get('search') || undefined;
    const department = searchParams.get('department') || undefined;

    let scopedEmployeeId = employeeId;
    if (session.role === 'employee') {
      scopedEmployeeId = session.employeeId; // Employee can only access their own attendance records
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
    return safeErrorResponse(error, 'Failed to fetch attendance records');
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;
    const { session } = auth;

    const body = await request.json();
    const { action, location, device } = body;

    // Enforce target employee identity from session for employees
    let targetEmployeeId = body.employeeId;
    if (session.role === 'employee') {
      targetEmployeeId = session.employeeId; // Prevent recording for others
    }

    if (!targetEmployeeId) {
      return NextResponse.json(
        { success: false, message: 'Employee ID is required.' },
        { status: 400 }
      );
    }

    if (action === 'check-in') {
      const result = await checkInAttendance(targetEmployeeId, location, device);
      if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: result.message, data: result.record, employee: result.employee }, { status: 200 });
    }

    if (action === 'check-out') {
      const result = await checkOutAttendance(targetEmployeeId);
      if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: result.message, data: result.record, employee: result.employee }, { status: 200 });
    }

    // Standard log fallback (restricted to admin)
    if (session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Only administrators can create custom attendance logs directly.' },
        { status: 403 }
      );
    }

    const created = await logAttendance({ ...body, employeeId: targetEmployeeId });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to record attendance');
  }
}
