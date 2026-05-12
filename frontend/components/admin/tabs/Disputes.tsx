"use client";
import React, { useEffect, useState } from 'react';
import {
    AlertCircle, Scale, History, CheckCircle2,
    RefreshCw, MoreHorizontal, ShieldAlert,
    IndianRupee, Search, Filter
} from 'lucide-react';
import { getDisputes } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const Disputes = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getDisputes();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <DisputesSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    {/* <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resolution Center</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage and resolve platform conflicts</p> */}
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
                        <Filter size={18} />
                    </button>
                    <button onClick={fetchData} className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Sync Tickets
                    </button>
                </div>
            </div>

            {/* 1. KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Disputes"
                    value={data?.summary.pending}
                    sub="Awaiting Admin Review"
                    icon={<AlertCircle className="text-amber-600" />}
                    trend="high"
                    color="bg-amber-50"
                />
                <StatCard
                    title="Resolved"
                    value={data?.summary.resolved}
                    sub="Closed this month"
                    icon={<CheckCircle2 className="text-emerald-600" />}
                    trend="neutral"
                    color="bg-emerald-50"
                />
                <StatCard
                    title="Refunded"
                    value={`₹${data?.summary.refundedAmount.toLocaleString()}`}
                    sub="Customer adjustments"
                    icon={<History className="text-blue-600" />}
                    trend="neutral"
                    color="bg-blue-50"
                />
                <StatCard
                    title="Avg. Response"
                    value="1.2h"
                    sub="Platform Efficiency"
                    icon={<Scale className="text-violet-600" />}
                    trend="up"
                    color="bg-violet-50"
                />
            </div>

            {/* 2. Main Dispute Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
                    <h3 className="font-bold text-slate-900 text-lg">Recent Dispute Tickets</h3>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by Ride ID..."
                            className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm w-full md:w-80 outline-none focus:ring-2 ring-blue-500/10 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                                <th className="px-8 py-5">Initiator & Ride ID</th>
                                <th className="px-8 py-5">Parties Involved</th>
                                <th className="px-8 py-5">Reason</th>
                                <th className="px-8 py-5">Priority</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.disputes.map((ticket: any) => (
                                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">#{ticket.rideId.slice(0, 8)}</span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">By {ticket.raisedBy}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white" />
                                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white" />
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-600">
                                                {ticket.ride.customer.name} / {ticket.ride.driver.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-slate-700 max-w-[180px] truncate">{ticket.reason}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <PriorityBadge priority={ticket.priority} />
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={ticket.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                            <MoreHorizontal size={18} className="text-slate-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Helper UI Components ---

const StatCard = ({ title, value, sub, icon, trend, color }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
        {trend === 'high' && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
    </div>
);

const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles: any = {
        high: "text-red-600 bg-red-50",
        medium: "text-amber-600 bg-amber-50",
        low: "text-blue-600 bg-blue-50",
        urgent: "text-red-700 bg-red-100 font-black",
    };
    return (
        <span className={cn("px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider", styles[priority.toLowerCase()])}>
            {priority}
        </span>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        pending: "text-slate-500 bg-slate-100",
        resolved: "text-emerald-600 bg-emerald-50",
        refunded: "text-blue-600 bg-blue-50",
        under_review: "text-violet-600 bg-violet-50",
    };
    return (
        <span className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest", styles[status.toLowerCase()])}>
            {status.replace('_', ' ')}
        </span>
    );
};

const DisputesSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
            <div className="h-10 w-64 bg-slate-100 rounded-xl" />
            <div className="h-12 w-40 bg-slate-100 rounded-2xl" />
        </div>
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem]" />)}
        </div>
        <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
    </div>
);