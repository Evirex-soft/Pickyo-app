"use client";

import { useEffect, useState } from "react";
import { Clock, ChevronRight, AlertCircle, User, IndianRupee } from "lucide-react";
import { getDriverTrips } from "@/services/driver.service";


interface Customer {
    name: string;
    rating: number;
}

interface Trip {
    id: string;
    vehicleType: string;
    distanceKm: number;
    price: number;
    status: string;
    createdAt: string;
    customer?: Customer;
    rideLocation: {
        pickupAddress: string;
        dropAddress: string;
    };
}

export default function DriverRideHistory() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const data = await getDriverTrips(currentPage, itemsPerPage);
                setTrips(data.trips);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching driver trips:", error)
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [currentPage]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR'
        }).format(amount)
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Ride History</h1>
                <p className="text-zinc-500 text-sm">Track your completed jobs and total earnings</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-44 bg-zinc-100 dark:bg-zinc-900 rounded-4xl animate-pulse" />
                    ))}
                </div>
            ) : trips.length > 0 ? (
                <div className="space-y-4">
                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-4xl p-6 hover:shadow-xl transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                {/* Left Side: Route Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                            <Clock size={16} className="text-zinc-600 dark:text-zinc-400" />
                                        </div>
                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                            {formatDate(trip.createdAt)}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${trip.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
                                            }`}>
                                            {trip.status}
                                        </span>
                                    </div>

                                    <div className="relative pl-6 space-y-4">
                                        <div className="absolute left-7px top-2 bottom-2 w-1px bg-zinc-200 dark:bg-zinc-700" />
                                        <div className="relative flex items-start gap-3">
                                            <div className="absolute -left-5.75 mt-1.5 w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 ring-4 ring-white dark:ring-zinc-900" />
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-zinc-400">Pickup</p>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">{trip.rideLocation?.pickupAddress}</p>
                                            </div>
                                        </div>
                                        <div className="relative flex items-start gap-3">
                                            <div className="absolute -left-5.75 mt-1.5 w-2 h-2 rounded-full bg-zinc-900 dark:bg-white ring-4 ring-white dark:ring-zinc-900" />
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-zinc-400">Drop-off</p>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">{trip.rideLocation?.dropAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Financials & Customer */}
                                <div className="md:w-64 flex flex-col gap-3">
                                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-[10px] uppercase font-bold text-zinc-400">Earnings</p>
                                            <IndianRupee size={12} className="text-zinc-400" />
                                        </div>
                                        <p className="text-xl font-black text-zinc-900 dark:text-white">
                                            {formatCurrency(trip.price)}
                                        </p>
                                        <p className="text-[10px] text-zinc-500 mt-1">{trip.distanceKm} km total distance</p>
                                    </div>

                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                                <User size={14} className="text-zinc-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Customer</p>
                                                <p className="text-xs font-bold dark:text-zinc-200">{trip.customer?.name}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                            <ChevronRight size={18} className="text-zinc-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination  */}
                    <div className="flex items-center justify-between pt-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 font-bold text-sm"
                        >
                            Previous
                        </button>
                        <p className="text-sm font-bold text-zinc-500">Page {currentPage} of {totalPages}</p>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 font-bold text-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
                    <AlertCircle className="mx-auto mb-4 text-zinc-300" size={48} />
                    <h3 className="text-xl font-bold">No rides yet</h3>
                    <p className="text-zinc-500">Go online to start receiving ride requests.</p>
                </div>
            )}
        </div>
    );

}