"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import {
    Truck,
    Clock,
    FileText,
    Settings,
    ArrowRight,
    Plus,
    Command
} from "lucide-react";

const ACTIONS = [
    {
        title: "New Booking",
        desc: "Schedule a shipment",
        icon: Plus,
        shortcut: "N",
        hoverColor: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
        borderColor: "hover:border-indigo-500/30"
    },
    {
        title: "Order History",
        desc: "Track past deliveries",
        icon: Clock,
        shortcut: "H",
        hoverColor: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
        borderColor: "hover:border-orange-500/30"
    },
    {
        title: "Invoices",
        desc: "View billing statements",
        icon: FileText,
        shortcut: "I",
        hoverColor: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
        borderColor: "hover:border-emerald-500/30"
    },
    {
        title: "Preferences",
        desc: "System settings",
        icon: Settings,
        shortcut: "S",
        hoverColor: "group-hover:text-zinc-900 dark:group-hover:text-white",
        borderColor: "hover:border-zinc-500/30"
    },
];

export default function QuickActions() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);

    useGSAP(() => {
        const elements = cardsRef.current.filter(Boolean);

        if (elements.length > 0) {
            gsap.fromTo(elements,
                {
                    y: 20,
                    opacity: 0,
                    scale: 0.98
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="px-6 lg:px-8 pb-8 max-w-7xl mx-auto w-full">

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Quick Actions
                </h3>
                <button className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    Customize
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ACTIONS.map((action, idx) => (
                    <button
                        key={idx}
                        ref={(el) => { cardsRef.current[idx] = el }}
                        className={`group relative flex flex-col justify-between p-5 h-40 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none hover:-translate-y-1 ${action.borderColor}`}
                    >
                        {/* Top Row: Icon and Shortcut */}
                        <div className="w-full flex justify-between items-start">
                            <div className={`p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 transition-colors ${action.hoverColor}`}>
                                <action.icon size={20} strokeWidth={2} />
                            </div>

                            {/* Visual Keyboard Shortcut Hint */}
                            <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Command size={10} />
                                <span>{action.shortcut}</span>
                            </div>
                        </div>

                        {/* Bottom Row: Text and Arrow */}
                        <div className="w-full">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                                    {action.title}
                                </h4>
                                <ArrowRight
                                    size={16}
                                    className="text-zinc-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                                />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                                {action.desc}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}