"use client";

import DashboardHeader from "@/components/dashboard/customer/DashboardHeader";
import RecentOrders from "@/components/dashboard/customer/RecentOrders";
import StatsSection from "@/components/dashboard/customer/StatsSection";

import { BookingProvider, useBooking } from "@/components/dashboard/booking/BookingContext";
import ServiceSelector from "@/components/dashboard/booking/ServiceSelector";
import BookingWizard from "@/components/dashboard/booking/BookingWizard";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";



function DashboardContent() {
    const { step }: any = useBooking();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* 1. Dynamic Booking Area */}
            <section className="mb-20 min-h-125 flex flex-col items-center justify-center">
                {step === 0 ? <ServiceSelector /> : <BookingWizard />}
            </section>

            {/* 2. Dashboard Stats & History  */}
            <div className="space-y-12 border-t border-zinc-200 dark:border-zinc-800 pt-12">
                <StatsSection />
                <RecentOrders />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">

            <div className="relative z-10">
                <DashboardHeader />

                <BookingProvider>
                    <GoogleMapsProvider>
                        <DashboardContent />
                    </GoogleMapsProvider>
                </BookingProvider>

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