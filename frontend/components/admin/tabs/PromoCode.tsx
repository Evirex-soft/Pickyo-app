"use client";
import React, { useEffect, useState } from 'react';
import {
    Ticket, Gift, Zap, Calendar,
    Plus, RefreshCw, MoreVertical,
    CheckCircle2, XCircle, Clock, Trash2
} from 'lucide-react';
import { getPromos } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const Promos = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getPromos();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <PromoSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>

                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-200">
                    <Plus size={16} /> Create New Promo
                </button>
            </div>

            {/* 1. Promo Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <PromoStat
                    title="Active Codes"
                    value={data?.summary.totalActive}
                    icon={<Ticket />}
                    color="text-blue-600" bg="bg-blue-50"
                />
                <PromoStat
                    title="Total Redemptions"
                    value={data?.summary.totalRedemptions}
                    icon={<Zap />}
                    color="text-amber-600" bg="bg-amber-50"
                />
                <PromoStat
                    title="Expiring Soon"
                    value={data?.summary.upcomingExpirations}
                    icon={<Clock />}
                    color="text-red-600" bg="bg-red-50"
                />
                <PromoStat
                    title="Avg. Discount"
                    value="₹120"
                    icon={<Gift />}
                    color="text-emerald-600" bg="bg-emerald-50"
                />
            </div>

            {/* 2. Promo Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">Active Campaigns</h3>
                    <button onClick={fetchData} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                        <RefreshCw size={18} className="text-slate-400" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                <th className="px-8 py-5">Code & Description</th>
                                <th className="px-8 py-5">Config</th>
                                <th className="px-8 py-5">Usage</th>
                                <th className="px-8 py-5">Expiry</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.promos.map((promo: any) => (
                                <tr key={promo.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg w-fit border border-dashed border-slate-300">
                                                {promo.code}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{promo.description || 'General Discount'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-700">
                                                {promo.discountType === 'percentage' ? `${promo.discountValue}% Off` : `₹${promo.discountValue} Flat`}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Min Order: ₹{promo.minPrice}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-32">
                                            <div className="flex justify-between text-[10px] font-black mb-1">
                                                <span>{promo.usedCount}/{promo.usageLimit}</span>
                                                <span>{Math.round((promo.usedCount / promo.usageLimit) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${(promo.usedCount / promo.usageLimit) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar size={14} />
                                            <span className="text-xs font-bold">{new Date(promo.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {promo.isActive ? (
                                            <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={12} /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                <XCircle size={12} /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all rounded-xl">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                                <MoreVertical size={16} className="text-slate-400" />
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

const PromoStat = ({ title, value, icon, color, bg }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>
);

const PromoSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
            <div className="h-12 w-64 bg-slate-100 rounded-xl" />
            <div className="h-12 w-40 bg-slate-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem]" />)}
        </div>
        <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
    </div>
);