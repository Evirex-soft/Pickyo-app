import {
    LayoutDashboard, Users, Activity, IndianRupee, BarChart3,
    MessageSquare, Wallet, Ticket, Percent, MapPin,
    Truck, Bell, ShieldAlert, Map as MapIcon, UserCog, History, Car,
    Zap, Banknote, BrainCircuit, ShieldCheck, Settings2
} from "lucide-react";

export const MENU_GROUPS = [
    {
        group: "Operations",
        icon: Zap,
        items: [
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'live', label: 'Live Tracking', icon: Activity },
            { id: 'verification', label: 'Verification', icon: ShieldCheck },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'drivers', label: 'Drivers', icon: Car },
            { id: 'fleet', label: 'Fleet Management', icon: Truck },
        ]
    },
    {
        group: "Financial",
        icon: Banknote,
        items: [
            { id: 'payments', label: 'Payments', icon: Wallet },
            { id: 'pricing', label: 'Dynamic Pricing', icon: IndianRupee },
            { id: 'commission', label: 'Commission', icon: Percent },
            { id: 'promos', label: 'Promo Codes', icon: Ticket },
        ]
    },
    {
        group: "Intelligence",
        icon: BrainCircuit,
        items: [
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'heatmap', label: 'Heatmaps', icon: MapIcon },
            { id: 'geozone', label: 'Geo-Zones', icon: MapPin },
        ]
    },
    {
        group: "Trust & Safety",
        icon: ShieldCheck,
        items: [
            { id: 'disputes', label: 'Disputes', icon: MessageSquare },
            { id: 'fraud-detection', label: 'Fraud Detection', icon: ShieldAlert },
            { id: 'audit', label: 'Audit Logs', icon: History },
        ]
    },
    {
        group: "System",
        icon: Settings2,
        items: [
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'roles', label: 'Permissions', icon: UserCog },
        ]
    }
];