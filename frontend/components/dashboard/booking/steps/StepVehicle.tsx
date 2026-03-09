"use client";
import { useEffect, useState } from "react";
import { useBooking } from "../BookingContext";
import { Clock } from "lucide-react";
import { getVehicles } from "@/services/ride.service";

export default function StepVehicle() {
    const { bookingState, updateBooking, nextStep } = useBooking();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const isRide = bookingState.serviceType === "ride";

    useEffect(() => {
        const fetchVehicles = async () => {
            const res = await getVehicles(bookingState.distance);
            setVehicles(res.vehicles);
        };

        fetchVehicles();
    }, [bookingState.distance]);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-zinc-500 mb-4">Select the best option for you</p>

            <div className="space-y-3">
                {vehicles.map((v) => {
                    const isSelected = bookingState.selectedVehicle === v.type;

                    return (
                        <div
                            key={v.type}
                            onClick={() => updateBooking({
                                selectedVehicle: v.type,
                                price: v.price
                            })}
                            className={`relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                ? `border-2 ${isRide ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10'}`
                                : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? (isRide ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600') : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                    }`}>
                                    <v.icon className="w-6 h-6" />
                                </div> */}
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-white">{v.name}</h4>
                                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {v.time} away
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-zinc-900 dark:text-white">₹{v.price.toFixed(2)}</p>
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
                Proceed to Confirm
            </button>
        </div>
    );
}