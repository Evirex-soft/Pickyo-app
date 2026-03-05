"use client";
import { Users, Box, Scale } from "lucide-react";
import { useBooking } from "../BookingContext";

export default function StepDetails() {
    const { bookingState, updateBooking, nextStep } = useBooking();
    const isRide = bookingState.serviceType === "ride";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {isRide ? (
                /* RIDE SPECIFIC DETAILS */
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Number of Passengers</span>
                        <div className="mt-2 flex items-center gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => updateBooking({ rideDetails: { ...bookingState.rideDetails!, passengers: num } })}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${bookingState.rideDetails?.passengers === num
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </label>
                </div>
            ) : (
                /* PACKAGE SPECIFIC DETAILS */
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Package Weight (kg)</span>
                        <div className="mt-1 relative">
                            <Scale className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
                            <input
                                type="number"
                                placeholder="e.g. 5"
                                value={bookingState.packageDetails?.weight}
                                onChange={(e) => updateBooking({ packageDetails: { ...bookingState.packageDetails!, weight: e.target.value } })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">What are you sending?</span>
                        <div className="mt-1 relative">
                            <Box className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="e.g. Documents, Electronics"
                                value={bookingState.packageDetails?.category}
                                onChange={(e) => updateBooking({ packageDetails: { ...bookingState.packageDetails!, category: e.target.value } })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </label>
                </div>
            )}

            <button
                onClick={nextStep}
                className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold hover:opacity-90 transition-all"
            >
                Find Available {isRide ? 'Rides' : 'Couriers'}
            </button>
        </div>
    );
}