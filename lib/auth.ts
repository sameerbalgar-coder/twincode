import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export interface UserSession {
  userId: string;
  employeeId: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  createdAt: number;
  expiresAt: number;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  employeeId: string;
  name: string;
  role: 'admin' | 'employee';
  createdAt: string;
}

// Server Secret for session signature (Server-only, never sent to client)
const SESSION_SECRET = process.env.SESSION_SECRET || 'dayflow-hrms-cryptographic-signing-secret-2026-production';
const SESSION_COOKIE_NAME = 'dayflow_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// In-Memory Active Session Store (token -> UserSession)
const activeSessions = new Map<string, UserSession>();

// In-Memory Rate Limiter (IP/Key -> timestamps[])
const rateLimitMap = new Map<string, number[]>();

/**
 * Hash password with secure scrypt and 16-byte random salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

/**
 * Verify password using timing-safe comparison to prevent timing attacks
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computed = crypto.scryptSync(password, salt, 64);
    const stored = Buffer.from(hash, 'hex');
    if (computed.length !== stored.length) return false;
    return crypto.timingSafeEqual(computed, stored);
  } catch {
    return false;
  }
}

// Initialize Default Secure Accounts (with precomputed scrypt hashes)
const adminCreds = hashPassword('Admin@123456');
const empCreds = hashPassword('Employee@123456');
const pass123 = hashPassword('Password123!');

export const userAccounts: UserAccount[] = [
  {
    id: 'USR-ADMIN-1',
    email: 'admin@dayflow.com',
    passwordHash: adminCreds.hash,
    salt: adminCreds.salt,
    employeeId: 'EMP-1004', // Amara Okafor (HR Admin)
    name: 'Amara Okafor',
    role: 'admin',
    createdAt: '2026-01-01'
  },
  {
    id: 'USR-ADMIN-2',
    email: 'amara.okafor@dayflow.internal',
    passwordHash: pass123.hash,
    salt: pass123.salt,
    employeeId: 'EMP-1004', // Amara Okafor
    name: 'Amara Okafor',
    role: 'admin',
    createdAt: '2026-01-01'
  },
  {
    id: 'USR-HR-1',
    email: 'hr@dayflow.internal',
    passwordHash: pass123.hash,
    salt: pass123.salt,
    employeeId: 'EMP-1004', // Elena Rostova
    name: 'Elena Rostova',
    role: 'admin',
    createdAt: '2026-01-01'
  },
  {
    id: 'USR-EMP-1',
    email: 'sarah.jenkins@dayflow.com',
    passwordHash: empCreds.hash,
    salt: empCreds.salt,
    employeeId: 'EMP-1001', // Sarah Jenkins (Employee)
    name: 'Sarah Jenkins',
    role: 'employee',
    createdAt: '2026-01-01'
  },
  {
    id: 'USR-EMP-2',
    email: 'alex.rivera@dayflow.internal',
    passwordHash: pass123.hash,
    salt: pass123.salt,
    employeeId: 'EMP-1001', // Alex Rivera
    name: 'Alex Rivera',
    role: 'employee',
    createdAt: '2026-01-01'
  }
];

export function createUserAccount(accountData: {
  employeeId: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  name?: string;
}): UserAccount {
  const { hash, salt } = hashPassword(accountData.password);
  const newAccount: UserAccount = {
    id: `USR-${Date.now()}`,
    email: accountData.email.trim().toLowerCase(),
    passwordHash: hash,
    salt,
    employeeId: accountData.employeeId.trim().toUpperCase(),
    name: accountData.name || (accountData.role === 'admin' ? 'HR Admin' : 'Employee Member'),
    role: accountData.role,
    createdAt: new Date().toISOString()
  };
  userAccounts.push(newAccount);
  return newAccount;
}

/**
 * Rate limiter helper: returns false if rate limit is exceeded
 */
export function checkRateLimit(key: string, limit = 5, windowMs = 5 * 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const recent = timestamps.filter(t => now - t < windowMs);

  if (recent.length >= limit) {
    return { allowed: false, remaining: 0 };
  }

  recent.push(now);
  rateLimitMap.set(key, recent);
  return { allowed: true, remaining: limit - recent.length };
}

/**
 * Generate HMAC-SHA256 signature for a session token
 */
function signToken(token: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(token);
  return `${token}.${hmac.digest('hex')}`;
}

/**
 * Verify HMAC-SHA256 signature for a session token
 */
function verifySignedToken(signedToken: string): string | null {
  const parts = signedToken.split('.');
  if (parts.length !== 2) return null;
  const [token, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(token).digest('hex');
  
  try {
    const isMatch = crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSig, 'hex'));
    return isMatch ? token : null;
  } catch {
    return null;
  }
}

/**
 * Create a new cryptographic session for a user
 */
export function createSession(account: { id: string; employeeId: string; email: string; name: string; role: 'admin' | 'employee' }): {
  session: UserSession;
  cookieValue: string;
} {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: UserSession = {
    userId: account.id,
    employeeId: account.employeeId,
    email: account.email,
    name: account.name,
    role: account.role,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS
  };

  activeSessions.set(rawToken, session);
  const cookieValue = signToken(rawToken);
  return { session, cookieValue };
}

/**
 * Destroy a session by cookie value
 */
export function destroySession(signedToken: string): void {
  const token = verifySignedToken(signedToken);
  if (token) {
    activeSessions.delete(token);
  }
}

/**
 * Extract and verify session from request cookies
 */
export function getSession(request: NextRequest): UserSession | null {
  const signedToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!signedToken) return null;

  const rawToken = verifySignedToken(signedToken);
  if (!rawToken) return null;

  const session = activeSessions.get(rawToken);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(rawToken);
    return null;
  }

  return session;
}

/**
 * Enforce authentication: Returns session or 401 Unauthorized response
 */
export function requireAuth(request: NextRequest): { session: UserSession } | { errorResponse: NextResponse } {
  const session = getSession(request);
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      )
    };
  }
  return { session };
}

/**
 * Enforce Admin Role: Returns session or 403 Forbidden response
 */
export function requireAdmin(request: NextRequest): { session: UserSession } | { errorResponse: NextResponse } {
  const auth = requireAuth(request);
  if ('errorResponse' in auth) return auth;

  if (auth.session.role !== 'admin') {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: 'Forbidden: Administrator privileges required.' },
        { status: 403 }
      )
    };
  }
  return auth;
}

export function getAuthenticatedUser(request: NextRequest): UserSession | null {
  return getSession(request);
}

export async function requireRole(roles: string | string[]) {
  const { getCurrentSession } = await import('@/lib/session');
  const session = await getCurrentSession();
  if (!session) return null;

  const allowedRoles = Array.isArray(roles) ? roles.map(r => r.toUpperCase()) : [roles.toUpperCase()];
  const userRole = (session.user.role || '').toUpperCase();

  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  return session;
}

/**
 * Helper to build Set-Cookie header string for session
 */
export function getSessionCookieHeader(cookieValue: string, maxAge = 28800): string {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=${cookieValue}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secureFlag}`;
}

export function getClearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}


