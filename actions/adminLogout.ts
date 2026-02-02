"use server";

import { clearAdminSessionCookie } from "@/lib/auth";

export async function adminLogout() {
  await clearAdminSessionCookie();
  return { success: true };
}
