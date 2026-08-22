import { NextRequest, NextResponse } from 'next/server';
import { updateLeaveStatus } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
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
    console.error('Error updating leave status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update leave status' },
      { status: 500 }
    );
  }
}

