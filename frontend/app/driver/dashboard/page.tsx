"use client";

import { useState } from "react";
import { DriverProvider } from "@/components/dashboard/driver/DriverContext";
import DashboardHeader from "@/components/dashboard/customer/DashboardHeader";
import JobController from "@/components/dashboard/driver/JobController";
import MapPreview from "@/components/MapPreview";
import DriverSidebar from "@/components/dashboard/driver/DriverSidebar";
import DriverRideHistory from "@/components/dashboard/driver/RideHistory";
import DriverEarnings from "@/components/dashboard/driver/Earnings";
import VehicleDetails from "@/components/dashboard/driver/VehicleDetails";
import DriverDocuments from "@/components/dashboard/driver/DriverDocuments";

function DashboardContent({ activeTab }: { activeTab: string }) {
    const renderSection = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <section className="h-full">
                        {/* Map & Controller Container - Adjusted for responsiveness */}
                        <div className="w-full min-h-[calc(100vh-12rem)] bg-white dark:bg-zinc-900 rounded-4xl md:rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                            {/* Controller first on desktop, Map first on mobile */}
                            <div className="w-full h-100 md:h-auto md:w-100 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 order-2 md:order-1 flex flex-col">
                                <JobController />
                            </div>
                            <div className="flex-1 min-h-75 order-1 md:order-2 relative">
                                <MapPreview />
                            </div>
                        </div>
                    </section>
                );

            case "history": return <DriverRideHistory />;
            case "earnings": return <DriverEarnings />;
            case "vehicle": return <VehicleDetails />;
            case "documents": return <DriverDocuments />;

            default:
                return (
                    <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
                        <p className="text-zinc-500">This module is currently under development.</p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-7xl mx-auto w-full">
            {renderSection()}
        </div>
    );
}

export default function DriverDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar remains fixed */}
            <DriverSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Main Content Area: Pushed right by lg:pl-72 on desktop */}
            <div className="flex flex-col min-h-screen lg:pl-72 transition-all duration-300">
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <DriverProvider>
                        <DashboardContent activeTab={activeTab} />
                    </DriverProvider>
                </div>
            </div>
        </main>
    );
}