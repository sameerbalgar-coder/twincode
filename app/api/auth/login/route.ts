import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/server-auth";
import { demoEmployee } from "@/lib/demo-data";

const DEMO_CREDENTIALS = {
  email: "employee@dayflow.com",
  password: "password123",
  user: {
    id: "user-001",
    email: "employee@dayflow.com",
    name: "John Doe",
    role: "employee",
    employeeId: "EMP-001",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const accessToken = "demo-token-" + Date.now();
    await createSession(DEMO_CREDENTIALS.user, accessToken);

    return NextResponse.json({
      user: DEMO_CREDENTIALS.user,
      token: accessToken,
    });
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}