"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import {
    Plus,
    Wallet,
    Calendar,
    ArrowUpRight,
    CreditCard,
    MoreHorizontal
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function DashboardHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.auth.user);

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Container expansion
        tl.fromTo(containerRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 });

        // Content stagger
        tl.fromTo(".dash-item", { y: 20, opacity: 0, filter: "blur(5px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, stagger: 0.05 },
            "-=0.4"
        );

    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="w-full max-w-7xl mx-auto pt-6 px-6 lg:px-8 pb-8">

            {/*  Banner Card */}
            <div className="relative w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 lg:p-8 overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size[24px_24px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-75 h-75 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                    <div className="lg:col-span-5 space-y-4">
                        <div className="dash-item flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                            <Calendar size={14} />
                            <span className="uppercase tracking-wide">{currentDate}</span>
                        </div>

                        <div className="dash-item space-y-1">
                            <h1 className="text-3xl lg:text-4xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                                Welcome, {user?.name?.split(' ')[0] || 'User'}
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                You have <span className="text-indigo-600 dark:text-indigo-400 font-medium">4 active shipments</span> scheduled for today.
                            </p>
                        </div>

                        <div className="dash-item pt-2 flex gap-3">
                            <button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                <Plus size={16} />
                                New Booking
                            </button>
                            <button className="flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                View Schedule
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden lg:block lg:col-span-3 lg:border-l lg:border-zinc-200 dark:lg:border-zinc-800 lg:pl-8 h-full">
                        <div className="dash-item flex flex-col justify-between h-full py-1">
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Weekly Volume</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">2,405</span>
                                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">+12%</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Fleet Efficiency</p>
                                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '84%' }} />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-zinc-400">
                                    <span>84% Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Wallet */}
                    <div className="lg:col-span-4 w-full">
                        <div className="dash-item group relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg shadow-indigo-500/20 transition-transform hover:-translate-y-1">

                            {/* Card Texture */}
                            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                <Wallet size={100} strokeWidth={1} />
                            </div>

                            <div className="relative z-10 flex flex-col justify-between h-32">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                        <CreditCard size={20} className="text-white" />
                                    </div>
                                    <button className="text-indigo-100 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div>
                                    <p className="text-indigo-200 text-sm font-medium mb-1">Available Balance</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-3xl font-bold tracking-tight">₹{user?.wallet?.balance}</h3>
                                        <button className="flex items-center gap-1 text-xs font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm">
                                            Top Up <ArrowUpRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}