"use client";

import DashboardHeader from "@/components/dashboard/customer/DashboardHeader";
import DriverStats from "@/components/dashboard/driver/DriverStats";
import RecentTrips from "@/components/dashboard/driver/RecentTrips";
import JobController from "@/components/dashboard/driver/JobController";
import { DriverProvider } from "@/components/dashboard/driver/DriverContext";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";

function DriverDashboardContent() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* 1. Main Action Area (The Job Controller) */}
            <section className="mb-12 flex flex-col items-center justify-center min-h-100">
                <JobController />
            </section>

            {/* 2. Stats & History */}
            <div className="space-y-8 border-t border-zinc-200 dark:border-zinc-800 pt-12">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-8">
                        <DriverStats />
                        <RecentTrips />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DriverDashboardPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden font-sans">
            <div className="relative z-10">

                <DriverProvider>
                    <DashboardHeader />

                    <GoogleMapsProvider>
                        <DriverDashboardContent />
                    </GoogleMapsProvider>

                    <footer className="py-12 border-t border-zinc-200 dark:border-zinc-900 mt-12 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-lg">
                        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-zinc-500">
                            <p>&copy; 2024 LogiTech Driver Partners.</p>
                        </div>
                    </footer>
                </DriverProvider>

            </div>
        </main>
    );
}