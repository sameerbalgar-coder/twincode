import { NextRequest, NextResponse } from 'next/server';
import { userAccounts, createUserAccount, checkRateLimit } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(`signup:${clientIp}`, 10, 5 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { employeeId, email, password, role = 'employee', name } = body;

    // Validate fields
    if (!employeeId || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Employee ID, work email, and password are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid work email address.' },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 8 chars)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters in length.' },
        { status: 400 }
      );
    }

    // Check for duplicate email or employee ID
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedEmpId = employeeId.trim().toUpperCase();

    const existingEmail = userAccounts.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'An account with this work email address already exists.' },
        { status: 409 }
      );
    }

    const existingEmpId = userAccounts.find(u => u.employeeId.toUpperCase() === normalizedEmpId);
    if (existingEmpId) {
      return NextResponse.json(
        { success: false, message: 'An account with this Employee ID is already registered.' },
        { status: 409 }
      );
    }

    const userRole = role.toLowerCase().includes('admin') || role.toLowerCase().includes('hr') ? 'admin' : 'employee';

    const account = createUserAccount({
      employeeId: normalizedEmpId,
      email: normalizedEmail,
      password,
      role: userRole,
      name: name || (userRole === 'admin' ? 'HR Administrator' : 'Staff Member')
    });

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully. Verification email sent. Please verify your email before logging in.',
      data: {
        id: account.id,
        employeeId: account.employeeId,
        email: account.email,
        name: account.name,
        role: account.role
      }
    });
  } catch (error) {
    return safeErrorResponse(error, 'Registration failed due to a server error.');
  }
}

