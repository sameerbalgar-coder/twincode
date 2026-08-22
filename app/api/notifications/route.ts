import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, createNotification } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);

    // Enforce Authentication
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in to view notifications.' },
        { status: 401 }
      );
    }

    // Fetch user-scoped notifications (Users can access ONLY their own notifications)
    const notifications = await getNotifications({
      employeeId: user.employeeId,
      userId: user.id,
      role: user.role
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.title || !body.message || !body.type) {
      return NextResponse.json(
        { success: false, message: 'Title, message, and type are required.' },
        { status: 400 }
      );
    }

    const created = await createNotification({
      employeeId: body.employeeId || user.employeeId,
      userId: body.userId || user.id,
      recipientRole: body.recipientRole || (user.role === 'ADMIN' ? 'ALL' : 'ADMIN'),
      title: body.title,
      message: body.message,
      type: body.type,
      isRead: false,
      link: body.link
    });

    return NextResponse.json({
      success: true,
      message: 'Notification created successfully',
      data: created
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

