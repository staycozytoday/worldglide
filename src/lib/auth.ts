import { Resend } from "resend";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const TOKENS_FILE = path.join(process.cwd(), "src", "data", "auth-tokens.json");

interface AuthToken {
  token: string;
  email: string;
  expiresAt: string; // ISO date
  used: boolean;
}

interface SessionToken {
  session: string;
  email: string;
  expiresAt: string; // ISO date
}

// ============ TOKEN STORAGE ============

async function getTokens(): Promise<AuthToken[]> {
  try {
    const data = await fs.readFile(TOKENS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveTokens(tokens: AuthToken[]): Promise<void> {
  const dir = path.dirname(TOKENS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf-8");
}

// ============ MAGIC LINK ============

/**
 * Generate a magic link token and send it via Resend.
 * Token is valid for 15 minutes.
 */
export async function sendMagicLink(email: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
    // Don't reveal whether the email is valid or not
    return true; // Silently succeed to prevent email enumeration
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("[Auth] RESEND_API_KEY not set");
    return false;
  }

  // Generate a secure random token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

  // Save token
  const tokens = await getTokens();
  // Clean up expired tokens
  const now = new Date();
  const activeTokens = tokens.filter((t) => new Date(t.expiresAt) > now);
  activeTokens.push({ token, email: adminEmail, expiresAt, used: false });
  await saveTokens(activeTokens);

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
 * Verify a magic link token and return a session token.
 * Each magic link can only be used once.
 */
export async function verifyMagicLink(
  token: string
): Promise<{ session: string; email: string } | null> {
  const tokens = await getTokens();
  const now = new Date();

  const authToken = tokens.find(
    (t) => t.token === token && !t.used && new Date(t.expiresAt) > now
  );

  if (!authToken) return null;

  // Mark as used
  authToken.used = true;
  await saveTokens(tokens);

  // Generate session token (valid for 7 days)
  const session = crypto.randomBytes(32).toString("hex");
  return { session, email: authToken.email };
}

/**
 * Check if a session cookie value is a valid admin session.
 * We use a simple HMAC approach — the session cookie contains
 * "email:timestamp:signature" so we can verify without a database lookup.
 */
export function createSessionCookie(email: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = `${email}:${expires}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${payload}:${signature}`;
}

export function verifySessionCookie(cookie: string): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";
  const parts = cookie.split(":");
  if (parts.length !== 3) return false;

  const [email, expiresStr, signature] = parts;
  const expires = parseInt(expiresStr, 10);

  // Check expiry
  if (Date.now() > expires) return false;

  // Check signature
  const payload = `${email}:${expiresStr}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return signature === expected;
}
