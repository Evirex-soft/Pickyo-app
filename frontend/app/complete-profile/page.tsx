'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  User,
  Building2,
  Truck,
  Bike,
  Car,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { completeUserProfile } from '@/services/user.service';
import { completeProfileSchema } from '@/zod/registerSchema';

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <CompleteProfileContent />
      <Toaster position="top-right" richColors />
    </Suspense>
  );
}

function CompleteProfileContent() {
  const router = useRouter();

  // Default to customer, but allow user to choose since Google doesn't know
  const [activeRole, setActiveRole] = useState<'customer' | 'driver'>('customer');
  const [userType, setUserType] = useState<'individual' | 'business'>('individual');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('bike');
  const [isLoading, setIsLoading] = useState(false);

  const [phone, setPhone] = useState('');

  // --- THEME CONFIG (Reused for consistency) ---
  const config: any = {
    customer: {
      color: 'blue',
      title: 'Almost There!',
      subtitle: 'We just need a few details to finish setting up your profile.',
      bgGradient: 'from-blue-600 to-indigo-800',
      accent: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      image: '/images/customer.avif',
    },
    driver: {
      color: 'emerald',
      title: 'Partner Setup',
      subtitle: 'Complete your profile to start accepting delivery requests.',
      bgGradient: 'from-emerald-600 to-teal-800',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      image: '/images/driver.avif',
    },
  };

  const theme = config[activeRole];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      role: activeRole,
      phone: phone,
      ...(activeRole === 'customer' && { userType }),
      ...(activeRole === 'driver' && { vehicleType: selectedVehicle }),
    };

    const result = completeProfileSchema.safeParse(payload);

    if (!result.success) {
      const firstError = result.error.issues[0];
      toast.error('Validation Error', {
        description: firstError.message,
      });
      return;
    }

    setIsLoading(true);

    try {
      // API
      await completeUserProfile(payload);

      toast.success('Profile Completed!', {
        description: 'Redirecting to dashboard...',
      });

      setTimeout(() => {
        if (activeRole === 'driver') {
          router.push('/driver/dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile.';
      toast.error('Error', { description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* LEFT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-10 relative z-10 bg-white overflow-y-auto custom-scrollbar">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{theme.title}</h1>
            <p className="text-slate-500 mb-8">{theme.subtitle}</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. SELECT ROLE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                I am joining as a:
              </label>
              <div className="flex p-1 bg-slate-100 rounded-xl">
                {['customer', 'driver'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role as 'customer' | 'driver')}
                    className={`flex-1 relative py-3 text-sm font-bold rounded-lg capitalize transition-all duration-200 ${
                      activeRole === role
                        ? 'text-slate-900 shadow-sm bg-white ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. PHONE NUMBER (Common) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* 3. CONDITIONAL FIELDS */}
            <AnimatePresence mode="wait">
              {activeRole === 'customer' ? (
                <motion.div
                  key="customer-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setUserType('individual')}
                      className={`flex flex-col items-center justify-center gap-2 py-4 border-2 rounded-xl transition-all ${
                        userType === 'individual'
                          ? `border-${theme.color}-600 bg-${theme.color}-50 text-${theme.color}-700`
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-bold">Personal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('business')}
                      className={`flex flex-col items-center justify-center gap-2 py-4 border-2 rounded-xl transition-all ${
                        userType === 'business'
                          ? `border-${theme.color}-600 bg-${theme.color}-50 text-${theme.color}-700`
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span className="text-sm font-bold">Business</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="driver-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-2"
                >
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Vehicle
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'bike', label: 'Bike', icon: Bike },
                      { id: 'pickups', label: 'Pickup', icon: Car },
                      { id: 'mini_truck', label: 'Mini', icon: Truck },
                      { id: 'truck', label: 'Truck', icon: Truck },
                    ].map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v.id)}
                        className={`border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all h-24
                                                    ${
                                                      selectedVehicle === v.id
                                                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                                        : 'border-slate-200 hover:border-emerald-300 bg-white'
                                                    }
                                                `}
                      >
                        <v.icon
                          className={`w-6 h-6 mb-2 ${selectedVehicle === v.id ? 'text-emerald-600' : 'text-slate-400'}`}
                        />
                        <span
                          className={`text-[11px] font-bold ${selectedVehicle === v.id ? 'text-emerald-900' : 'text-slate-600'}`}
                        >
                          {v.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-${theme.color}-200/50 transition-all flex items-center justify-center transform active:scale-[0.98] ${theme.button} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Finish Setup <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-slate-400">
              By clicking Finish, you agree to our Terms of Service.
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: VISUALS (Identical Logic to RegisterPage) */}
      <div className="hidden lg:block w-1/2 relative bg-slate-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {/* Background Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-[20s]"
              style={{ backgroundImage: `url(${theme.image})` }}
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${theme.bgGradient} opacity-90 mix-blend-multiply`}
            />

            {/* Texture Overlay (Optional for detail) */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-center p-16 text-white z-10">
          <motion.div
            key={activeRole + 'info'}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Profile Verification
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight tracking-tight">
              {activeRole === 'customer' ? (
                <>
                  Secure logistics for <br />{' '}
                  <span className="text-blue-200">modern businesses.</span>
                </>
              ) : (
                <>
                  Drive more, <br /> <span className="text-emerald-200">earn smarter.</span>
                </>
              )}
            </h2>

            <div className="grid gap-6 mt-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-8 h-8 text-white/80 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Google Verified</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Your email is already verified via Google. Adding your details completes the
                    security check.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/70">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Sync across all devices</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative bottom element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-slate-900/50 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
