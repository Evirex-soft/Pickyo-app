'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  Truck,
  User,
  Building2,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
  Bike,
  Car,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { registerUser } from '@/services/auth.service';
import { registerSchema } from '@/zod/registerSchema';
import { redirectToGoogle } from '@/services/oauth.service';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <RegisterContent />

      <Toaster position="top-right" richColors />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';

  const [activeRole, setActiveRole] = useState(initialRole);
  const [userType, setUserType] = useState<'individual' | 'business'>('individual');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('bike');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  //  THEME CONFIG
  const config: any = {
    customer: {
      color: 'blue',
      title: 'Create Account',
      subtitle: 'Join 50,000+ people moving goods securely.',
      bgGradient: 'from-blue-600 to-indigo-800',
      accent: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      image: '/images/customer.avif',
    },
    driver: {
      color: 'emerald',
      title: 'Partner Registration',
      subtitle: 'Start earning with your vehicle today.',
      bgGradient: 'from-emerald-600 to-teal-800',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      image: '/images/driver.avif',
    },
  };

  const theme = config[activeRole] || config.customer;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      ...form,
      role: activeRole,
    };

    if (activeRole === 'customer') {
      payload.userType = userType;
    }

    if (activeRole === 'driver') {
      payload.vehicleType = selectedVehicle;
    }

    // ZOD VALIDATION
    const validation = registerSchema.safeParse(payload);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error('Validation Error', {
        description: firstError.message,
      });
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(payload);

      toast.success('Registration successful!', {
        description: 'Redirecting to login...',
      });

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';

      toast.error('Registration Failed', {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* LEFT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-10 relative z-10 bg-white overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />{' '}
            Back
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{theme.title}</h1>
            <p className="text-slate-500 mb-6">{theme.subtitle}</p>
          </motion.div>

          {/* ROLE SWITCHER */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
            {['customer', 'driver'].map((role) => (
              <button
                key={role}
                type="button" // Important: prevent form submission
                onClick={() => setActiveRole(role)}
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

          {/* CUSTOMER TYPE TOGGLE */}
          <AnimatePresence>
            {activeRole === 'customer' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('individual')}
                    className={`flex items-center justify-center gap-2 py-3 border-2 rounded-xl transition-all ${
                      userType === 'individual'
                        ? `border-${theme.color}-600 bg-${theme.color}-50 text-${theme.color}-700`
                        : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <User className="w-4 h-4" /> <span className="text-sm font-bold">Personal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('business')}
                    className={`flex items-center justify-center gap-2 py-3 border-2 rounded-xl transition-all ${
                      userType === 'business'
                        ? `border-${theme.color}-600 bg-${theme.color}-50 text-${theme.color}-700`
                        : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />{' '}
                    <span className="text-sm font-bold">Business</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* NAME FIELD */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  {userType === 'business' && activeRole === 'customer'
                    ? 'Company Name'
                    : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={userType === 'business' ? 'Acme Logistics Ltd.' : 'John Doe'}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* CONTACT INFO GRID */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Mobile</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="98765..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="mail@site.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* DRIVER SPECIFIC: VEHICLE SELECTION */}
            <AnimatePresence>
              {activeRole === 'driver' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-bold text-slate-500 uppercase">Vehicle Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'bike', label: 'Bike', icon: Bike },
                      { id: 'pickups', label: 'Pickups', icon: Car },
                      { id: 'mini_truck', label: 'Mini Truck', icon: Truck },
                      { id: 'truck', label: 'Truck', icon: Truck },
                    ].map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v.id)}
                        className={`border rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all
                                                    ${
                                                      selectedVehicle === v.id
                                                        ? 'border-emerald-500 bg-emerald-50'
                                                        : 'border-slate-200 hover:border-emerald-300'
                                                    }
                                                `}
                      >
                        <v.icon
                          className={`w-5 h-5 mb-1 ${selectedVehicle === v.id ? 'text-emerald-600' : 'text-slate-600'}`}
                        />
                        <span
                          className={`text-[10px] font-bold ${selectedVehicle === v.id ? 'text-emerald-700' : 'text-slate-600'}`}
                        >
                          {v.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                />
                {/* Eye Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* TERMS CHECKBOX */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className={`mt-1 rounded border-slate-300 text-${theme.color}-600 focus:ring-${theme.color}-500`}
                required
              />
              <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed">
                I agree to the{' '}
                <Link href="#" className="underline text-slate-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="underline text-slate-800">
                  Privacy Policy
                </Link>
                .{activeRole === 'driver' && ' I confirm I have a valid driving license.'}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-slate-200 transition-all flex items-center justify-center mt-2 ${theme.button} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link
                href={`/login?role=${activeRole}`}
                className={`font-bold hover:underline ${theme.accent}`}
              >
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={redirectToGoogle}
              className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-4 h-4"
                alt="Google"
              />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: VISUALS */}
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
              className={`absolute inset-0 bg-linear-to-br ${theme.bgGradient} opacity-90 mix-blend-multiply`}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-center p-12 text-white z-10">
          <motion.div
            key={activeRole + 'info'}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg"
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {activeRole === 'customer' && 'Get your goods moving in minutes.'}
              {activeRole === 'driver' && 'Be your own boss. Start driving.'}
              {/* {activeRole === 'admin' && "Scale your logistics operations."} */}
            </h2>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white/60" />
                <span className="text-lg">
                  Instant {activeRole === 'driver' ? 'Payouts' : 'Booking'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-white/60" />
                <span className="text-lg">
                  Secure & Verified {activeRole === 'driver' ? 'Trips' : 'Drivers'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <User className="w-5 h-5 text-white/60" />
                <span className="text-lg">24/7 Support Team</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
