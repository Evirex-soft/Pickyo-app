"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useBooking } from "../BookingContext";
import { MapPin, Loader2, Star, Phone, MessageSquare, ShieldCheck, Car, Flag } from "lucide-react";
import { createRide } from "@/services/ride.service";
import { io, Socket } from "socket.io-client";
import { connectSocket } from "@/socket/socket";

// Define statuses based on your Backend Prisma schema
type RideStatus = 'idle' | 'searching' | 'driver_assigned' | 'ride_started' | 'completed';

export default function StepConfirm() {
    const { bookingState, resetBooking } = useBooking();

    const user = useSelector((state: RootState) => state.auth.user);

    const [status, setStatus] = useState<RideStatus>('idle');
    const [driverInfo, setDriverInfo] = useState<any>(null);
    const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!user?.id) return;

        const socket = connectSocket(user.id, "user");
        socketRef.current = socket;

        socket.on("ride-accepted", (data) => {
            setDriverInfo(data.driver);
            setStatus('driver_assigned');
        });

        socket.on("driver-location-updated", (location) => {
            setDriverLocation(location);
        });

        socket.on("ride-started", () => {
            setStatus('ride_started');
        });

        socket.on("ride-completed", () => {
            setStatus('completed');
        });

        return () => {
            socket.off("ride-accepted");
            socket.off("ride-started");
            socket.off("ride-completed");
            socket.off("driver-location-updated");
        };

    }, [user?.id]);

    const handleConfirm = async () => {
        try {
            if (!bookingState.pickup || !bookingState.drop) return;
            setStatus('searching');

            // This calls your createRideController
            await createRide({
                pickup: bookingState.pickup,
                drop: bookingState.drop,
                distance: bookingState.distance,
                price: bookingState.price,
                vehicleType: bookingState.selectedVehicle || ''
            });
        } catch (err) {
            console.error(err);
            setStatus('idle');
            alert("Failed to request ride");
        }
    };


    if (status === 'searching') {
        return (
            <div className="flex flex-col items-center justify-center h-full py-10 animate-in fade-in">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                    <div className="relative bg-white dark:bg-zinc-800 p-6 rounded-full shadow-xl border border-blue-100">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Finding your driver...</h3>
                <p className="text-zinc-500 text-sm">Nearby {bookingState.selectedVehicle}s are being notified</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-red-500 font-medium text-sm"
                >
                    Cancel Request
                </button>
            </div>
        );
    }

    if (status === 'driver_assigned' || status === 'ride_started') {
        return (

            <div className="animate-in slide-in-from-bottom duration-500 h-full flex flex-col">
                <div className="mb-6">
                    <h2 className="text-xl font-bold">
                        {status === 'driver_assigned' ? "Driver is coming to you" : "You are on your way"}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        {status === 'driver_assigned' ? "Meeting at pickup point" : "Heading to drop-off"}
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 rounded-2xl p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                                👨‍✈️
                            </div>
                            <div>
                                <h3 className="font-bold">{driverInfo?.name}</h3>
                                <div className="flex items-center text-xs text-zinc-500 gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{driverInfo?.rating}</span>
                                </div>-
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{driverInfo?.license}</p>
                            <p className="text-xs text-zinc-500">{driverInfo?.vehicleType}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <a href={`tel:${driverInfo?.phone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-100 font-medium">
                            <Phone className="w-4 h-4" /> Call
                        </a>
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-100 font-medium">
                            <MessageSquare className="w-4 h-4" /> Message
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-xs text-blue-600 font-semibold uppercase">Security OTP</p>
                            <p className="text-xl font-bold text-blue-700">1234</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (['driver_assigned', 'ride_started'].includes(status)) {
        return (
            <div className="flex flex-col h-full">
                {/* Live Map Area */}
                <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl mb-4 relative overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    {driverLocation ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping absolute" />
                            <div className="w-4 h-4 bg-blue-600 rounded-full relative border-2 border-white" />
                            <p className="mt-4 text-[10px] font-mono text-zinc-500">
                                Driver: {driverLocation.lat.toFixed(5)}, {driverLocation.lng.toFixed(5)}
                            </p>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
                            Waiting for driver GPS...
                        </div>
                    )}
                </div>

                {/* Rest of your driver info UI... */}
            </div>
        );
    }

    if (status === 'completed') {
        return (
            <div className="text-center h-full flex flex-col justify-center animate-in zoom-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <Flag className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Arrived!</h2>
                <p className="text-zinc-500 mb-8">Hope you had a safe trip.</p>
                <div className="bg-zinc-50 p-6 rounded-xl mb-8">
                    <p className="text-sm text-zinc-500">Total Paid</p>
                    <p className="text-3xl font-bold">₹{bookingState.price}</p>
                </div>
                <button onClick={resetBooking} className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold">
                    Done
                </button>
            </div>
        );
    }

    // Default Review UI
    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold mb-6">Review Ride</h2>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-6 space-y-4">
                <div className="flex gap-3">
                    <MapPin className="text-zinc-400 w-5 h-5" />
                    <p className="text-sm line-clamp-1">{bookingState.pickup?.address}</p>
                </div>
                <div className="flex gap-3">
                    <MapPin className="text-zinc-900 dark:text-white w-5 h-5" />
                    <p className="text-sm line-clamp-1">{bookingState.drop?.address}</p>
                </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-xl mb-8">
                <div className="flex items-center gap-3">
                    <Car />
                    <div>
                        <p className="font-bold capitalize">{bookingState.selectedVehicle}</p>
                        <p className="text-xs text-zinc-500">{bookingState.distance.toFixed(1)} km</p>
                    </div>
                </div>
                <p className="text-xl font-bold">₹{bookingState.price}</p>
            </div>

            <button
                onClick={handleConfirm}
                className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold"
            >
                Confirm Booking
            </button>
        </div>
    );
}