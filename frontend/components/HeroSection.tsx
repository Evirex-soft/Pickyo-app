'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Bike, Clock, Leaf, Box,
  ArrowRight, Activity, Globe, ShieldCheck, Zap
} from 'lucide-react';

const FLEET = [
  { id: 'express', name: 'Express', icon: Bike, cap: '20kg', speed: 'Ultra' },
  { id: 'cargo', name: 'Cargo Pro', icon: Truck, cap: '500kg', speed: 'Fast' },
  { id: 'heavy', name: 'Heavy', icon: Box, cap: '2.5 Tons', speed: 'Scheduled' },
];

export default function ResponsivePremiumHero() {
  const [activeFleet, setActiveFleet] = useState('cargo');

  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Background Tech Grid - Scaled for high DPI */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: 'clamp(30px, 5vw, 50px) clamp(30px, 5vw, 50px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-32 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* --- LEFT SIDE: THE PITCH --- */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-bold tracking-widest uppercase mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Network Active: 124 Drivers Nearby
            </motion.div>

            {/* Headline: Uses Fluid Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[2.75rem] sm:text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight"
            >
              The <span className="text-indigo-600">OS</span> for <br className="hidden sm:block" />
              Modern Cargo.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Deploy your logistics infrastructure in seconds. From urban bike couriers to heavy freight, manage it all through one interface.
            </motion.p>

            {/* Buttons: Stack on mobile, side-by-side on tablet/desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4"
            >
              <button className="h-14 sm:h-16 px-8 sm:px-10 bg-slate-900 text-white rounded-full font-bold text-base sm:text-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-100 flex items-center justify-center gap-3 group">
                Start Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="h-14 sm:h-16 px-8 sm:px-10 bg-white border-2 border-slate-200 text-slate-900 rounded-full font-bold text-base sm:text-lg hover:border-slate-900 transition-all">
                Earn With US
              </button>
            </motion.div>

            {/* Trust Indicators: Only show prominently on larger screens */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-slate-100 opacity-60">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-[10px] uppercase tracking-tighter">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Fully Insured
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-bold text-[10px] uppercase tracking-tighter">
                <Globe className="w-4 h-4 text-indigo-500" /> Global Network
              </div>
              <div className="items-center gap-2 text-slate-600 font-bold text-[10px] uppercase tracking-tighter hidden md:flex">
                <Zap className="w-4 h-4 text-indigo-500" /> Instant Quote
              </div>
            </div>
          </div>

          {/* RIGHT SIDE  */}
          <div className="lg:col-span-6 xl:col-span-5 relative w-full max-w-125 lg:max-w-none mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square sm:aspect-4/5 lg:aspect-square xl:aspect-10/11 bg-slate-50 rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden"
            >
              {/* Map Layer */}
              <div
                className="absolute inset-0 grayscale opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              {/* Technical SVG Route - Fixed with ViewBox and Numerical Coordinates */}
              <svg className="absolute inset-0 w-full h-full p-8 sm:p-12 overflow-visible" viewBox="0 0 100 100">
                {/* 1. Static background line (The Path) */}
                <path
                  d="M 20 80 Q 50 75, 80 20"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* 2. The Animated Connection (Moving Dashes) */}
                <motion.path
                  d="M 20 80 Q 50 75, 80 20"
                  stroke="#4f46e5"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="4 8" // 4px dash, 8px gap
                  animate={{ strokeDashoffset: [24, 0] }} // Animates the dash offset
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* 3. Start Node (Pickup) */}
                <circle cx="20" cy="80" r="2.5" className="fill-white stroke-indigo-600 stroke-[0.8]" />

                {/* 4. End Node (Destination) with Pulse */}
                <motion.circle
                  cx="80" cy="20" r="3"
                  className="fill-white stroke-emerald-500 stroke-[0.8]"
                  animate={{ r: [3, 4.5, 3], strokeWidth: [0.8, 1.5, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>

              {/* HUD Elements */}
              <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between pointer-events-none">
                {/* Top Overlay */}
                <div className="flex justify-between items-start">
                  <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-lg pointer-events-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Pulse</p>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">Optimization: 98%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Overlay: Fleet Selector */}
                <div className="bg-white/95 backdrop-blur-2xl border border-white p-4 sm:p-6 rounded-4xl sm:rounded-[2.5rem] shadow-2xl pointer-events-auto">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Live Fleet</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Tracking Active</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {FLEET.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFleet(f.id)}
                        className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all border ${activeFleet === f.id
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xl lg:-translate-y-1'
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
                          }`}
                      >
                        <f.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        <div className="text-center">
                          <p className="text-[9px] font-bold uppercase mb-0.5">{f.name}</p>
                          <p className="text-[8px] font-bold opacity-60">{f.cap}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Info Tag */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-4 sm:-right-8 top-[15%] bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-2xl  items-center gap-3 z-20 hidden sm:flex"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Avg. Pickup</p>
                <p className="text-xs sm:text-sm font-black text-slate-900">12 MINS</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Footer Logo Strip: Marquee or Flex strip */}
      {/* <div className="mt-auto py-8 sm:py-12 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-8 sm:gap-4 opacity-30 grayscale filter contrast-125">
            {['LOGITECH', 'AMAZON FREIGHT', 'DHL GLOBAL', 'FEDEX PRO', 'MAERSK'].map((brand) => (
              <span key={brand} className="font-black text-sm sm:text-lg lg:text-xl tracking-tighter shrink-0">{brand}</span>
            ))}
          </div>
        </div>
      </div> */}
    </section>
  );
}