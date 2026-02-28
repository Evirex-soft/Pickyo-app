'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  Truck,
  Package,
  LayoutDashboard,
  ChevronRight,
  Building2,
  User,
  CheckCircle2,
  Grip,
} from 'lucide-react';

// Wrap the main content in Suspense because we use useSearchParams
export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';

  const [activeRole, setActiveRole] = useState(initialRole);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [userType, setUserType] = useState<'individual' | 'business'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Theme Config
  const config: any = {
    customer: {
      color: 'blue',
      title: 'Customer Login',
      subtitle: 'Book vehicles & track shipments.',
      icon: <Package className="w-5 h-5" />,
      bgGradient: 'from-blue-600 to-indigo-700',
      accent: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      image: '/images/customer.avif',
    },
    driver: {
      color: 'emerald',
      title: 'Driver Partner',
      subtitle: 'Earn money on your schedule.',
      icon: <Truck className="w-5 h-5" />,
      bgGradient: 'from-emerald-600 to-teal-700',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      image: '/images/driver.avif',
    },
    admin: {
      color: 'purple',
      title: 'Admin Portal',
      subtitle: 'System control center.',
      icon: <LayoutDashboard className="w-5 h-5" />,
      bgGradient: 'from-purple-600 to-indigo-900',
      accent: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      image: '/images/admin.avif',
    },
  };

  const theme = config[activeRole] || config.customer;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate OTP Logic
    if (authMethod === 'phone' && !otpSent) {
      setTimeout(() => {
        setOtpSent(true);
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Simulate Final Login
    setTimeout(() => {
      setIsLoading(false);
      alert(`Logged in as ${activeRole} (${userType})`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* --- LEFT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12 relative z-10 bg-white overflow-y-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* HEADER */}
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-${theme.color}-50 flex items-center justify-center mb-6 ${theme.accent}`}
            >
              {theme.icon}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{theme.title}</h1>
            <p className="text-slate-500 mb-8">{theme.subtitle}</p>
          </motion.div>

          {/* 1. ROLE TABS */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
            {['customer', 'driver', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setActiveRole(role);
                  setOtpSent(false);
                }}
                className={`flex-1 relative py-2 text-sm font-semibold rounded-md capitalize transition-all z-10 ${
                  activeRole === role
                    ? 'text-slate-900 shadow-sm bg-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* 2. BUSINESS TOGGLE (Only for Customers) */}
          <AnimatePresence>
            {activeRole === 'customer' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="flex gap-4 p-1">
                  <button
                    onClick={() => setUserType('individual')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-xl transition-all ${
                      userType === 'individual'
                        ? `border-${theme.color}-600 bg-${theme.color}-50 text-${theme.color}-700`
                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="font-semibold text-sm">Personal</span>
                  </button>
                  <button
                    onClick={() => setUserType('business')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-xl transition-all ${
                      userType === 'business'
                        ? `border-${theme.color}-600 bg-${theme.color}-50 text-${theme.color}-700`
                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="font-semibold text-sm">Business</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. AUTH METHOD TABS (Phone vs Email) */}
          <div className="flex items-center gap-6 mb-4 border-b border-slate-100">
            <button
              onClick={() => {
                setAuthMethod('phone');
                setOtpSent(false);
              }}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 ${authMethod === 'phone' ? `border-${theme.color}-600 text-slate-900` : 'border-transparent text-slate-400'}`}
            >
              Mobile Number
            </button>
            <button
              onClick={() => {
                setAuthMethod('email');
                setOtpSent(false);
              }}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 ${authMethod === 'email' ? `border-${theme.color}-600 text-slate-900` : 'border-transparent text-slate-400'}`}
            >
              Email & Password
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* PHONE INPUT */}
            {authMethod === 'phone' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {!otpSent ? (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-slate-900"
                        required
                      />
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Enter OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className={`text-xs font-bold ${theme.accent}`}
                      >
                        Change Number
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          className="w-full py-3 text-center bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 text-lg font-bold"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* EMAIL INPUT */}
            {authMethod === 'email' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-slate-200 transition-all flex items-center justify-center mt-4 ${theme.button} ${isLoading ? 'opacity-80' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {authMethod === 'phone' && !otpSent ? 'Get OTP' : 'Login'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">Or continue with</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Google
            </button>
          </div>

          <p className="mt-8 text-center text-slate-500 text-sm">
            New here?{' '}
            <Link href="/register" className={`font-bold hover:underline ${theme.accent}`}>
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: DYNAMIC IMAGE --- */}
      <div className="hidden lg:block w-1/2 relative bg-slate-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${theme.image})` }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} opacity-90 mix-blend-multiply`}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
          <motion.div
            key={activeRole + 'txt'}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-md"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-sm font-medium mb-4">
              <CheckCircle2 className="w-4 h-4" /> Secure Session
            </div>
            <h2 className="text-4xl font-bold mb-4">
              {activeRole === 'customer' && 'Moving made simple.'}
              {activeRole === 'driver' && 'Drive more, earn more.'}
              {activeRole === 'admin' && 'Complete Fleet Control.'}
            </h2>
            <p className="text-white/70 text-lg">
              {activeRole === 'customer'
                ? 'Join 50,000+ businesses and individuals moving goods securely.'
                : ''}
              {activeRole === 'driver'
                ? 'Get paid instantly and choose your own working hours.'
                : ''}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
