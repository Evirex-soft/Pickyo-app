'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation2, Menu, X, ArrowRight, Package, Users, Globe } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-100 transition-all duration-300 ${scrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className={`relative flex items-center justify-between p-2 pl-3 sm:pl-6 ${scrolled ? 'rounded-2xl sm:rounded-[28px]' : 'rounded-xl sm:rounded-2xl'} transition-all duration-300 border ${scrolled
          ? 'bg-white/80 backdrop-blur-xl border-zinc-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
          : 'bg-transparent border-transparent'
          }`}>

          {/* 1. BRAND LOGO */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 select-none">
            <div className="relative">
              <div className="bg-zinc-950 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-transform hover:rotate-12 duration-300">
                <Navigation2 className="text-white w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tighter text-zinc-950 leading-none">PICKYO</span>
            </div>
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-100/50 p-1 rounded-xl border border-zinc-200/50">
            {[
              { name: 'Platform', href: '/platform', icon: Users },
              { name: 'Solutions', href: '/solutions', icon: Package },
              { name: 'Ecosystem', href: '/partners', icon: Globe },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-white transition-all duration-200"
              >
                <item.icon className="w-4 h-4 opacity-50" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* 3. AUTH & ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className={`inline-flex text-xs sm:text-sm font-bold px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg transition-all border ${scrolled
                ? 'border-zinc-300 bg-white/70 backdrop-blur-sm'
                : 'border-transparent'
                } text-zinc-600 hover:text-zinc-950`}
            >
              Log In
            </Link>

            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-zinc-950 text-white text-[11px] sm:text-sm font-bold px-3 py-2 sm:px-6 sm:py-3 rounded-md sm:rounded-xl flex items-center gap-1.5 sm:gap-2 shadow-xl shadow-zinc-200/50 hover:bg-indigo-600 transition-colors"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </motion.button>
            </Link>

            {/* Mobile Toggle Button */}
            <button
              className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors flex items-center justify-center select-none"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full p-3 sm:px-6 md:hidden pointer-events-auto"
          >
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
              {[
                { name: 'Platform', href: '/platform', icon: Users },
                { name: 'Solutions', href: '/solutions', icon: Package },
                { name: 'Ecosystem', href: '/partners', icon: Globe },
              ].map((item, i) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className={`flex items-center justify-between p-3.5 bg-zinc-50 hover:bg-zinc-100/80 active:bg-zinc-100 border border-zinc-100 rounded-xl font-semibold text-zinc-800 transition-all ${i === 2 ? 'border-t border-zinc-100 mt-1 pt-3.5' : ''
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-indigo-500 opacity-80" />
                    {item.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </Link>
              ))}


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}