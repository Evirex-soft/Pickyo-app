"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, } from "react";
import { connectSocket, getSocket } from "@/socket/socket";
import * as DriverService from "@/services/driver.service";
import { useSelector } from "react-redux";

export type DriverStatus = "offline" | "idle" | "request" | "pickup" | "trip";

interface RideRequest {
    id: string;
    pickup: { address: string; lat: number; lng: number; };
    drop: { address: string; lat: number; lng: number; };
    distance: number;
    price: number;
    driverEarning: number;
    passenger: string;
    rating: number;
}

interface DriverContextType {
    status: DriverStatus;
    currentRide: RideRequest | null;
    earnings: number;
    isLoading: boolean;
    toggleOnline: () => Promise<void>;
    acceptRide: () => Promise<void>;
    rejectRide: () => Promise<void>;
    startTrip: (otp: string) => Promise<boolean>;
    completeTrip: () => Promise<void>;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<DriverStatus>('offline');
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [earnings, setEarnings] = useState(1250);
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        let watchSocketId: number;

        const trackingStatuses = ['driver_assigned', 'driver_arriving', 'ride_started'];

        if (trackingStatuses.includes(status) && currentRide) {
            watchSocketId = navigator.geolocation.watchPosition((position) => {
                const socket = getSocket();
                if (socket) {
                    socket.emit("update-location", {
                        userId: currentRide.id,
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                }
            },
                (err) => console.log("GPS Error:", err),
                {
                    enableHighAccuracy: true,
                    distanceFilter: 10
                })
        }
        return () => {
            if (watchSocketId) navigator.geolocation.clearWatch(watchSocketId);
        }
    }, [status, currentRide]);

    // Helper to reset to searching state
    const resetToIdle = () => {
        setStatus('idle');
        setCurrentRide(null);
    };

    const checkPendingRide = async () => {
        try {
            const rides = await DriverService.checkPendingRidesAPI();
            if (rides.length > 0) {
                setCurrentRide(rides[0]);
                // Automatically set correct state based on ride status from backend
                // (Assuming your API returns ride status)
                const rideStatus = rides[0].status; // e.g., 'accepted', 'started'
                if (rideStatus === 'started') setStatus('trip');
                else if (rideStatus === 'accepted') setStatus('pickup');
                else setStatus('request');
            } else {
                setStatus("idle");
            }
        } catch (error) {
            console.error("Error fetching rides", error);
        }
    };

    const toggleOnline = async () => {
        setIsLoading(true);
        try {
            const isGoingOnline = status === 'offline';
            await DriverService.toggleDriverStatusAPI(isGoingOnline);

            if (isGoingOnline) {
                const vehicleType = user?.driverProfile?.vehicleType;
                if (!vehicleType) throw new Error("No vehicle found");

                await checkPendingRide();
                connectSocket(user.id, "driver", vehicleType);

                const socket = getSocket();
                socket.off("new-ride").on("new-ride", (ride) => {
                    setCurrentRide(ride);
                    setStatus("request");
                    // Add Haptic feedback or sound here for real device
                });
            } else {
                setStatus('offline');
                setCurrentRide(null);
                getSocket()?.disconnect();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const acceptRide = async () => {
        if (!currentRide) return;
        setIsLoading(true);
        try {
            await DriverService.acceptRideAPI(currentRide.id);
            setStatus('pickup');
        } finally {
            setIsLoading(false);
        }
    };

    const rejectRide = async () => {
        if (!currentRide) return;
        setIsLoading(true);
        try {
            await DriverService.rejectRideAPI(currentRide.id);
            resetToIdle();
            await checkPendingRide();
        } finally {
            setIsLoading(false);
        }
    };

    const startTrip = async (otp: string) => {
        if (!currentRide) return false;
        setIsLoading(true);
        try {
            const res = await DriverService.verifyOtpAPI(currentRide.id, otp);
            if (res?.ride) {
                setStatus('trip');
                return true;
            }
            return false;
        } catch (error) {
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const completeTrip = async () => {
        if (!currentRide) return;
        setIsLoading(true);
        try {
            const res: any = await DriverService.completeTripAPI(currentRide.id);
            setEarnings(e => e + (res.earnings || 0));
            resetToIdle();
            await checkPendingRide();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DriverContext.Provider value={{
            status, currentRide, earnings, isLoading,
            toggleOnline, acceptRide, rejectRide, startTrip, completeTrip
        }}>
            {children}
        </DriverContext.Provider>
    );
}

export const useDriver = () => {
    const context = useContext(DriverContext);
    if (!context) throw new Error("useDriver must be used within DriverProvider");
    return context;
};