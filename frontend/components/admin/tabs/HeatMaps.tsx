"use client";
import React, { useEffect, useState } from 'react';
import {
    Flame, Map, Navigation, Users,
    RefreshCw, ArrowUpRight, Maximize2,
    TrendingUp, MapPin, Activity, Zap
} from 'lucide-react';
import { getHeatmapStats } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const Heatmaps = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getHeatmapStats();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <HeatSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>

                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : "text-slate-400"} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                        <Maximize2 size={14} /> Full Map View
                    </button>
                </div>
            </div>

            {/* 1. Heat KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <HeatStat
                    title="Active Hotspots" value={data?.summary.activeHotspots}
                    sub="Clusters detected" icon={<Flame />} color="text-orange-600" bg="bg-orange-50"
                />
                <HeatStat
                    title="Peak Area" value={data?.summary.peakDemandArea}
                    sub="Highest trip density" icon={<Map />} color="text-blue-600" bg="bg-blue-50"
                />
                <HeatStat
                    title="Supply Gap" value={data?.summary.supplyGap}
                    sub="Demand vs Drivers" icon={<TrendingUp />} color="text-red-600" bg="bg-red-50"
                />
                <HeatStat
                    title="Online Supply" value={data?.drivers}
                    sub="Available drivers" icon={<Users />} color="text-emerald-600" bg="bg-emerald-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Hotspot List (Heat Intensity) */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-lg">Top Demand Clusters</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Activity size={14} className="text-orange-500" /> Pulse Analysis
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                    <th className="px-8 py-5">Coordinates / Cluster</th>
                                    <th className="px-8 py-5">Trip Density</th>
                                    <th className="px-8 py-5">Revenue Generated</th>
                                    <th className="px-8 py-5">Heat Level</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.hotspots.map((spot: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <MapPin size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-900">{spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Geo-Cluster ID: {i + 101}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-slate-700">{spot.demand}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">Requests</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900 text-sm">
                                            ₹{spot.revenue.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <HeatLevel intensity={spot.demand} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-blue-600">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Heat Analysis Insights */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Flame size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-8 tracking-tight">Heat Insights</h3>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-1 h-12 bg-orange-500 rounded-full" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bottleneck Detected</p>
                                    <p className="text-sm font-bold mt-1">Downtown has 42% more demand than active drivers.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 h-12 bg-blue-500 rounded-full" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue Hub</p>
                                    <p className="text-sm font-bold mt-1">Airport runs are generating 3x average trip value today.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <div className="flex items-center gap-2 text-amber-400 mb-2">
                                <Zap size={14} fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Surge Suggestion</span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                Consider activating a <span className="text-white font-bold">1.5x Multiplier</span> in the Southern Hub to balance driver distribution.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helpers ---

const HeatStat = ({ title, value, sub, icon, color, bg }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
    </div>
);

const HeatLevel = ({ intensity }: { intensity: number }) => {
    // Arbitrary thresholds for demo
    const level = intensity > 20 ? "Critical" : intensity > 10 ? "High" : "Moderate";
    const styles: any = {
        Critical: "bg-red-50 text-red-600 border-red-100",
        High: "bg-orange-50 text-orange-600 border-orange-100",
        Moderate: "bg-blue-50 text-blue-600 border-blue-100",
    };
    return (
        <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", styles[level])}>
            {level}
        </span>
    );
};

const HeatSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-96 bg-slate-50 rounded-[2.5rem]" />
            <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
        </div>
    </div>
);