"use client";

import { useDriver } from "./DriverContext";
import { MapPin, Navigation, Phone, ShieldCheck, Timer } from "lucide-react";
import { useState } from "react";

export default function JobController() {
    const { status, currentRide, acceptRide, rejectRide, startTrip, completeTrip } = useDriver();
    const [otp, setOtp] = useState("");

    // 1. OFFLINE VIEW
    if (status === 'offline') {
        return (
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Navigation className="w-8 h-8 text-zinc-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">You are currently Offline</h2>
                <p className="text-zinc-500">Go online to start receiving new ride requests in your area.</p>
            </div>
        );
    }

    // 2. IDLE (SCANNING) VIEW
    if (status === 'idle') {
        return (
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl border border-blue-100 dark:border-blue-900/30 p-12 text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 animate-pulse" />
                <div className="relative z-10">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Finding nearby passengers...</h2>
                    <p className="text-zinc-500 mt-2">Please keep your app open</p>
                </div>
            </div>
        );
    }

    // 3. INCOMING REQUEST VIEW
    if (status === 'request' && currentRide) {
        return (
            <div className="w-full max-w-3xl bg-zinc-900 text-white rounded-2xl p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 border border-zinc-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 to-green-300 animate-progress" />

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
                            New Request
                        </span>
                        <h2 className="text-4xl font-bold mt-2">₹{currentRide.price}</h2>
                        <p className="text-zinc-400 text-sm mt-1">Est. Earnings</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{currentRide.distance} km</div>
                        <div className="text-zinc-400 text-sm">Total Distance</div>
                    </div>
                </div>

                <div className="space-y-4 mb-8 bg-zinc-800/50 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <span className="text-lg">{currentRide.pickup.address}</span>
                    </div>
                    <div className="pl-2.5">
                        <div className="w-0.5 h-6 bg-zinc-700" />
                    </div>
                    <div className="flex items-center gap-4">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="text-lg">{currentRide.drop.address}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={rejectRide}
                        className="py-4 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={acceptRide}
                        className="py-4 rounded-xl font-bold bg-green-500 text-black hover:bg-green-400 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                    >
                        Accept Ride
                    </button>
                </div>
            </div>
        );
    }

    // 4. ACTIVE RIDE (PICKUP & TRIP) VIEW
    if ((status === 'pickup' || status === 'trip') && currentRide) {
        return (
            <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Left: Map Placeholder */}
                <div className="w-full md:w-1/2 bg-zinc-100 dark:bg-zinc-950 h-64 md:h-auto flex items-center justify-center relative">
                    <Navigation className="w-12 h-12 text-zinc-300" />
                    <div className="absolute top-4 left-4 bg-white dark:bg-zinc-900 px-3 py-1 rounded-lg shadow-md text-xs font-bold">
                        MAP PREVIEW
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{currentRide.passenger}</h3>
                            <div className="flex items-center gap-1 text-sm text-zinc-500">
                                <span>★ {currentRide.rating}</span> • <span>Cash Trip</span>
                            </div>
                        </div>
                        <button className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200">
                            <Phone className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {status === 'pickup' ? (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Navigation</p>
                                <p className="text-sm dark:text-blue-100">Heading to Pickup location</p>
                            </div>
                        ) : (
                            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800">
                                <p className="text-xs font-bold text-green-600 uppercase mb-1">Navigation</p>
                                <p className="text-sm dark:text-green-100">Heading to Drop location</p>
                            </div>
                        )}

                        {/* OTP Input Section (Only during Pickup) */}
                        {status === 'pickup' && (
                            <div className="py-4">
                                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Enter Start OTP</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter 4-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                    <button
                                        onClick={startTrip}
                                        disabled={otp.length < 4}
                                        className="px-6 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl disabled:opacity-50"
                                    >
                                        Start
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Complete Button (Only during Trip) */}
                        {status === 'trip' && (
                            <button
                                onClick={completeTrip}
                                className="w-full py-4 mt-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-colors"
                            >
                                Complete Trip
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}