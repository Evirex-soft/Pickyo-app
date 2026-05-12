"use client";
import { MENU_ITEMS } from "@/constants/adminMenu";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export const Sidebar = ({ isOpen, onClose }: any) => {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={cn(
                    "w-64 bg-white border-r border-slate-200 flex flex-col shrink-0",
                    "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="relative p-6 text-black font-bold text-2xl text-center">
                    Pickyo

                    {/* Close button */}
                    <button
                        className="absolute right-6 top-1/2 -translate-y-1/2 lg:hidden text-xl"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.id}
                            href={`?tab=${item.id}`}
                            onClick={onClose} // close on click (mobile)
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 transition-all text-black",
                                activeTab === item.id &&
                                "bg-blue-600 text-white border-r-4 border-blue-400"
                            )}
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>

    );
};