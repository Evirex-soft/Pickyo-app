"use client";

import { useState } from "react";
import {
    Search,
    MessageCircle,
    Mail,
    Phone,
    ChevronDown,
    ChevronRight,
    LifeBuoy,
    ExternalLink,
    FileText,
    ShieldAlert
} from "lucide-react";

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
};

const faqs: FAQ[] = [
    {
        id: 1,
        category: "Order",
        question: "How can I track my order status?",
        answer: "You can track your order in real-time through the 'Activity' tab in the main menu. We also send push notifications for every status update."
    },
    {
        id: 2,
        category: "Payment",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit/debit cards, Apple Pay, Google Pay, and localized digital wallets depending on your region."
    },
    {
        id: 3,
        category: "Account",
        question: "How do I delete my account?",
        answer: "You can find the 'Delete Account' option at the bottom of the Settings page under the Danger Zone section."
    }
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">How can we help?</h1>
                <p className="text-zinc-500 mb-8">Search our help center or contact our team</p>

                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for topics (e.g. 'refund')"
                        className="w-full pl-14 pr-6 py-5 bg-white border border-zinc-100 rounded-4xl shadow-sm outline-none focus:border-zinc-300 transition-all text-zinc-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <ContactCard
                    icon={<MessageCircle size={24} />}
                    title="Live Chat"
                    description="Average wait: 2 mins"
                    action="Start Chat"
                />
                <ContactCard
                    icon={<Mail size={24} />}
                    title="Email Support"
                    description="Response within 24h"
                    action="Send Email"
                />
                <ContactCard
                    icon={<Phone size={24} />}
                    title="Phone Support"
                    description="Available 9am - 6pm"
                    action="Call Now"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* FAQs */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-2 mb-4">Frequently Asked Questions</h3>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-50/50 transition-colors"
                                >
                                    <div className="pr-4">
                                        <span className="text-[10px] font-black uppercase text-zinc-400 block mb-1">{faq.category}</span>
                                        <span className="font-bold text-zinc-900">{faq.question}</span>
                                    </div>
                                    <ChevronDown
                                        size={20}
                                        className={`text-zinc-400 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFaq === faq.id && (
                                    <div className="px-6 pb-6 text-sm text-zinc-600 leading-relaxed animate-in fade-in slide-in-from-top-2">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200">
                            <LifeBuoy className="mx-auto text-zinc-300 mb-2" size={32} />
                            <p className="text-zinc-500 font-medium">No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Links */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-2">Resources</h3>
                    <div className="bg-zinc-900 rounded-[2.5rem] p-6 text-white">
                        <h4 className="font-bold mb-2">Community Forum</h4>
                        <p className="text-xs text-zinc-400 mb-4">Connect with other users and share tips.</p>
                        <button className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors">
                            Visit Forum <ExternalLink size={12} />
                        </button>
                    </div>

                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-2">
                        <SidebarLink icon={<FileText size={18} />} title="User Guide" />
                        <SidebarLink icon={<ShieldAlert size={18} />} title="Safety Center" />
                        <SidebarLink icon={<LifeBuoy size={18} />} title="Terms of Service" />
                    </div>
                </div>

            </div>

        </div>
    )
}

function ContactCard({ icon, title, description, action }: { icon: React.ReactNode, title: string, description: string, action: string }) {
    return (
        <div className="group p-6 bg-white border border-zinc-100 rounded-[2.5rem] hover:border-zinc-200 transition-all text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-600 mx-auto mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                {icon}
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">{title}</h3>
            <p className="text-xs text-zinc-500 mb-4">{description}</p>
            <button className="text-xs font-bold text-zinc-900 bg-zinc-100 px-4 py-2 rounded-xl hover:bg-zinc-200 transition-colors">
                {action}
            </button>
        </div>
    );
}

function SidebarLink({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 rounded-3xl transition-colors group">
            <div className="flex items-center gap-3">
                <div className="text-zinc-400 group-hover:text-zinc-900 transition-colors">
                    {icon}
                </div>
                <span className="text-sm font-bold text-zinc-900">{title}</span>
            </div>
            <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900" />
        </button>
    );
}