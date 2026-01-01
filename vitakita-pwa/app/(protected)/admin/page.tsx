"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SeedButton } from "@/components/feature/seed-button";

export default function AdminPage() {
    const { userData, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // if (!loading && userData?.role !== "admin") {
        //     router.push("/dashboard");
        // }
    }, [userData, loading, router]);

    // if (loading || userData?.role !== "admin") return <div>Loading...</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Doctor / Admin Panel</h1>
                {/* Seed button for testing */}
                <div className="flex gap-2">
                    <SeedButton />
                </div>
            </div>
            <p className="text-gray-500 mb-4">Manage patients and view records here.</p>

            <div className="bg-white p-4 rounded-lg shadow border">
                <p className="text-sm text-gray-400">No patients registered yet.</p>
            </div>
        </div>
    );
}
