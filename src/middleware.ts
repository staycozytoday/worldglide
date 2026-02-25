import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware that protects /grimoire routes with magic link auth.
 *
 * Flow:
 * 1. Visit /grimoire → middleware checks for "admin-session" cookie
 * 2. No valid cookie → redirect to /grimoire/login
 * 3. User enters email → receives magic link via Resend
 * 4. Click link → /api/auth/verify sets session cookie → redirect to /grimoire
 * 5. Session lasts 7 days
 *
 * The /grimoire/login page and /api/auth/* routes are NOT protected.
 * Uses Web Crypto API (compatible with Edge Runtime).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API routes through
  if (
    pathname === "/grimoire/login" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  // In development without ADMIN_EMAIL set, allow access (convenience)
  if (!process.env.ADMIN_EMAIL && process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  // Check session cookie
  const sessionCookie = request.cookies.get("admin-session")?.value;

  if (sessionCookie && (await verifySession(sessionCookie))) {
    return NextResponse.next();
  }

  // No valid session → redirect to login
  const loginUrl = new URL("/grimoire/login", request.url);
  return NextResponse.redirect(loginUrl);
}

/**
 * Verify the session cookie signature and expiry.
 * Cookie format: "email:expiresTimestamp:hmacSignature"
 * Uses Web Crypto API for Edge Runtime compatibility.
 */
async function verifySession(cookie: string): Promise<boolean> {
  try {
    const secret =
      process.env.ADMIN_SESSION_SECRET ||
      process.env.ADMIN_PASSWORD ||
      "dev-secret";

    const parts = cookie.split(":");
    if (parts.length !== 3) return false;

    const [_email, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);

    // Check expiry
    if (isNaN(expires) || Date.now() > expires) return false;

    // Check HMAC signature using Web Crypto API
    const encoder = new TextEncoder();
    const payload = `${_email}:${expiresStr}`;

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return signature === expected;
  } catch {
    return false;
  }
}

// Protect grimoire + admin API, but NOT login page or auth API
export const config = {
  matcher: ["/grimoire/:path*", "/api/admin/:path*"],
};
