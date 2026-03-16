'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  RefreshCcw,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { forgotPasswordSchema } from '@/zod/registerSchema';
import { forgotPassword } from '@/services/user.service';
import Spinner from '@/components/LoadingSpinner';

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}
    >
      <ForgotPasswordContent />
      <Toaster position="top-right" richColors />
    </Suspense>
  );
}

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'user';

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Theme Config
  const config: any = {
    customer: {
      color: 'blue',
      title: 'Forgot Password?',
      subtitle: "No worries, we'll send you reset instructions.",
      bgGradient: 'from-blue-600 to-indigo-800',
      accent: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      ring: 'focus:ring-blue-200',
      image: '/images/customer.avif',
    },
    driver: {
      color: 'emerald',
      title: 'Reset Password',
      subtitle: 'Recover access to your driver account.',
      bgGradient: 'from-emerald-600 to-teal-800',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      ring: 'focus:ring-emerald-200',
      image: '/images/driver.avif',
    },
    admin: {
      color: 'purple',
      title: 'Admin Recovery',
      subtitle: 'Secure account recovery protocol.',
      bgGradient: 'from-purple-600 to-indigo-900',
      accent: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      ring: 'focus:ring-purple-200',
      image: '/images/admin.avif',
    },
  };

  const theme = config[initialRole] || config.customer;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = forgotPasswordSchema.safeParse({ email });

    if (!validation.success) {
      toast.error('validation Error', {
        description: validation.error.issues[0].message,
      });
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Reset link sent!', {
        description: `Please check your inbox.`,
      });
    } catch (error: any) {
      toast.error('Error', {
        description: error.response?.data?.message || 'Something went wrong. Try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);

    try {
      await forgotPassword(email);

      toast.success('Reset link resent!', {
        description: 'Please check your inbox again.',
      });
    } catch (error: any) {
      toast.error('Error', {
        description: error.response?.data?.message || 'Could not resend reset email.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/*  LEFT SIDE: FORM  */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-10 relative z-10 bg-white overflow-y-auto">
        <Link
          href={`/login?role=${initialRole}`}
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 w-fit group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />{' '}
          Back to Login
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
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
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} transition-all font-medium text-slate-900`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-slate-200 transition-all flex items-center justify-center ${theme.button} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Reset Password <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              /*  SUCCESS MESSAGE */
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
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Check your email</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  We have sent a password reset link to <br />
                  <span className="font-bold text-slate-900">{email}</span>
                </p>

                <div className="space-y-4">
                  <a
                    href="mailto:"
                    className={`block w-full py-3 rounded-xl text-white font-bold shadow-lg shadow-slate-200 transition-all ${theme.button}`}
                  >
                    Open Email App
                  </a>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" /> Try another email
                  </button>

                  <p className="text-xs text-slate-400 mt-6">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={handleResend}
                      className={`font-bold hover:underline ${theme.accent}`}
                    >
                      click to resend
                    </button>
                    .
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE: VISUALS */}
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
              <ShieldCheck className="w-4 h-4" /> Account Security
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">We've got your back.</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Security is our top priority. We use industry-standard encryption to keep your account
              safe at all times.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
