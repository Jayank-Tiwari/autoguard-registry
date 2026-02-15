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

  // --- Helper for Contact Styling ---
  const getContactStyle = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("police")) {
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-900",
        subtext: "text-blue-700",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        hover: "hover:bg-blue-100 hover:border-blue-300",
      };
    }
    if (
      l.includes("ambulance") ||
      l.includes("medical") ||
      l.includes("hospital")
    ) {
      return {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-900",
        subtext: "text-rose-700",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        hover: "hover:bg-rose-100 hover:border-rose-300",
      };
    }
    if (l.includes("fire")) {
      return {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-900",
        subtext: "text-orange-700",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        hover: "hover:bg-orange-100 hover:border-orange-300",
      };
    }
    // Default / Family / Custom
    return {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-900",
      subtext: "text-slate-600",
      iconBg: "bg-white",
      iconColor: "text-slate-500",
      hover: "hover:bg-slate-100 hover:border-slate-300",
    };
  };

  // --- 1. Vehicle Not Found / Disabled View ---
  if (!vehicle || vehicle.isDisabled) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
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
              <span className="font-bold text-slate-900 text-lg">
                AutoGuard
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6 text-slate-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Vehicle Not Available
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              The vehicle you are looking for ({vehicleNumber}) is not currently
              active in the AutoGuard Registry.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // --- 2. Active Vehicle View ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
            <span className="font-bold text-slate-900 text-lg">AutoGuard</span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        {/* Emergency Banner */}
        <div className="bg-slate-900 rounded-2xl shadow-lg p-6 sm:p-8 text-white mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2">Emergency Info</h1>
            <p className="text-slate-300 text-sm">
              You have scanned a vehicle registered with AutoGuard. Use the
              buttons below to contact the owner or emergency services
              immediately.
            </p>
          </div>
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Primary Card: Owner & Vehicle */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Owner Details
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {/* License Plate Style Display */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="bg-yellow-50 border-4 border-slate-900 rounded-lg px-8 py-3 shadow-sm relative">
                <div className="absolute top-1.5 left-2 w-1.5 h-1.5 bg-slate-300 rounded-full border border-slate-400"></div>
                <div className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-slate-300 rounded-full border border-slate-400"></div>
                <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 bg-slate-300 rounded-full border border-slate-400"></div>
                <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 bg-slate-300 rounded-full border border-slate-400"></div>

                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-widest uppercase">
                  {vehicle.vehicleNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-3">
                Vehicle Registration
              </p>
            </div>

            {/* Owner Contact */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-0.5">
                    Owner Name
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {vehicle.ownerName}
                  </p>
                </div>
                <a
                  href={`tel:${vehicle.contactNumber}`}
                  className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.98]"
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call Owner
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts List */}
        <h2 className="text-lg font-bold text-slate-900 mb-4 px-1 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Emergency Contacts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vehicle.emergencyContacts.map(
            (contact: { id: number; label: string; phone: string }) => {
              const style = getContactStyle(contact.label);
              return (
                <a
                  key={contact.id}
                  href={`tel:${contact.phone}`}
                  className={`group relative p-5 rounded-xl border ${style.bg} ${style.border} ${style.hover} transition-all duration-200 active:scale-[0.98] shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center ${style.iconColor}`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/50 px-2 py-1 rounded text-slate-500">
                      Tap to Call
                    </span>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold ${style.subtext} uppercase tracking-wide`}
                    >
                      {contact.label}
                    </p>
                    <p className={`text-2xl font-bold ${style.text}`}>
                      {contact.phone}
                    </p>
                  </div>
                </a>
              );
            },
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-8">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} AutoGuard Registry. All rights
            reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
