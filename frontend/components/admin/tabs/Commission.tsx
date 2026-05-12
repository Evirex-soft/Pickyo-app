"use client";
import React, { useEffect, useState } from 'react';
import {
    Percent, Banknote, TrendingUp, Coins,
    RefreshCw, PieChart, Target
} from 'lucide-react';

import { getCommissionStats } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const Commissions = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getCommissionStats();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <CommissionSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    {/* <h1 className="text-2xl font-black text-slate-900 tracking-tight">Commission Engine</h1>
                    <p className="text-sm text-slate-500 font-medium">Platform take-rate and revenue distribution</p> */}
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    Recalculate
                </button>
            </div>

            {/* 1. Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CommCard
                    title="Platform Net"
                    value={`₹${data?.summary.platformEarnings.toLocaleString()}`}
                    sub="Total admin cut"
                    icon={<Coins />}
                    color="text-emerald-600" bg="bg-emerald-50"
                />
                <CommCard
                    title="Driver Share"
                    value={`₹${data?.summary.driverDisbursements.toLocaleString()}`}
                    sub="Disbursed earnings"
                    icon={<Banknote />}
                    color="text-blue-600" bg="bg-blue-50"
                />
                <CommCard
                    title="Avg. Take Rate"
                    value={`${data?.summary.avgCommissionRate.toFixed(1)}%`}
                    sub="Net platform margin"
                    icon={<Percent />}
                    color="text-violet-600" bg="bg-violet-50"
                />
                <CommCard
                    title="Target Margin"
                    value="20.0%"
                    sub="+2.4% vs last month"
                    icon={<Target />}
                    color="text-orange-600" bg="bg-orange-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Earnings Distribution (Driver vs Admin) */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Revenue Split</h3>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Platform vs Partner</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-xs font-black text-slate-400 uppercase">Driver Earnings (Gross)</span>
                                <span className="text-xl font-black text-slate-900">₹{data?.summary.driverDisbursements.toLocaleString()}</span>
                            </div>
                            <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: '80%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-xs font-black text-slate-400 uppercase">Platform Commission (Net)</span>
                                <span className="text-xl font-black text-slate-900">₹{data?.summary.platformEarnings.toLocaleString()}</span>
                            </div>
                            <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '20%' }} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                <TrendingUp size={20} />
                            </div>
                            <p className="text-sm text-slate-600 font-medium">
                                The platform is currently operating at a <span className="font-black text-slate-900">{data?.summary.avgCommissionRate.toFixed(1)}%</span> margin.
                                High efficiency detected in <span className="text-blue-600 font-bold uppercase tracking-tight">Mini Truck</span> fleet.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Fleet Profitability */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <PieChart size={120} />
                    </div>

                    <h3 className="text-xl font-black mb-10 tracking-tight">Fleet Margin</h3>
                    <div className="space-y-8 flex-1">
                        {data?.fleet.map((f: any) => (
                            <div key={f.type} className="group cursor-default">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.type}</span>
                                    <span className="text-xs font-bold text-emerald-400">₹{f.commission.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full" style={{ width: `${(f.commission / f.total) * 100}%` }} />
                                    </div>
                                    <span className="text-xs font-black italic">
                                        {((f.commission / f.total) * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-10 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Adjust Rates
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Helpers ---

const CommCard = ({ title, value, sub, icon, color, bg }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
    </div>
);

const CommissionSkeleton = () => (
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