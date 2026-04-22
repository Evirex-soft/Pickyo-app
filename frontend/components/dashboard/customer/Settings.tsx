"use client";
import {
    User,
    Bell,
    Lock,
    CreditCard,
    MapPin,
    ChevronRight,
    LogOut,
    ShieldCheck,
    Globe,
    Moon,
    Trash2,
    Camera
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { use, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        toast("Are you sure you want to log out?", {
            action: {
                label: "Log Out",
                onClick: () => console.log("Logged out")
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
                <p className="text-zinc-500 text-sm">Manage your profile and app preferences</p>
            </div>


            {/* Profile Section */}
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-3xl bg-zinc-100 flex items-center justify-center text-zinc-400 overflow-hidden">
                                <User size={40} />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900">{user?.name}</h2>
                            <p className="text-sm text-zinc-500">{user?.email}</p>
                        </div>
                    </div>
                    <button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>
            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Account Settings */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-4">Account</h3>
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden">
                        <SettingItem
                            icon={<MapPin size={18} />}
                            title="Saved Places"
                            description="Home, work, and other addresses"
                            href="/saved-places"
                        />
                        <SettingItem
                            icon={<CreditCard size={18} />}
                            title="Payment Methods"
                            description="Manage cards and digital wallets"
                            href="/payments"
                        />
                        <SettingItem
                            icon={<Lock size={18} />}
                            title="Security"
                            description="Password and two-factor auth"
                            href="/security"
                        />
                    </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-4">Preferences</h3>
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden p-2">
                        {/* Toggle Item */}
                        <div className="flex items-center justify-between p-4 hover:bg-zinc-50 rounded-3xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-600">
                                    <Bell size={18} />
                                </div>
                                <span className="text-sm font-bold text-zinc-900">Push Notifications</span>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 hover:bg-zinc-50 rounded-3xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-600">
                                    <Moon size={18} />
                                </div>
                                <span className="text-sm font-bold text-zinc-900">Dark Mode</span>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <SettingItem
                            icon={<Globe size={18} />}
                            title="Language"
                            description="English (US)"
                            href="/language"
                        />
                    </div>
                </div>

                {/* Support & Legal */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-4">Support</h3>
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden">
                        <SettingItem
                            icon={<ShieldCheck size={18} />}
                            title="Privacy Policy"
                            href="/privacy"
                        />
                        <div
                            onClick={handleLogout}
                            className="flex items-center justify-between p-4 hover:bg-red-50 cursor-pointer transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                    <LogOut size={18} />
                                </div>
                                <span className="text-sm font-bold text-red-600">Sign Out</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-400 ml-4">Danger Zone</h3>
                    <div className="bg-red-50/50 border border-red-100 rounded-[2.5rem] p-2">
                        <button className="w-full flex items-center gap-3 p-4 hover:bg-red-100/50 rounded-3xl transition-colors text-red-600">
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                <Trash2 size={18} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold">Delete Account</p>
                                <p className="text-[10px] opacity-70">This action is permanent</p>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
};

function SettingItem({ icon, title, description, href }: { icon: React.ReactNode, title: string, description?: string, href: string }) {
    return (
        <Link href={href} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-bold text-zinc-900">{title}</p>
                    {description && <p className="text-xs text-zinc-500">{description}</p>}
                </div>
            </div>
            <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
        </Link>
    );
}