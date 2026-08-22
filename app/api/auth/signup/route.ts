import { NextRequest, NextResponse } from 'next/server';
import { SignUpRequest, AuthResponse, SessionUser } from '@/types/auth';
import {
  findUserByEmail,
  findUserByEmployeeId,
  hashPassword,
  createUserRecord,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body: SignUpRequest = await request.json();
    const { employeeId, email, password, role, name, department } = body;

    // Required fields validation
    if (!employeeId || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: 'Employee ID, work email, password, and role are required.',
        } satisfies AuthResponse,
        { status: 400 }
      );
    }

    const cleanEmployeeId = employeeId.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check for duplicate Employee ID
    const existingEmp = findUserByEmployeeId(cleanEmployeeId);
    if (existingEmp) {
      return NextResponse.json(
        {
          success: false,
          message: `Employee ID "${cleanEmployeeId}" is already registered in the system.`,
        } satisfies AuthResponse,
        { status: 409 }
      );
    }

    // Check for duplicate Email
    const existingEmail = findUserByEmail(cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: `An account with email "${cleanEmail}" already exists.`,
        } satisfies AuthResponse,
        { status: 409 }
      );
    }

    // Enforce Password Security Policy
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 8 characters long.',
        } satisfies AuthResponse,
        { status: 400 }
      );
    }

    // Hash Password with PBKDF2
    const { hash, salt } = hashPassword(password);

    // Derive display name from email or employee ID if not provided
    const derivedName =
      name ||
      cleanEmail
        .split('@')[0]
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

    // Create user record in store
    const newUser = createUserRecord({
      employeeId: cleanEmployeeId,
      name: derivedName,
      email: cleanEmail,
      passwordHash: hash,
      salt,
      role: role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
      department: department || (role === 'ADMIN' ? 'People Operations' : 'Engineering'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isVerified: true, // Configured for immediate sign-in usability; can be toggled to false if email verification pipeline is attached
    });

    const sessionUser: SessionUser = {
      id: newUser.id,
      employeeId: newUser.employeeId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      avatar: newUser.avatar,
      isVerified: newUser.isVerified,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Verification email sent. Please verify your email before logging in.',
        user: sessionUser,
      } satisfies AuthResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in /api/auth/signup:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process registration request.',
      } satisfies AuthResponse,
      { status: 500 }
    );
  }
}
