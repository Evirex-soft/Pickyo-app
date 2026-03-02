'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  KeyRound,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { resetPasswordSchema } from '@/zod/registerSchema';
import { resetPassword } from '@/services/user.service';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <ResetPasswordContent />
      <Toaster position="top-right" richColors />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';
  const token = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Theme Config (Matching Login & Register Pages)
  const config: any = {
    customer: {
      color: 'blue',
      title: 'Set New Password',
      subtitle: 'Create a strong password to secure your account.',
      bgGradient: 'from-blue-600 to-indigo-800',
      accent: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      image: '/images/customer.avif',
    },
    driver: {
      color: 'emerald',
      title: 'Set New Password',
      subtitle: 'Create a strong password to secure your account.',
      bgGradient: 'from-emerald-600 to-teal-800',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      image: '/images/driver.avif',
    },
    admin: {
      color: 'purple',
      title: 'Admin Reset',
      subtitle: 'Update your administrative access credentials.',
      bgGradient: 'from-purple-600 to-indigo-900',
      accent: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      image: '/images/admin.avif',
    },
  };

  const theme = config[initialRole] || config.customer;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      token,
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    const validation = resetPasswordSchema.safeParse(payload);

    if (!validation.success) {
      toast.error('Validation Error', {
        description: validation.error.issues[0].message,
      });
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({ token, newPassword: form.password });

      setIsSuccess(true);

      toast.success('Password reset successful', {
        description: 'Your password has been updated. Redirecting to login...',
      });

      setTimeout(() => {
        router.push(`/login?role=${initialRole}`);
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Reset link may be invalid or expired.';

      toast.error('Reset Failed', {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* LEFT SIDE: FORM  */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-10 relative z-10 bg-white overflow-y-auto">
        {!isSuccess && (
          <Link
            href={`/login?role=${initialRole}`}
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 w-fit group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />{' '}
            Back to Login
          </Link>
        )}

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              /* RESET FORM */
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-${theme.color}-50 flex items-center justify-center mb-6 ${theme.accent}`}
                >
                  <KeyRound className="w-7 h-7" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-3">{theme.title}</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">{theme.subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NEW PASSWORD */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat new password"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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
                        Update Password <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              /*  SUCCESS MESSAGE  */
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Password Updated!</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Your password has been changed successfully. <br />
                  You will be redirected to the login page shortly.
                </p>

                <Link
                  href={`/login?role=${initialRole}`}
                  className={`block w-full py-3.5 rounded-xl text-white font-bold shadow-lg shadow-slate-200 transition-all ${theme.button}`}
                >
                  Go to Login Now
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE: VISUALS  */}
      <div className="hidden lg:block w-1/2 relative bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${theme.image})` }}
        />
        <div
          className={`absolute inset-0 bg-linear-to-br ${theme.bgGradient} opacity-90 mix-blend-multiply`}
        />

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" /> Strong Security
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Keep your account safe.</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Make sure to use a unique password that you don't use on other websites to maximize
              your account security.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
