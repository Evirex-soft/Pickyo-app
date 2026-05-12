"use client";
import React, { useEffect, useState } from 'react';
import {
    MapPin, Navigation, Clock, ExternalLink,
    RefreshCw, ChevronLeft, ChevronRight, Activity,
    Phone, Car
} from 'lucide-react';
import { getActiveTrips } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const LiveTracking = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const TRIPS_PER_PAGE = 8;

    const fetchTrips = async () => {
        try {
            // Note: If your backend supports pagination for active trips, 
            // pass currentPage here.
            const data = await getActiveTrips();
            setTrips(data.trips);
            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
        const interval = setInterval(fetchTrips, 20000);
        return () => clearInterval(interval);
    }, []);

    // Pagination Logic
    const totalPages = Math.ceil(trips.length / TRIPS_PER_PAGE);
    const paginatedTrips = trips.slice(
        (currentPage - 1) * TRIPS_PER_PAGE,
        currentPage * TRIPS_PER_PAGE
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">

            {/* 1. Control Room Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <Activity size={24} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Live Operations</h2>
                        <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                            <Clock size={12} /> Syncing every 20s • Last update: {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-black uppercase text-slate-500 tracking-widest">
                        {trips.length} Active Trips
                    </div>
                    <button
                        onClick={() => { setIsLoading(true); fetchTrips(); }}
                        className="p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 active:scale-95"
                    >
                        <RefreshCw size={18} className={cn("text-slate-600", isLoading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* 2. Tracking Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                                <th className="px-8 py-5">Driver & Vehicle</th>
                                <th className="px-8 py-5">Route Progress</th>
                                <th className="px-8 py-5">GPS Signal</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Live View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => <TrackingRowSkeleton key={i} />)
                            ) : paginatedTrips.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                <Navigation size={32} />
                                            </div>
                                            <p className="text-slate-400 font-bold">No active trips being tracked right now.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedTrips.map((trip) => (
                                    <tr key={trip.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-sm">
                                                    {trip.driverName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{trip.driverName}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        <Car size={10} /> {trip.vehiclePlate || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1.5 relative">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]">{trip.pickup}</span>
                                                </div>
                                                <div className="w-[1px] h-3 bg-slate-200 ml-[2.5px]" />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]">{trip.dropoff}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                                                    <Clock size={12} className="text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
                                                        {formatLastSeen(trip.lastPingAt)}
                                                    </span>
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-400 ml-1">LAT: {trip.currentLat?.toFixed(4)}</p>
                                            </div>
                                        </td>

                                        <td className="px-8 py-5">
                                            <StatusBadge status={trip.status} />
                                        </td>

                                        <td className="px-8 py-5 text-right">
                                            <a
                                                href={`https://www.google.com/maps?q=${trip.currentLat},${trip.currentLng}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                                            >
                                                Track Trip <ExternalLink size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 3. Pagination Footer */}
                {!isLoading && trips.length > TRIPS_PER_PAGE && (
                    <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500">
                            Showing {paginatedTrips.length} of {trips.length} live trips
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Helper Components & Functions ---

const formatLastSeen = (dateString: string) => {
    if (!dateString) return "No Signal";
    const lastPing = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffInMins = Math.floor((now - lastPing) / 60000);

    if (diffInMins < 1) return "Just Now";
    if (diffInMins > 60) return "Lost Signal";
    return `${diffInMins}m ago`;
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        DRIVER_ARRIVING: "bg-amber-50 text-amber-600",
        DRIVER_ASSIGNED: "bg-blue-50 text-blue-600",
        RIDE_STARTED: "bg-emerald-50 text-emerald-600",
        SOS: "bg-red-50 text-red-600 animate-pulse",
    };
    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            styles[status] || "bg-slate-50 text-slate-600"
        )}>
            {status.replace("_", " ")}
        </span>
    );
};

const TrackingRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-8 py-5">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                <div className="space-y-2">
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                    <div className="h-2 w-16 bg-slate-100 rounded" />
                </div>
            </div>
        </td>
        <td className="px-8 py-5">
            <div className="space-y-3">
                <div className="h-2 w-40 bg-slate-100 rounded" />
                <div className="h-2 w-32 bg-slate-100 rounded" />
            </div>
        </td>
        <td className="px-8 py-5">
            <div className="h-8 w-24 bg-slate-100 rounded-xl" />
        </td>
        <td className="px-8 py-5">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
        </td>
        <td className="px-8 py-5 text-right">
            <div className="h-10 w-28 bg-slate-200 rounded-2xl ml-auto" />
        </td>
    </tr>
);