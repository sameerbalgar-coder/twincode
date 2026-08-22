import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-auth";
import { demoAttendance } from "@/lib/demo-data";

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
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  let filtered = demoAttendance;

  if (startDate) {
    filtered = filtered.filter((a) => a.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((a) => a.date <= endDate);
  }

  return NextResponse.json(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
}