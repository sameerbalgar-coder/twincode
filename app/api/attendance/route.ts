import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

function today() {
  const date = new Date();

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

export async function GET() {
  try {
    const session = await requireAuth();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const employee = session.user.employee;

    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Employee profile not found" },
        { status: 403 }
      );
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("ATTENDANCE GET ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await requireAuth();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const employee = session.user.employee;

    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Employee profile not found" },
        { status: 403 }
      );
    }

    const date = today();

    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Already checked in today",
        },
        { status: 409 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date,
        checkIn: new Date(),
        status: "PRESENT",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Checked in successfully",
        attendance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ATTENDANCE POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check in",
      },
      { status: 500 }
    );
  }
}