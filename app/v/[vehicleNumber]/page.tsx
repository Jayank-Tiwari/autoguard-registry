import { prisma } from "@/lib/prisma";

export default async function VehiclePage({
    params,
}: {
    params: Promise<{ vehicleNumber: string }>;
}) {
    const { vehicleNumber } = await params;

    const vehicle = await prisma.vehicle.findUnique({
        where: { vehicleNumber },
        include: { emergencyContacts: true },
    });

    if (!vehicle || vehicle.isDisabled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Vehicle not available
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="border border-gray-300 rounded-lg p-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                        Vehicle Information
                    </h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Vehicle Number
                            </label>
                            <p className="text-lg text-gray-900">{vehicle.vehicleNumber}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Owner Name
                            </label>
                            <p className="text-lg text-gray-900">{vehicle.ownerName}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Contact Number
                            </label>
                            <p className="text-lg text-gray-900">{vehicle.contactNumber}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Emergency Contacts
                            </label>
                            <div className="space-y-2">
                                {vehicle.emergencyContacts.map((contact: { id: number; label: string; phone: string; vehicleId: number }) => (
                                    <div
                                        key={contact.id}
                                        className="border border-gray-200 rounded p-3"
                                    >
                                        <p className="text-sm font-medium text-gray-700">
                                            {contact.label}
                                        </p>
                                        <p className="text-lg text-gray-900">{contact.phone}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
