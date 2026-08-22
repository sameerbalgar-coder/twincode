import { getCurrentSession } from "@/lib/session";
import { Role } from "@/lib/generated/prisma/client";

export async function requireAuth() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return session;
}

export async function requireRole(roles: Role | Role[]) {
  const session = await requireAuth();

  if (!session) {
    return null;
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(session.user.role)) {
    return null;
  }

  return session;
}