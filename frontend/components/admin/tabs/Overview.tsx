"use client";
import React, { useEffect, useState } from 'react';
import {
    Car, MapPin, AlertCircle, Clock, CheckCircle2,
    IndianRupee
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { getDashboardStats } from '@/services/admin.service';
import { DashboardStats } from '@/types/admin.types';
import { cn } from '@/lib/utils';

export const Overview = () => {
    const [data, setData] = useState<DashboardStats | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const result = await getDashboardStats();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const totalPages = Math.ceil((data?.recentTrips.length || 0) / ITEMS_PER_PAGE);

    const paginatedTrips = data?.recentTrips.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) || [];

    if (isLoading) return <OverviewSkeleton />;

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">

            {/* 1. TOP LEVEL STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${data?.totalRevenue.toLocaleString()}`}
                    change={`+${data?.revenueChange}%`}
                    icon={<IndianRupee className="text-emerald-600" />}
                    trend="up"
                />
                <StatCard
                    title="Active Trips"
                    value={data?.activeTrips.toString() || "0"}
                    change="Live Now"
                    icon={<MapPin className="text-blue-600" />}
                    trend="neutral"
                />
                <StatCard
                    title="Online Drivers"
                    value={data?.onlineDrivers.toString() || "0"}
                    change="+12% from avg"
                    icon={<Car className="text-indigo-600" />}
                    trend="up"
                />
                <StatCard
                    title="Disputes"
                    value={data?.pendingDisputes.toString() || "0"}
                    change="Requires Action"
                    icon={<AlertCircle className="text-red-600" />}
                    trend="down"
                    isAlert={data?.pendingDisputes ? data.pendingDisputes > 0 : false}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. REVENUE TREND CHART */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Revenue Growth</h3>
                            <p className="text-sm text-slate-500">Weekly platform earnings</p>
                        </div>
                        <select className="bg-slate-50 border-none text-sm font-medium rounded-lg px-3 py-1 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-75 w-full">
                        <div className='pointer-events-none h-full w-full'>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. TRIP DISTRIBUTION / STATUS */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 text-lg mb-6">Trip Status</h3>
                    <div className="space-y-6">
                        <StatusProgress label="Completed" value={85} color="bg-emerald-500" icon={<CheckCircle2 size={16} />} />
                        <StatusProgress label="Ongoing" value={10} color="bg-blue-500" icon={<Clock size={16} />} />
                        <StatusProgress label="Cancelled" value={5} color="bg-red-500" icon={<AlertCircle size={16} />} />
                    </div>

                    <div className="mt-10 p-4 bg-slate-50 rounded-2xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pro Tip</p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Peak demand expected in <span className="text-blue-600 font-bold">Downtown</span> between 5 PM - 7 PM today.
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. RECENT TRIPS TABLE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">Live Trip Activity</h3>
                    <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-200">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Rider</th>
                                <th className="px-6 py-4">Driver</th>
                                <th className="px-6 py-4">Route</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedTrips?.map((trip, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200" />
                                            <span className="text-sm font-semibold text-slate-700">{trip.riderName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{trip.driverName}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-medium text-slate-500 wrap-break-word whitespace-normal max-w-[150px]">
                                            {trip.pickup} → {trip.dropoff}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{trip.fare}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">
                                            {trip.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>
                        {" "}to{" "}
                        <span className="font-semibold text-slate-700">
                            {Math.min(currentPage * ITEMS_PER_PAGE, data?.recentTrips.length || 0)}
                        </span>
                        {" "}of{" "}
                        <span className="font-semibold text-slate-700">
                            {data?.recentTrips.length}
                        </span>
                        {" "}trips
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }).map((_, index) => {
                            const page = index + 1;

                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        "w-10 h-10 rounded-xl text-sm font-semibold transition",
                                        currentPage === page
                                            ? "bg-blue-600 text-white"
                                            : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

const StatCard = ({ title, value, change, icon, trend, isAlert }: any) => (
    <div className={cn(
        "p-6 rounded-3xl bg-white border shadow-sm transition-all hover:shadow-md",
        isAlert ? "border-red-100 bg-red-50/10" : "border-slate-100"
    )}>
        <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-slate-50">{icon}</div>
            <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-lg",
                trend === 'up' ? "bg-emerald-50 text-emerald-600" :
                    trend === 'down' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
            )}>
                {change}
            </span>
        </div>
        <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
        </div>
    </div>
);

const StatusProgress = ({ label, value, color, icon }: any) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                {icon} <span>{label}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{value}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
        </div>
    </div>
);

const OverviewSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-slate-200 rounded-3xl" />
            <div className="h-80 bg-slate-200 rounded-3xl" />
        </div>
    </div>
);

