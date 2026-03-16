"use client";

import { DriverProvider, useDriver } from "@/components/dashboard/driver/DriverContext";
import DashboardHeader from "@/components/dashboard/customer/DashboardHeader";
import JobController from "@/components/dashboard/driver/JobController";
import DriverStats from "@/components/dashboard/driver/DriverStats";
import RecentTrips from "@/components/dashboard/driver/RecentTrips";
import MapPreview from "@/components/MapPreview";

function DashboardContent() {
    const { status } = useDriver();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* 1. Dynamic Driver Area (Map & Job Controller) */}
            <section className="mb-20 min-h-125 flex flex-col items-center justify-center">

                <div className="w-full h-[60dvh] min-h-125 max-h-175 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">

                    {/* Map Area */}
                    <div className="w-full h-[40%] md:h-full md:flex-1 relative border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 order-1 md:order-2 bg-zinc-50 dark:bg-zinc-950">
                        <MapPreview />

                        {status !== "offline" && (
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                                    Online
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Job Controller Sidebar */}
                    <div className="w-full h-[60%] md:h-full md:w-100 lg:w-112.5 flex flex-col bg-white dark:bg-zinc-900 order-2 md:order-1 relative z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:shadow-none">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 flex flex-col justify-center">
                            <JobController />
                        </div>
                    </div>

                </div>

            </section>

            {/* 2. Dashboard Stats & History */}
            <div className="space-y-12 border-t border-zinc-200 dark:border-zinc-800 pt-12">
                <DriverStats />
                <RecentTrips />
            </div>

        </div>
    );
}

export default function DriverDashboard() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">

            <div className="relative z-10">
                <DashboardHeader />

                <DriverProvider>
                    <DashboardContent />
                </DriverProvider>

                <footer className="py-12 border-t border-zinc-200 dark:border-zinc-900 mt-12 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-lg">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
                        <p>&copy; 2026 Pickyo. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                </footer>
            </div>

        </main>
    );
}