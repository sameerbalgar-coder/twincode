import { NextRequest, NextResponse } from 'next/server';
import { updateLeaveStatus } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // Only Admins can modify leave status
    const auth = requireAdmin(request);
    if ('errorResponse' in auth) return auth.errorResponse;

    const { id } = await context.params;
    const body = await request.json();
    const { status, adminRemarks } = body;

    if (!status || (status !== 'Approved' && status !== 'Rejected')) {
      return NextResponse.json(
        { success: false, message: 'Valid status (Approved | Rejected) is required' },
        { status: 400 }
      );
    }

    const updated = await updateLeaveStatus(id, status, adminRemarks);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Leave request with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to update leave status');
  }
}

