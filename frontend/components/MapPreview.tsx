"use client";

import { useEffect, useState, useMemo } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useBooking } from "./dashboard/booking/BookingContext";

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
    scrollWheel: true,
};

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "1.5rem",
};

export default function MapPreview() {
    const { bookingState, updateBooking } = useBooking();
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    // Center map on pickup or default locaiton
    const center = useMemo(() => {
        if (bookingState.pickup) return { lat: bookingState.pickup.lat!, lng: bookingState.pickup.lng! };
        if (bookingState.drop) return { lat: bookingState.drop.lat!, lng: bookingState.drop.lng! };
        return { lat: 20.5937, lng: 78.9629 }; // Default to center of India
    }, [bookingState.pickup, bookingState.drop]);

    // Calculate Route
    useEffect(() => {
        if (bookingState.pickup && bookingState.drop) {
            const service = new google.maps.DirectionsService();

            service.route(
                {
                    origin: { lat: bookingState.pickup.lat, lng: bookingState.pickup.lng },
                    destination: { lat: bookingState.drop.lat, lng: bookingState.drop.lng },
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === "OK" && result) {
                        setDirections(result);

                        // Calculate distance
                        const distanceInKm = result.routes[0].legs[0].distance?.value
                            ? result.routes[0].legs[0].distance.value / 1000
                            : 0;

                        updateBooking({ distance: distanceInKm });
                    }
                }
            );
        } else {
            setDirections(null);
        }
    }, [bookingState.pickup, bookingState.drop]);

    useEffect(() => {
        if (map && bookingState.pickup && !bookingState.drop) {
            map.panTo({ lat: bookingState.pickup.lat!, lng: bookingState.pickup.lng! });
            map.setZoom(15);
        }
    }, [bookingState.pickup, map]);

    return (
        <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-inner bg-zinc-100 dark:bg-zinc-800 relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                options={mapOptions}
                onLoad={(mapInstance) => setMap(mapInstance)}
            >
                {/* Render pickup marker */}
                {bookingState.pickup && !directions && (
                    <Marker
                        position={{ lat: bookingState.pickup.lat, lng: bookingState.pickup.lng }}
                        icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                    />
                )}

                {/* Render drop marker */}
                {bookingState.drop && !directions && (
                    <Marker
                        position={{ lat: bookingState.drop.lat, lng: bookingState.drop.lng }}
                        icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                    />
                )}

                {/* Render directions */}
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            polylineOptions: {
                                strokeColor: "#2563EB", // Blue line
                                strokeWeight: 5,
                            },
                            suppressMarkers: false,
                        }}
                    />
                )}
            </GoogleMap>

            {!map && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 z-10">
                    <span className="text-zinc-500 animate-pulse">Loading Map...</span>
                </div>
            )}
        </div>
    )
}