"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRCardPageProps {
    params: Promise<{ vehicleNumber: string }>;
}

export default function QRCardPage({ params }: QRCardPageProps) {
    const [vehicleNumber, setVehicleNumber] = useState<string>("");
    const [qrUrl, setQrUrl] = useState<string>("");

    useEffect(() => {
        params.then((resolvedParams) => {
            setVehicleNumber(resolvedParams.vehicleNumber);
            setQrUrl(`${window.location.origin}/v/${resolvedParams.vehicleNumber}`);
        });
    }, [params]);

    const handlePrint = () => {
        window.print();
    };

    if (!vehicleNumber) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-slate-600">Loading...</div>
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
                    }
                }
            `}</style>

            <div className="min-h-screen bg-slate-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Controls */}
                    <div className="mb-6 no-print flex gap-4">
                        <button
                            onClick={handlePrint}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                        >
                            Print QR Card
                        </button>
                        <a
                            href="/admin/dashboard"
                            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition"
                        >
                            Back to Dashboard
                        </a>
                    </div>

                    {/* QR Card - A6 Size */}
                    <div className="print-card bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center" style={{ width: "148mm", height: "105mm" }}>
                        <div className="text-center space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    AutoGuard Registry
                                </h1>
                                <p className="text-slate-600 text-lg">
                                    Emergency Contact QR Code
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg inline-block">
                                <QRCodeCanvas
                                    value={qrUrl}
                                    size={256}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-2xl font-bold text-slate-900">
                                    {vehicleNumber}
                                </p>
                                <p className="text-slate-600 text-sm">
                                    Scan to view emergency contacts
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-200">
                                <p className="text-xs text-slate-500">
                                    In case of emergency, scan this code with your phone camera
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 no-print bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">
                            Instructions
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-600">
                            <li>Click &quot;Print QR Card&quot; to print this card</li>
                            <li>Recommended: Print on A6 (105 x 148 mm) cardstock</li>
                            <li>Place the printed card in your vehicle dashboard</li>
                            <li>Emergency responders can scan to access contact info</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
