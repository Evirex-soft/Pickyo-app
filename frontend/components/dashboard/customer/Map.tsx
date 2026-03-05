"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Fix icons (run this once outside component)
const iconFix = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapProps {
    className?: string;
}

const Map = ({ className }: MapProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Coordinates
    const pickup = [37.7749, -122.4194] as [number, number];
    const dropoff = [37.3382, -121.8863] as [number, number];
    const truckLocation = [37.5620, -122.2800] as [number, number];

    // Prevent SSR rendering issues
    if (!isMounted) {
        return <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />;
    }

    return (
        <MapContainer
            center={truckLocation}
            zoom={10}
            scrollWheelZoom={false}
            className={className} // Pass the classname down
            style={{ height: "100%", width: "100%", zIndex: 0 }} // Explicitly force 100%
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={isDark
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
            />

            <Polyline
                positions={[pickup, truckLocation, dropoff]}
                pathOptions={{ color: isDark ? '#818cf8' : '#4f46e5', weight: 4, opacity: 0.7, dashArray: '10, 10' }}
            />

            <Marker position={truckLocation} icon={iconFix}>
                <Popup>Active Truck</Popup>
            </Marker>

            <Marker position={pickup} icon={iconFix} opacity={0.5} />
            <Marker position={dropoff} icon={iconFix} opacity={0.5} />
        </MapContainer>
    );
};

export default Map;