import {
    LayoutDashboard, Users, Activity, IndianRupee, BarChart3,
    MessageSquare, Wallet, Ticket, Percent, MapPin,
    Truck, Bell, ShieldAlert, Map as MapIcon, UserCog, History, Car
} from "lucide-react";

export const MENU_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'drivers', label: 'Drivers', icon: Car },
    { id: 'live', label: 'Live Tracking', icon: Activity },
    { id: 'pricing', label: 'Dynamic Pricing', icon: IndianRupee },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'disputes', label: 'Disputes', icon: MessageSquare },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'promos', label: 'Promo Codes', icon: Ticket },
    { id: 'commission', label: 'Commission', icon: Percent },
    { id: 'geozone', label: 'Geo-Zones', icon: MapPin },
    { id: 'fleet', label: 'Fleet Management', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: ShieldAlert },
    { id: 'heatmap', label: 'Heatmaps', icon: MapIcon },
    { id: 'roles', label: 'Permissions', icon: UserCog },
    { id: 'audit', label: 'Audit Logs', icon: History },
];