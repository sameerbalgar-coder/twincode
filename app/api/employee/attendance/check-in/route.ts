import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-auth";
import { demoAttendance } from "@/lib/demo-data";

export async function POST() {
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

  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().slice(0, 5);

  const existingIndex = demoAttendance.findIndex((a) => a.date === today);

  if (existingIndex >= 0 && demoAttendance[existingIndex].checkIn) {
    return NextResponse.json(
      { error: "Already checked in today" },
      { status: 400 }
    );
  }

  const newRecord = {
    id: `att-${Date.now()}`,
    employeeId: "emp-001",
    date: today,
    checkIn: now,
    status: "present" as const,
    hoursWorked: 0,
  };

  if (existingIndex >= 0) {
    demoAttendance[existingIndex] = { ...demoAttendance[existingIndex], ...newRecord };
  } else {
    demoAttendance.push(newRecord);
  }

  return NextResponse.json(demoAttendance.find((a) => a.id === newRecord.id));
}