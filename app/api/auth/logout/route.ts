import { NextResponse } from "next/server";
import { deleteCurrentSession } from "@/lib/session";

export async function POST() {
  try {
    await deleteCurrentSession();

    return NextResponse.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("LOGOUT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to logout",
      },
      { status: 500 }
    );
  }
}