import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, createEmployee } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { sanitizeAdminEmployeePayload, safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;

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
    return safeErrorResponse(error, 'Failed to fetch employees');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only Administrators can add new employees
    const auth = requireAdmin(request);
    if ('errorResponse' in auth) return auth.errorResponse;

    const body = await request.json();
    if (!body.name || !body.email || typeof body.name !== 'string' || typeof body.email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid employee name and email are required' },
        { status: 400 }
      );
    }

    const sanitized = sanitizeAdminEmployeePayload(body);
    const created = await createEmployee(sanitized as any);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to create employee');
  }
}

