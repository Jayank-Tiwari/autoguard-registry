"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function adminUpdateVehicle(data: {
  vehicleNumber: string;
  ownerName: string;
  contactNumber: string;
  emergencyContacts: { label: string; phone: string }[];
}) {
  // Verify admin is authenticated
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (data.emergencyContacts.length < 1 || data.emergencyContacts.length > 10) {
    throw new Error("Emergency contacts must be between 1 and 10");
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { vehicleNumber: data.vehicleNumber },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  await prisma.vehicle.update({
    where: { vehicleNumber: data.vehicleNumber },
    data: {
      ownerName: data.ownerName,
      contactNumber: data.contactNumber,
      emergencyContacts: {
        deleteMany: {},
        create: data.emergencyContacts,
      },
    },
  });

  // Revalidate relevant pages
  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/dashboard/edit/${data.vehicleNumber}`);
  revalidatePath(`/v/${data.vehicleNumber}`);
}
