import { NextResponse } from "next/server";
import { sendMagicLink } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const sent = await sendMagicLink(email.trim());

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If this email is authorized, a login link has been sent.",
    });
  } catch (err) {
    console.error("[Auth] Send magic link error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
