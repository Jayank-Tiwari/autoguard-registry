"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRCardPageProps {
    params: Promise<{ vehicleNumber: string }>;
}

export default function QRCardPage({ params }: QRCardPageProps) {
    const [vehicleNumber, setVehicleNumber] = useState<string>("");
    const [qrUrl, setQrUrl] = useState<string>("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        params.then((resolvedParams) => {
            setVehicleNumber(resolvedParams.vehicleNumber);
            setQrUrl(`${window.location.origin}/v/${resolvedParams.vehicleNumber}`);
        });
    }, [params]);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!vehicleNumber) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p className="text-slate-600 font-medium">Loading your QR code...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style jsx global>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-card {
                        width: 148mm;
                        height: 105mm;
                        margin: 0;
                        padding: 0;
                        page-break-after: always;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: white;
                        box-shadow: none;
                        border-radius: 0;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                            Vehicle Registration Complete
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your vehicle has been successfully registered. Below is your unique QR code that can be placed on your vehicle for emergency identification.
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* QR Card Preview */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                                    <h2 className="text-white text-xl font-semibold">Your QR Card</h2>
                                    <p className="text-green-100 text-sm mt-1">Print and place this in your vehicle dashboard</p>
                                </div>

                                {/* QR Card Preview - A6 Size */}
                                <div className="print-card bg-white flex flex-col items-center justify-center p-8" style={{ aspectRatio: "148/105" }}>
                                    <div className="text-center space-y-4 w-full h-full flex flex-col items-center justify-center">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-1">
                                                AutoGuard Registry
                                            </h3>
                                            <p className="text-slate-600 text-sm">
                                                Emergency Contact QR Code
                                            </p>
                                        </div>

                                        <div className="bg-white p-3 rounded-lg inline-block border border-gray-200">
                                            <QRCodeCanvas
                                                value={qrUrl}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xl font-bold text-slate-900">
                                                {vehicleNumber}
                                            </p>
                                            <p className="text-slate-600 text-xs">
                                                Scan to view emergency contacts
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-slate-200 w-full">
                                            <p className="text-xs text-slate-500 px-4">
                                                In case of emergency, scan this code with your phone camera
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="space-y-4">
                                {/* Print Button */}
                                <button
                                    onClick={handlePrint}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 no-print"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2m-6-4V9m0 0V5a2 2 0 012-2h.5a2 2 0 012 2v4m0 0a2 2 0 012 2v4m0 0V9a2 2 0 012-2h.5a2 2 0 012 2v4" />
                                    </svg>
                                    Print QR Card
                                </button>

                                {/* Copy Link Button */}
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 no-print"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    {copied ? "Copied!" : "Copy Link"}
                                </button>

                                {/* Back to Dashboard Button */}
                                <a
                                    href="/admin/dashboard"
                                    className="w-full px-6 py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 no-print"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 19l-7-7 7-7m6 0l-7 7 7 7" />
                                    </svg>
                                    Back to Dashboard
                                </a>

                                {/* Info Box */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 no-print">
                                    <h3 className="font-semibold text-blue-900 text-sm mb-2">📋 Vehicle Number</h3>
                                    <p className="text-blue-800 text-lg font-bold break-words">{vehicleNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 no-print">
                        {/* Print Instructions */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2m-6-4V9m0 0V5a2 2 0 012-2h.5a2 2 0 012 2v4m0 0a2 2 0 012 2v4m0 0V9a2 2 0 012-2h.5a2 2 0 012 2v4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Printing Guide</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                    <span>Click the <strong>&quot;Print QR Card&quot;</strong> button above</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    <span>Use <strong>A6 cardstock</strong> (105 × 148 mm) for best results</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    <span>Ensure <strong>fit to page</strong> option is enabled</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                    <span>Print in <strong>color</strong> for better QR code readability</span>
                                </li>
                            </ul>
                        </div>

                        {/* Placement Instructions */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Placement & Usage</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                    <span>Place the card in your <strong>vehicle dashboard</strong></span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    <span>Position it where it&apos;s <strong>visible and accessible</strong></span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    <span>Emergency responders can <strong>scan instantly</strong></span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                    <span>Protect from <strong>water and UV</strong> exposure</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-8 no-print">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Why AutoGuard Registry Matters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500 text-white">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Instant Access</h4>
                                    <p className="text-gray-600">Emergency responders can instantly access your vehicle information and emergency contacts</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500 text-white">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Always Available</h4>
                                    <p className="text-gray-600">Works 24/7 without internet - QR codes can be scanned even in emergencies</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500 text-white">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Easy Setup</h4>
                                    <p className="text-gray-600">Simple print and place - no complex installation or maintenance required</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
