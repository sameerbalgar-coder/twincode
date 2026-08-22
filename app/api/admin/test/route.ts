import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const session = await requireRole("ADMIN");

  if (!session) {
    const authenticated = await requireRole([
      "EMPLOYEE",
      "HR",
      "ADMIN",
    ]);

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Admin access granted",
    user: {
      id: session.user.id,
      employeeId: session.user.employeeId,
      email: session.user.email,
      role: session.user.role,
    },
  });
}