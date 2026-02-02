"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleVehicleStatus(vehicleId: number) {
  // Verify admin is authenticated
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Get current vehicle status
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { isDisabled: true },
    });

    if (!vehicle) {
      return { success: false, error: "Vehicle not found" };
    }

    // Toggle the status
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { isDisabled: !vehicle.isDisabled },
    });

    // Revalidate the dashboard page to show updated data
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error toggling vehicle status:", error);
    return { success: false, error: "Failed to update vehicle status" };
  }
}
