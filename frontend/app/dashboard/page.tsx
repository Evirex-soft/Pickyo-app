"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/customer/Sidebar";
import DashboardHeader from "@/components/dashboard/customer/DashboardHeader";
import { BookingProvider, useBooking } from "@/components/dashboard/booking/BookingContext";
import ServiceSelector from "@/components/dashboard/booking/ServiceSelector";
import BookingWizard from "@/components/dashboard/booking/BookingWizard";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import MyTrips from "@/components/dashboard/customer/MyTrips";
import Wallet from "@/components/dashboard/customer/Wallet";
import SavedPlaces from "@/components/dashboard/customer/SavedPlaces";
import PromosAndRewards from "@/components/dashboard/customer/PromosAndRewards";
import SettingsPage from "@/components/dashboard/customer/Settings";
import SupportPage from "@/components/dashboard/customer/Support";
import SafetyPage from "@/components/dashboard/customer/Safety";


export default function DashboardPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("book");

    const renderTabContent = () => {
        switch (activeTab) {
            case "book":
                return (
                    <BookingProvider>
                        <GoogleMapsProvider>
                            <BookingFlowContent />
                        </GoogleMapsProvider>
                    </BookingProvider>
                );
            case "trips":
                return <MyTrips />;
            case "wallet":
                return <Wallet />;
            case "places":
                return (
                    <GoogleMapsProvider>
                        <SavedPlaces />
                    </GoogleMapsProvider>
                )
            case "settings":
                return <SettingsPage />;
            case "promos":
                return <PromosAndRewards />;
            case "safety":
                return <SafetyPage />;
            case "support":
                return <SupportPage />;
            default:
                return <BookingFlowContent />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <main className="flex-1 overflow-y-auto">
                    {renderTabContent()}
                </main>
            </div>
        </div>
    );
}

// Internal component to handle the Booking Step logic
function BookingFlowContent() {
    const { step }: any = useBooking();
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
            {step === 0 ? <ServiceSelector /> : <BookingWizard />}
        </div>
    );
}


// function DashboardContent() {
//     const { step }: any = useBooking();
//     return (
//         <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
//             {step === 0 ? <ServiceSelector /> : <BookingWizard />}
//         </div>
//     );
// }