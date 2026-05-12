"use client";

import { useState, useRef, useEffect } from "react";
import {
    Bell,
    Menu,
    Search,
    User,
    LogOut,
    ChevronDown,
    Zap,
    Car,
    CreditCard,
    FileCheck,
    X
} from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/services/auth.service";
import {
    fetchNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from "@/services/notification.service";
import { formatDistanceToNow } from "date-fns";

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: HeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector((state: RootState) => state.auth.user);
    const role = (user?.role || "customer") as "customer" | "driver";


    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (err) {
            console.error("Notif error", err);
        }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications?.filter(n => !n.isRead).length;

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
            toast.success("All notifications marked as read");
        } catch (err) {
            toast.error("Failed to update notifications");
        }
    };

    const handleMarkSingleRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ride_request': return <Zap className="text-amber-500" size={16} />;
            case 'ride_update': return <Car className="text-blue-500" size={16} />;
            case 'payment': return <CreditCard className="text-green-500" size={16} />;
            case 'document_status': return <FileCheck className="text-purple-500" size={16} />;
            default: return <Bell size={16} />;
        }
    };


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Close profile dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            // Close notification dropdown
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (name?: string) =>
        name?.split(" ").map((word) => word[0]).join("").toUpperCase() || "U";

    const navConfig = {
        customer: [
            { label: "Overview", href: "/dashboard" },
            { label: "My Rides", href: "/dashboard/rides" },
            { label: "Payments", href: "/dashboard/payments" },
        ],
        driver: [
            { label: "Overview", href: "/driver" },
            { label: "Ride Requests", href: "/driver/rides" },
            { label: "Earnings", href: "/driver/earnings" },
        ]
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(logout());
            router.replace("/login");
            toast.success("Logged out successfully.");
        } catch (error) {
            toast.error("Failed to log out.");
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Left: Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <button onClick={onMenuClick} className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 lg:hidden">
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link href={role === "driver" ? "/driver" : "/dashboard"} className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-lg">P</span>
                            <span className="hidden sm:block">Pickyo</span>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {navConfig[role].map((item) => (
                            <Link key={item.href} href={item.href} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Search - Desktop only */}
                        <div className="hidden lg:flex items-center relative">
                            <Search className="w-4 h-4 absolute left-3 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-1.5 h-9 text-sm rounded-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 w-48 xl:w-64"
                            />
                        </div>

                        {/* Notifications Dropdown */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="relative p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button onClick={handleMarkAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-95 overflow-y-auto custom-scrollbar">
                                        {notifications?.length === 0 ? (
                                            <div className="p-10 text-center">
                                                <Bell className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                                                <p className="text-zinc-500 text-sm">No new notifications</p>
                                            </div>
                                        ) : (
                                            notifications?.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => handleMarkSingleRead(n.id)}
                                                    className={`p-4 border-b border-zinc-50 dark:border-zinc-800/50 flex gap-3 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/40 dark:bg-blue-500/5' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                                >
                                                    <div className="mt-0.5 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl h-fit">
                                                        {getIcon(n.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <p className={`text-sm leading-tight ${!n.isRead ? 'font-bold text-zinc-900 dark:text-white' : 'font-medium text-zinc-600 dark:text-zinc-400'}`}>
                                                                {n.title}
                                                            </p>
                                                            {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
                                                        </div>
                                                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400 mt-2 font-medium uppercase tracking-wider">
                                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <Link href={role === 'driver' ? "/driver/notifications" : "/dashboard/notifications"}
                                        className="block p-3 text-center text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-800"
                                        onClick={() => setIsNotifOpen(false)}
                                    >
                                        View All
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                            >
                                <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 text-xs font-bold shadow-sm">
                                    {getInitials(user?.name)}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform hidden sm:block ${isProfileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                                        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-zinc-500 truncate mt-0.5">{user?.email}</p>
                                        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            {role}
                                        </div>
                                    </div>

                                    <Link href={role === 'driver' ? "/driver/profile" : "/dashboard/profile"}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User className="w-4 h-4 text-zinc-400" />
                                        My Profile
                                    </Link>

                                    <div className="border-t border-zinc-100 dark:border-zinc-800 mt-2 pt-2">
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
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