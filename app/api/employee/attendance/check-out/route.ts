import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-auth";
import { demoAttendance } from "@/lib/demo-data";
import { AttendanceStatus } from "@/lib/types";

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

  if (existingIndex < 0) {
    return NextResponse.json(
      { error: "No check-in record found for today" },
      { status: 400 }
    );
  }

  const record = demoAttendance[existingIndex];

  if (!record.checkIn) {
    return NextResponse.json(
      { error: "Must check in first" },
      { status: 400 }
    );
  }

  if (record.checkOut) {
    return NextResponse.json(
      { error: "Already checked out today" },
      { status: 400 }
    );
  }

  const checkInTime = new Date(`1970-01-01T${record.checkIn}Z`);
  const checkOutTime = new Date(`1970-01-01T${now}Z`);
  const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

  const updatedStatus: AttendanceStatus = hoursWorked >= 7 ? "present" : hoursWorked >= 3.5 ? "half-day" : "present";

  const updatedRecord = {
    ...record,
    checkOut: now,
    hoursWorked: Math.round(hoursWorked * 10) / 10,
    status: updatedStatus,
  };

  demoAttendance[existingIndex] = updatedRecord;

  return NextResponse.json(updatedRecord);
}