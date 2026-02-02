"use server";

import { prisma } from "@/lib/prisma";

export async function updateVehicle(data: {
  vehicleNumber: string;
  contactNumber: string;
  ownerName: string;
  newContactNumber: string;
  emergencyContacts: { label: string; phone: string }[];
}) {
  if (data.emergencyContacts.length < 1 || data.emergencyContacts.length > 10) {
    throw new Error("Emergency contacts must be between 1 and 10");
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { vehicleNumber: data.vehicleNumber },
  });

  if (!vehicle || vehicle.contactNumber !== data.contactNumber) {
    throw new Error("Vehicle not found or contact number does not match");
  }

  await prisma.vehicle.update({
    where: { vehicleNumber: data.vehicleNumber },
    data: {
      ownerName: data.ownerName,
      contactNumber: data.newContactNumber,
      emergencyContacts: {
        deleteMany: {},
        create: data.emergencyContacts,
      },
    },
  });
}
