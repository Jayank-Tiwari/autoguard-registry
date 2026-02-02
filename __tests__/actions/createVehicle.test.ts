import { createVehicle } from "@/actions/createVehicle";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    vehicle: {
      create: jest.fn(),
    },
  },
}));

describe("createVehicle Server Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a vehicle with valid data", async () => {
    const mockData = {
      vehicleNumber: "ABC123",
      ownerName: "John Doe",
      contactNumber: "9876543210",
      emergencyContacts: [{ label: "Police", phone: "112" }],
    };

    (prisma.vehicle.create as jest.Mock).mockResolvedValue({
      id: 1,
      ...mockData,
      isDisabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createVehicle(mockData);

    expect(prisma.vehicle.create).toHaveBeenCalledWith({
      data: {
        vehicleNumber: "ABC123",
        ownerName: "John Doe",
        contactNumber: "9876543210",
        emergencyContacts: {
          create: [{ label: "Police", phone: "112" }],
        },
      },
    });
  });

  it("should throw error if emergency contacts are less than 1", async () => {
    const mockData = {
      vehicleNumber: "ABC123",
      ownerName: "John Doe",
      contactNumber: "9876543210",
      emergencyContacts: [] as { label: string; phone: string }[],
    };

    await expect(createVehicle(mockData)).rejects.toThrow(
      "Emergency contacts must be between 1 and 10",
    );
  });

  it("should throw error if emergency contacts exceed 10", async () => {
    const mockData = {
      vehicleNumber: "ABC123",
      ownerName: "John Doe",
      contactNumber: "9876543210",
      emergencyContacts: Array(11).fill({ label: "Police", phone: "112" }),
    };

    await expect(createVehicle(mockData)).rejects.toThrow(
      "Emergency contacts must be between 1 and 10",
    );
  });

  it("should handle multiple emergency contacts", async () => {
    const mockData = {
      vehicleNumber: "ABC123",
      ownerName: "John Doe",
      contactNumber: "9876543210",
      emergencyContacts: [
        { label: "Police", phone: "112" },
        { label: "Ambulance", phone: "101" },
        { label: "Fire", phone: "101" },
      ],
    };

    (prisma.vehicle.create as jest.Mock).mockResolvedValue({
      id: 1,
      ...mockData,
      isDisabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createVehicle(mockData);

    expect(prisma.vehicle.create).toHaveBeenCalledWith({
      data: {
        vehicleNumber: "ABC123",
        ownerName: "John Doe",
        contactNumber: "9876543210",
        emergencyContacts: {
          create: mockData.emergencyContacts,
        },
      },
    });
  });
});
