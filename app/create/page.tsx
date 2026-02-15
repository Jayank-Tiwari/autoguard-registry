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
    const [consentGiven, setConsentGiven] = useState(false);
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

        if (!consentGiven) {
            setError("You must agree to the terms and conditions to proceed");
            setLoading(false);
            return;
        }

        try {
            await createVehicle({
                vehicleNumber,
                ownerName,
                contactNumber,
                emergencyContacts: validContacts,
                consentGiven,
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header - Sticky on all screens for easy access */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-emerald-200 shadow-md">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="font-bold text-slate-900 text-lg tracking-tight">AutoGuard Registry</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* Left Column: Form Content */}
                    <div className="lg:col-span-8 w-full">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-4 sm:px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Register New Vehicle</h1>
                                <p className="text-sm text-slate-500 mt-1">Enter your vehicle details to generate an emergency QR code.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                                {/* Section 1: Vehicle & Owner */}
                                <div className="space-y-5 sm:space-y-6">
                                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">1</span>
                                        Primary Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                        <div className="col-span-1 md:col-span-2">
                                            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Vehicle Registration Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="vehicleNumber"
                                                    /* text-base on mobile prevents iOS zoom, sm:text-sm on larger screens */
                                                    className="block w-full pl-10 pr-3 py-3 sm:py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-base sm:text-sm font-medium uppercase"
                                                    placeholder="DL 01 AB 1234"
                                                    value={vehicleNumber}
                                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <p className="mt-1.5 text-xs text-slate-500">Enter without spaces for best results (e.g. MH12AB1234)</p>
                                        </div>

                                        <div>
                                            <label htmlFor="ownerName" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Owner Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="ownerName"
                                                    className="block w-full pl-10 pr-3 py-3 sm:py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-base sm:text-sm"
                                                    placeholder="John Doe"
                                                    value={ownerName}
                                                    onChange={(e) => setOwnerName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="contactNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Primary Contact Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="tel"
                                                    id="contactNumber"
                                                    className="block w-full pl-10 pr-3 py-3 sm:py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-base sm:text-sm"
                                                    placeholder="+91 98765 43210"
                                                    value={contactNumber}
                                                    onChange={(e) => setContactNumber(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100"></div>

                                {/* Section 2: Emergency Contacts */}
                                <div className="space-y-5 sm:space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">2</span>
                                            Emergency Contacts
                                        </h2>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                            {emergencyContacts.length} / 10
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {emergencyContacts.map((contact, index) => (
                                            /* Stack vertically on mobile, horizontally on tablet+ */
                                            <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-200 transition-colors group">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Relation / Label</label>
                                                    <select
                                                        value={contact.label}
                                                        onChange={(e) => updateEmergencyContact(index, "label", e.target.value)}
                                                        required
                                                        className="block w-full py-2.5 sm:py-2 pl-3 pr-10 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm text-base sm:text-sm"
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="Police">Police</option>
                                                        <option value="Ambulance">Ambulance</option>
                                                        <option value="Fire">Fire</option>
                                                        <option value="Custom">Custom</option>
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        value={contact.phone}
                                                        onChange={(e) => updateEmergencyContact(index, "phone", e.target.value)}
                                                        required
                                                        placeholder="Enter number"
                                                        className="block w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm text-base sm:text-sm"
                                                    />
                                                </div>
                                                {emergencyContacts.length > 1 && (
                                                    <div className="flex items-end justify-end sm:justify-start">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEmergencyContact(index)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Remove Contact"
                                                        >
                                                            <span className="sr-only">Remove</span>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {emergencyContacts.length < 10 && (
                                            <button
                                                type="button"
                                                onClick={addEmergencyContact}
                                                className="w-full py-3 sm:py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-2 active:bg-emerald-50"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Another Contact
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100"></div>

                                {/* Section 3: Consent */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="consent"
                                                type="checkbox"
                                                checked={consentGiven}
                                                onChange={(e) => setConsentGiven(e.target.checked)}
                                                className="focus:ring-amber-500 h-5 w-5 text-amber-600 border-gray-300 rounded cursor-pointer"
                                                required
                                            />
                                        </div>
                                        <div className="text-sm">
                                            <label htmlFor="consent" className="font-medium text-amber-900 block mb-1 cursor-pointer">
                                                Data Consent & Privacy
                                            </label>
                                            <p className="text-amber-800/80 leading-relaxed text-xs sm:text-sm">
                                                I authorize AutoGuard to store this vehicle information. I understand it will be publicly accessible via the generated QR code to facilitate emergency contact.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                {error && (
                                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-800 font-medium">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                                        <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-sm text-emerald-800 font-medium">Vehicle registered successfully! Redirecting to QR code...</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base sm:text-sm"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            "Register Vehicle"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Info & Process (Sticky on Desktop) */}
                    <div className="lg:col-span-4 w-full space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">How it works</h3>
                            <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:h-full before:w-0.5 before:bg-slate-100">
                                <div className="relative">
                                    <div className="absolute -left-8 w-7 h-7 bg-emerald-100 rounded-full border-2 border-white flex items-center justify-center">
                                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">Register Vehicle</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Fill out the form with accurate contact details.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-8 w-7 h-7 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
                                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">Get QR Code</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Instantly generate a unique QR code for your windshield.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-8 w-7 h-7 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center">
                                        <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">Stay Protected</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Bystanders can scan to call you or emergency services instantly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-5 sm:p-6 text-white overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    For the best durability, print your QR code on <span className="text-white font-semibold">weatherproof vinyl sticker paper</span> and apply it to the bottom-left corner of your windshield.
                                </p>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}