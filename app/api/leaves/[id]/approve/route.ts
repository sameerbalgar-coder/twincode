import { NextRequest, NextResponse } from 'next/server';
import { approveLeaveRequest } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // Strictly require Admin role to approve leaves
    const auth = requireAdmin(request);
    if ('errorResponse' in auth) return auth.errorResponse;

    const { id } = await context.params;
    let adminRemarks: string | undefined;

    try {
      const body = await request.json();
      adminRemarks = body.adminRemarks;
    } catch {
      // Empty body is acceptable
    }

    const updated = await approveLeaveRequest(id, adminRemarks);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Leave request with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Leave request ${id} approved successfully and synced with employee attendance & leave balances`,
      data: updated
    });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to approve leave request');
  }
}

