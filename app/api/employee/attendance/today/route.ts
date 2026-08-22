import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-auth";
import { getTodayAttendance } from "@/lib/demo-data";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  if (session.user.role !== "employee") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const attendance = getTodayAttendance();
  return NextResponse.json(attendance);
}