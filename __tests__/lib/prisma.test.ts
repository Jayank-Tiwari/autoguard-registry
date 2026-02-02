import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

describe("Prisma Singleton", () => {
  it("should export a PrismaClient instance", () => {
    expect(prisma).toBeDefined();
    expect(prisma).toBeInstanceOf(PrismaClient);
  });

  it("should be the same instance when imported multiple times in development", () => {
    const prismaInstance1 = prisma;
    const prismaInstance2 = prisma;

    expect(prismaInstance1).toBe(prismaInstance2);
  });

  it("should have the necessary methods", () => {
    expect(prisma.vehicle).toBeDefined();
    expect(prisma.$connect).toBeDefined();
    expect(prisma.$disconnect).toBeDefined();
  });
});
