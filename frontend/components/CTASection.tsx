'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Zap, MapPin, Package } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Background Decor matching the "Infrastructure" vibe */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-size-[30px_30px] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#0A0A0B] rounded-[2.5rem] p-8 md:p-20 overflow-hidden border border-zinc-800 shadow-2xl"
        >
          {/* 1. PREMIUM BACKGROUND ELEMENTS */}
          <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

          {/* Animated Grid Lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 flex flex-col items-center text-center">

            {/* 2. TAG/STATUS INDICATOR */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Unified Mobility Platform</span>
            </motion.div>

            {/* 3. REFINED TYPOGRAPHY */}
            <h2 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-8 leading-[0.95]">
              Move Anything. <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-200 via-zinc-500 to-zinc-700">
                Anywhere.
              </span>
            </h2>

            <p className="text-zinc-400 text-lg md:text-xl font-light mb-12 max-w-2xl leading-relaxed text-center">
              Join the global network of enterprises using Pickyo.
              From <span className="text-white">executive rides</span> to{" "}
              <span className="text-white">last-mile deliveries</span>,
              Pickyo coordinates your world through a high-performance transit network.
            </p>

            {/* 4. PREMIUM BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link href="/booking" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full sm:w-auto h-16 px-10 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all overflow-hidden"
                >
                  {/* Subtle Inner Shimmer Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-zinc-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <span className="relative z-10">Start Transit</span>
                  <Zap className="w-5 h-5 fill-black relative z-10" />
                </motion.button>
              </Link>

              <Link href="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="w-full sm:w-auto h-16 px-10 border border-zinc-700 text-zinc-300 font-medium rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                  Explore Services
                  <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>

            {/* 5. TRUST FOOTER */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-zinc-800/50 w-full max-w-4xl">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Safety First</p>
                  <p className="text-xs text-zinc-300 font-medium">Vetted Fleet & Goods</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Precision</p>
                  <p className="text-xs text-zinc-300 font-medium">Live GPS Telemetry</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center md:justify-end">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Package className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Dispatch</p>
                  <p className="text-xs text-zinc-300 font-medium">People & Parcels</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div >
    </section >
  );
}