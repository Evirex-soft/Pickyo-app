"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ServiceType = "ride" | "package" | null;

export type LocationData = {
    address: string;
    lat: number;
    lng: number;
} | null;

interface BookingState {
    serviceType: ServiceType;
    pickup: LocationData;
    drop: LocationData;
    distance: number;
    packageDetails?: {
        weight: string;
        category: string;
    };
    rideDetails?: {
        passengers: number;
    };
    selectedVehicle: string | null;
    price: number;
}

interface BookingContextType {
    step: number;
    bookingState: BookingState;
    setServiceType: (type: ServiceType) => void;
    updateBooking: (data: Partial<BookingState>) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetBooking: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [step, setStep] = useState(0);
    const [bookingState, setBookingState] = useState<BookingState>({
        serviceType: null,
        pickup: null,
        drop: null,
        distance: 12.5,
        selectedVehicle: null,
        price: 0,
        rideDetails: { passengers: 1 },
        packageDetails: { weight: "", category: "" }
    });

    const setServiceType = (type: ServiceType) => {
        setBookingState((prev) => ({ ...prev, serviceType: type }));
        setStep(1);
    };

    const updateBooking = (data: Partial<BookingState>) => {
        setBookingState((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

    const resetBooking = () => {
        setStep(0);
        setBookingState({
            serviceType: null,
            pickup: null,
            drop: null,
            distance: 12.5,
            selectedVehicle: null,
            price: 0,
            rideDetails: { passengers: 1 },
            packageDetails: { weight: "", category: "" }
        });
    };

    return (
        <BookingContext.Provider value={{ step, bookingState, setServiceType, updateBooking, nextStep, prevStep, resetBooking }}>
            {children}
        </BookingContext.Provider>
    );

}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error("useBooking must be used within BookingProvider");
    return context;
};