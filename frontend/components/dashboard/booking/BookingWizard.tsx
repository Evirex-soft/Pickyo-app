"use client";

import { useBooking } from "./BookingContext";
import StepLocation from "./steps/StepLocation";
import StepDetails from "./steps/StepDetails";
import StepVehicle from "./steps/StepVehicle";
import StepConfirm from "./steps/StepConfirm";
import MapPreview from "@/components/MapPreview";
import { ChevronLeft } from "lucide-react";

export default function BookingWizard() {
    const { step, prevStep, bookingState } = useBooking();

    const isRideActive = step === 4;

    const steps = [
        { title: "Location", component: <StepLocation /> },
        { title: "Details", component: <StepDetails /> },
        { title: "Vehicle", component: <StepVehicle /> },
        { title: "Confirm", component: <StepConfirm /> },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto h-[85dvh] max-h-212.5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">

            {/* Map Area: Top 35% on mobile */}
            <div className="w-full h-[35%] md:h-full md:flex-1 bg-zinc-50 dark:bg-zinc-950 relative z-10 shrink-0 order-1 md:order-2 border-b md:border-b-0 md:border-l border-zinc-200 dark:border-zinc-800">
                <MapPreview key={step} />

                {bookingState.distance > 0 && !isRideActive && (
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">
                            Est. Distance
                        </p>
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">
                            {bookingState.distance.toFixed(1)} km
                        </p>
                    </div>
                )}
            </div>

            {/* Sidebar Area: Bottom 65% on mobile */}
            <div className="w-full h-[65%] md:h-full md:w-100 lg:w-112.5 flex flex-col relative z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:shadow-none bg-white dark:bg-zinc-900 shrink-0 order-2 md:order-1">

                {/* Header */}
                {!isRideActive && (
                    <div className="shrink-0 p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full disabled:opacity-0 transition-opacity"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${s <= step ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="relative flex-1 w-full bg-white dark:bg-zinc-900">
                    <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 pb-12 custom-scrollbar">
                        {steps[step - 1].component}
                    </div>
                </div>

            </div>
        </div>
    );
}