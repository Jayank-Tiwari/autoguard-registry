"use server";

import { compare } from "bcrypt";
import { getAdminByEmail } from "@/lib/db";
import { createSession, setAdminSessionCookie } from "@/lib/auth";

export interface LoginResponse {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    // Get admin from database
    const admin = await getAdminByEmail(email.toLowerCase());

    if (!admin) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Compare password with hash
    const isPasswordValid = await compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session
    const token = await createSession(admin.id, admin.email);

    // Set session cookie
    await setAdminSessionCookie(token);

    return {
      success: true,
      redirectUrl: "/admin/dashboard",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login",
    };
  }
}
