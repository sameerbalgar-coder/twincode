import { NextRequest, NextResponse } from 'next/server';
import { getLeaveRequests, createLeaveRequest } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const employeeId = searchParams.get('employeeId') || undefined;

    const leaves = await getLeaveRequests({ status, category, employeeId });
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
    const created = await createLeaveRequest(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create leave request' },
      { status: 500 }
    );
  }
}
