import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

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

    const leaves = await prisma.leaveRequest.findMany({
      where: {
        employeeId: employee.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error("LEAVE GET ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch leaves" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { type, startDate, endDate, remarks } = body;

    if (!type || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "type, startDate and endDate are required",
        },
        { status: 400 }
      );
    }

    const employee = session.user.employee;

    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Employee profile not found" },
        { status: 403 }
      );
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        remarks: remarks || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Leave request submitted",
        leave,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("LEAVE POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit leave request",
      },
      { status: 500 }
    );
  }
}