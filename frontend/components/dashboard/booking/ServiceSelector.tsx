"use client";

import { Car, Package, ArrowRight } from "lucide-react";
import { useBooking } from "./BookingContext";


export default function ServiceSelector() {
    const { setServiceType } = useBooking();

    return (
        <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">What can we do for you today?</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">Choose a service to get started</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Ride Option */}
                <button
                    onClick={() => setServiceType("ride")}
                    className="group relative p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 text-left hover:shadow-2xl hover:shadow-blue-500/10"
                >
                    <div className="absolute top-6 right-6 w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <Car className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Book a Ride</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Comfortable rides for you and your friends. Choose from Economy to Lux.
                    </p>
                </button>

                {/* Package Option */}
                <button
                    onClick={() => setServiceType("package")}
                    className="group relative p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 text-left hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                    <div className="absolute top-6 right-6 w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                        <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Send a Package</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Instant delivery for goods, gifts, and documents within the city.
                    </p>
                </button>
            </div>
        </div>
    );
}