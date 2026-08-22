import { NextResponse } from 'next/server';
import { AuthResponse } from '@/types/auth';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Successfully logged out.',
      } satisfies AuthResponse,
      { status: 200 }
    );

    // Clear session cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Error in /api/auth/logout:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during logout.',
      } satisfies AuthResponse,
      { status: 500 }
    );
  }
}

