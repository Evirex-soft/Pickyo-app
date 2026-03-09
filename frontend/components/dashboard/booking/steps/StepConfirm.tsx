"use client";

import { useState, useEffect } from "react";
import {
    MapPin, Loader2, Star, Phone, MessageSquare,
    ShieldCheck, Car, X
} from "lucide-react";
import { useBooking } from "../BookingContext";
import { createRide } from "@/services/ride.service";

// Types of states the ride can be in
type RideStatus = 'idle' | 'searching' | 'accepted' | 'arrived' | 'completed';

export default function StepConfirm() {
    const { bookingState, resetBooking } = useBooking();
    const [status, setStatus] = useState<RideStatus>('idle');
    const [progress, setProgress] = useState(0);

    // Mock Driver Data
    const driverDetails = {
        name: "Vikram Singh",
        rating: 4.8,
        trips: "1.2k",
        vehicleModel: bookingState.selectedVehicle || "Sedan",
        plate: "KA 05 MN 2024",
        phone: "+91 98765 43210",
        otp: "4589"
    };

    const handleConfirm = async () => {
        try {
            if (!bookingState.pickup || !bookingState.drop) return;

            // 1. Start Searching
            setStatus('searching');

            // Call API (In a real app, this returns a ride ID and we listen to a socket)
            await createRide({
                pickup: bookingState.pickup,
                drop: bookingState.drop,
                distance: bookingState.distance,
                price: bookingState.price,
                vehicleType: bookingState.selectedVehicle || 'Standard'
            });

        } catch (err) {
            console.error(err);
            setStatus('idle');
        }
    };

    // Simulation Logic: Moving through ride states
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (status === 'searching') {
            // Simulate finding a driver (3 seconds)
            timer = setTimeout(() => setStatus('accepted'), 3000);
        }
        else if (status === 'accepted') {
            // Simulate driver arriving (5 seconds)
            timer = setTimeout(() => setStatus('arrived'), 5000);
        }
        else if (status === 'arrived') {
            // Simulate ride duration (5 seconds)
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStatus('completed');
                        return 100;
                    }
                    return prev + 2; // Progress bar speed
                });
            }, 100);
            return () => clearInterval(interval);
        }

        return () => clearTimeout(timer);
    }, [status]);

    // --- RENDER FUNCTIONS ---

    // 1. Searching UI
    if (status === 'searching') {
        return (
            <div className="flex flex-col items-center justify-center h-full py-10 animate-in fade-in">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                    <div className="relative bg-white dark:bg-zinc-800 p-6 rounded-full shadow-xl border border-blue-100 dark:border-blue-900/30">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    Finding your ride...
                </h3>
                <p className="text-zinc-500 text-sm">Connecting you to nearby drivers</p>
            </div>
        );
    }

    // 2. Active Ride UI (Accepted / Arrived)
    if (status === 'accepted' || status === 'arrived') {
        return (
            <div className="animate-in slide-in-from-bottom duration-500 h-full flex flex-col">
                {/* Status Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {status === 'accepted' ? "Driver is on the way" : "Ride in Progress"}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        {status === 'accepted' ? "Arriving in 4 mins" : "Heading to destination"}
                    </p>
                </div>

                {/* Driver Card */}
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center overflow-hidden">
                                <span className="text-xl">👨‍✈️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white">{driverDetails.name}</h3>
                                <div className="flex items-center text-xs text-zinc-500 gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{driverDetails.rating}</span>
                                    <span>•</span>
                                    <span>{driverDetails.trips} trips</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-zinc-900 dark:text-white">{driverDetails.plate}</p>
                            <p className="text-xs text-zinc-500">{driverDetails.vehicleModel}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm font-medium">Call</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm font-medium">Message</span>
                        </button>
                    </div>
                </div>

                {/* Ride Info / OTP */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 dark:text-blue-300 font-semibold uppercase">Start Ride OTP</p>
                            <p className="text-xl font-bold text-blue-700 dark:text-blue-200">{driverDetails.otp}</p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar (Only when arrived) */}
                {status === 'arrived' && (
                    <div className="mt-auto">
                        <div className="flex justify-between text-xs text-zinc-500 mb-2">
                            <span>On route</span>
                            <span>{100 - progress}% remaining</span>
                        </div>
                        <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-zinc-900 dark:bg-white transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 3. Completed UI
    if (status === 'completed') {
        return (
            <div className="text-center animate-in zoom-in duration-300 h-full flex flex-col justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <FlagCheckered className="w-10 h-10" />
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    You've Arrived!
                </h2>
                <p className="text-zinc-500 mb-8">
                    Hope you enjoyed your ride with {driverDetails.name}.
                </p>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 mb-8">
                    <p className="text-sm text-zinc-500 mb-1">Total Fare</p>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white">₹{bookingState.price}</p>
                </div>

                <button
                    onClick={resetBooking}
                    className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg"
                >
                    Book New Ride
                </button>
            </div>
        );
    }

    // 4. Default: Confirmation Preview (Before clicking confirm)
    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
                Review Ride
            </h2>

            {/* Route Summary */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-300 dark:bg-zinc-700 border-l border-dashed" />

                <div className="flex items-start gap-4 mb-6 relative z-10">
                    <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-zinc-500 font-medium uppercase mb-0.5">Pickup</p>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2">
                            {bookingState.pickup?.address}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                    <MapPin className="w-5 h-5 text-zinc-900 dark:text-white mt-0.5 fill-current" />
                    <div>
                        <p className="text-xs text-zinc-500 font-medium uppercase mb-0.5">Drop-off</p>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2">
                            {bookingState.drop?.address}
                        </p>
                    </div>
                </div>
            </div>

            {/* Price & Vehicle */}
            <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <div>
                        <p className="font-bold text-zinc-900 dark:text-white capitalize">{bookingState.selectedVehicle}</p>
                        <p className="text-xs text-zinc-500">{bookingState.distance.toFixed(1)} km</p>
                    </div>
                </div>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">₹{bookingState.price}</p>
            </div>

            <button
                onClick={handleConfirm}
                className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
                Confirm Booking
            </button>
        </div>
    );
}

// Helper icon component
function FlagCheckered(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
    )
}