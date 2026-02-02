import { getAdminSession } from "@/lib/auth";
import { adminLogout } from "@/actions/adminLogout";
import { toggleVehicleStatus } from "@/actions/toggleVehicleStatus";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const session = await getAdminSession();

    if (!session) {
        redirect("/admin");
    }

    const vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: "desc" },
    });

    const stats = {
        total: vehicles.length,
        active: vehicles.filter((v: { isDisabled: boolean }) => !v.isDisabled).length,
        disabled: vehicles.filter((v: { isDisabled: boolean }) => v.isDisabled).length,
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600 mt-1">
                            AutoGuard Registry Administration
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-slate-600">Logged in as</p>
                            <p className="font-medium text-slate-900">
                                {session.email}
                            </p>
                        </div>
                        <form
                            action={async () => {
                                "use server";
                                await adminLogout();
                                redirect("/admin");
                            }}
                        >
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-slate-600">
                            Total Vehicles
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            {stats.total}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-slate-600">
                            Active
                        </p>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {stats.active}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-slate-600">
                            Disabled
                        </p>
                        <p className="text-3xl font-bold text-slate-400 mt-2">
                            {stats.disabled}
                        </p>
                    </div>
                </div>

                {/* Vehicles Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900">
                            All Vehicles
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Vehicle Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Owner Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Contact Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {vehicles.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-8 text-center text-slate-500"
                                        >
                                            No vehicles found
                                        </td>
                                    </tr>
                                ) : (
                                    vehicles.map((vehicle: { id: number; vehicleNumber: string; ownerName: string; contactNumber: string; isDisabled: boolean }) => (
                                        <tr
                                            key={vehicle.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {vehicle.vehicleNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {vehicle.ownerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {vehicle.contactNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {vehicle.isDisabled ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                        Disabled
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/qr/${vehicle.vehicleNumber}`}
                                                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition duration-200"
                                                        target="_blank"
                                                    >
                                                        QR
                                                    </Link>
                                                    <Link
                                                        href={`/admin/dashboard/edit/${vehicle.vehicleNumber}`}
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition duration-200"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <form
                                                        action={async () => {
                                                            "use server";
                                                            await toggleVehicleStatus(
                                                                vehicle.id,
                                                            );
                                                        }}
                                                    >
                                                        <button
                                                            type="submit"
                                                            className={`px-3 py-1 rounded-md font-medium transition duration-200 ${vehicle.isDisabled
                                                                ? "bg-green-600 hover:bg-green-700 text-white"
                                                                : "bg-slate-600 hover:bg-slate-700 text-white"
                                                                }`}
                                                        >
                                                            {vehicle.isDisabled
                                                                ? "Enable"
                                                                : "Disable"}
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
