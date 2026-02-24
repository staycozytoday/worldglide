import { Resend } from "resend";
import crypto from "crypto";

// ============ HELPERS ============

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-secret";
}

function hmacSign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

// ============ MAGIC LINK (stateless) ============

/**
 * Generate a magic link and send it via Resend.
 * The link is self-contained: email + expiry + HMAC signature.
 * No server-side storage needed — works on serverless (Vercel).
 */
export async function sendMagicLink(email: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
    return true; // Silently succeed to prevent email enumeration
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("[Auth] RESEND_API_KEY not set");
    return false;
  }

  // Build stateless token: email:expiry:signature
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
  const payload = `${adminEmail}:${expires}`;
  const signature = hmacSign(payload);
  const token = Buffer.from(`${payload}:${signature}`).toString("base64url");

  // Build magic link URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

  // Send email via Resend
  const resend = new Resend(resendApiKey);
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "worldglide <onboarding@resend.dev>",
      to: adminEmail,
      subject: "worldglide admin login",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 0;">
          <p style="font-size: 14px; color: #666; margin-bottom: 24px;">
            Click below to sign in to worldglide admin:
          </p>
          <a href="${magicLink}"
             style="display: inline-block; background: #000; color: #fff; padding: 12px 24px;
                    text-decoration: none; font-size: 13px; font-weight: 500; border-radius: 6px;">
            Sign in to admin →
          </a>
          <p style="font-size: 11px; color: #999; margin-top: 24px;">
            This link expires in 15 minutes. If you didn't request this, ignore this email.
          </p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("[Auth] Failed to send email:", err);
    return false;
  }
}

/**
 * Verify a stateless magic link token.
 * Decodes base64url → checks expiry → verifies HMAC signature.
 */
export function verifyMagicLink(token: string): { email: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;

    const [email, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);

    // Check expiry
    if (Date.now() > expires) return null;

    // Verify HMAC
    const payload = `${email}:${expiresStr}`;
    const expected = hmacSign(payload);
    if (signature !== expected) return null;

    return { email };
  } catch {
    return null;
  }
}

// ============ SESSION COOKIE ============

/**
 * Create a signed session cookie: email:expiry:signature
 * Valid for 7 days. No database needed.
 */
export function createSessionCookie(email: string): string {
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = `${email}:${expires}`;
  const signature = hmacSign(payload);
  return `${payload}:${signature}`;
}

/**
 * Verify a session cookie's signature and expiry.
 */
export function verifySessionCookie(cookie: string): boolean {
  const parts = cookie.split(":");
  if (parts.length !== 3) return false;

  const [, expiresStr, signature] = parts;
  const expires = parseInt(expiresStr, 10);

  if (Date.now() > expires) return false;

  const payload = `${parts[0]}:${expiresStr}`;
  const expected = hmacSign(payload);
  return signature === expected;
}
