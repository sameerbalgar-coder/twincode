import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-auth";
import { getWeeklyAttendance } from "@/lib/demo-data";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const weekStart = searchParams.get("weekStart");

  if (!weekStart) {
    return NextResponse.json(
      { error: "weekStart parameter is required" },
      { status: 400 }
    );
  }

  const weeklyData = getWeeklyAttendance(weekStart);
  return NextResponse.json(weeklyData);
}