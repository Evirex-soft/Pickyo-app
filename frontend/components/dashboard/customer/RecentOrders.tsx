"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { RECENT_ORDERS } from "@/lib/data";
import { ArrowRight, Repeat } from "lucide-react";

export default function RecentOrders() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".order-card", {
            x: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="px-6 lg:px-12 py-12 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl font-bold">Recent Deliveries</h3>
                <button className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ArrowRight size={16} />
                </button>
            </div>

            <div className="flex overflow-x-auto pb-8 gap-6 snap-x no-scrollbar mask-gradient">
                {RECENT_ORDERS.map((order) => (
                    <div key={order.id} className="order-card min-w-75 snap-center">
                        <Card className="p-6 h-full flex flex-col justify-between group hover:border-indigo-500/50">
                            <div>
                                <div className="flex justify-between mb-4">
                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-xs font-mono text-zinc-500">{order.date}</span>
                                    <span className="font-bold">{order.amount}</span>
                                </div>
                                <h4 className="font-semibold text-lg mb-1">{order.dest}</h4>
                                <p className="text-sm text-zinc-500">Standard Delivery</p>
                            </div>

                            <button className="mt-6 w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 text-sm font-medium hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors">
                                <Repeat size={14} /> Rebook
                            </button>
                        </Card>
                    </div>
                ))}
            </div>
        </section>
    );
}