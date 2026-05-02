'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, LayoutDashboard, ArrowUpRight, Zap, Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

// Technical Role Data
const ROLES = [
  {
    id: 'customer',
    title: 'Customer',
    desc: 'Deploy and track cargo shipments across the global network.',
    icon: Package,
    href: '/login?role=customer',
    accent: 'text-indigo-600',
    bg: 'bg-indigo-50/50',
    stat: '99.9% Delivery Rate',
    feature: 'Instant Quotes'
  },
  {
    id: 'driver',
    title: 'Driver Partner',
    desc: 'Access the logistics OS to manage routes and maximize earnings.',
    icon: Truck,
    href: '/login?role=driver',
    accent: 'text-emerald-600',
    bg: 'bg-emerald-50/50',
    stat: 'Weekly Payouts',
    feature: 'Flexi-Hours'
  },
  {
    id: 'admin',
    title: 'Administrator',
    desc: 'Complete operational oversight of fleet health and network flow.',
    icon: LayoutDashboard,
    href: '/login?role=admin',
    accent: 'text-slate-900',
    bg: 'bg-slate-100',
    stat: 'Full Ops Control',
    feature: 'Fleet Analytics'
  }
];

export default function RoleSelectionSection() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Visual Continuity: Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header Block */}
        <div className="mb-16 lg:mb-24 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4"
          >
            <Zap className="w-3 h-3 fill-current" /> Access Portal
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none"
          >
            Select Your <span className="text-indigo-600">Interface.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-slate-500 max-w-2xl"
          >
            Choose your gateway to interact with the Pickyo Logistics Network. High-performance tools for every link in the supply chain.
          </motion.p>
        </div>

        {/* Role Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {ROLES.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={role.href} className="group block h-full">
                <div className="relative h-full bg-white border border-slate-200 rounded-2xl p-8 transition-all duration-300 hover:border-slate-900 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col">

                  {/* Top: Icon and Feature Tag */}
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-14 h-14 rounded-xl ${role.bg} ${role.accent} flex items-center justify-center transition-colors group-hover:bg-slate-900 group-hover:text-white`}>
                      <role.icon className="w-7 h-7" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                      {role.feature}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      {role.title}
                      <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600" />
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                      {role.desc}
                    </p>
                  </div>

                  {/* Bottom: Technical Data Footer */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{role.stat}</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Enter Portal
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}