"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { STATS } from "@/lib/data";

export default function StatsSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Select all elements with class .stat-value inside the container
        const stats = gsap.utils.toArray<HTMLElement>(".stat-value");

        stats.forEach((stat) => {
            const endValue = parseFloat(stat.dataset.value || "0");

            gsap.fromTo(stat,
                { innerText: 0 },
                {
                    innerText: endValue,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerText: 1 }, // Snap to whole numbers
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        once: true, // Animate only once
                    }
                }
            );
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="text-center md:text-left border-l-2 border-zinc-100 dark:border-zinc-800 pl-6">
                        <p className="text-sm text-zinc-500 uppercase tracking-widest font-semibold mb-2">{stat.label}</p>
                        <div className="flex items-baseline justify-center md:justify-start gap-1">
                            <span className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white stat-value" data-value={stat.value}>0</span>
                            <span className="text-xl text-indigo-500 font-medium">{stat.suffix}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}