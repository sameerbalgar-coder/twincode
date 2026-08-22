import { cookies } from "next/headers";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  employeeId?: string;
}

export interface Session {
  user: SessionUser;
  accessToken: string;
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dayflow_session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value) as Session;

    if (session.user && session.accessToken) {
      return session;
    }

    return null;
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser, accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("dayflow_session", JSON.stringify({ user, accessToken }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("dayflow_session");
}