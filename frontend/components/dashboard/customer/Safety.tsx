"use client";

import {
    ShieldCheck,
    ShieldAlert,
    PhoneCall,
    Users,
    Map,
    Zap,
    ChevronRight,
    BellRing,
    Lock,
    EyeOff,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function SafetyPage() {
    const handleSOS = () => {
        toast.error("Emergency services are being notified", {
            description: "This is a demo.",
            duration: 5000,
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-white">
                        <ShieldCheck size={22} />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900">Safety Center</h1>
                </div>
                <p className="text-zinc-500 max-w-md">Your safety is our priority. Explore tools and features designed to keep you protected.</p>
            </div>

            {/* Emergency Action Card */}
            <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-4xl bg-white flex items-center justify-center text-red-600 shadow-sm shadow-red-200/50">
                        <Zap size={32} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-red-900">Emergency Assistance</h2>
                        <p className="text-red-700/70 text-sm">Need urgent help? Alert local authorities and our safety team immediately.</p>
                    </div>
                </div>
                <button
                    onClick={handleSOS}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-red-200"
                >
                    ACTIVATE SOS
                </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <SafetyFeatureCard
                    icon={<Map size={24} />}
                    title="Share Live Trip"
                    description="Let friends or family track your journey in real-time until you arrive."
                    enabled={true}
                />
                <SafetyFeatureCard
                    icon={<ShieldAlert size={24} />}
                    title="Incident Reporting"
                    description="Report safety concerns or accidents directly to our 24/7 response team."
                    enabled={false}
                    actionLabel="Report Now"
                />
                <SafetyFeatureCard
                    icon={<Lock size={24} />}
                    title="PIN Verification"
                    description="Ensure you're getting into the right vehicle with a unique 4-digit code."
                    enabled={true}
                />
                <SafetyFeatureCard
                    icon={<Users size={24} />}
                    title="Trusted Contacts"
                    description="Automatically share your trip status with your inner circle."
                    enabled={false}
                    actionLabel="Set Up"
                />
            </div>

            {/* Settings */}
            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-4">Safety Preferences</h3>
                <div className="bg-white border border-zinc-100 rounded-4xl overflow-hidden">
                    <SafetySettingItem
                        icon={<BellRing size={18} />}
                        title="Ride Check-ins"
                        description="We'll message you if we detect an unexpected long stop."
                    />
                    <SafetySettingItem
                        icon={<EyeOff size={18} />}
                        title="Data Anonymization"
                        description="Hide your specific pick-up address in driver history."
                    />
                    <SafetySettingItem
                        icon={<PhoneCall size={18} />}
                        title="Anonymized Calling"
                        description="Keep your phone number private during calls."
                    />
                </div>
            </div>

            {/* Educational Link */}
            <div className="mt-12 p-8 bg-zinc-900 rounded-[2.5rem] text-white flex items-center justify-between group cursor-pointer">
                <div>
                    <h4 className="font-bold text-lg mb-1">Safety Guidelines</h4>
                    <p className="text-zinc-400 text-sm">Read our commitment to community standards and safety.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-zinc-900 transition-all">
                    <ChevronRight size={24} />
                </div>
            </div>

        </div>
    )
};


function SafetyFeatureCard({ icon, title, description, enabled, actionLabel }: { icon: React.ReactNode, title: string, description: string, enabled: boolean, actionLabel?: string }) {
    return (
        <div className="group p-8 bg-white border border-zinc-100 rounded-[2.5rem] hover:border-zinc-200 transition-all flex flex-col h-full">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors mb-6">
                {icon}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-zinc-900">{title}</h3>
                    {enabled && <CheckCircle2 size={16} className="text-green-500" />}
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6">{description}</p>
            </div>

            <button className={`w-fit px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${enabled
                ? 'bg-zinc-50 text-zinc-500 cursor-default'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}>
                {enabled ? "Currently Active" : (actionLabel || "Configure")}
            </button>
        </div>
    );
}

function SafetySettingItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex items-center justify-between p-6 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0 group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-bold text-zinc-900">{title}</p>
                    <p className="text-xs text-zinc-500">{description}</p>
                </div>
            </div>
            <div className="w-12 h-6 bg-zinc-200 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
        </div>
    );
}