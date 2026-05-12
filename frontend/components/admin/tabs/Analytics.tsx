"use client";
import React, { useEffect, useState } from 'react';
import {
    Truck,
    Activity, RefreshCw,
    ShieldCheck, Wallet, IndianRupee,
    BarChart3
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';
import { getAnalytics } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const Analytics = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getAnalytics();
            setData(result);
        } catch (err) {
            console.error("Analytics Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <AnalyticsSkeleton />;

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>

                </div>
                <button
                    onClick={fetchData}
                    className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                >
                    <RefreshCw size={18} className="text-slate-600" />
                </button>
            </div>

            {/* 1. KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Net Revenue"
                    value={`₹${data?.summary.netRevenue?.toLocaleString()}`}
                    sub="Commission Earned"
                    icon={<Wallet className="text-emerald-600" />}
                    trend="up"
                    percentage="+12.5%"
                />
                <StatCard
                    title="Gross Volume"
                    value={`₹${data?.summary.grossVolume.toLocaleString()}`}
                    sub="Total Fare Value"
                    icon={<IndianRupee className="text-blue-600" />}
                    trend="up"
                    percentage="+8.2%"
                />
                <StatCard
                    title="Avg. Trip Fare"
                    value={`₹${(data?.summary.grossVolume / data?.summary.totalRides || 0).toFixed(0)}`}
                    sub="Per Completed Ride"
                    icon={<BarChart3 className="text-violet-600" />}
                    trend="neutral"
                    percentage="Stable"
                />
                <StatCard
                    title="Active Fleet"
                    value={data?.summary.activeDrivers}
                    sub="Verified Partners"
                    icon={<ShieldCheck className="text-orange-600" />}
                    trend="up"
                    percentage="+4.1%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Revenue Trend (Primary Chart) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Revenue Stream</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Financial Performance</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Status Distribution */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">Ride Success Rate</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">System Health</p>

                        <div className="space-y-6">
                            {data?.statusBreakdown?.map((item: any) => (
                                <div key={item.status}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-slate-600 capitalize">{item.status.toLowerCase().replace('_', ' ')}</span>
                                        <span className="text-sm font-black text-slate-900">{item.count}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full", item.color)}
                                            style={{ width: `${(item.count / data.summary.totalRides) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 p-5 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                        <Activity size={40} className="absolute -right-2 -bottom-2 text-white/10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">System Status</p>
                        <p className="text-sm font-bold">All services are optimal</p>
                    </div>
                </div>
            </div>

            {/* 4. Fleet Performance Table-style Grid */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50">
                    <h3 className="font-bold text-slate-900 text-lg">Fleet Performance</h3>
                    <p className="text-sm text-slate-500">Breakdown by vehicle category</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-50">
                    {data?.fleet.map((item: any) => (
                        <div key={item.label} className="p-8 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                    <Truck size={20} />
                                </div>
                                <span className="font-black text-slate-700 text-xs uppercase tracking-widest">{item.label}</span>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-1">{item.count}</h4>
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Utilization</span>
                                <span>{item.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Internal Helper Components ---

const StatCard = ({ title, value, sub, icon, trend, percentage }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className={cn(
                "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter",
                trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
            )}>
                {percentage}
            </span>
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
            <p className="text-slate-400 text-[10px] font-medium mt-1">{sub}</p>
        </div>
    </div>
);

const AnalyticsSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-slate-200 rounded-xl" />
                <div className="h-4 w-32 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-12 w-12 bg-slate-100 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-36 bg-slate-100 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-100 rounded-3xl" />
            <div className="h-96 bg-slate-100 rounded-3xl" />
        </div>
    </div>
);