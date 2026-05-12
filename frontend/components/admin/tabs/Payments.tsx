"use client";
import React, { useEffect, useState } from 'react';
import {
    Wallet, IndianRupee, ArrowDownLeft, ArrowUpRight,
    Download, RefreshCw, CreditCard, Banknote,
    Smartphone, Search, ChevronRight
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getPayments } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const Payments = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getPayments();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <PaymentSkeleton />;

    const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>

                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={14} /> Export CSV
                    </button>
                    <button onClick={fetchData} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* 1. Financial KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinanceCard
                    title="Gross Volume"
                    value={`₹${data?.summary.totalVolume.toLocaleString()}`}
                    sub="Total processed"
                    icon={<IndianRupee />}
                    color="text-slate-900"
                    bg="bg-slate-50"
                />
                <FinanceCard
                    title="Platform Net"
                    value={`₹${data?.summary.netRevenue.toLocaleString()}`}
                    sub="Commission earned"
                    icon={<ArrowDownLeft />}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <FinanceCard
                    title="Driver Payouts"
                    value={`₹${data?.summary.driverPayouts.toLocaleString()}`}
                    sub="Disbursed earnings"
                    icon={<ArrowUpRight />}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <FinanceCard
                    title="Success Rate"
                    value={`${data?.summary.successRate}%`}
                    sub="Transaction health"
                    icon={<Wallet />}
                    color="text-violet-600"
                    bg="bg-violet-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Method Distribution Chart */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 text-lg mb-6">Payment Methods</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.methods}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {data?.methods.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-3">
                        {data?.methods.map((m: any, i: number) => (
                            <div key={m.name} className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">{m.name}</span>
                                <span className="text-slate-900">₹{m.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Recent Transactions Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-lg">Transaction History</h3>
                        <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest cursor-pointer hover:underline">
                            View Ledger <ChevronRight size={14} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                    <th className="px-8 py-4">Customer</th>
                                    <th className="px-8 py-4">Method</th>
                                    <th className="px-8 py-4">Amount</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{tx.ride.customer.name}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">#{tx.id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <MethodIcon method={tx.method} />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{tx.method.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">₹{tx.amount}</span>
                                                <span className="text-[9px] font-bold text-emerald-600 tracking-tighter">Comm: ₹{tx.adminCommission}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                tx.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                            )}>
                                                {tx.status}
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

// --- Helper Components ---

const FinanceCard = ({ title, value, sub, icon, color, bg }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
    </div>
);

const MethodIcon = ({ method }: { method: string }) => {
    switch (method.toLowerCase()) {
        case 'wallet': return <Wallet size={14} className="text-blue-500" />;
        case 'cash': return <Banknote size={14} className="text-emerald-500" />;
        case 'card': return <CreditCard size={14} className="text-violet-500" />;
        default: return <Smartphone size={14} className="text-amber-500" />;
    }
};

const PaymentSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center mb-4">
            <div className="h-10 w-64 bg-slate-100 rounded-xl" />
            <div className="h-12 w-12 bg-slate-100 rounded-2xl" />
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