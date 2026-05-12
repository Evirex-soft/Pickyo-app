"use client";
import React, { useEffect, useState } from 'react';
import {
    Bell, Megaphone, CheckCheck, Eye,
    Plus, RefreshCw, MoreVertical, Search,
    Mail, ShieldAlert, Send, Clock
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getNotificationStats } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const NotificationsManagement = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getNotificationStats();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <NotifySkeleton />;

    const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6366f1'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>

                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">
                    <Plus size={16} /> Send Broadcast
                </button>
            </div>

            {/* 1. KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Sent" value={data?.summary.totalSent}
                    sub="System-wide pings" icon={<Send />} color="text-blue-600" bg="bg-blue-50"
                />
                <StatCard
                    title="Read Rate" value={`${data?.summary.readRate}%`}
                    sub="User engagement" icon={<Eye />} color="text-emerald-600" bg="bg-emerald-50"
                />
                <StatCard
                    title="Last 24h" value={data?.summary.activeAlerts}
                    sub="Recent notifications" icon={<Clock />} color="text-amber-600" bg="bg-amber-50"
                />
                <StatCard
                    title="Read Count" value={Math.round(data?.summary.totalSent * (data?.summary.readRate / 100))}
                    sub="Successful opens" icon={<CheckCheck />} color="text-violet-600" bg="bg-violet-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Type Distribution */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-6">Notification Mix</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.distribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px' }} />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {data?.distribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Notification Logs */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-lg">Sent History</h3>
                        <button onClick={fetchData} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                            <RefreshCw size={18} className="text-slate-400" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                    <th className="px-8 py-5">Recipient</th>
                                    <th className="px-8 py-5">Message Content</th>
                                    <th className="px-8 py-5">Type</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.history.map((n: any) => (
                                    <tr key={n.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">{n.user.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{n.user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col max-w-[240px]">
                                                <span className="text-xs font-black text-slate-700 truncate">{n.title}</span>
                                                <span className="text-[10px] text-slate-400 truncate mt-1">{n.message}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <TypeBadge type={n.type} />
                                        </td>
                                        <td className="px-8 py-6">
                                            {n.isRead ? (
                                                <span className="text-emerald-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                                                    <Eye size={12} /> Read
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                                                    <Mail size={12} /> Sent
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
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

const StatCard = ({ title, value, sub, icon, color, bg }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
    </div>
);

const TypeBadge = ({ type }: { type: string }) => {
    const styles: any = {
        ride_request: "bg-blue-50 text-blue-600",
        ride_update: "bg-indigo-50 text-indigo-600",
        document_status: "bg-amber-50 text-amber-600",
        payment: "bg-emerald-50 text-emerald-600",
        general: "bg-slate-50 text-slate-600"
    };
    return (
        <span className={cn("px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest", styles[type] || styles.general)}>
            {type.replace('_', ' ')}
        </span>
    );
};

const NotifySkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
            <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
            <div className="col-span-2 h-96 bg-slate-50 rounded-[2.5rem]" />
        </div>
    </div>
);