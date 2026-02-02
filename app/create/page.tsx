"use client";

import { useState } from "react";
import { createVehicle } from "@/actions/createVehicle";
import { useRouter } from "next/navigation";

export default function CreatePage() {
    const router = useRouter();
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [emergencyContacts, setEmergencyContacts] = useState<
        { label: string; phone: string }[]
    >([{ label: "Police", phone: "112" }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const validContacts = emergencyContacts.filter(
            (c) => c.label && c.phone
        );

        if (validContacts.length < 1) {
            setError("At least 1 emergency contact is required");
            setLoading(false);
            return;
        }

        try {
            await createVehicle({
                vehicleNumber,
                ownerName,
                contactNumber,
                emergencyContacts: validContacts,
            });
            router.push(`/qr/${vehicleNumber}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create vehicle");
        } finally {
            setLoading(false);
        }
    };

    const addEmergencyContact = () => {
        if (emergencyContacts.length < 10) {
            setEmergencyContacts([...emergencyContacts, { label: "Police", phone: "" }]);
        }
    };

    const removeEmergencyContact = (index: number) => {
        if (emergencyContacts.length > 1) {
            setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
        }
    };

    const updateEmergencyContact = (
        index: number,
        field: "label" | "phone",
        value: string
    ) => {
        const updated = [...emergencyContacts];
        updated[index][field] = value;
        setEmergencyContacts(updated);
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="border border-gray-300 rounded-lg p-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                        Register Vehicle
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="vehicleNumber"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Vehicle Number
                            </label>
                            <input
                                type="text"
                                id="vehicleNumber"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="ownerName"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Owner Name
                            </label>
                            <input
                                type="text"
                                id="ownerName"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contactNumber"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Contact Number
                            </label>
                            <input
                                type="text"
                                id="contactNumber"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Emergency Contacts
                            </label>
                            <div className="space-y-3">
                                {emergencyContacts.map((contact, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row gap-3">
                                        <select
                                            value={contact.label}
                                            onChange={(e) =>
                                                updateEmergencyContact(index, "label", e.target.value)
                                            }
                                            required
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                                        >
                                            <option value="Police">Police</option>
                                            <option value="Ambulance">Ambulance</option>
                                            <option value="Fire">Fire</option>
                                            <option value="Custom">Custom</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                            value={contact.phone}
                                            onChange={(e) =>
                                                updateEmergencyContact(index, "phone", e.target.value)
                                            }
                                            required
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                        {emergencyContacts.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEmergencyContact(index)}
                                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {emergencyContacts.length < 10 && (
                                <button
                                    type="button"
                                    onClick={addEmergencyContact}
                                    className="mt-3 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                >
                                    + Add Emergency Contact
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="border border-red-300 bg-red-50 text-red-800 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Vehicle"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
