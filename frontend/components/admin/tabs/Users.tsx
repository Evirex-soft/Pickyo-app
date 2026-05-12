"use client";
import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, Mail, Phone, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUsers } from '@/services/admin.service';
import { User } from '@/types/admin.types';
import { cn } from '@/lib/utils';

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const USERS_PER_PAGE = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true); // Show loader when page changes
                const data = await getUsers(currentPage, USERS_PER_PAGE);
                setUsers(data.users);
                setTotalUsers(data.total);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage]); // Re-fetch when page changes

    // Search logic
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* 1. Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>

            {/* 2. Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                                <th className="px-8 py-5">User</th>
                                <th className="px-8 py-5">Contact</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Trips</th>
                                <th className="px-8 py-5">Joined</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                // Render 6 skeleton rows while loading
                                [...Array(6)].map((_, i) => <UserRowSkeleton key={i} />)
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-600 shadow-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium tracking-tight">ID: {user.id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Mail size={12} className="text-slate-400" /> {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Phone size={12} className="text-slate-400" /> {user.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <StatusBadge status={user.isActive ? "active" : "blocked"} />
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-700 text-sm">{user._count?.ridesAsCustomer || 0}</td>
                                        <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                                <MoreVertical size={18} className="text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 3. Pagination Footer */}
                {!isLoading && (
                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500">
                            Showing {filteredUsers.length} of {totalUsers} users
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage * USERS_PER_PAGE >= totalUsers}
                                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        active: "bg-emerald-50 text-emerald-600",
        blocked: "bg-red-50 text-red-600",
        pending: "bg-amber-50 text-amber-600",
    };
    return (
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", styles[status])}>
            {status}
        </span>
    );
};


const UserRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-8 py-5">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-slate-200" />
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div className="h-2 w-16 bg-slate-100 rounded" />
                </div>
            </div>
        </td>
        <td className="px-8 py-5">
            <div className="space-y-2">
                <div className="h-2 w-32 bg-slate-100 rounded" />
                <div className="h-2 w-24 bg-slate-100 rounded" />
            </div>
        </td>
        <td className="px-8 py-5 text-xs"><div className="h-6 w-16 bg-slate-200 rounded-full" /></td>
        <td className="px-8 py-5 text-xs"><div className="h-3 w-8 bg-slate-200 rounded" /></td>
        <td className="px-8 py-5 text-xs"><div className="h-3 w-20 bg-slate-100 rounded" /></td>
        <td className="px-8 py-5 text-right"><div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" /></td>
    </tr>
);