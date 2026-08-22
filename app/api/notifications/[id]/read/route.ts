import { NextRequest, NextResponse } from 'next/server';
import { markNotificationAsRead } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const success = await markNotificationAsRead(id, user.employeeId || user.id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: `Notification ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Notification ${id} marked as read.`
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update notification status.' },
      { status: 500 }
    );
  }
}

