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
        <div className="h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
            <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
                {/* Header Section */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-xl border-2 border-emerald-200 mb-5">
                        <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <span className="text-sm font-black text-emerald-700">AutoGuard Registration</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                        Register Your Vehicle
                    </h1>
                    <p className="text-base sm:text-lg text-gray-700">
                        Create a scannable emergency QR sticker in under a minute.
                    </p>
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-6">
                    {/* Main Form Card */}
                    <div className="bg-white rounded-[2rem] shadow-2xl border-2 border-gray-100 flex flex-col min-h-0">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 px-6 sm:px-8 py-6">
                            <h2 className="text-white text-lg font-black">Vehicle Information</h2>
                            <p className="text-emerald-100 text-sm mt-1">Complete the form below to register your vehicle</p>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-6 flex-1 min-h-0 overflow-y-auto">
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
                                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900 font-medium"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Format: State Registration Number</p>
                            </div>

                            {/* Two Column Layout for Owner Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
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
                                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Emergency Contacts Section */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Emergency Contacts <span className="text-red-500">*</span>
                                        </label>
                                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                                            {emergencyContacts.length}/10
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-3">Add contacts that will appear on the QR page</p>

                                    <div className="space-y-3">
                                        {emergencyContacts.map((contact, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                                                <select
                                                    value={contact.label}
                                                    onChange={(e) =>
                                                        updateEmergencyContact(index, "label", e.target.value)
                                                    }
                                                    required
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 font-medium"
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
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                                            className="mt-3 w-full px-4 py-3 border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-semibold"
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
                                <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-semibold text-emerald-800">Vehicle registered successfully! Redirecting...</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-3 sm:py-3.5 rounded-2xl font-black hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base shadow-2xl hover:shadow-3xl"
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

                    {/* Side Panel */}
                    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 rounded-[2rem] border-2 border-emerald-200 shadow-xl p-6 flex flex-col gap-5">
                        <h3 className="text-lg font-black text-gray-900">Registration Flow</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black">1</div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">Create QR Sticker</p>
                                    <p className="text-xs text-gray-600">A printable QR is generated instantly after submit.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black">2</div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">Attach to Windshield</p>
                                    <p className="text-xs text-gray-600">Place the sticker on the lower-right corner.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white flex items-center justify-center font-black">3</div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">Ready for Emergencies</p>
                                    <p className="text-xs text-gray-600">Anyone can scan to reach emergency contacts.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto rounded-2xl border border-emerald-200 bg-white/80 p-4 shadow-inner">
                            <p className="text-xs font-black text-emerald-700">Tip</p>
                            <p className="text-xs text-gray-700">Use waterproof label paper for best durability.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
