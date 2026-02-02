"use client";

import { useState, useEffect } from "react";
import { adminUpdateVehicle } from "@/actions/adminUpdateVehicle";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EmergencyContact {
    label: string;
    phone: string;
}

interface Vehicle {
    vehicleNumber: string;
    ownerName: string;
    contactNumber: string;
    emergencyContacts: EmergencyContact[];
}

export default function AdminEditVehiclePage({
    params,
}: {
    params: Promise<{ vehicleNumber: string }>;
}) {
    const router = useRouter();
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
        { label: "Police", phone: "112" },
    ]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function loadVehicle() {
            try {
                const resolvedParams = await params;
                setVehicleNumber(resolvedParams.vehicleNumber);

                const response = await fetch(`/api/vehicles/${resolvedParams.vehicleNumber}`);
                if (!response.ok) {
                    throw new Error("Vehicle not found");
                }

                const vehicle: Vehicle = await response.json();
                setOwnerName(vehicle.ownerName);
                setContactNumber(vehicle.contactNumber);
                setEmergencyContacts(
                    vehicle.emergencyContacts.length > 0
                        ? vehicle.emergencyContacts
                        : [{ label: "Police", phone: "112" }]
                );
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load vehicle");
            } finally {
                setLoading(false);
            }
        }

        loadVehicle();
    }, [params]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        const validContacts = emergencyContacts.filter((c) => c.label && c.phone);

        if (validContacts.length < 1) {
            setError("At least 1 emergency contact is required");
            setSaving(false);
            return;
        }

        try {
            await adminUpdateVehicle({
                vehicleNumber,
                ownerName,
                contactNumber,
                emergencyContacts: validContacts,
            });
            setSuccess("Vehicle updated successfully");
            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update vehicle");
        } finally {
            setSaving(false);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-600">Loading vehicle data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/admin/dashboard"
                        className="text-slate-600 hover:text-slate-900 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Edit Vehicle
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Admin editing for {vehicleNumber}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="vehicleNumber"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Vehicle Number
                            </label>
                            <input
                                type="text"
                                id="vehicleNumber"
                                value={vehicleNumber}
                                disabled
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="ownerName"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Owner Name
                            </label>
                            <input
                                type="text"
                                id="ownerName"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contactNumber"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Contact Number
                            </label>
                            <input
                                type="text"
                                id="contactNumber"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Emergency Contacts
                            </label>
                            <div className="space-y-3">
                                {emergencyContacts.map((contact, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row gap-3"
                                    >
                                        <select
                                            value={contact.label}
                                            onChange={(e) =>
                                                updateEmergencyContact(
                                                    index,
                                                    "label",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
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
                                                updateEmergencyContact(
                                                    index,
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                        {emergencyContacts.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEmergencyContact(index)}
                                                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
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
                                    className="mt-3 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                                >
                                    + Add Emergency Contact
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                                {success}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <Link
                                href="/admin/dashboard"
                                className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
