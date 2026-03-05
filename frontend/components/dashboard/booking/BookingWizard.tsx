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

    const steps = [
        { title: "Location", component: <StepLocation /> },
        { title: "Details", component: <StepDetails /> },
        { title: "Vehicle", component: <StepVehicle /> },
        { title: "Confirm", component: <StepConfirm /> },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto h-150 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col md:flex-row">

            <div className="w-full md:w-[40%] flex flex-col border-r border-zinc-200 dark:border-zinc-800">

                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 w-6 rounded-full ${s <= step ? "bg-blue-600" : "bg-zinc-200"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {steps[step - 1].component}
                </div>
            </div>

            <div className="hidden md:block w-[60%] p-4 bg-zinc-50 dark:bg-zinc-950 relative">
                <MapPreview />

                {bookingState.distance > 0 && step >= 3 && (
                    <div className="absolute top-8 right-8 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl shadow-xl">
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                            Est. Distance
                        </p>
                        <p className="text-xl font-bold">
                            {bookingState.distance.toFixed(1)} km
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
}