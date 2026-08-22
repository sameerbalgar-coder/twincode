import { NextRequest, NextResponse } from 'next/server';
import { rejectLeaveRequest } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    let adminRemarks: string | undefined;

    try {
      const body = await request.json();
      adminRemarks = body.adminRemarks;
    } catch {
      // Empty body is acceptable
    }

    const updated = await rejectLeaveRequest(id, adminRemarks);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Leave request with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Leave request ${id} rejected`,
      data: updated
    });
  } catch (error) {
    console.error('Error rejecting leave:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reject leave request' },
      { status: 500 }
    );
  }
}

