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
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
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
            setSuccess(true);
            setTimeout(() => {
                router.push(`/qr/${vehicleNumber}`);
            }, 500);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                        Register Vehicle
                    </h1>
                    <p className="text-lg text-gray-600">
                        Add your vehicle to the AutoGuard registry and generate a QR code for easy identification
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 sm:px-10 sm:py-10">
                        <h2 className="text-white text-xl font-semibold">Vehicle Information</h2>
                        <p className="text-blue-100 text-sm mt-2">Complete the form below to register your vehicle</p>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="px-8 py-10 sm:px-10 space-y-8">
                        {/* Vehicle Number Field */}
                        <div>
                            <label
                                htmlFor="vehicleNumber"
                                className="block text-sm font-semibold text-gray-800 mb-3"
                            >
                                Vehicle Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="vehicleNumber"
                                    placeholder="e.g., DL 01 AB 1234"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                    required
                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900 font-medium"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Format: State Registration Number</p>
                        </div>

                        {/* Two Column Layout for Owner Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Owner Name Field */}
                            <div>
                                <label
                                    htmlFor="ownerName"
                                    className="block text-sm font-semibold text-gray-800 mb-3"
                                >
                                    Owner Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="ownerName"
                                    placeholder="John Doe"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    required
                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                                />
                            </div>

                            {/* Contact Number Field */}
                            <div>
                                <label
                                    htmlFor="contactNumber"
                                    className="block text-sm font-semibold text-gray-800 mb-3"
                                >
                                    Contact Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    placeholder="+91 98765 43210"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Emergency Contacts Section */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Emergency Contacts <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {emergencyContacts.length}/10
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 mb-4">Add emergency contacts that will be displayed on the vehicle QR code</p>

                                <div className="space-y-3">
                                    {emergencyContacts.map((contact, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                            <select
                                                value={contact.label}
                                                onChange={(e) =>
                                                    updateEmergencyContact(index, "label", e.target.value)
                                                }
                                                required
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                            >
                                                <option value="">Select Contact Type</option>
                                                <option value="Police">Police</option>
                                                <option value="Ambulance">Ambulance</option>
                                                <option value="Fire">Fire</option>
                                                <option value="Custom">Custom</option>
                                            </select>
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                value={contact.phone}
                                                onChange={(e) =>
                                                    updateEmergencyContact(index, "phone", e.target.value)
                                                }
                                                required
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                            />
                                            {emergencyContacts.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeEmergencyContact(index)}
                                                    className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm sm:text-base"
                                                >
                                                    <span className="hidden sm:inline">Remove</span>
                                                    <span className="sm:hidden">✕</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {emergencyContacts.length < 10 && (
                                    <button
                                        type="button"
                                        onClick={addEmergencyContact}
                                        className="mt-4 w-full px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                                    >
                                        + Add Emergency Contact
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-green-800">Vehicle registered successfully! Redirecting...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base sm:text-lg shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Register Vehicle
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Info Card */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 What happens next?</h3>
                    <p className="text-sm text-blue-800">After registration, you&apos;ll receive a unique QR code that can be placed on your vehicle. This QR code will display your vehicle information and emergency contacts when scanned.</p>
                </div>
            </div>
        </div>
    );
}
