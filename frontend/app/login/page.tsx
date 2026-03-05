'use client';

import React, { useState, Suspense } from 'react';
import { useDispatch, UseDispatch } from 'react-redux';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Lock,
  Truck,
  Package,
  LayoutDashboard,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { redirectToGoogle } from '@/services/oauth.service';
import { loginUser } from '@/services/auth.service';
import { loginSchema } from '@/zod/registerSchema';
import { setCredentials } from '@/store/authSlice';


// Wrap the main content in Suspense because we use useSearchParams
export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <LoginContent />
      <Toaster position="top-right" richColors />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';

  const [activeRole, setActiveRole] = useState(initialRole);
  // const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  // const [userType, setUserType] = useState<'individual' | 'business'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: form.email,
      password: form.password,
      role: activeRole,
    };

    const validation = loginSchema.safeParse(payload);

    if (!validation.success) {
      const firstError = validation.error.issues[0];

      toast.error('Validation Error', {
        description: firstError.message,
      });

      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(payload.email, payload.password, payload.role);

      dispatch(setCredentials(response.user));

      toast.success(`Welcome back!`, {
        description: `Logged in successfully as ${activeRole}.`,
      });

      setTimeout(() => {
        if (activeRole === 'admin') router.push('/admin/dashboard');
        else if (activeRole === 'driver') router.push('/driver/dashboard');
        else router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Something went wrong';

      if (status === 429) {
        toast.error('Too Many Attempts', {
          description: message,
        });
      } else if (status === 400) {
        toast.error('Login Failed', {
          description: message,
        });
      } else {
        toast.error('Error', {
          description: message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* LEFT SIDE: FORM */}
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

          {/* ROLE TABS */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
            {['customer', 'driver', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setActiveRole(role);
                  setForm({ email: '', password: '' });
                }}
                className={`flex-1 relative py-2 text-sm font-semibold rounded-md capitalize transition-all z-10 ${activeRole === role
                  ? 'text-slate-900 shadow-sm bg-white'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL INPUT */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <Link
                  href={`/forgot-password?role=${activeRole}`}
                  className={`text-xs font-bold ${theme.accent} hover:underline`}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-slate-200 transition-all flex items-center justify-center ${theme.button} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Login <ChevronRight className="w-4 h-4 ml-2" />
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
            <button
              onClick={redirectToGoogle}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Sign in with Google
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

      {/*  RIGHT SIDE: DYNAMIC IMAGE  */}
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
