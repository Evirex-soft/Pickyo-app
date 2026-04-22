"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback } from "react";
import { Loader2 } from "lucide-react";

interface MapPickerProps {
    center: { lat: number; lng: number };
    onLocationSelect: (lat: number, lng: number) => void;
    mapContainerStyle: React.CSSProperties;
}



export default function MapPicker({ center, onLocationSelect, mapContainerStyle }: MapPickerProps) {

    const onMapClick = useCallback((e: any) => {
        if (e.latLng) {
            onLocationSelect(e.latLng.lat(), e.latLng.lng());
        }
    }, [onLocationSelect]);

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            onClick={onMapClick}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
                clickableIcons: false
            }}
        >
            <Marker
                position={center}
                draggable
                onDragEnd={(e) => {
                    if (e.latLng) {
                        onLocationSelect(e.latLng.lat(), e.latLng.lng());
                    }
                }}
            />
        </GoogleMap>
    );
}