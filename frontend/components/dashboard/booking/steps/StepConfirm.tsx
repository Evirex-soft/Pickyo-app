"use client";
import { CheckCircle2, MapPin } from "lucide-react";
import { useBooking } from "../BookingContext";

export default function StepConfirm() {
    const { bookingState, resetBooking } = useBooking();

    return (
        <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Booking Confirmed!</h2>
            <p className="text-zinc-500 mb-8">Your {bookingState.serviceType} is on the way.</p>

            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 text-left mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Service</span>
                    <span className="font-medium text-zinc-900 dark:text-white capitalize">{bookingState.serviceType} - {bookingState.selectedVehicle}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Total Price</span>
                    <span className="font-bold text-zinc-900 dark:text-white">${bookingState.price}</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-700 my-2 pt-2">
                    <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                        <MapPin className="w-4 h-4 mt-0.5 text-blue-500" />
                        <span className="truncate">{bookingState.pickup}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300 mt-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-red-500" />
                        <span className="truncate">{bookingState.drop}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={resetBooking}
                className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold hover:opacity-90 transition-all"
            >
                Book Another
            </button>
        </div>
    );
}