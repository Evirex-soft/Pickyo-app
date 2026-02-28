'use client';

import { motion } from 'framer-motion';

export default function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-b from-white to-slate-400 mb-2">
        {number}
      </span>
      <span className="text-slate-400 font-medium uppercase tracking-wider text-sm">{label}</span>
    </motion.div>
  );
}
