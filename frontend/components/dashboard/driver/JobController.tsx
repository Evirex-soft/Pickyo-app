"use client";

import { useState } from "react";
import { useDriver } from "./DriverContext";
import { MapPin, Navigation, Phone, Power, Radar, Check, X, ShieldAlert } from "lucide-react";

export default function JobController() {
    const { status, currentRide, isLoading, toggleOnline, acceptRide, rejectRide, startTrip, completeTrip } = useDriver();
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState(false);

    const handleStartTrip = async () => {
        const success = await startTrip(otp);
        if (!success) setOtpError(true);
    };

    if (status === 'offline') {
        return (
            <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200 dark:border-zinc-700 p-8 text-center flex flex-col items-center justify-center min-h-62.5">
                <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center mb-4">
                    <Power className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">You are Offline</h2>
                <p className="text-sm text-zinc-500 mb-6">Go online to receive new ride requests.</p>
                <button
                    onClick={toggleOnline} disabled={isLoading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {isLoading ? "Going Online..." : "Go Online"}
                </button>
            </div>
        );
    }

    if (status === 'idle') {
        return (
            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 p-8 text-center flex flex-col items-center justify-center min-h-62.5 relative overflow-hidden">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
                    <Radar className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin-slow" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Finding Rides...</h2>
                <p className="text-sm text-zinc-500 mb-6">Stay in this area for higher demand.</p>
                <button
                    onClick={toggleOnline} disabled={isLoading}
                    className="w-full py-3.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    Go Offline
                </button>
            </div>
        );
    }

    if (status === 'request' && currentRide) {
        return (
            <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-500 border border-zinc-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 to-emerald-400 animate-[pulse_1s_ease-in-out_infinite]" />

                <div className="flex justify-between items-start mb-6 pt-2">
                    <div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Est. Earnings</p>
                        <h2 className="text-4xl font-black text-green-400">₹{currentRide.price}</h2>
                    </div>
                    <div className="text-right bg-zinc-800 px-3 py-1.5 rounded-lg">
                        <div className="text-lg font-bold">{currentRide.distance} km</div>
                        <div className="text-zinc-400 text-xs uppercase tracking-wide">Distance</div>
                    </div>
                </div>

                <div className="space-y-3 mb-6 bg-zinc-800/60 p-4 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium leading-tight">{currentRide?.pickup?.address}</span>
                    </div>
                    <div className="w-0.5 h-4 bg-zinc-700 ml-2.5" />
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium leading-tight">{currentRide?.drop?.address}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={rejectRide} disabled={isLoading} className="flex-1 py-4 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                        <X className="w-5 h-5" /> Decline
                    </button>
                    <button onClick={acceptRide} disabled={isLoading} className="flex-2 py-4 rounded-xl font-bold bg-green-500 hover:bg-green-400 text-zinc-950 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-colors disabled:opacity-50">
                        <Check className="w-5 h-5" /> Accept Ride
                    </button>
                </div>
            </div>
        );
    }

    if ((status === 'pickup' || status === 'trip') && currentRide) {
        const isPickup = status === 'pickup';
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm animate-in fade-in">
                {/* Header */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">
                                {currentRide.passenger.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-white">{currentRide.passenger}</h3>
                            <div className="text-xs text-zinc-500 flex items-center gap-1">
                                <span className="text-yellow-500">★</span> {currentRide.rating} • Cash Trip
                            </div>
                        </div>
                    </div>
                    <button className="p-2.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                        <Phone className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Status Badge */}
                    <div className={`p-4 rounded-2xl flex items-start gap-3 border ${isPickup ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50'}`}>
                        <Navigation className={`w-6 h-6 shrink-0 ${isPickup ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isPickup ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {isPickup ? 'Heading to Pickup' : 'Heading to Dropoff'}
                            </p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                                {isPickup ? currentRide.pickup.address : currentRide.drop.address}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    {isPickup ? (
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Enter Start OTP</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={4}
                                    placeholder="4-digit PIN"
                                    value={otp}
                                    onChange={(e) => { setOtp(e.target.value); setOtpError(false); }}
                                    className={`w-full p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border ${otpError ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white text-center font-mono text-lg tracking-widest`}
                                />
                                <button
                                    onClick={handleStartTrip}
                                    disabled={otp.length < 4 || isLoading}
                                    className="px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
                                >
                                    Start
                                </button>
                            </div>
                            {otpError && <p className="text-xs text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Invalid OTP</p>}
                        </div>
                    ) : (
                        <button
                            onClick={completeTrip}
                            disabled={isLoading}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(239,68,68,0.4)] transition-colors disabled:opacity-50"
                        >
                            Complete Trip & Collect ₹{currentRide.price}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return null;
}