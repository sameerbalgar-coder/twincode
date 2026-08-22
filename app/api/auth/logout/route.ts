import { NextRequest, NextResponse } from 'next/server';
import { destroySession, getClearSessionCookieHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const signedToken = request.cookies.get('dayflow_session')?.value;
  if (signedToken) {
    destroySession(signedToken);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  response.headers.set('Set-Cookie', getClearSessionCookieHeader());
  return response;
}

