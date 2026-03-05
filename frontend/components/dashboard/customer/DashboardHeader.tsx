"use client";

import { useState, useRef, useEffect } from "react";
import {
    Bell,
    Menu,
    Search,
    User,
    Settings,
    LogOut,
    ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function DashboardHeader() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.auth.user);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (name?: string) => {
        if (!name) return "";

        return name.split(' ').map((word) => word[0]).join('').toUpperCase();
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 md:hidden">
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">

                            <span>Pickyo</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        <Link href="#" className="text-zinc-900 dark:text-white transition-colors">Overview</Link>
                        <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Shipments</Link>
                        <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Invoices</Link>
                        <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Support</Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Search (Desktop) */}
                        <div className="hidden sm:flex items-center relative">
                            <Search className="w-4 h-4 absolute left-3 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="pl-9 pr-4 py-1.5 h-9 text-sm rounded-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 w-64 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-medium shadow-md">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white">{user?.name}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{user?.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                                    </div>

                                    <Link href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-blue-600 transition-colors">
                                        <User className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <Link href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-blue-600 transition-colors">
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>

                                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-2 pt-2">
                                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}