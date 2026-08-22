import { NextRequest, NextResponse } from 'next/server';
import { userAccounts, verifyPassword, createSession, getSessionCookieHeader, checkRateLimit } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Rate limit login attempts by IP
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(`login:${clientIp}`, 5, 5 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many failed login attempts. Please try again in 5 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid email and password are required' },
        { status: 400 }
      );
    }

    const account = userAccounts.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!account) {
      // Generic message to prevent email enumeration
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, account.passwordHash, account.salt);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session and set HttpOnly Cookie
    const { session, cookieValue } = createSession(account);
    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${session.name}`,
      user: {
        id: session.userId,
        employeeId: session.employeeId,
        email: session.email,
        name: session.name,
        role: session.role
      }
    });

    response.headers.set('Set-Cookie', getSessionCookieHeader(cookieValue));
    return response;
  } catch (error) {
    return safeErrorResponse(error, 'Login failed due to a server error');
  }
}

