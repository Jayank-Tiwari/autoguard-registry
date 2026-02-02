import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ vehicleNumber: string }> },
) {
  // Verify admin is authenticated
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { vehicleNumber } = await params;

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicleNumber },
      include: { emergencyContacts: true },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.ownerName,
      contactNumber: vehicle.contactNumber,
      emergencyContacts: vehicle.emergencyContacts.map(
        (c: { label: string; phone: string }) => ({
          label: c.label,
          phone: c.phone,
        }),
      ),
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
