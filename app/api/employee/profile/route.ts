import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-auth";
import { demoEmployee } from "@/lib/demo-data";

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

  return NextResponse.json(demoEmployee);
}

export async function PATCH(request: Request) {
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

  try {
    const body = await request.json();
    const { phone, address, avatarUrl } = body;

    const updatedEmployee = {
      ...demoEmployee,
      personalDetails: {
        ...demoEmployee.personalDetails,
        phone: phone ?? demoEmployee.personalDetails.phone,
        address: address ?? demoEmployee.personalDetails.address,
      },
      avatarUrl: avatarUrl ?? demoEmployee.avatarUrl,
    };

    return NextResponse.json(updatedEmployee);
  } catch {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}