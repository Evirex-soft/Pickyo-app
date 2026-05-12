"use client";
import React, { useEffect, useState } from 'react';
import {
    History, ShieldAlert, User, Activity,
    Search, RefreshCw, FileText, Download,
    Database, Terminal, Globe, ChevronRight
} from 'lucide-react';
import { getAuditLogs } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const AuditLogs = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getAuditLogs();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <AuditSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>

                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={14} /> Export Logs
                    </button>
                    <button onClick={fetchData} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* 1. Audit KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <LogCard
                    title="Total Events" value={data?.summary.totalLogs}
                    sub="Lifetime actions" icon={<History />} color="text-slate-900" bg="bg-slate-100"
                />
                <LogCard
                    title="Critical Changes" value={data?.summary.criticalActions}
                    sub="Needs verification" icon={<ShieldAlert />} color="text-red-600" bg="bg-red-50"
                    isAlert={data?.summary.criticalActions > 0}
                />
                <LogCard
                    title="System Updates" value={data?.summary.warningActions}
                    sub="Configuration changes" icon={<Database />} color="text-amber-600" bg="bg-amber-50"
                />
                <LogCard
                    title="Active Admins" value={data?.summary.uniqueAdmins}
                    sub="Authorized actors" icon={<User />} color="text-blue-600" bg="bg-blue-50"
                />
            </div>

            {/* 2. Detailed Audit Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                            <Terminal size={18} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">System Event Stream</h3>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text" placeholder="Filter by action or admin..."
                            className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm w-full md:w-80 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                <th className="px-8 py-5">Administrator</th>
                                <th className="px-8 py-5">Action & Entity</th>
                                <th className="px-8 py-5">IP / Origin</th>
                                <th className="px-8 py-5">Severity</th>
                                <th className="px-8 py-5 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">
                                                {log.adminName.charAt(0)}
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{log.adminName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700">{log.action.replace('_', ' ')}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Target: {log.entity}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Globe size={12} />
                                            <span className="text-[10px] font-mono font-bold tracking-tight">{log.ipAddress || 'Internal'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <SeverityBadge level={log.severity} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-900">
                                                    {new Date(log.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">
                                                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-blue-600 transition-all">
                                                <FileText size={16} />
                                            </button>
                                        </div>
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

// --- Helpers ---

const LogCard = ({ title, value, sub, icon, color, bg, isAlert }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
        {isAlert && <div className="absolute top-8 right-8 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
    </div>
);

const SeverityBadge = ({ level }: { level: string }) => {
    const styles: any = {
        critical: "bg-red-50 text-red-600 border-red-100",
        warning: "bg-amber-50 text-amber-600 border-amber-100",
        info: "bg-blue-50 text-blue-600 border-blue-100",
    };
    return (
        <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", styles[level])}>
            {level}
        </span>
    );
};

const AuditSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="h-10 w-64 bg-slate-100 rounded-xl" />
            <div className="h-12 w-48 bg-slate-100 rounded-2xl" />
        </div>
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem]" />)}
        </div>
        <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
    </div>
);