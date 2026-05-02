'use client';

import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '12+', label: 'Cities', meta: 'Active Regions' },
  { value: '50k+', label: 'Deliveries', meta: 'Successful Drops' },
  { value: '15k+', label: 'Drivers', meta: 'Vetted Fleet' },
  { value: '4.9', label: 'Rating', meta: 'User Satisfaction' },
];

export default function StatsSection() {
  return (
    <div className="bg-white border-y border-slate-100 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 divide-x-0 md:divide-x divide-slate-100">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="px-8 text-center md:text-left"
            >
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">
                {stat.meta}
              </p>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}