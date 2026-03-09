"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Types
export type DriverStatus = "offline" | "idle" | "request" | "pickup" | "trip";

interface RideRequest {
    id: string;
    pickup: {
        address: string;
        lat: number;
        lng: number;
    };
    drop: {
        address: string;
        lat: number;
        lng: number;
    };
    distance: number;
    price: number;
    passenger: string;
    rating: number;
}

interface DriverContextType {
    status: DriverStatus;
    currentRide: RideRequest | null;
    earnings: number;
    toggleOnline: () => void;
    acceptRide: () => void;
    rejectRide: () => void;
    startTrip: () => void;
    completeTrip: () => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<DriverStatus>('offline');
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [earnings, setEarnings] = useState(1250); // Mock earnings

    // Toggle online/offline status
    const toggleOnline = () => {
        if (status === 'offline') {
            setStatus('idle')
            setTimeout(() => {
                triggerMockRequest();
            }, 3000);
        } else {
            setStatus('offline');
            setCurrentRide(null);
        }
    };

    const triggerMockRequest = () => {
        setCurrentRide({
            id: "ORD-9982",
            pickup: {
                address: "Terminal 2, Int. Airport",
                lat: 19.1214,
                lng: 72.8523
            },
            drop: {
                address: "Grand Hyatt, Santacruz",
                lat: 19.0760,
                lng: 72.8077
            },
            price: 450,
            distance: 12.4,
            passenger: "Vikram Singh",
            rating: 4.8
        });
        setStatus('request');
    };

    const acceptRide = () => setStatus('pickup');

    const rejectRide = () => {
        setStatus('idle');
        setCurrentRide(null);
        // Retry simulation
        setTimeout(triggerMockRequest, 5000);
    };

    const startTrip = () => setStatus('trip');

    const completeTrip = () => {
        if (currentRide) setEarnings(e => e + currentRide.price);
        setStatus('idle');
        setCurrentRide(null);
    };

    return (
        <DriverContext.Provider value={{
            status, currentRide, earnings,
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