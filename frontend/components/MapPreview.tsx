"use client";

import { useEffect, useState, useMemo } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { useBooking } from "./dashboard/booking/BookingContext";
import { useDriver } from "./dashboard/driver/DriverContext";
import Spinner from "./LoadingSpinner";

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
    scrollWheel: true,
};


const containerStyle = {
    width: "100%",
    height: "100%",
};

export default function MapPreview() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    });



    const booking = useBooking();
    const bookingState = booking?.bookingState;
    const updateBooking = booking?.updateBooking;

    const driver = useDriver();
    const currentRide = driver?.currentRide;


    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    // Center map on pickup or default locaiton
    const center = useMemo(() => {
        if (currentRide?.pickup) return { lat: currentRide.pickup.lat, lng: currentRide.pickup.lng };
        if (bookingState?.pickup) return { lat: bookingState.pickup.lat!, lng: bookingState.pickup.lng! };
        if (bookingState?.drop) return { lat: bookingState.drop.lat!, lng: bookingState.drop.lng! };
        return { lat: 20.5937, lng: 78.9629 }; // Default to center of India
    }, [currentRide, bookingState?.pickup, bookingState?.drop]);

    // Calculate Route
    useEffect(() => {
        if (bookingState?.pickup && bookingState?.drop) {
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

                        if (updateBooking) {
                            updateBooking({ distance: distanceInKm });
                        }
                    }
                }
            );
        } else {
            setDirections(null);
        }
    }, [bookingState?.pickup, bookingState?.drop]);

    useEffect(() => {
        if (map && bookingState?.pickup && !bookingState.drop) {
            map.panTo({ lat: bookingState.pickup.lat!, lng: bookingState.pickup.lng! });
            map.setZoom(15);
        }
    }, [bookingState?.pickup, map]);


    // Update directions when driver accepts ride
    useEffect(() => {
        if (currentRide?.pickup && currentRide?.drop) {
            const service = new google.maps.DirectionsService();

            service.route(
                {
                    origin: {
                        lat: currentRide.pickup.lat,
                        lng: currentRide.pickup.lng
                    },
                    destination: {
                        lat: currentRide.drop.lat,
                        lng: currentRide.drop.lng
                    },
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === "OK" && result) {
                        setDirections(result);
                    }
                }
            );
        }
    }, [currentRide]);

    // Fit map to markers
    useEffect(() => {
        if (!map || !currentRide) return;

        const bounds = new google.maps.LatLngBounds();

        bounds.extend({
            lat: currentRide?.pickup.lat,
            lng: currentRide?.pickup.lng
        });

        bounds.extend({
            lat: currentRide.drop.lat,
            lng: currentRide?.drop.lng
        });

        map.fitBounds(bounds);

    }, [currentRide, map]);

    // Resize map
    useEffect(() => {
        if (!map) return;

        const resizeMap = () => {
            google.maps.event.trigger(map, "resize");

            if (bookingState?.pickup) {
                map.panTo({
                    lat: bookingState.pickup.lat!,
                    lng: bookingState.pickup.lng!,
                });
            }
        };
        const timeout = setTimeout(resizeMap, 200);

        return () => clearTimeout(timeout);
    }, [map, bookingState?.pickup, bookingState?.drop]);

    if (!isLoaded) return <Spinner />;

    return (
        <div className="w-full h-full overflow-hidden shadow-inner bg-zinc-100 dark:bg-zinc-800 relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                options={mapOptions}
                onLoad={(mapInstance) => setMap(mapInstance)}
            >
                {/* Render pickup marker */}
                {bookingState?.pickup && !directions && (
                    <Marker
                        position={{ lat: bookingState.pickup.lat, lng: bookingState.pickup.lng }}
                        icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                    />
                )}

                {/* Render drop marker */}
                {bookingState?.drop && !directions && (
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

                {currentRide?.pickup && (
                    <Marker
                        position={{
                            lat: currentRide.pickup.lat,
                            lng: currentRide.pickup.lng
                        }}
                        icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                    />
                )}

                {currentRide?.drop && (
                    <Marker
                        position={{
                            lat: currentRide.drop.lat,
                            lng: currentRide.drop.lng
                        }}
                        icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                    />
                )}

            </GoogleMap>

            {!map && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 z-10">
                    <Spinner />
                </div>
            )}
        </div>
    )
}