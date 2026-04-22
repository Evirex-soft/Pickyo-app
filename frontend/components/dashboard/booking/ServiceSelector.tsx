"use client";

import { Car, Package, ArrowRight, MapPin, Home, Briefcase, Dumbbell, Plus } from "lucide-react";
import { useBooking } from "./BookingContext";

export default function ServiceSelector() {
    const { setServiceType } = useBooking();

    return (
        <div className="w-full space-y-8 lg:space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900">Where to?</h2>
                <p className="text-zinc-500 text-base md:text-lg">Your premium mobility concierge is ready.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <MapPin className="text-zinc-400" size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter destination..."
                        className="w-full pl-14 pr-6 py-4 md:py-5 bg-zinc-50 border-none rounded-[1.5rem] md:rounded-3xl text-base md:text-lg focus:ring-2 focus:ring-black transition-all shadow-sm"
                    />
                </div>

                {/* Mobile: Horizontal Scroll for actions */}
                <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar md:justify-center">
                    <QuickAction icon={<Home size={16} />} label="Home" />
                    <QuickAction icon={<Briefcase size={16} />} label="Office" />
                    <QuickAction icon={<Dumbbell size={16} />} label="Gym" />
                    <QuickAction icon={<Plus size={16} />} label="New" />
                </div>
            </div>

            {/* Responsive Grid: 1 col on mobile, 2 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4">
                <button
                    onClick={() => setServiceType("ride")}
                    className="group relative h-64 md:h-80 flex flex-col justify-between p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-black text-white text-left transition-transform active:scale-[0.98]"
                >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black">
                        <Car fill="currentColor" size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">Book a Ride</h3>
                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-[200px]">
                            Chauffeur-driven luxury vehicles.
                        </p>
                    </div>
                    <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-black">
                        <ArrowRight size={20} />
                    </div>
                </button>

                <button
                    onClick={() => setServiceType("package")}
                    className="group relative h-64 md:h-80 flex flex-col justify-between p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-zinc-50 border border-zinc-100 text-left transition-transform active:scale-[0.98]"
                >
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                        <Package size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">Send a Package</h3>
                        <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-[220px]">
                            Same-day white-glove delivery.
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 rounded-full text-sm font-medium hover:bg-zinc-50 transition-colors whitespace-nowrap">
            {icon} {label}
        </button>
    );
}