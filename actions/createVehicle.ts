"use server";

import { prisma } from "@/lib/prisma";

export async function createVehicle(data: {
  vehicleNumber: string;
  ownerName: string;
  contactNumber: string;
  emergencyContacts: { label: string; phone: string }[];
}) {
  if (data.emergencyContacts.length < 1 || data.emergencyContacts.length > 10) {
    throw new Error("Emergency contacts must be between 1 and 10");
  }

  await prisma.vehicle.create({
    data: {
      vehicleNumber: data.vehicleNumber,
      ownerName: data.ownerName,
      contactNumber: data.contactNumber,
      emergencyContacts: {
        create: data.emergencyContacts,
      },
    },
  });
}
