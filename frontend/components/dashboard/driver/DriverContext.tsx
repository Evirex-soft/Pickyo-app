"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import * as DriverService from "@/services/driver.service";

export type DriverStatus = "offline" | "idle" | "request" | "pickup" | "trip";

interface RideRequest {
    id: string;
    pickup: { address: string; lat: number; lng: number; };
    drop: { address: string; lat: number; lng: number; };
    distance: number;
    price: number;
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

    const toggleOnline = async () => {
        setIsLoading(true);
        const newStatus = status === 'offline';
        await DriverService.toggleDriverStatusAPI(newStatus);

        if (newStatus) {
            setStatus('idle');

            const rides: any = await DriverService.checkPendingRidesAPI();
            if (rides.length > 0) {
                setCurrentRide(rides[0]);
                setStatus("request");
            }
        } else {
            setStatus('offline');
            setCurrentRide(null);
        }
        setIsLoading(false);
    };

    const acceptRide = async () => {
        if (!currentRide) return;
        setIsLoading(true);
        await DriverService.acceptRideAPI(currentRide.id);
        setStatus('pickup');
        setIsLoading(false);
    };

    const rejectRide = async () => {
        if (!currentRide) return;
        setIsLoading(true);
        await DriverService.rejectRideAPI(currentRide.id);
        setStatus('idle');
        setCurrentRide(null);
        setIsLoading(false);

        // Resume searching
        const ride: any = await DriverService.checkPendingRidesAPI();
        setCurrentRide(ride);
        setStatus('request');
    };

    const startTrip = async (otp: string) => {
        if (!currentRide) return false;

        try {
            setIsLoading(true);

            const res = await DriverService.verifyOtpAPI(currentRide.id, otp);

            if (res?.ride) {
                setStatus('trip');
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const completeTrip = async () => {
        if (!currentRide) return;
        setIsLoading(true);
        const res: any = await DriverService.completeTripAPI(currentRide.id);
        setEarnings(e => e + res.earnings);
        setStatus('idle');
        setCurrentRide(null);
        setIsLoading(false);

        // Resume searching
        const ride: any = await DriverService.checkPendingRidesAPI();
        setCurrentRide(ride);
        setStatus('request');
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