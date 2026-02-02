"use client";

import { adminLogin } from "@/actions/adminLogin";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

export default function AdminLoginPage() {
    const router = useRouter();
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const email = emailInputRef.current?.value;
        const password = passwordInputRef.current?.value;

        if (!email || !password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        const result = await adminLogin(email, password);

        if (result.success && result.redirectUrl) {
            router.push(result.redirectUrl);
        } else {
            setError(result.error || "Login failed");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
                        <p className="text-slate-600 mt-2">AutoGuard Registry Administration</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                ref={emailInputRef}
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="admin@example.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                ref={passwordInputRef}
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-center text-slate-600 text-xs">
                            This is a secure admin login. Unauthorized access is prohibited.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
