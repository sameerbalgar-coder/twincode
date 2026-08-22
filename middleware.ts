import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SessionUser, UserRole } from './types/auth';

const AUTH_COOKIE_NAME = 'dayflow_session';

// Decode session payload safely in Edge/Node runtime
function getSessionUser(request: NextRequest): SessionUser | null {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    // Convert base64url to standard base64 string
    const base64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    // Verify token expiry
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload.user as SessionUser;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = getSessionUser(request);
  const isAuthenticated = !!user;

  // 1. PUBLIC ASSETS & API BYPASS
  // Allow static assets, images, favicons, and Next.js internal files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isAuthRoute = pathname.startsWith('/auth');
  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/';
  const isEmployeeRoute = pathname.startsWith('/employee');

  // 2. AUTHENTICATED USERS VISITING /auth/* ROUTES
  // Redirect logged-in users away from login/signup to their home dashboards
  if (isAuthRoute && isAuthenticated && user) {
    const role: UserRole = user.role;
    if (role === 'ADMIN' || role === 'HR') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/employee/dashboard', request.url));
    }
  }

  // 3. UNAUTHENTICATED USERS ACCESSING PROTECTED ROUTES
  if ((isAdminRoute || isEmployeeRoute) && !isAuthenticated) {
    // Preserve attempted destination for seamless post-login redirect
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. ROLE-BASED ACCESS CONTROL (RBAC) ENFORCEMENT
  if (isAuthenticated && user) {
    const role: UserRole = user.role;

    // Block standard EMPLOYEE role from accessing /admin/* routes
    if (isAdminRoute && role === 'EMPLOYEE') {
      const deniedUrl = new URL('/employee/dashboard', request.url);
      deniedUrl.searchParams.set('denied', 'admin_restricted');
      return NextResponse.redirect(deniedUrl);
    }

    // Optional: Allow ADMIN/HR to view /employee routes with admin context or redirect
    // (Admins and HR have supervisory access across both views)
  }

  return NextResponse.next();
}

// Route matchers to intercept
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

