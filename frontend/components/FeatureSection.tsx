'use client';

import { Clock, ShieldCheck, Zap } from 'lucide-react';
import AnimatedHeader from './AnimatedHeader';
import { motion } from 'framer-motion';
import React from 'react';

export default function FeatureSection() {
  const features = [
    {
      icon: <Zap />,
      title: 'Lightning Fast',
      desc: 'AI matching connects you to a driver in under 15 seconds.',
    },
    {
      icon: <ShieldCheck />,
      title: 'Secure & Insured',
      desc: 'Every trip is tracked and goods are insured up to $5000.',
    },
    {
      icon: <Clock />,
      title: 'Real-time Tracking',
      desc: 'Watch your goods move on the map link-by-link.',
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedHeader
          title="Why Pickyo?"
          subtitle="Redefining logistics with technology first."
          center
        />

        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                {React.cloneElement(f.icon as any, { className: 'w-6 h-6' })}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h4>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
