'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Phone, Search, Truck, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeInUp, staggerContainer, textReveal } from '@/components/animations';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-100/50 to-purple-100/30 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-100/40 to-emerald-50/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Active in 12 Major Cities
          </motion.div>

          {/* GSAP-style Text Reveal Headline */}
          <div className="overflow-hidden">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              <div className="overflow-hidden block">
                <motion.span variants={textReveal} className="block">
                  Logistics for the
                </motion.span>
              </div>
              <div className="overflow-hidden block">
                <motion.span
                  variants={textReveal}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500"
                >
                  Modern Age.
                </motion.span>
              </div>
            </h1>
          </div>

          <motion.p variants={fadeInUp} className="text-xl text-slate-500 max-w-lg leading-relaxed">
            Pickyo connects you with the nearest truck or bike driver in seconds. The Uber for cargo
            is finally here.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <Link href="/booking">
              <Button className="h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200/50 transition-all hover:scale-105 rounded-full">
                Book a Truck <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/driver">
              <Button
                variant="outline"
                className="h-14 px-8 text-lg bg-white border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full"
              >
                Earn with Pickyo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Visual/Abstract Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:h-[600px] w-full flex items-center justify-center perspective-1000"
        >
          {/* THE PHONE CONTAINER (Made smaller/shorter) */}
          <div
            className="relative
    w-[min(80vw,360px)]
    sm:w-[min(70vw,390px)]
    lg:w-[380px]
    aspect-[9/16]
    bg-slate-900
    rounded-[2.8rem]
    p-4
    shadow-2xl
    border-4
    border-slate-800
    ring-1
    ring-slate-900/50
    transform
    rotate-[-6deg]
    hover:rotate-0
    transition-transform
    duration-700
    ease-out
    z-20"
          >
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-slate-950 rounded-b-xl z-50"></div>

            {/* Screen Content */}
            <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden relative flex flex-col">
              {/* --- MAP LAYER --- */}
              <div className="absolute inset-0 z-0">
                {/* 1. Map Base & Grid */}
                <div className="absolute inset-0 bg-[#F3F4F6]"></div>
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }}
                ></div>

                {/* 2. Green Zones (Parks) */}
                <div className="absolute top-16 left-[-20px] w-32 h-32 bg-emerald-100/60 rounded-full blur-xl"></div>
                <div className="absolute bottom-32 right-[-20px] w-40 h-40 bg-emerald-100/60 rounded-full blur-xl"></div>

                {/* 3. SVG Route Path */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* 
                   Path Coordinates: 
                   Start: 20% Left, 85% Top
                   Curve: via 50% Left, 50% Top
                   End: 80% Left, 20% Top 
                */}
                  <motion.path
                    d="M 20 85 Q 50 50 80 20"
                    fill="transparent"
                    strokeWidth="3"
                    stroke="#3b82f6"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0.5 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  />

                  {/* Destination Pin Pulse */}
                  <circle cx="80" cy="20" r="3" fill="#ef4444" />
                </svg>

                {/* 4. Moving Truck Animation */}
                <motion.div
                  className="absolute w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center shadow-lg z-10 text-white ring-2 ring-white"
                  // Animate Top and Left to follow the SVG path curve (approximate)
                  animate={{
                    left: ['20%', '50%', '80%'],
                    top: ['85%', '50%', '20%'],
                  }}
                  transition={{
                    duration: 4,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Truck className="w-4 h-4 fill-current" />
                </motion.div>
              </div>

              {/* --- UI OVERLAY LAYER --- */}
              <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
                {/* Top: Compact Search */}
                <div className="pt-10 px-4">
                  <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-full py-2 px-3 flex items-center gap-2 border border-white/60">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex-1 text-[10px] text-slate-500 font-medium">
                      Tracking Order #2891
                    </div>
                  </div>
                </div>

                {/* Bottom: Compact Driver Sheet */}
                <div className="p-3 pb-5 pt-8 bg-gradient-to-t from-white via-white/80 to-transparent">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 pointer-events-auto">
                    {/* Handle */}
                    <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto mb-3"></div>

                    {/* Driver Row */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-500">
                          {/* DRIVER ICON */}
                          <User className="w-5 h-5" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm border border-white">
                          <span className="text-[8px] font-bold text-yellow-900">★</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">Mike R.</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">
                            Volvo FH
                          </span>
                          <span className="text-[10px] text-slate-400">· KL-07-29</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">2 min</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">
                        <MessageSquare className="w-3 h-3" /> Chat
                      </button>
                      <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
                        <Phone className="w-3 h-3" /> Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Decor Elements */}
          <div className="absolute -z-10 top-1/2 right-4 w-56 h-56 bg-indigo-400 rounded-full blur-[80px] opacity-20" />
          <div className="absolute -z-10 bottom-0 left-4 w-64 h-64 bg-emerald-400 rounded-full blur-[80px] opacity-20" />
        </motion.div>
      </div>
    </section>
  );
}
