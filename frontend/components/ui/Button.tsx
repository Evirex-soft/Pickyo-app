import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'light';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    'px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20',

    secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20',

    outline:
      'border-2 border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900 bg-transparent',

    light: 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg shadow-indigo-500/10',

    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
