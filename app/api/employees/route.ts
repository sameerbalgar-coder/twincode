import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, createEmployee } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const department = searchParams.get('department') || undefined;
    const status = searchParams.get('status') || undefined;
    const employmentType = searchParams.get('employmentType') || undefined;

    const employees = await getEmployees({
      search,
      department,
      status,
      employmentType
    });

    return NextResponse.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Employee name and email are required' },
        { status: 400 }
      );
    }

    const created = await createEmployee(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

