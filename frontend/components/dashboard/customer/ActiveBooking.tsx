"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import {
    MapPin,
    Phone,
    MessageSquare,
    MoreHorizontal,
    Clock,
    Box
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import with proper loading state
const Map = dynamic(() => import("@/components/dashboard/customer/Map"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center text-xs text-zinc-400">Loading Map...</div>
});

// --- Mock Data ---
const ACTIVE_BOOKING = {
    id: "TRK-8829-XJ",
    status: "In Transit",
    progress: 65,
    eta: "14:30",
    timeLeft: "45 mins",
    origin: {
        city: "San Francisco, CA",
        address: "800 Market St, Logistics Hub A",
        time: "10:00 AM"
    },
    destination: {
        city: "San Jose, CA",
        address: "2400 Great America Pkwy",
        time: "02:30 PM"
    },
    driver: {
        name: "Michael R.",
        vehicle: "Volvo VNL 760",
        plate: "CA 5592 L",
        rating: 4.9
    }
};

export default function ActiveBooking() {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(containerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.2
        });

        tl.fromTo(progressBarRef.current,
            { width: "0%" },
            { width: `${ACTIVE_BOOKING.progress}%`, duration: 1.5, ease: "circ.out" },
            "-=0.4"
        );
    }, { scope: containerRef });

    return (
        <section className="px-6 lg:px-8 pb-8 max-w-7xl mx-auto w-full">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Current Shipment
                </h3>
                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-medium border border-emerald-500/20">
                    <Clock size={12} />
                    <span>ETA: {ACTIVE_BOOKING.timeLeft}</span>
                </div>
            </div>

            {/* Main Card Container */}
            <div
                ref={containerRef}
                className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col lg:flex-row h-auto lg:h-[450px]"
            // Note: lg:h-[450px] gives the map a concrete height to fill
            >

                {/* Left: The Map (Explicit 40% Width on Desktop) */}
                <div className="w-full lg:w-[40%] h-64 lg:h-full relative border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
                    {/* Pass h-full w-full to the dynamic component */}
                    <Map className="h-full w-full" />
                </div>

                {/* Right: Details (Fill Remaining Space) */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">

                    {/* Header Details */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 uppercase tracking-widest">
                                    #{ACTIVE_BOOKING.id}
                                </span>
                                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800 uppercase tracking-widest">
                                    {ACTIVE_BOOKING.status}
                                </span>
                            </div>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                                Delivering to {ACTIVE_BOOKING.destination.city.split(',')[0]}
                            </h2>
                        </div>
                        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    {/* Timeline Route */}
                    <div className="py-6 lg:py-0">
                        <div className="relative flex flex-col gap-6">
                            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-zinc-100 dark:bg-zinc-800"></div>

                            {/* Origin */}
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium mb-0.5">Pickup • {ACTIVE_BOOKING.origin.time}</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{ACTIVE_BOOKING.origin.address}</p>
                                    <p className="text-xs text-zinc-400">{ACTIVE_BOOKING.origin.city}</p>
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-2 border-indigo-500 flex items-center justify-center shrink-0">
                                    <MapPin size={12} className="text-indigo-500 fill-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-500 font-medium mb-0.5">Dropoff • {ACTIVE_BOOKING.destination.time}</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{ACTIVE_BOOKING.destination.address}</p>
                                    <p className="text-xs text-zinc-400">{ACTIVE_BOOKING.destination.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full">
                        <div className="flex justify-between text-xs font-medium text-zinc-500 mb-2">
                            <span>Progress</span>
                            <span>{ACTIVE_BOOKING.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div ref={progressBarRef} className="h-full bg-indigo-600 rounded-full" />
                        </div>
                    </div>

                    {/* Footer: Driver & Actions */}
                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Driver Info */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                {ACTIVE_BOOKING.driver.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{ACTIVE_BOOKING.driver.name}</p>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <span>{ACTIVE_BOOKING.driver.vehicle}</span>
                                    <span>•</span>
                                    <span>{ACTIVE_BOOKING.driver.plate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                <Phone size={18} />
                            </button>
                            <button className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                <MessageSquare size={18} />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity ml-2">
                                <Box size={16} />
                                Details
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}