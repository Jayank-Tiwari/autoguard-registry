"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRCardClientProps {
  vehicleNumber: string;
  isAdmin: boolean;
  origin: string;
}

export default function QRCardClient({
  vehicleNumber,
  isAdmin,
  origin,
}: QRCardClientProps) {
  const [copied, setCopied] = useState(false);

  const qrUrl = `${origin}/v/${vehicleNumber}`;

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Page Setup for Print - Just handles dimensions */}
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm 80mm;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white;
          }
        }
      `}</style>

      {/* SCREEN UI WRAPPER: Hidden when printing */}
      <div className="print:hidden flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                AutoGuard Registry
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Registration Successful
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Ready for the Road
                </h1>
                <p className="text-slate-600 mt-1">
                  Vehicle{" "}
                  <span className="font-semibold text-slate-900">
                    {vehicleNumber}
                  </span>{" "}
                  is now secured.
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-md flex items-center gap-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2m-6-4V9m0 0V5a2 2 0 012-2h.5a2 2 0 012 2v4m0 0a2 2 0 012 2v4m0 0V9a2 2 0 012 2v4"
                  />
                </svg>
                Print Sticker
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Sticker Preview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="font-semibold text-slate-900">
                    Sticker Preview
                  </h2>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    80mm × 80mm
                  </span>
                </div>

                {/* Preview Container */}
                <div className="p-8 sm:p-12 bg-slate-100 flex justify-center items-center">
                  <div className="relative group perspective-1000">
                    {/* --- STICKER CARD START --- */}
                    <div className="bg-white border-4 border-slate-200 rounded-2xl p-5 w-[280px] shadow-xl flex flex-col items-center text-center relative z-10 gap-4">
                      <div className="w-full border-b border-slate-100 pb-3">
                        <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <span className="font-black tracking-tight text-lg">
                            AUTOGUARD
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Emergency QR
                        </p>
                      </div>

                      <div className="bg-white p-1.5 rounded-xl border-2 border-slate-900 shadow-sm w-full flex justify-center">
                        <QRCodeCanvas
                          value={qrUrl}
                          size={130}
                          level="H"
                          includeMargin={true}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "130px",
                          }}
                        />
                      </div>

                      <div className="w-full">
                        <div className="bg-slate-50 rounded-lg py-2 px-2 border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                            Vehicle Registration
                          </p>
                          <p className="text-xl font-black text-slate-900 tracking-wider font-mono uppercase break-all leading-tight">
                            {vehicleNumber}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-2">
                          Scan to contact owner
                        </p>
                      </div>
                    </div>
                    {/* --- STICKER CARD END --- */}

                    <div className="absolute inset-0 bg-slate-900/10 rounded-2xl blur-xl transform translate-y-4 translate-x-4 -z-0"></div>
                  </div>
                </div>
              </div>

              {/* Printing Checklist */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-3">
                    Printing Checklist
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                        1
                      </div>
                      <span>
                        Print at <strong>100% scale</strong> (Do not scale to
                        fit)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                        2
                      </div>
                      <span>Cut along the outer black border</span>
                    </li>
                  </ul>
                </div>
                <div className="w-px bg-slate-100 hidden sm:block"></div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-3">Placement</h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                        1
                      </div>
                      <span>Clean windshield glass thoroughly</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                        2
                      </div>
                      <span>Stick on bottom-left corner (inside)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-600 font-medium rounded-lg transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      {copied ? "Link Copied!" : "Copy Public Link"}
                    </span>
                    {copied && (
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  {isAdmin && (
                    <a
                      href="/admin/dashboard"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-medium rounded-lg transition-all flex items-center justify-between hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                        Dashboard
                      </span>
                      <span className="text-slate-400">→</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Paper Recommendation */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Paper Guide
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed mb-3">
                    This design is sized for <strong>A4 Paper</strong>.
                  </p>
                  <div className="bg-white/60 rounded-lg p-3 border border-blue-200/50 space-y-2">
                    <p className="text-xs text-blue-900">
                      1. Print on a full{" "}
                      <strong>A4 Waterproof Vinyl Sticker Sheet</strong>.
                    </p>
                    <p className="text-xs text-blue-900">
                      2. <strong>Cut out</strong> the sticker along the black
                      border (80mm x 80mm).
                    </p>
                  </div>
                  <p className="text-xs text-blue-700 mt-3 font-medium flex items-center gap-1">
                    <span className="bg-blue-200 text-blue-800 text-[10px] px-1.5 rounded">
                      NOTE
                    </span>
                    Do not stick the entire A4 sheet.
                  </p>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Safety Tips
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>
                        Update your emergency contacts immediately if they
                        change.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>
                        Test the QR code scanning regularly to ensure it works.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>
                        Place the sticker where it won&apos;t obstruct the
                        driver&apos;s view.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PRINT ONLY CONTENT */}
      {/* The hidden print:flex utility makes this visible ONLY during print, and positions it fullscreen */}
      <div className="hidden print:flex print:fixed print:inset-0 print:items-center print:justify-center print:bg-white print:z-[9999]">
        <div
          className="flex flex-col items-center justify-center text-center bg-[#ecfdf5] border-[3px] border-black rounded-xl box-border gap-4"
          style={{ width: "80mm", height: "80mm", padding: "6mm" }}
        >
          <div className="w-full border-b border-black/10 pb-3">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ strokeWidth: 3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span
                className="font-black text-xl tracking-tight"
                style={{ color: "#064e3b" }}
              >
                AUTOGUARD
              </span>
            </div>
            <p
              className="text-[9px] font-bold uppercase tracking-widest mt-0.5"
              style={{ color: "#047857" }}
            >
              Emergency QR
            </p>
          </div>

          <div className="bg-white p-1.5 rounded-lg border-2 border-black shadow-sm">
            <QRCodeCanvas
              value={qrUrl}
              size={110}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="w-full">
            <div className="bg-white/50 rounded px-1 border border-black/5 py-1 mb-1">
              <p
                className="text-[9px] font-bold text-black/60 uppercase mb-0.5"
                style={{ fontSize: "8px" }}
              >
                Vehicle Registration
              </p>
              <p
                className="text-[14px] font-black text-black tracking-wider font-mono uppercase break-all leading-none"
                style={{ fontFamily: "monospace" }}
              >
                {vehicleNumber}
              </p>
            </div>
            <p className="text-[8px] text-emerald-900 font-bold uppercase mt-1">
              Scan for Emergency Contact
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
