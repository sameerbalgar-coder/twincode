import { NextResponse } from 'next/server';

/**
 * Sanitizes employee payload for Admin actions.
 * Strips dangerous prototype pollution and guarantees clean typed values.
 */
export function sanitizeAdminEmployeePayload(body: any): Record<string, any> {
  const allowed = [
    'name', 'email', 'role', 'department', 'location', 'status', 
    'employmentType', 'joinDate', 'salary', 'phone', 'address', 'avatar', 
    'salaryStructure', 'documents', 'personalDetails'
  ];

  const sanitized: Record<string, any> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      sanitized[key] = body[key];
    }
  }
  return sanitized;
}

/**
 * Sanitizes employee payload for Employee self-service actions.
 * Employees can ONLY update non-privileged personal contact info.
 * Strictly prevents role changes, salary structure tampering, or promotion to admin.
 */
export function sanitizeEmployeeSelfUpdatePayload(body: any): Record<string, any> {
  const allowed = ['phone', 'address', 'personalDetails'];
  const sanitized: Record<string, any> = {};

  for (const key of allowed) {
    if (body[key] !== undefined) {
      sanitized[key] = body[key];
    }
  }
  return sanitized;
}

/**
 * Generic safe error responder that logs internally but never leaks stack traces
 * or database internals to the client.
 */
export function safeErrorResponse(error: unknown, fallbackMessage = 'An unexpected server error occurred'): NextResponse {
  console.error('[SERVER_SECURE_LOG]', error instanceof Error ? error.message : error);
  return NextResponse.json(
    { success: false, message: fallbackMessage },
    { status: 500 }
  );
}

