"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, ChevronRight, AlertCircle, User } from "lucide-react";
import { getTrips } from "@/services/user.service";

interface Driver {
    name: string;
    phone: string;
}

interface Trip {
    id: string;
    vehicleType: string;
    pickupLat: number;
    pickupLng: number;
    dropLat: number;
    dropLng: number;
    distanceKm: number;
    price: number;
    status: string;
    createdAt: string;
    driver?: Driver;
    rideLocation: {
        pickupAddress: string;
        dropAddress: string;
    };
}

export default function MyTrips() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    // Fetch Trips 
    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const data = await getTrips(currentPage, itemsPerPage);
                console.log("Fetched trips data:", data);
                setTrips(data.trips);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [currentPage]);


    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900">Your Trips</h1>
                <p className="text-zinc-500 text-sm">Review your ride history and payments</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-zinc-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : trips.length > 0 ? (
                <div className="space-y-4">
                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            className="group bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-400 transition-all shadow-sm"
                        >
                            {/* Header: Date, Status, and Price */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-zinc-900 rounded-xl text-white">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900">{formatDate(trip.createdAt)}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 font-bold uppercase text-zinc-600">
                                                {trip.vehicleType}
                                            </span>
                                            <span className="text-[10px] text-zinc-400">•</span>
                                            <span className="text-[10px] text-zinc-500 font-medium">{trip.distanceKm} km</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-zinc-900 text-lg">{formatPrice(trip.price)}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${trip.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                        {trip.status}
                                    </span>
                                </div>
                            </div>

                            {/* Body: Locations (Since your API has coords, showing simplified coords or "View Map") */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-3 relative">
                                    <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-zinc-100" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center z-10">
                                            <div className="w-2 h-2 rounded-full bg-zinc-300 shadow-[0_0_0_4px_rgba(255,255,255,1)]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase font-bold text-zinc-400">Pickup</p>
                                            <p className="text-sm text-zinc-600 truncate">
                                                {trip.rideLocation?.pickupAddress || "Unknown location"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center z-10">
                                            <MapPin size={14} className="text-zinc-900" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase font-bold text-zinc-400">Drop-off</p>
                                            <p className="text-sm text-zinc-600 truncate">
                                                {trip.rideLocation?.dropAddress || "Unknown location"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Driver Info Box */}
                                {trip.driver && (
                                    <div className="bg-zinc-50 rounded-xl p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-zinc-400">Driver</p>
                                                <p className="text-sm font-bold text-zinc-900 capitalize">{trip.driver.name}</p>
                                            </div>
                                        </div>
                                        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-6 py-2 text-sm font-bold text-zinc-900 bg-white border border-zinc-200 rounded-xl disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-medium text-zinc-500">
                            Page <span className="text-zinc-900">{currentPage}</span> of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-6 py-2 text-sm font-bold text-zinc-900 bg-white border border-zinc-200 rounded-xl disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                    <div className="bg-zinc-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-zinc-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900">No trips found</h3>
                    <p className="text-zinc-500">Your ride history will appear here once you complete a trip.</p>
                </div>
            )}
        </div>
    );
}