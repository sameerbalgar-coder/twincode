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

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: today(),
        },
      },
    });

    if (!attendance) {
      return NextResponse.json(
        {
          success: false,
          message: "You have not checked in today",
        },
        { status: 400 }
      );
    }

    if (attendance.checkOut) {
      return NextResponse.json(
        {
          success: false,
          message: "Already checked out",
        },
        { status: 409 }
      );
    }

    const updated = await prisma.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        checkOut: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Checked out successfully",
      attendance: updated,
    });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check out",
      },
      { status: 500 }
    );
  }
}