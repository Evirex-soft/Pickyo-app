import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export const textReveal: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: '0%',
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
  },
};
