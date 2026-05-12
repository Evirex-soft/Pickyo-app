"use client";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { Bell, Search, User, LogOut, Menu, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    // Accessing your Redux state
    const { user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();

    return (
        <header className="sticky top-0 z-40 w-full h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between transition-all duration-300">

            {/* LEFT SECTION: Branding & Mobile Trigger */}
            <div className="flex items-center gap-3 md:gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 lg:hidden hover:bg-slate-100 active:scale-95 rounded-xl transition-all text-slate-600"
                    aria-label="Open Menu"
                >
                    <Menu size={22} />
                </button>

                {/* Search - Icon only on mobile, expanded on Desktop */}
                <div className="relative group">
                    <div className="flex md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer">
                        <Search size={20} />
                    </div>

                    <div className="hidden md:flex items-center bg-slate-50/50 border border-slate-100 px-4 py-2 rounded-2xl w-64 lg:w-80 focus-within:w-72 lg:focus-within:w-96 focus-within:bg-white focus-within:ring-4 ring-blue-50/50 transition-all duration-300">
                        <Search size={18} className="text-slate-400 group-focus-within:text-blue-500" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-600 placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION: Actions & Profile */}
            <div className="flex items-center gap-1 md:gap-4">

                {/* Secondary Actions - Desktop Only */}
                <div className="hidden sm:flex items-center gap-1 mr-2">
                    <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                        <Settings size={20} />
                    </button>
                </div>

                {/* Notifications */}
                <button className="relative p-2.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all active:scale-90 group">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:animate-bounce"></span>
                </button>

                {/* Profile Section */}
                <div className="flex items-center gap-2 ml-1 md:ml-4 pl-2 md:pl-4 border-l border-slate-100">
                    {/* Text info - Hidden on mobile/tablet, shown on LG */}
                    <div className="hidden lg:block text-right mr-2">
                        <p className="text-sm font-bold text-slate-900 leading-none truncate max-w-[120px]">
                            {user?.name || "Administrator"}
                        </p>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                            {user?.role || "System Admin"}
                        </p>
                    </div>

                    {/* Avatar with Status Ring */}
                    <div className="relative group cursor-pointer">
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">
                            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                                <User size={20} className="text-blue-600" />
                                {/* If you have image: <img src={user.avatar} className="object-cover" /> */}
                            </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>

                    {/* Logout - Compact on mobile */}
                    <button
                        onClick={() => dispatch(logout())}
                        className="ml-1 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};