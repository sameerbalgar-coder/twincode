import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createUser } from "@/services/user.service";
import { validateCreateUserInput } from "@/validations/user.validation";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        employeeId: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,

        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            position: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateCreateUserInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        {
          status: 400,
        }
      );
    }

    const user = await createUser(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
          },
          {
            status: 409,
          }
        );
      }

      if (error.message === "EMPLOYEE_ID_ALREADY_EXISTS") {
        return NextResponse.json(
          {
            success: false,
            message: "Employee ID already exists",
          },
          {
            status: 409,
          }
        );
      }
    }

    console.error("POST USERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create employee",
      },
      {
        status: 500,
      }
    );
  }
}