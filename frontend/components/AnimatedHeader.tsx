'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  subtitle: string;
  center?: boolean;
}

export default function AnimatedHeader({ title, subtitle, center = false }: Props) {
  return (
    <div className={cn('max-w-2xl mb-10', center && 'mx-auto text-center')}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
