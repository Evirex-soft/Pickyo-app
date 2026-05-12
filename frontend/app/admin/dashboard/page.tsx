"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { Overview } from "@/components/admin/tabs/Overview";
import { UserList } from "@/components/admin/tabs/Users";
import { DriverList } from "@/components/admin/tabs/Drivers";
import { LiveTracking } from "@/components/admin/tabs/LiveTracking";
import { DynamicPricing } from "@/components/admin/tabs/DynamicPricing";
import { Analytics } from "@/components/admin/tabs/Analytics";
import { Disputes } from "@/components/admin/tabs/Disputes";
import { Payments } from "@/components/admin/tabs/Payments";
import { Promos } from "@/components/admin/tabs/PromoCode";
import { Commissions } from "@/components/admin/tabs/Commission";
import { GeoZones } from "@/components/admin/tabs/GeoZones";
import { FleetManagement } from "@/components/admin/tabs/FleetManagement";
import { NotificationsManagement } from "@/components/admin/tabs/Notifications";
import { FraudDetection } from "../../../components/admin/tabs/FraudDetection";
import { Heatmaps } from "@/components/admin/tabs/HeatMaps";
import { Permissions } from "@/components/admin/tabs/Permissions";
import { AuditLogs } from "@/components/admin/tabs/AuditLogs";

export default function AdminPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    const renderContent = () => {
        switch (activeTab) {
            case "overview": return <Overview />;
            case "users": return <UserList />;
            case "drivers": return <DriverList />;
            case "live": return <LiveTracking />;
            case "pricing": return <DynamicPricing />;
            case "analytics": return <Analytics />;
            case "disputes": return <Disputes />;
            case "payments": return <Payments />;
            case "promos": return <Promos />;
            case "commission": return <Commissions />;
            case "geozone": return <GeoZones />;
            case "fleet": return <FleetManagement />;
            case "notifications": return <NotificationsManagement />;
            case "fraud-detection": return <FraudDetection />;
            case "heatmap": return <Heatmaps />;
            case "roles": return <Permissions />;
            case "audit": return <AuditLogs />;
            default: return (
                <div className="p-10 bg-white rounded-3xl border-2 border-dashed text-slate-400 text-center">
                    Module "{activeTab}" is loading...
                </div>
            );
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">

            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main
                    className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                    {/* Inner wrapper for padding and max-width */}
                    <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto">

                        {/* Tab Title Section */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-black text-slate-900 capitalize tracking-tight">
                                {activeTab.replace("-", " ")}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">Manage and monitor your platform operations.</p>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}