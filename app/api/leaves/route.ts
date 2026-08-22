import { NextRequest, NextResponse } from 'next/server';
import { getLeaveRequests, createLeaveRequest } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const employeeId = searchParams.get('employeeId') || undefined;

    // Permission check: If employee role header is passed, enforce employee scope
    const userRole = request.headers.get('x-user-role');
    const authEmployeeId = request.headers.get('x-employee-id');

    let scopedEmployeeId = employeeId;
    if (userRole === 'employee' && authEmployeeId) {
      scopedEmployeeId = authEmployeeId;
    }

    const leaves = await getLeaveRequests({ status, category, employeeId: scopedEmployeeId });
    return NextResponse.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leave requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, startDate, endDate, leaveType, reason } = body;

    if (!employeeId || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { success: false, message: 'Employee ID, start date, end date, and reason are required.' },
        { status: 400 }
      );
    }

    // Permission check
    const userRole = request.headers.get('x-user-role');
    const authEmployeeId = request.headers.get('x-employee-id');
    if (userRole === 'employee' && authEmployeeId && authEmployeeId !== employeeId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: You can only submit leave requests for yourself.' },
        { status: 403 }
      );
    }

    const result = await createLeaveRequest(body);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message, data: result.data }, { status: 201 });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create leave request' },
      { status: 500 }
    );
  }
}
