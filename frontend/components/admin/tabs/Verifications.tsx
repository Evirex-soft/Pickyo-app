"use client";
import React, { useEffect, useState } from 'react';
import {
    ShieldCheck, XCircle, FileText, ExternalLink,
    User, Car, Smartphone, Check, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import { getPendingVerifications, verifyDriver } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const Verification = () => {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getPendingVerifications();
            setDrivers(data);
            if (data.length > 0) setSelectedDriver(data[0]);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAction = async (status: 'approve' | 'reject') => {
        if (status === 'reject' && !rejectReason) return alert("Please provide a reason");
        try {
            await verifyDriver(selectedDriver.id, status, rejectReason);
            await fetchData();
            setRejectReason("");
        } catch (err) { alert("Action failed"); }
    };

    if (isLoading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse">Loading Verification Queue...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700 h-[calc(100vh-250px)]">

            {/* 1. Left: Pending List */}
            <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Pending Review ({drivers.length})</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {drivers.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 font-bold text-sm italic">Queue is clear!</div>
                    ) : (
                        drivers.map((d) => (
                            <button
                                key={d.id}
                                onClick={() => setSelectedDriver(d)}
                                className={cn(
                                    "w-full p-6 text-left border-b border-slate-50 transition-all flex items-center gap-4",
                                    selectedDriver?.id === d.id ? "bg-slate-900 text-white" : "hover:bg-slate-50"
                                )}
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                                    {d.user.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-sm truncate">{d.user.name}</p>
                                    <p className={cn("text-[10px] font-bold uppercase", selectedDriver?.id === d.id ? "text-slate-400" : "text-slate-400")}>
                                        {d.vehicleType} • {d.lastSeen
                                            ? new Date(d.lastSeen).toLocaleDateString()
                                            : "Never Active"}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* 2. Right: Document Review Panel */}
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {selectedDriver ? (
                    <>
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-blue-600" size={24} />
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedDriver.user.name}</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedDriver.user.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction('approve')}
                                    className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                                >
                                    Approve Driver
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                            {/* Documents Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedDriver.documents.map((doc: any) => (
                                    <div key={doc.id} className="group relative bg-slate-50 rounded-3xl border border-slate-100 p-4 transition-all">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <FileText size={12} /> {doc.type.replace('_', ' ')}
                                            </span>

                                            {/* NEW: Document Status Badge */}
                                            {doc.isVerified ? (
                                                <span className="flex items-center gap-1 text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    <Check size={10} strokeWidth={4} /> Verified
                                                </span>
                                            ) : (
                                                <a href={doc.url} target="_blank" className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600">
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>

                                        <div className="aspect-[4/3] rounded-2xl bg-slate-200 overflow-hidden relative">
                                            <img src={doc.url} alt="Document" className={cn("w-full h-full object-cover", doc.isVerified && "opacity-60 grayscale-[0.5]")} />
                                            {doc.isVerified && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-emerald-500/90 text-white p-2 rounded-full shadow-lg">
                                                        <ShieldCheck size={24} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Rejection Form */}
                            <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100">
                                <h4 className="text-red-600 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <AlertCircle size={14} /> Rejection Protocol
                                </h4>
                                <textarea
                                    placeholder="State the reason for rejection (e.g. Blur image, Expired license)..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full h-24 bg-white border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-red-200 transition-all mb-4"
                                />
                                <button
                                    onClick={() => handleAction('reject')}
                                    className="w-full py-4 bg-white text-red-600 border border-red-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                >
                                    Reject Application
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                        <Check size={48} className="mb-4" />
                        <p className="font-black italic">Nothing to verify</p>
                    </div>
                )}
            </div>
        </div>
    );
};