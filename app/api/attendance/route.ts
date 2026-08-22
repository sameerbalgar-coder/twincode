import { NextRequest, NextResponse } from 'next/server';
import { getAttendanceRecords, logAttendance } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId') || undefined;
    const viewMode = (searchParams.get('viewMode') as 'daily' | 'weekly') || undefined;
    const date = searchParams.get('date') || undefined;
    const search = searchParams.get('search') || undefined;
    const department = searchParams.get('department') || undefined;

    const records = await getAttendanceRecords({
      employeeId,
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
    const created = await logAttendance(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error logging attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log attendance' },
      { status: 500 }
    );
  }
}
