"use client";

import { LoadScript } from "@react-google-maps/api";
import { ReactNode } from "react";
import Spinner from "@/components/LoadingSpinner";

const libraries: ("places")[] = ["places"];

export default function GoogleMapsProvider({ children }: { children: ReactNode }) {
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            libraries={libraries}
            loadingElement={
                <div className="min-h-screen flex items-center justify-center">
                    <Spinner />
                </div>
            }
        >
            {children}
        </LoadScript>
    );
}