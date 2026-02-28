'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from './animations';
import Link from 'next/link';
import Button from './ui/Button';

export default function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
        {/* Background Circles */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to move?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of businesses and individuals who trust Pickyo for their logistics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button
                variant="light"
                className="h-14 px-8 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-full text-lg"
              >
                Book Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                className="h-14 px-8 text-white border border-indigo-400 hover:bg-indigo-700 rounded-full text-lg"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
