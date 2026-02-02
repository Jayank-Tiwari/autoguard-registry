import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-change-in-production",
);

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export interface AdminSession {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Create a JWT token for the admin session
 */
export async function createSession(adminId: number, email: string) {
  const now = new Date();
  const exp = new Date(now.getTime() + COOKIE_MAX_AGE * 1000);

  const token = await new SignJWT({ id: adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode the admin session token
 */
export async function verifySession(
  token: string,
): Promise<AdminSession | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

/**
 * Get the current admin session from cookies
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

/**
 * Set the admin session cookie
 */
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Clear the admin session cookie
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
