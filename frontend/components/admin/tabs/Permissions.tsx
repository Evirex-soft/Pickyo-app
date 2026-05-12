"use client";
import React, { useEffect, useState } from 'react';
import {
    ShieldCheck, Lock, UserPlus, ShieldAlert,
    RefreshCw, MoreHorizontal, Fingerprint,
    UserCheck, UserX, Key, Shield
} from 'lucide-react';
import { getPermissionsStats } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export const Permissions = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getPermissionsStats();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (isLoading) return <PermissionSkeleton />;

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
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                        <UserPlus size={16} /> Invite Staff
                    </button>
                </div>
            </div>

            {/* 1. Security KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SecurityCard
                    title="Total Admins" value={data?.summary.totalAdmins}
                    sub="Full system access" icon={<ShieldCheck />} color="text-blue-600" bg="bg-blue-50"
                />
                <SecurityCard
                    title="Active Now" value={data?.summary.activeStaff}
                    sub="Live sessions" icon={<Fingerprint />} color="text-emerald-600" bg="bg-emerald-50"
                />
                <SecurityCard
                    title="Security Score" value={data?.summary.securityLevel}
                    sub="Platform integrity" icon={<Lock />} color="text-violet-600" bg="bg-violet-50"
                />
                <SecurityCard
                    title="MFA Adoption" value={data?.summary.mfaEnabled}
                    sub="Verified staff" icon={<ShieldAlert />} color="text-orange-600" bg="bg-orange-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Staff Management Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <h3 className="font-bold text-slate-900 text-lg">Administrative Staff</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                    <th className="px-8 py-5">Staff Member</th>
                                    <th className="px-8 py-5">Role</th>
                                    <th className="px-8 py-5">Last Login</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.staff.map((member: any) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900">{member.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{member.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">
                                                Super Admin
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-500">
                                            {new Date(member.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            {member.isActive ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                                                    <UserCheck size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-slate-300 text-[9px] font-black uppercase tracking-widest">
                                                    <UserX size={12} /> Suspended
                                                </span>
                                            )}
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

                {/* 3. Security Settings Sidebar */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Shield size={120} />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-8 tracking-tight">System Policy</h3>
                        <div className="space-y-6">
                            <PolicyItem icon={<Lock />} title="Enforce 2FA" status="Active" />
                            <PolicyItem icon={<Key />} title="Password Expiry" status="90 Days" />
                            <PolicyItem icon={<ShieldCheck />} title="Audit Logs" status="Enabled" />
                        </div>

                        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Security Tip</p>
                            <p className="text-xs font-bold text-slate-400 leading-relaxed">
                                Avoid sharing root admin credentials. Create individual staff accounts for better audit tracking.
                            </p>
                        </div>
                    </div>

                    <button className="mt-10 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        View Audit Log
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Helpers ---

const SecurityCard = ({ title, value, sub, icon, color, bg }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg, color)}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-slate-400 text-[10px] font-bold mt-1">{sub}</p>
    </div>
);

const PolicyItem = ({ icon, title, status }: any) => (
    <div className="flex items-center justify-between group cursor-default">
        <div className="flex items-center gap-4">
            <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <span className="text-sm font-bold text-slate-300">{title}</span>
        </div>
        <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">{status}</span>
    </div>
);

const PermissionSkeleton = () => (
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