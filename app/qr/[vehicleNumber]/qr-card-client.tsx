"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRCardClientProps {
    vehicleNumber: string;
    isAdmin: boolean;
}

export default function QRCardClient({ vehicleNumber, isAdmin }: QRCardClientProps) {
    const [copied, setCopied] = useState(false);
    const [qrSize, setQrSize] = useState(180);

    const qrUrl = useMemo(() => {
        if (!vehicleNumber || typeof window === "undefined") {
            return "";
        }

        return `${window.location.origin}/v/${vehicleNumber}`;
    }, [vehicleNumber]);

    useEffect(() => {
        const updateQrSize = () => {
            const nextSize = Math.min(200, Math.max(140, Math.floor(window.innerWidth * 0.45)));
            setQrSize(nextSize);
        };

        updateQrSize();
        window.addEventListener("resize", updateQrSize);
        return () => window.removeEventListener("resize", updateQrSize);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyLink = () => {
        if (!qrUrl) {
            return;
        }

        navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!vehicleNumber) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl mb-6 shadow-2xl animate-pulse">
                        <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p className="text-xl text-gray-700 font-bold">Generating your QR sticker...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style jsx global>{`
                .print-card {
                    display: none;
                }
                
                @media print {
                    @page {
                        size: 80mm 80mm;
                        margin: 0;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        color-adjust: exact;
                    }
                    
                    html, body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }

                    body > :not(.print-card) {
                        display: none !important;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                    
                    .print-card {
                        width: 80mm !important;
                        height: 80mm !important;
                        margin: 0 !important;
                        padding: 6mm !important;
                        box-sizing: border-box !important;
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                        background: #d8f5eb !important;
                        box-shadow: none !important;
                        border: 3px solid #000 !important;
                        border-radius: 10px !important;
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-10">
                <div className="max-w-7xl mx-auto">
                    {/* Success Banner */}
                    <div className="text-center mb-10 no-print">
                        <div className="inline-flex items-center gap-4 bg-white rounded-full px-6 py-4 sm:px-10 sm:py-5 shadow-2xl border-2 border-emerald-300 mb-8 animate-bounce">
                            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-2xl font-black text-emerald-800">Registration Complete!</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 tracking-tight">
                            Your QR Sticker is Ready
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto font-semibold leading-relaxed">
                            Vehicle <span className="font-black text-teal-700 text-2xl sm:text-3xl">{vehicleNumber}</span> successfully registered
                        </p>
                        <p className="text-lg text-gray-600 mt-3">Print your emergency windshield sticker below</p>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10 mb-12">
                        {/* Left: QR Preview Card */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border-2 border-gray-100 no-print hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                                {/* Animated Gradient Header */}
                                <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 px-10 py-14 overflow-hidden">
                                    <div className="absolute inset-0">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48 animate-pulse"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32 animate-pulse delay-150"></div>
                                    </div>
                                    <div className="relative flex items-center gap-4">
                                        <div className="p-4 bg-white/30 rounded-2xl backdrop-blur-md shadow-xl">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-white text-3xl font-black tracking-tight">Windshield QR Sticker</h2>
                                            <p className="text-emerald-100 text-base font-medium mt-1">Professional • Durable • Emergency-Ready</p>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code Display - Screen Version */}
                                <div className="p-6 sm:p-10 lg:p-12 bg-gradient-to-b from-gray-50 to-white">
                                    <div className="bg-white border-[6px] border-gray-300 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl mx-auto hover:border-teal-400 transition-all duration-300 max-w-[420px] w-full">
                                        <div className="text-center space-y-6">
                                            {/* Top Section */}
                                            <div className="pb-6 border-b-2 border-gray-200">
                                                <div className="inline-block p-3 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl mb-3 shadow-md">
                                                    <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                                                    AutoGuard Registry
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-600 font-bold">
                                                    Emergency Contact System
                                                </p>
                                            </div>

                                            {/* QR Code */}
                                            <div className="py-6">
                                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-5 rounded-2xl inline-block shadow-xl border-[3px] border-gray-400">
                                                    <QRCodeCanvas
                                                        value={qrUrl}
                                                        size={qrSize}
                                                        level="H"
                                                        includeMargin={true}
                                                    />
                                                </div>
                                            </div>

                                            {/* Bottom Section */}
                                            <div className="pt-6 border-t-2 border-gray-200">
                                                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl py-4 px-4 sm:px-6 mb-4 shadow-inner">
                                                    <p className="text-xs sm:text-sm text-gray-500 font-black uppercase tracking-widest mb-2">Vehicle Number</p>
                                                    <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-wider break-all">
                                                        {vehicleNumber}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center gap-3 text-gray-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm sm:text-base font-bold">
                                                        Please Scan to connect with car owner.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-gray-500 text-sm sm:text-base font-semibold">
                                        <span className="flex items-center gap-2">✂️ Cut along border</span>
                                        <span className="flex items-center gap-2">💧 Waterproof</span>
                                        <span className="flex items-center gap-2">🚗 Apply to windshield</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Action Cards and Features */}
                        <div className="space-y-6">
                            {/* Quick Actions Card */}
                            <div className="bg-white rounded-[2rem] shadow-2xl border-2 border-gray-100 p-6 sm:p-8 lg:p-10 no-print">
                                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Quick Actions
                                </h3>
                                <div className="space-y-4">
                                    {/* Print Button */}
                                    <button
                                        onClick={handlePrint}
                                        className="group w-full px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white font-black text-base sm:text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-between transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/30 rounded-xl backdrop-blur-sm">
                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2m-6-4V9m0 0V5a2 2 0 012-2h.5a2 2 0 012 2v4m0 0a2 2 0 012 2v4m0 0V9a2 2 0 012 2v4" />
                                                </svg>
                                            </div>
                                            <span>Print Sticker</span>
                                        </div>
                                        <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Copy Link Button */}
                                    <button
                                        onClick={handleCopyLink}
                                        className="group w-full px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-base sm:text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-between transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/30 rounded-xl backdrop-blur-sm">
                                                {copied ? (
                                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span>{copied ? "Link Copied!" : "Copy QR Link"}</span>
                                        </div>
                                        <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Back to Dashboard */}
                                    {isAdmin && (
                                        <a
                                            href="/admin/dashboard"
                                            className="group w-full px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-black text-base sm:text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-between transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                </div>
                                                <span>Dashboard</span>
                                            </div>
                                            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Features Card */}
                            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-[2rem] border-2 border-teal-300 p-6 sm:p-8 lg:p-10 no-print shadow-xl">
                                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-7 flex items-center gap-3">
                                    <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    Key Features
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg mb-1">Instant Scan</p>
                                            <p className="text-sm text-gray-600 font-medium leading-relaxed">Quick QR code access from any smartphone camera</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg mb-1">Emergency Ready</p>
                                            <p className="text-sm text-gray-600 font-medium leading-relaxed">Critical information accessible 24/7 in emergencies</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg mb-1">Weatherproof</p>
                                            <p className="text-sm text-gray-600 font-medium leading-relaxed">Durable waterproof design for long-term outdoor use</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 no-print">
                        <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-100 p-6 sm:p-8 hover:shadow-3xl hover:border-emerald-300 transition-all duration-300 transform hover:scale-[1.02]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-md">
                                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2m-6-4V9m0 0V5a2 2 0 012-2h.5a2 2 0 012 2v4m0 0a2 2 0 012 2v4m0 0V9a2 2 0 012 2v4" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-black text-gray-900">Print Tips</h4>
                            </div>
                            <ul className="space-y-3 text-base text-gray-600 font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Use adhesive waterproof label paper</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Print in color for best QR readability</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Standard size: 80mm × 80mm sticker</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl shadow-2xl border-2 border-cyan-100 p-6 sm:p-8 hover:shadow-3xl hover:border-cyan-300 transition-all duration-300 transform hover:scale-[1.02]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl shadow-md">
                                    <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-black text-gray-900">Application</h4>
                            </div>
                            <ul className="space-y-3 text-base text-gray-600 font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="text-cyan-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Clean windshield with rubbing alcohol</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-cyan-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Apply to bottom right windshield corner</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-cyan-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Press firmly for 30 seconds to adhere</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl shadow-2xl border-2 border-teal-100 p-6 sm:p-8 hover:shadow-3xl hover:border-teal-300 transition-all duration-300 transform hover:scale-[1.02]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl shadow-md">
                                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-black text-gray-900">Important</h4>
                            </div>
                            <ul className="space-y-3 text-base text-gray-600 font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Avoid prolonged direct sunlight exposure</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Keep clear of driver&apos;s field of vision</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-600 font-black text-xl mt-0.5">✓</span>
                                    <span>Test scan before final placement</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Version - Hidden on Screen */}
            <div className="print-card">
                <div className="text-center h-full flex flex-col items-center justify-center">
                    <div style={{ marginBottom: "10px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 3px 0", color: "#0f172a" }}>
                            AutoGuard
                        </h3>
                        <p style={{ fontSize: "11px", margin: "0", color: "#64748b", fontWeight: "600" }}>
                            Emergency QR
                        </p>
                    </div>

                    <div
                        style={{
                            margin: "10px 0",
                            padding: "8px",
                            border: "3px solid #000",
                            display: "inline-block",
                            borderRadius: "8px",
                            backgroundColor: "#d8f5eb",
                        }}
                    >
                        <QRCodeCanvas
                            value={qrUrl}
                            size={110}
                            level="H"
                            includeMargin={false}
                            bgColor="#d8f5eb"
                        />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <p style={{ fontSize: "16px", fontWeight: "900", margin: "0", color: "#0f172a", letterSpacing: "0.5px" }}>
                            {vehicleNumber}
                        </p>
                    </div>

                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "2px solid #cbd5e1", width: "100%" }}>
                        <p style={{ fontSize: "10px", margin: "0", color: "#475569", fontWeight: "800" }}>
                            Please Scan to connect with car owner.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
