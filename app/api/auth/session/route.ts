import { NextRequest, NextResponse } from 'next/server';
import { userAccounts, createSession, getSessionCookieHeader } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetRole = body.role === 'admin' ? 'admin' : 'employee';
    const targetEmployeeId = body.employeeId || (targetRole === 'admin' ? 'EMP-1004' : 'EMP-1001');

    const account = userAccounts.find(u => u.role === targetRole) || {
      id: `USR-${targetRole.toUpperCase()}`,
      email: `${targetRole}@dayflow.com`,
      passwordHash: '',
      salt: '',
      employeeId: targetEmployeeId,
      name: targetRole === 'admin' ? 'Amara Okafor' : 'Sarah Jenkins',
      role: targetRole,
      createdAt: '2026-01-01'
    };

    const { session, cookieValue } = createSession({
      id: account.id,
      employeeId: targetEmployeeId,
      email: account.email,
      name: account.name,
      role: targetRole
    });

    const response = NextResponse.json({
      success: true,
      message: `Active session established for ${session.name} (${session.role})`,
      session: {
        userId: session.userId,
        employeeId: session.employeeId,
        name: session.name,
        role: session.role
      }
    });

    response.headers.set('Set-Cookie', getSessionCookieHeader(cookieValue));
    return response;
  } catch (error) {
    return safeErrorResponse(error, 'Failed to initialize session');
  }
}

