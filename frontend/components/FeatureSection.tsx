"use client";

import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Cpu, Terminal, Activity } from 'lucide-react';


export default function FeatureSection() {
  const router = useRouter();
  return (
    <section className='py-24 lg:py-32 bg-[#050505] text-white relative overflow-hidden'>
      {/* Background layer */}
      <div className='absolute inset-0 z-0'>
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        {/* Grid */}
        <div className='absolute inset-0 border-x border-white/5 max-w-7xl mx-auto' />
        <div className='absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right, #80808012_1px, transparent_1px), linear-gradient(to_bottom, #80808012_1px, transparent_1px)] bg-size-[40px_40px]' />
      </div>

      <div className='max-w-7xl mx-auto px-6 relative z-10'>

        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10'>
          <div className='max-w-3xl'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className='h-px w-12 bg-indigo-500' />
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-[0.4em]">Core_Engine_v4.0</span>
            </motion.div>
            <h2 className='text-6xl lg:text-8xl font-medium tracking-tighter leading-[0.85]'>Architected for <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-100 via-zinc-400 to-zinc-800">
                Pure Performance.
              </span>
            </h2>
          </div>
          <div className='lg:max-w-xs text-zinc-400 font-light leading-relaxed border-l border-zinc-800 pl-8'>
            <Terminal className="w-5 h-5 mb-4 text-indigo-500" />
            Pickyo transforms complex global logistics into a streamlined API-first infrastructure. High-fidelity dispatching for the modern era.
          </div>
        </div>

        {/* Asymmetric Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Hero Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 group relative bg-zinc-900/40 border border-white/10 rounded-4xl p-8 lg:p-12 overflow-hidden backdrop-blur-sm"
          >
            {/* Animated "Scan" Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent -translate-y-full group-hover:animate-scan" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="text-right font-mono text-[10px] text-zinc-500 space-y-1">
                  <p>SYS_STATUS: OPTIMAL</p>
                  <p>REGION: GLOBAL_NODE</p>
                </div>
              </div>

              <h3 className="text-4xl font-light mb-6">Proprietary Dispatch <br /> <span className="text-indigo-400">Neural Network</span></h3>
              <p className="text-zinc-400 text-lg max-w-md font-light leading-relaxed mb-12">
                Our algorithm calculates millions of permutations per second—balancing fuel efficiency, time-to-arrival, and driver fatigue.
              </p>

              <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-white/5">
                {[
                  { label: "Latency", val: "0.42ms", color: "text-indigo-400" },
                  { label: "Stability", val: "99.9%", color: "text-emerald-400" },
                  { label: "Optimization", val: "24/7", color: "text-zinc-100" },
                  { label: "Nodes", val: "1,204", color: "text-zinc-100" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase mb-1">{stat.label}</p>
                    <p className={`text-xl font-medium ${stat.color}`}>{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Security Module */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 bg-linear-to-b from-indigo-600 to-indigo-900 rounded-4xl p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10">
              <ShieldCheck className="w-12 h-12 mb-6" />
              <h3 className="text-3xl font-medium mb-4 tracking-tight">Enterprise <br />Assurance.</h3>
              <p className="text-indigo-100/70 font-light leading-relaxed">
                Automated cargo protection baked into every transit. Full transparency, zero paperwork.
              </p>
            </div>
            <button className="relative z-10 mt-8 w-full py-4 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              Read Policy
            </button>
          </motion.div>

          {/* 3. TRACKING MODULE */}
          <motion.div
            className="lg:col-span-5 bg-zinc-900/40 border border-white/10 rounded-4xl p-8 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Live_Telemetry</span>
              </div>
              <Activity className="w-4 h-4 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-light mb-2 text-zinc-100">Hyper-Local Tracking</h3>
            <p className="text-zinc-500 text-sm font-light leading-relaxed mb-8">
              5-meter precision utilizing multi-constellation GNSS satellites for 100% uptime in urban canyons.
            </p>
            {/* Visual Signal Wave */}
            <div className="flex items-end gap-1 h-12">
              {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6, 0.3].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                  style={{ height: `${h * 100}%` }}
                  className="flex-1 bg-indigo-500/30 rounded-t-sm"
                />
              ))}
            </div>
          </motion.div>

          {/* 4. CTA MODULE */}
          <motion.div
            whileHover={{ scale: 0.99 }}
            onClick={() => router.push("/login")}
            className="lg:col-span-7 bg-zinc-100 rounded-4xl p-8 text-zinc-900 flex flex-col md:flex-row items-center justify-between group cursor-pointer"
          >
            <div className="max-w-sm mb-8 md:mb-0 text-center md:text-left">
              <h3 className="text-4xl font-medium tracking-tight mb-2">Initialize Setup.</h3>
              <p className="text-zinc-600 font-light">Experience the infrastructure of tomorrow, today.</p>
            </div>
            <div className="flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full text-white group-hover:scale-110 transition-transform duration-500">
              <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(500%); opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>

    </section>
  )
}
