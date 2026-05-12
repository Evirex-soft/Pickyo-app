"use client";
import React, { useEffect, useState } from 'react';
import {
    ShieldAlert, ShieldCheck, AlertTriangle,
    Lock, RefreshCw, UserX, MapPinOff,
    MoreVertical, Eye, Activity, Zap
} from 'lucide-react';
import { getFraudStats } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const FraudDetection = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getFraudStats();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <FraudSkeleton />;

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
                    <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-red-100">
                        <Lock size={16} /> Block High Risk
                    </button>
                </div>
            </div>

            {/* 1. Risk KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <RiskCard
                    title="Critical Alerts" value={data?.summary.criticalAlerts}
                    sub="SOS/Emergency signals" icon={<ShieldAlert />} color="text-red-600" bg="bg-red-50"
                    isUrgent={data?.summary.criticalAlerts > 0}
                />
                <RiskCard
                    title="Flagged Users" value={data?.summary.flaggedAccounts}
                    sub="Suspicious patterns" icon={<UserX />} color="text-orange-600" bg="bg-orange-50"
                />
                <RiskCard
                    title="Anomalies" value={data?.summary.suspiciousVolume}
                    sub="Past 24 hours" icon={<MapPinOff />} color="text-amber-600" bg="bg-amber-50"
                />
                <RiskCard
                    title="System Health" value={data?.summary.riskScore}
                    sub="Security protocol active" icon={<ShieldCheck />} color="text-emerald-600" bg="bg-emerald-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Security Feed */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-lg">Risk Incident Log</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Activity size={14} className="text-emerald-500" /> Live Monitoring
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                    <th className="px-8 py-5">Actor Involved</th>
                                    <th className="px-8 py-5">Incident Type</th>
                                    <th className="px-8 py-5">Value at Risk</th>
                                    <th className="px-8 py-5">Risk Level</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.incidents.map((inc: any) => (
                                    <tr key={inc.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">{inc.driver?.name || 'Unassigned'}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">vs {inc.customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">
                                                    {inc.status === 'cancelled' ? 'Excessive Cancellation' : 'Payment Failure'}
                                                </span>
                                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Ride: #{inc.id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900 text-sm">
                                            ₹{inc.payment?.amount || 0}
                                        </td>
                                        <td className="px-8 py-6">
                                            <RiskBadge level={inc.status === 'cancelled' ? 'Medium' : 'High'} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                                <Eye size={16} className="text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Security Quick Actions */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldAlert size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-8 tracking-tight">Security Actions</h3>
                        <div className="space-y-4">
                            <ActionButton icon={<Zap />} title="Purge Fake Accounts" sub="Identify via device ID" />
                            <ActionButton icon={<AlertTriangle />} title="Audit Route Deviations" sub="Last 50 active trips" />
                            <ActionButton icon={<UserX />} title="Review Block List" sub="84 drivers currently restricted" />
                        </div>
                        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Automated Rules</p>
                            <p className="text-xs font-bold text-slate-300 leading-relaxed">
                                AI Shield is currently blocking users with more than <span className="text-red-400">3 failed payments</span> within 10 mins.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helpers ---

const RiskCard = ({ title, value, sub, icon, color, bg, isUrgent }: any) => (
    <div className={cn(
        "bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group",
        isUrgent && "ring-2 ring-red-500 ring-offset-2"
    )}>
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
    </div>
);

const RiskBadge = ({ level }: { level: string }) => {
    const styles: any = {
        High: "bg-red-50 text-red-600",
        Medium: "bg-orange-50 text-orange-600",
        Low: "bg-emerald-50 text-emerald-600",
    };
    return (
        <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest", styles[level])}>
            {level} Risk
        </span>
    );
};

const ActionButton = ({ icon, title, sub }: any) => (
    <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 text-left">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-red-400">
            {icon}
        </div>
        <div>
            <p className="text-sm font-black text-white tracking-tight">{title}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">{sub}</p>
        </div>
    </button>
);

const FraudSkeleton = () => (
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