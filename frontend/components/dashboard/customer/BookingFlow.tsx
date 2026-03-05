"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { MapPin, Truck, Package, CheckCircle } from "lucide-react";

const STEPS = [
    { id: 1, title: "Locations", icon: MapPin },
    { id: 2, title: "Vehicle", icon: Truck },
    { id: 3, title: "Details", icon: Package },
    { id: 4, title: "Confirm", icon: CheckCircle },
];

export default function BookingFlow() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const steps = gsap.utils.toArray(".flow-step");

        gsap.fromTo(steps,
            { x: -50, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: wrapperRef });

    return (
        <section className="px-6 lg:px-12 py-16 bg-white dark:bg-zinc-900/50 border-y border-zinc-100 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto" ref={wrapperRef}>
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold mb-2">How it works</h2>
                    <p className="text-zinc-500">Simple 4-step booking process</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />

                    {STEPS.map((step, idx) => (
                        <div key={idx} className="flow-step flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-800 border-4 border-zinc-50 dark:border-zinc-900 shadow-lg flex items-center justify-center mb-4 relative z-10 group transition-transform hover:scale-110">
                                <step.icon className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors" size={32} />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-full text-xs flex items-center justify-center font-bold">
                                    {step.id}
                                </div>
                            </div>
                            <h3 className="font-bold text-lg">{step.title}</h3>
                            <p className="text-sm text-zinc-500 mt-1">Select your {step.title.toLowerCase()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}