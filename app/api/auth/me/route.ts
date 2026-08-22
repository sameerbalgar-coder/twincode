import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, authenticated: false, message: 'No active session' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      userId: session.userId,
      employeeId: session.employeeId,
      email: session.email,
      name: session.name,
      role: session.role
    }
  });
}

