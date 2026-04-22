"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    User, Mail,
    Bell, Lock, ChevronRight, Star, LogOut,
    CheckCircle2, Smartphone,
    Globe, Accessibility, Leaf, Share2,
    Trash2, EyeOff, MessageSquare, HandHelping,
    Scale, BadgeCheck, Zap
} from "lucide-react";


export default function PremiumProfilePage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { name, email, role } = user || {};

    const [activeTab, setActiveTab] = useState<"account" | "preferences" | "privacy">("account");

    return (
        <div className="min-h-screen bg-[#F8F9FB] dark:bg-black py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER  */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                            Account
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium">Manage your digital identity & preferences</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-black text-zinc-900 dark:text-white">4.92</span>
                        </div>
                        <button className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 rounded-4xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-3xl font-black shadow-2xl">
                                        {name?.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 p-1 rounded-xl">
                                        <div className="bg-blue-500 text-white p-1 rounded-lg">
                                            <BadgeCheck size={16} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{name}</h2>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Verified {role}</span>
                            </div>

                            <div className="mt-8 space-y-2">
                                <TabBtn active={activeTab === 'account'} label="General Info" icon={<User size={18} />} onClick={() => setActiveTab('account')} />
                                <TabBtn active={activeTab === 'preferences'} label="App Preferences" icon={<Zap size={18} />} onClick={() => setActiveTab('preferences')} />
                                <TabBtn active={activeTab === 'privacy'} label="Data & Privacy" icon={<Lock size={18} />} onClick={() => setActiveTab('privacy')} />
                            </div>
                        </div>

                        {/* Impact/Stats Grid - Uber Gamification */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard icon={<CheckCircle2 className="text-green-500" />} value="428" label="Trips" />
                            <StatCard icon={<Leaf className="text-emerald-500" />} value="12kg" label="CO2 Saved" />
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="lg:col-span-8">

                        {activeTab === "account" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Profile Fields */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8">
                                    <h3 className="font-bold text-lg mb-6">Personal Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Display Name" value={name} icon={<User />} />
                                        <InputGroup label="Phone Number" value="+91 98765 43210" icon={<Smartphone />} />
                                        <InputGroup label="Email" value={email} icon={<Mail />} disabled />
                                    </div>
                                    <button className="mt-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform active:scale-95">
                                        Update Profile
                                    </button>
                                </div>

                                {/* Trusted Contacts - Unique Feature */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-lg">Trusted Contacts</h3>
                                        <button className="text-xs font-black text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                            <Share2 size={12} /> Manage
                                        </button>
                                    </div>
                                    <p className="text-sm text-zinc-500 mb-6 italic">Automatically share your live trip status with these people.</p>
                                    <div className="space-y-3">
                                        <ContactItem name="Sarah Doe" relation="Family" />
                                        <ContactItem name="Alex Rivera" relation="Partner" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "preferences" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                {/* App Behavior */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-2">
                                    <SectionHeader title="App Settings" />
                                    <ToggleItem icon={<Accessibility />} title="Accessibility" desc="Request wheelchair-accessible vehicles by default" />
                                    <ToggleItem icon={<HandHelping />} title="Assistance Needed" desc="Notify drivers you may need help getting in/out" />
                                    <SelectItem icon={<Globe />} title="Language" value="English (US)" />
                                    <SelectItem icon={<Scale />} title="Unit System" value="Metric (km)" />
                                </div>

                                {/* Granular Communications */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-2">
                                    <SectionHeader title="Communication Center" />
                                    <ToggleItem icon={<Bell />} title="Trip Status" desc="Push notifications for arrival and drop-off" active />
                                    <ToggleItem icon={<MessageSquare />} title="Marketing SMS" desc="Receive news and local promotions" />
                                </div>
                            </div>
                        )}

                        {activeTab === "privacy" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-2">
                                    <SectionHeader title="Privacy & Data Management" />
                                    <SettingActionItem icon={<EyeOff />} title="Privacy Center" desc="Take control of the data you share" />
                                    <SettingActionItem icon={<Lock />} title="Two-Step Verification" desc="Add an extra layer of security" />
                                    <SettingActionItem icon={<Trash2 className="text-red-500" />} title="Account Deletion" desc="Permanently remove your data and account" />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

/*  HELPER */

function TabBtn({ active, icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl"
                : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
        >
            <span className={active ? "text-white dark:text-zinc-900" : "text-zinc-400"}>{icon}</span>
            <span className="font-bold text-sm">{label}</span>
            {active && <ChevronRight className="ml-auto w-4 h-4" />}
        </button>
    );
}

function StatCard({ icon, value, label }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-4xl text-center shadow-sm">
            <div className="flex justify-center mb-2">{icon}</div>
            <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">{label}</p>
        </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 p-6 pb-2">{title}</h3>;
}

function ToggleItem({ icon, title, desc, active = false }: any) {
    return (
        <div className="flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-4xl transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{title}</p>
                    <p className="text-xs text-zinc-500 max-w-60">{desc}</p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${active ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                <div className={`w-4 h-4 rounded-full transition-all ${active ? 'translate-x-6 bg-white dark:bg-zinc-900' : 'translate-x-0 bg-white'}`} />
            </div>
        </div>
    );
}

function SelectItem({ icon, title, value }: any) {
    return (
        <div className="flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-4xl cursor-pointer group transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    {icon}
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{title}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400">{value}</span>
                <ChevronRight size={14} className="text-zinc-300" />
            </div>
        </div>
    );
}

function SettingActionItem({ icon, title, desc }: any) {
    return (
        <div className="flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-4xl cursor-pointer group transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{title}</p>
                    <p className="text-xs text-zinc-500">{desc}</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900" />
        </div>
    );
}

function ContactItem({ name, relation }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-xs">
                    {name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter">{relation}</p>
                </div>
            </div>
            <button className="text-zinc-300 hover:text-red-500"><Trash2 size={16} /></button>
        </div>
    );
}

function InputGroup({ label, value, icon, disabled }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">{label}</label>
            <div className={`relative flex items-center ${disabled ? 'opacity-50' : ''}`}>
                <div className="absolute left-4 text-zinc-400">{icon}</div>
                <input
                    type="text"
                    defaultValue={value}
                    disabled={disabled}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-transparent rounded-2xl outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-zinc-200 transition-all text-sm font-bold"
                />
            </div>
        </div>
    );
}