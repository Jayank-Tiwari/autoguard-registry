import { updateVehicle } from "@/actions/updateVehicle";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    vehicle: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("updateVehicle Server Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a vehicle with valid data and matching contact number", async () => {
    const mockVehicle = {
      id: 1,
      vehicleNumber: "ABC123",
      ownerName: "John Doe",
      contactNumber: "9876543210",
      isDisabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle);
    (prisma.vehicle.update as jest.Mock).mockResolvedValue({
      ...mockVehicle,
      ownerName: "Jane Doe",
      contactNumber: "9999999999",
    });

    const updateData = {
      vehicleNumber: "ABC123",
      contactNumber: "9876543210",
      ownerName: "Jane Doe",
      newContactNumber: "9999999999",
      emergencyContacts: [
        { label: "Police", phone: "112" },
        { label: "Ambulance", phone: "101" },
      ],
    };

    await updateVehicle(updateData);

    expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
      where: { vehicleNumber: "ABC123" },
    });

    expect(prisma.vehicle.update).toHaveBeenCalledWith({
      where: { vehicleNumber: "ABC123" },
      data: {
        ownerName: "Jane Doe",
        contactNumber: "9999999999",
        emergencyContacts: {
          deleteMany: {},
          create: updateData.emergencyContacts,
        },
      },
    });
  });

  it("should throw error if vehicle not found", async () => {
    (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(null);

    const updateData = {
      vehicleNumber: "NOTEXIST",
      contactNumber: "9876543210",
      ownerName: "Jane Doe",
      newContactNumber: "9999999999",
      emergencyContacts: [{ label: "Police", phone: "112" }],
    };

    await expect(updateVehicle(updateData)).rejects.toThrow(
      "Vehicle not found or contact number does not match",
    );
  });

  it("should throw error if contact number does not match", async () => {
    const mockVehicle = {
      id: 1,
      vehicleNumber: "ABC123",
      ownerName: "John Doe",
      contactNumber: "9876543210",
      isDisabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle);

    const updateData = {
      vehicleNumber: "ABC123",
      contactNumber: "WRONGNUMBER",
      ownerName: "Jane Doe",
      newContactNumber: "9999999999",
      emergencyContacts: [{ label: "Police", phone: "112" }],
    };

    await expect(updateVehicle(updateData)).rejects.toThrow(
      "Vehicle not found or contact number does not match",
    );
  });

  it("should throw error if emergency contacts are less than 1", async () => {
    const updateData = {
      vehicleNumber: "ABC123",
      contactNumber: "9876543210",
      ownerName: "Jane Doe",
      newContactNumber: "9999999999",
      emergencyContacts: [] as { label: string; phone: string }[],
    };

    await expect(updateVehicle(updateData)).rejects.toThrow(
      "Emergency contacts must be between 1 and 10",
    );
  });

  it("should throw error if emergency contacts exceed 10", async () => {
    const updateData = {
      vehicleNumber: "ABC123",
      contactNumber: "9876543210",
      ownerName: "Jane Doe",
      newContactNumber: "9999999999",
      emergencyContacts: Array(11).fill({ label: "Police", phone: "112" }),
    };

    await expect(updateVehicle(updateData)).rejects.toThrow(
      "Emergency contacts must be between 1 and 10",
    );
  });
});
