"use client";

import { useDriver } from "./DriverContext";
import { LogOut, Menu, UserCircle } from "lucide-react";

export default function DriverHeader() {
    const { status, toggleOnline, earnings } = useDriver();

    return (
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                {/* Logo & Brand */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                        <span className="text-white dark:text-black font-bold text-xl">D</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden md:block dark:text-white">
                        DrivePartner
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-500 rounded-full">
                        DRIVER
                    </span>
                </div>

                {/* Center: Online Toggle */}
                <button
                    onClick={toggleOnline}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${status === 'offline'
                            ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                            : "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        }`}
                >
                    <div className={`w-2.5 h-2.5 rounded-full ${status === 'offline' ? 'bg-zinc-400' : 'bg-white'}`} />
                    {status === 'offline' ? "GO ONLINE" : "YOU ARE ONLINE"}
                </button>

                {/* Right: Profile & Earnings */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-xs text-zinc-500 font-medium uppercase">Today's Wallet</p>
                        <p className="font-bold text-lg text-zinc-900 dark:text-white">₹{earnings}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <UserCircle className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
                    </div>
                </div>
            </div>
        </header>
    );
}