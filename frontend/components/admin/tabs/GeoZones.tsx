"use client";
import React, { useEffect, useState } from 'react';
import {
    Map, Navigation, Locate, Layers,
    RefreshCw, Users, TrendingUp, AlertTriangle,
    ChevronRight, MapPin, Plus, Zap
} from 'lucide-react';
import { getGeoZones } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const GeoZones = () => {
    const [zones, setZones] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getGeoZones();
            setZones(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <GeoSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    {/* <h1 className="text-2xl font-black text-slate-900 tracking-tight">Geofencing & Zones</h1>
                    <p className="text-sm text-slate-500 font-medium">Regional performance and supply-demand heatmaps</p> */}
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                    <Plus size={16} /> Define New Zone
                </button>
            </div>

            {/* 1. Regional Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ZoneStat
                    title="Active Zones" value={zones.length}
                    icon={<Map />} color="text-blue-600" bg="bg-blue-50"
                />
                <ZoneStat
                    title="High Demand" value={zones.filter(z => z.demandScore > 70).length}
                    icon={<TrendingUp />} color="text-orange-600" bg="bg-orange-50"
                />
                <ZoneStat
                    title="Low Coverage" value={zones.filter(z => z.driverCount < 3).length}
                    icon={<AlertTriangle />} color="text-red-600" bg="bg-red-50"
                />
                <ZoneStat
                    title="Avg. Radius" value="4.2km"
                    icon={<Locate />} color="text-violet-600" bg="bg-violet-50"
                />
            </div>

            {/* 2. Zone Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {zones.map((zone) => (
                    <div key={zone.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        {/* Status Light */}
                        <div className={cn(
                            "absolute top-8 right-8 w-2 h-2 rounded-full",
                            zone.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                        )} />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">{zone.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{zone.radiusKm}km Coverage</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Live Drivers</p>
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-blue-500" />
                                    <span className="text-lg font-black text-slate-900">{zone.driverCount}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Revenue</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-slate-500">₹</span>
                                    <span className="text-lg font-black text-slate-900">{zone.revenue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Demand Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Demand Heat</span>
                                <span className={cn(
                                    zone.demandScore > 70 ? "text-orange-500" : "text-emerald-500"
                                )}>{zone.demandScore}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        zone.demandScore > 70 ? "bg-orange-500" : "bg-emerald-500"
                                    )}
                                    style={{ width: `${zone.demandScore}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {zone.surgeEnabled && <Zap size={14} className="text-amber-500 fill-amber-500" />}
                                <span className="text-[10px] font-black text-slate-500 uppercase">
                                    {zone.surgeEnabled ? `${zone.baseMultiplier}x Surge` : 'Standard Pricing'}
                                </span>
                            </div>
                            <button className="text-blue-600 p-2 hover:bg-blue-50 rounded-xl transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Helpers ---

const ZoneStat = ({ title, value, icon, color, bg }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>
);

const GeoSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
            <div className="h-10 w-64 bg-slate-100 rounded-xl" />
            <div className="h-12 w-48 bg-slate-100 rounded-2xl" />
        </div>
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-50 rounded-[2.5rem]" />)}
        </div>
    </div>
);