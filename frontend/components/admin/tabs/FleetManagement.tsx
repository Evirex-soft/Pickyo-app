"use client";
import React, { useEffect, useState } from 'react';
import {
    Truck, Bike, ShieldCheck, AlertCircle,
    Plus, RefreshCw, MoreVertical, Search,
    Car, ClipboardCheck, Info, Package
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getFleetStats } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const FleetManagement = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getFleetStats();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <FleetSkeleton />;

    const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    {/* <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Management</h1>
                    <p className="text-sm text-slate-500 font-medium">Verify assets and monitor vehicle distribution</p> */}
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : "text-slate-400"} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                        <Plus size={16} /> Register Vehicle
                    </button>
                </div>
            </div>

            {/* 1. Fleet KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Fleet" value={data?.summary.totalVehicles}
                    sub="Registered assets" icon={<Package />} color="text-slate-900" bg="bg-slate-100"
                />
                <StatCard
                    title="Verified" value={data?.summary.verified}
                    sub="Compliant & Active" icon={<ShieldCheck />} color="text-emerald-600" bg="bg-emerald-50"
                />
                <StatCard
                    title="Pending" value={data?.summary.pending}
                    sub="Needs review" icon={<AlertCircle />} color="text-amber-600" bg="bg-amber-50"
                    isAlert={data?.summary.pending > 0}
                />
                <StatCard
                    title="Categories" value={data?.summary.activeTypes}
                    sub="Vehicle models" icon={<Truck />} color="text-blue-600" bg="bg-blue-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Composition Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-6">Type Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.composition}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {data?.composition.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 p-5 bg-slate-50 rounded-3xl">
                        <div className="flex items-center gap-3 text-slate-600">
                            <Info size={16} />
                            <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                                Heavy vehicles account for <span className="text-blue-600">42%</span> of your total revenue.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Fleet Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-lg">Vehicle Directory</h3>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text" placeholder="Search Plate No..."
                                className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none w-64"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                    <th className="px-8 py-5">Vehicle & Driver</th>
                                    <th className="px-8 py-5">Plate Number</th>
                                    <th className="px-8 py-5">Type</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.fleet.map((v: any) => (
                                    <tr key={v.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    {v.type === 'bike' ? <Bike size={20} /> : <Truck size={20} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900">{v.brand} {v.model}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{v.driver.user.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                                                {v.plateNumber}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{v.type.replace('_', ' ')}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {v.isVerified ? (
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                                    <ClipboardCheck size={12} /> Verified
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                                    <AlertCircle size={12} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                                <MoreVertical size={18} className="text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helpers ---

const StatCard = ({ title, value, sub, icon, color, bg, isAlert }: any) => (
    <div className={cn(
        "bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md relative overflow-hidden",
        isAlert && "ring-2 ring-amber-500/10 border-amber-100"
    )}>
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
        {isAlert && <div className="absolute top-8 right-8 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
    </div>
);

const FleetSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="h-10 w-64 bg-slate-100 rounded-xl" />
            <div className="h-12 w-48 bg-slate-100 rounded-2xl" />
        </div>
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
            <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
            <div className="col-span-2 h-96 bg-slate-50 rounded-[2.5rem]" />
        </div>
    </div>
);