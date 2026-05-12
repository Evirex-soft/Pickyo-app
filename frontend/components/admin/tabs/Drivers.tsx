"use client";
import React, { useEffect, useState } from 'react';
import {
    Search, MoreVertical, Star, Filter,
    ChevronLeft, ChevronRight, Car, IndianRupee,
    ShieldAlert, UserX,
    ChartArea
} from 'lucide-react';
import { getDrivers } from '@/services/admin.service';
import { Driver } from '@/types/admin.types';
import { cn } from '@/lib/utils';


export const DriverList = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalDrivers, setTotalDrivers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const DRIVERS_PER_PAGE = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getDrivers(currentPage, DRIVERS_PER_PAGE);
                setDrivers(data.drivers);
                setTotalDrivers(data.total);
            } catch (err) {
                setError("Could not load drivers")
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);

    const filteredDrivers = drivers.filter(d => d.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.vehicles?.[0]?.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) return <ErrorState message={error} />

    return (
        <div className='space-y-6 animate-in fade-in duration-700'>
            {/* Header */}
            <div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
                <div className='relative w-full md:w-96'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                    <input type='text' placeholder="Search driver or plate number..." className='w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-blue-500 outline-none transition-all shadow-sm' onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button className='flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm'>
                    <Filter size={18} /> Filter
                </button>
            </div>

            {/* Drivers Table */}
            <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead>
                            <tr className='bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold'>
                                <th className='px-8 py-5'>Driver</th>
                                <th className='px-8 py-5'>Vehicle Details</th>
                                <th className='px-8 py-5'>Performance</th>
                                <th className='px-8 py-5'>Earnings</th>
                                <th className='px-8 py-5'>Status</th>
                                <th className='px-8 py-5 text-right'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-50'>
                            {isLoading ? (
                                [...Array(6)].map((_, i) => <DriverRowSkeleton key={i} />)
                            ) : filteredDrivers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='py-20 text-center text-slate-400 font-medium'>No drivers found.</td>
                                </tr>
                            ) : (
                                filteredDrivers.map((driver) => (
                                    <tr key={driver.user.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className='px-8 py-5'>
                                            <div className='flex items-center gap-4'>
                                                <div className='w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm'>
                                                    {driver?.user?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className='text-sm font-bold text-slate-900'>{driver.user.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium tracking-tight">ID: {driver.user.id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-8 py-5'>
                                            <div className='flex items-center gap-3'>
                                                <div className='p-2 bg-slate-100 rounded-xl text-slate-600'>
                                                    <Car size={16} />
                                                </div>
                                                <div>
                                                    <p className='text-xs font-bold text-slate-700'>{driver.vehicles?.[0]?.plateNumber || "N/A"}</p>
                                                    <p className='text-xs font-bold text-slate-700'>{driver.vehicles?.[0]?.type || "unknown"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-8 py-5'>
                                            <div className='flex items-center gap-1'>
                                                <Star size={14} className='fill-amber-400 text-amber-400' />
                                                <span className='text-sm font-bold text-slate-700'>{driver.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1 text-sm font-black text-slate-900">
                                                <IndianRupee size={14} className="text-slate-400" />
                                                {driver.totalEarnings.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <StatusBadge status={driver.user.isActive ? "active" : "blocked"} />
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                                <MoreVertical size={18} className="text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && drivers.length > 0 && (
                    <div className='px-8 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between'>
                        <p className="text-xs font-bold text-slate-500">
                            Showing {filteredDrivers.length} of {totalDrivers} drivers
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className='p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm'>
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage * DRIVERS_PER_PAGE >= totalDrivers}
                                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

            </div>

        </div>
    )
}


const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        active: "bg-emerald-50 text-emerald-600",
        blocked: "bg-red-50 text-red-600"
    };
    return (
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", styles[status])}>
            {status === "active" ? "Online" : "Blocked"}
        </span>
    )
};

const DriverRowSkeleton = () => (
    <tr className='animate-pulse'>
        <td className='px-8 py-5'>
            <div className='flex items-center gap-4'>
                <div className='w-11 h-11 rounded-2xl bg-slate-200' />
                <div className='space-y-2'>
                    <div className='h-3 w-24 bg-slate-200 rounded' />
                    <div className='h-2 w-16 bg-slate-100 rounded' />
                </div>
            </div>
        </td>
        <td className='px-8 py-5'>
            <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-lg bg-slate-100' />
                <div className='space-y-1'>
                    <div className="h-2 w-16 bg-slate-200 rounded" />
                    <div className="h-2 w-10 bg-slate-100 rounded" />
                </div>
            </div>
        </td>
        <td className="px-8 py-5"><div className="h-4 w-10 bg-slate-100 rounded" /></td>
        <td className="px-8 py-5"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
        <td className="px-8 py-5"><div className="h-6 w-16 bg-slate-100 rounded-full" /></td>
        <td className="px-8 py-5 text-right"><div className="h-8 w-8 bg-slate-50 rounded-lg ml-auto" /></td>
    </tr>
);

const ErrorState = ({ message }: { message: string }) => (
    <div className='flex flex-col items-center justify-center p-20 bg-red-50/30 border border-red-100 rounded-[3rem]'>
        <ShieldAlert className='text-red-500 mb-4' size={48} />
        <p className='text-red-900 font-bold'>{message}</p>
    </div>
);