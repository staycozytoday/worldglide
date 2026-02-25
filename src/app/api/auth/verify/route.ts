import { NextResponse } from "next/server";
import { verifyMagicLink, createSessionCookie } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/grimoire/login?error=missing-token", request.url));
  }

  const result = verifyMagicLink(token);

  if (!result) {
    return NextResponse.redirect(new URL("/grimoire/login?error=invalid-or-expired", request.url));
  }

  // Create session cookie
  const sessionValue = createSessionCookie(result.email);

  // Redirect to admin with session cookie
  const response = NextResponse.redirect(new URL("/grimoire", request.url));
  response.cookies.set("admin-session", sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });

  return response;
}
