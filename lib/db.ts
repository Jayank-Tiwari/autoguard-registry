import { prisma } from "./prisma";

/**
 * Get admin by email from database
 */
export async function getAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
  });
}
