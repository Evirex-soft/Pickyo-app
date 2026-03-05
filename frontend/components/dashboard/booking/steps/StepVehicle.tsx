"use client";
import { useEffect, useState } from "react";
import { useBooking } from "../BookingContext";
import { Car, Truck, Zap, Clock } from "lucide-react";

export default function StepVehicle() {
    const { bookingState, updateBooking, nextStep } = useBooking();
    const isRide = bookingState.serviceType === "ride";

    // Simulate Fetching Prices from Backend
    const vehicles = isRide ? [
        { id: "eco", name: "Economy", icon: Car, basePrice: 10, multiplier: 1, time: "5 min" },
        { id: "lux", name: "Premium", icon: Car, basePrice: 20, multiplier: 1.5, time: "8 min" },
        { id: "ev", name: "Electric", icon: Zap, basePrice: 12, multiplier: 1.1, time: "4 min" },
    ] : [
        { id: "bike", name: "Motorbike", icon: Zap, basePrice: 5, multiplier: 0.8, time: "15 min" },
        { id: "truck", name: "Mini Truck", icon: Truck, basePrice: 25, multiplier: 2.0, time: "30 min" },
    ];

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-zinc-500 mb-4">Select the best option for you</p>

            <div className="space-y-3">
                {vehicles.map((v) => {
                    const calculatedPrice = Math.round((v.basePrice + (bookingState.distance * v.multiplier)));
                    const isSelected = bookingState.selectedVehicle === v.id;

                    return (
                        <div
                            key={v.id}
                            onClick={() => updateBooking({ selectedVehicle: v.id, price: calculatedPrice })}
                            className={`relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                    ? `border-2 ${isRide ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10'}`
                                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? (isRide ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600') : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                    }`}>
                                    <v.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white">{v.name}</h4>
                                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {v.time} away
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-zinc-900 dark:text-white">${calculatedPrice}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={nextStep}
                disabled={!bookingState.selectedVehicle}
                className="w-full py-3 mt-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
                Proceed to Pay
            </button>
        </div>
    );
}