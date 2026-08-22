import { NextRequest, NextResponse } from 'next/server';
import { SignInRequest, AuthResponse, SessionUser } from '@/types/auth';
import {
  findUserByEmail,
  verifyPassword,
  signSessionToken,
  AUTH_COOKIE_NAME,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body: SignInRequest = await request.json();
    const { email, password, rememberMe } = body;

    // Validate presence of required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Work email and password are required.',
        } satisfies AuthResponse,
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Look up user in store
    const user = findUserByEmail(trimmedEmail);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password.',
        } satisfies AuthResponse,
        { status: 401 }
      );
    }

    // Verify Password Hash
    const isPasswordValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password.',
        } satisfies AuthResponse,
        { status: 401 }
      );
    }

    // Check Account Verification Status
    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Your email address is unverified. Please check your work inbox for the verification link.',
        } satisfies AuthResponse,
        { status: 403 }
      );
    }

    // Construct Session User Context
    const sessionUser: SessionUser = {
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };

    // Calculate expiry & generate signed session token
    const expiresInDays = rememberMe ? 30 : 7;
    const token = signSessionToken(sessionUser, expiresInDays);
    const maxAgeSeconds = expiresInDays * 24 * 60 * 60;

    const redirectUrl =
      user.role === 'ADMIN' || user.role === 'HR'
        ? '/admin/dashboard'
        : '/employee/dashboard';

    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentication successful',
        user: sessionUser,
        token,
        redirectUrl,
      } satisfies AuthResponse,
      { status: 200 }
    );

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeSeconds,
    });

    return response;
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during authentication.',
      } satisfies AuthResponse,
      { status: 500 }
    );
  }
}
