"use client";

import { Car, Clock, Wallet, MapPin, Settings, HelpCircle, X, Gift, ShieldCheck } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function Sidebar({ isOpen, setIsOpen, activeTab, onTabChange }: SidebarProps) {

    // Using IDs to match the state in the parent
    const mainNav = [
        { id: "book", icon: Car, label: "Book a Ride" },
        { id: "trips", icon: Clock, label: "My Trips" },
        { id: "wallet", icon: Wallet, label: "Wallet & Payments" },
        { id: "places", icon: MapPin, label: "Saved Places" },
    ];

    const accountNav = [
        { id: "promos", icon: Gift, label: "Promos & Rewards" },
        { id: "safety", icon: ShieldCheck, label: "Safety" },
        { id: "settings", icon: Settings, label: "Settings" },
        { id: "support", icon: HelpCircle, label: "Support" },
    ];

    const handleNavigation = (id: string) => {
        onTabChange(id);
        if (window.innerWidth < 1024) setIsOpen(false); // Close mobile sidebar on click
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setIsOpen(false)} />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:h-screen
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <button onClick={() => setIsOpen(false)} className="lg:hidden absolute right-4 top-4 text-zinc-400">
                    <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto px-4 p-6 mt-10 lg:mt-0">
                    <div className="mb-6">
                        <p className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Main Menu</p>
                        <nav className="space-y-1">
                            {mainNav.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                            ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                                            : "text-zinc-500 hover:bg-zinc-100"
                                        }`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <p className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Account</p>
                        <nav className="space-y-1">
                            {accountNav.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                            ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                                            : "text-zinc-500 hover:bg-zinc-100"
                                        }`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    );
}