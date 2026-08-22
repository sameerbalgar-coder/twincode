import { NextRequest, NextResponse } from 'next/server';
import { getLeaveRequests, createLeaveRequest } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;
    const { session } = auth;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const employeeId = searchParams.get('employeeId') || undefined;

    let scopedEmployeeId = employeeId;
    if (session.role === 'employee') {
      scopedEmployeeId = session.employeeId; // Employee can only see their own leave requests
    }

    const leaves = await getLeaveRequests({ status, category, employeeId: scopedEmployeeId });
    return NextResponse.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch leave requests');
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;
    const { session } = auth;

    const body = await request.json();
    const { startDate, endDate, leaveType, reason } = body;

    // Enforce target employee from session if employee role
    let targetEmployeeId = body.employeeId;
    if (session.role === 'employee') {
      targetEmployeeId = session.employeeId;
    }

    if (!targetEmployeeId || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { success: false, message: 'Employee ID, start date, end date, and reason are required.' },
        { status: 400 }
      );
    }

    const result = await createLeaveRequest({
      employeeId: targetEmployeeId,
      startDate,
      endDate,
      leaveType: leaveType || 'Paid Leave',
      reason
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message, data: result.data }, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to create leave request');
  }
}
