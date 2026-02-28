'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RoleCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  delay: number;
}

export default function RoleCard({
  href,
  title,
  description,
  icon,
  colorClass,
  delay,
}: RoleCardProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay },
        },
      }}
    >
      <Link
        href={href}
        className="group relative flex flex-col h-full p-8 rounded-3xl bg-slate-50 border"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-[100px] opacity-50 transition-transform group-hover:scale-150 duration-700" />

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${colorClass}`}
        >
          {icon}
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 mb-8 grow">{description}</p>

        <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:translate-x-2 transition-transform duration-300">
          Enter Portal <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </Link>
    </motion.div>
  );
}
