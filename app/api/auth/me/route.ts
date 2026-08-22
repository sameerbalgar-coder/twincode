import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse } from '@/types/auth';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Attempt to read token from HTTP-only cookie first, then Authorization header
    const tokenFromCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. No active session found.',
        } satisfies AuthResponse,
        { status: 401 }
      );
    }

    const sessionUser = verifySessionToken(token);

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Session has expired or is invalid. Please sign in again.',
        } satisfies AuthResponse,
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: sessionUser,
      } satisfies AuthResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while resolving user session.',
      } satisfies AuthResponse,
      { status: 500 }
    );
  }
}

