import { NextRequest, NextResponse } from 'next/server';
import { markAllNotificationsAsRead } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const count = await markAllNotificationsAsRead({
      employeeId: user.employeeId,
      userId: user.id,
      role: user.role
    });

    return NextResponse.json({
      success: true,
      message: `All notifications marked as read (${count} updated).`,
      count
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark notifications as read.' },
      { status: 500 }
    );
  }
}

