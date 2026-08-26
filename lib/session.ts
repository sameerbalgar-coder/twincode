import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'dayflow_session';
const SESSION_DURATION_DAYS = 7;

function hashToken(token: string) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  try {
    await prisma.session.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });
  } catch (err) {
    console.warn('Prisma session persistence skipped (in-memory mode active):', err);
  }

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export async function getCurrentSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
      return null;
    }

    const tokenHash = hashToken(token);

    const session = await prisma.session.findUnique({
      where: {
        tokenHash,
      },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            role: true,
            emailVerified: true,
            employee: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function deleteCurrentSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (token) {
      const tokenHash = hashToken(token);

      await prisma.session.deleteMany({
        where: {
          tokenHash,
        },
      });
    }

    cookieStore.delete(SESSION_COOKIE);
  } catch {
    // Fail-safe cleanup
  }
}
