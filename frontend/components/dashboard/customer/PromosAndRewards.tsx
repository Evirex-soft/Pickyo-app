"use client";

import { useState, useEffect } from "react";
import {
    Ticket,
    Gift,
    Clock,
    Copy,
    CheckCircle2,
    Tag,
    Search,
    ChevronRight,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
// Assume you'll create these service functions
// import { getPromos } from "@/services/user.service"; 

interface Promo {
    id: string;
    title: string;
    description: string;
    code: string;
    expiryDate: string;
    type: "discount" | "reward" | "cashback";
    status: "active" | "expired" | "used";
    value: string; // e.g., "20%", "$10 Off"
}

export default function PromosAndRewards() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"available" | "history">("available");
    const [promos, setPromos] = useState<Promo[]>([]);

    // Mock data - replace with actual fetch in useEffect
    useEffect(() => {
        const fetchPromos = async () => {
            setLoading(true);
            try {
                // const data = await getPromos();
                // setPromos(data);

                // Simulated Delay & Data
                setTimeout(() => {
                    setPromos([
                        {
                            id: "1",
                            title: "First Order Discount",
                            description: "Get 20% off on your first order above $50",
                            code: "WELCOME20",
                            expiryDate: "2024-12-31",
                            type: "discount",
                            status: "active",
                            value: "20%"
                        },
                        {
                            id: "2",
                            title: "Free Delivery Reward",
                            description: "Valid for all orders this weekend",
                            code: "FREESHIP",
                            expiryDate: "2024-06-15",
                            type: "reward",
                            status: "active",
                            value: "FREE"
                        },
                        {
                            id: "3",
                            title: "Referral Bonus",
                            description: "Used on June 01, 2024",
                            code: "REF50",
                            expiryDate: "2024-06-01",
                            type: "cashback",
                            status: "used",
                            value: "$50"
                        }
                    ]);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                toast.error("Failed to load rewards");
                setLoading(false);
            }
        };
        fetchPromos();
    }, []);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Promo code copied!", {
            description: `${code} is ready to use.`
        });
    };

    const filteredPromos = promos.filter(p =>
        activeTab === "available" ? p.status === "active" : p.status !== "active"
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900">Promos & Rewards</h1>
                <p className="text-zinc-500 text-sm">Apply codes to save on your next order</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 p-1 bg-zinc-100 rounded-2xl mb-8 w-fit">
                <button
                    onClick={() => setActiveTab("available")}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "available" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                        }`}
                >
                    Available
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "history" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                        }`}
                >
                    History
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 bg-zinc-100 rounded-4xl animate-pulse" />
                    ))}
                </div>
            ) : filteredPromos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPromos.map((promo) => (
                        <div
                            key={promo.id}
                            className={`group p-6 bg-white border border-zinc-100 rounded-4xl flex flex-col justify-between transition-all hover:border-zinc-200 hover:shadow-sm ${promo.status !== 'active' ? 'opacity-70' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                        {promo.type === 'discount' ? <Tag size={20} /> : promo.type === 'reward' ? <Gift size={20} /> : <Ticket size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900">{promo.title}</h3>
                                        <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                                            <Clock size={12} /> {promo.status === 'active' ? `Expires ${promo.expiryDate}` : 'Expired'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-lg font-black text-zinc-900">
                                    {promo.value}
                                </div>
                            </div>

                            <p className="text-sm text-zinc-600 mb-6 line-clamp-2">
                                {promo.description}
                            </p>

                            <div className="flex items-center gap-2">
                                {promo.status === 'active' ? (
                                    <>
                                        <div className="flex-1 bg-zinc-50 border border-dashed border-zinc-300 px-4 py-2.5 rounded-xl text-sm font-mono font-bold text-zinc-700 flex items-center justify-between">
                                            {promo.code}
                                            <button
                                                onClick={() => copyToClipboard(promo.code)}
                                                className="text-zinc-400 hover:text-zinc-900 transition-colors"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 bg-zinc-50 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 flex items-center gap-2">
                                        <CheckCircle2 size={14} /> {promo.status === 'used' ? 'Reward Redeemed' : 'Voucher Expired'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
                    <Ticket className="text-zinc-300 mx-auto mb-4" size={48} />
                    <p className="text-zinc-500 font-medium">No rewards found in this section</p>
                </div>
            )}
        </div>
    );
}