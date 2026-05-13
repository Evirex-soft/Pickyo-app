"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, X } from "lucide-react";

import { MENU_GROUPS } from "@/constants/adminMenu";
import { cn } from "@/lib/utils";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    // Auto-open the group that contains the active tab
    const initialGroup = MENU_GROUPS.find(g =>
        g.items.some(item => item.id === activeTab)
    )?.group || "Operations";

    const [openGroup, setOpenGroup] = useState(initialGroup);

    const toggleGroup = (groupName: string) => {
        setOpenGroup((prev) => prev === groupName ? "" : groupName);
    };

    return (
        <>
            {/* Premium Blur Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
            )}

            <aside className={cn(
                "w-72 bg-white border-r border-slate-100 flex flex-col shrink-0",
                "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0",
                "transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Branding Section */}
                <div className="p-8 mb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                                <span className="text-white font-black text-xl italic">P</span>
                            </div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tighter">
                                Pickyo<span className="text-blue-600">.</span>
                            </h1>
                        </div>
                        <button className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-400" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-2">
                    {MENU_GROUPS.map((group) => {
                        const isExpanded = openGroup === group.group;
                        const hasActiveChild = group.items.some(i => i.id === activeTab);

                        return (
                            <div key={group.group} className={cn(
                                "rounded-[2rem] transition-all duration-300",
                                isExpanded ? "bg-slate-50/50 pb-2" : ""
                            )}>
                                <button
                                    onClick={() => toggleGroup(group.group)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-5 py-4 rounded-2xl group transition-all",
                                        isExpanded ? "text-slate-900" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "p-2 rounded-xl transition-all",
                                            isExpanded ? "bg-white shadow-sm text-blue-600" : "bg-transparent text-slate-400 group-hover:text-slate-600"
                                        )}>
                                            <group.icon size={18} strokeWidth={isExpanded ? 2.5 : 2} />
                                        </div>
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-[0.15em]",
                                            isExpanded ? "opacity-100" : "opacity-70"
                                        )}>
                                            {group.group}
                                        </span>
                                    </div>

                                    <div className={cn(
                                        "transition-transform duration-300",
                                        isExpanded ? "rotate-180 text-blue-600" : "text-slate-300"
                                    )}>
                                        <ChevronDown size={16} strokeWidth={3} />
                                    </div>
                                </button>

                                {/* Submenu with Vertical Indicator Line */}
                                <div className={cn(
                                    "overflow-hidden transition-all duration-500 ease-in-out px-4",
                                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                )}>
                                    <div className="ml-6 border-l-2 border-slate-100 space-y-1 py-1">
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`?tab=${item.id}`}
                                                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                                className={cn(
                                                    "relative ml-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group/item",
                                                    activeTab === item.id
                                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200 translate-x-1"
                                                        : "text-slate-500 hover:text-slate-900 hover:translate-x-1"
                                                )}
                                            >
                                                {/* Connecting dot for active state */}
                                                {activeTab === item.id && (
                                                    <div className="absolute -left-[18px] w-2 h-2 bg-slate-900 rounded-full border-2 border-white" />
                                                )}

                                                <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                                                <span className="tracking-tight">{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </nav>


            </aside>
        </>
    )
}