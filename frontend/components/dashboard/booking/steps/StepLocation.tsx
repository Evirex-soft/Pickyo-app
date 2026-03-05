"use client";

import { MapPin, Navigation } from "lucide-react";
import { useBooking } from "../BookingContext";
import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

export default function StepLocation() {
    const { bookingState, updateBooking, nextStep } = useBooking();

    const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);
    const dropRef = useRef<google.maps.places.Autocomplete | null>(null);

    const handlePlaceSelect = (type: "pickup" | "drop") => {
        const ref = type === "pickup" ? pickupRef : dropRef;
        const place = ref.current?.getPlace();

        if (place?.geometry?.location) {
            const locationData = {
                address: place.formatted_address || "",
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };

            if (type === "pickup") updateBooking({ pickup: locationData });
            else updateBooking({ drop: locationData });
        }
    };

    const handleNext = () => {
        if (bookingState.pickup && bookingState.drop) nextStep();
    };

    return (
        <div className="space-y-6">

            {/* Pickup */}
            <div>
                <span className="text-sm font-medium">Pickup Location</span>

                <Autocomplete
                    onLoad={(auto) => (pickupRef.current = auto)}
                    onPlaceChanged={() => handlePlaceSelect("pickup")}
                >
                    <div className="relative mt-1">
                        <Navigation className="absolute left-3 top-3 w-5 h-5 text-blue-500" />

                        <input
                            type="text"
                            placeholder="Enter pickup location"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border"
                        />
                    </div>
                </Autocomplete>
            </div>

            {/* Drop */}
            <div>
                <span className="text-sm font-medium">Drop Location</span>

                <Autocomplete
                    onLoad={(auto) => (dropRef.current = auto)}
                    onPlaceChanged={() => handlePlaceSelect("drop")}
                >
                    <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-red-500" />

                        <input
                            type="text"
                            placeholder="Enter drop destination"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border"
                        />
                    </div>
                </Autocomplete>
            </div>

            <button
                onClick={handleNext}
                disabled={!bookingState.pickup || !bookingState.drop}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl"
            >
                Continue
            </button>
        </div>
    );
}