"use client";

import {
    LayoutDashboard,
    History,
    Wallet,
    CarFront,
    BarChart3,
    ShieldCheck,
    Settings,
    HelpCircle,
    X,
    FileText,
} from "lucide-react";

interface DriverSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function DriverSidebar({ isOpen, setIsOpen, activeTab, onTabChange }: DriverSidebarProps) {
    const mainNav = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "earnings", icon: Wallet, label: "Earnings" },
        { id: "history", icon: History, label: "Ride History" },
        { id: "performance", icon: BarChart3, label: "Performance" },
    ];

    const managementNav = [
        { id: "vehicle", icon: CarFront, label: "Vehicle Details" },
        { id: "documents", icon: FileText, label: "Documents" },
        { id: "safety", icon: ShieldCheck, label: "Safety Center" },
    ];

    const systemNav = [
        { id: "settings", icon: Settings, label: "Settings" },
        { id: "support", icon: HelpCircle, label: "Support" },
    ];

    const handleNavigation = (id: string) => {
        onTabChange(id);
        if (window.innerWidth < 1024) setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`} onClick={() => setIsOpen(false)}
            />

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out flex flex-col lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {/* Sidebar */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-800 lg:hidden">
                    <span className="font-bold">Menu</span>
                    <button onClick={() => setIsOpen(false)} className="text-zinc-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                    {/* Navigation Groups */}
                    {[
                        { title: "Main Menu", items: mainNav },
                        { title: "Business", items: managementNav },
                        { title: "System", items: systemNav }
                    ].map((group, idx) => (
                        <div key={idx} className="mb-8">
                            <p className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
                                {group.title}
                            </p>
                            <nav className="space-y-1">
                                {group.items.map((item) => (
                                    <SidebarItem
                                        key={item.id}
                                        item={item}
                                        active={activeTab === item.id}
                                        onClick={() => handleNavigation(item.id)}
                                    />
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

            </aside>
        </>
    )
}

function SidebarItem({ item, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${active
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                }`}
        >
            <item.icon size={18} className={active ? "animate-pulse" : ""} />
            {item.label}
        </button>
    )
}