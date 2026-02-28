import Link from 'next/link';
import { Truck } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-slate-900 p-2 rounded-lg">
            <Truck className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Pickyo</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/customer" className="hover:text-slate-900 transition-colors">
            For Business
          </Link>
          <Link href="/driver" className="hover:text-slate-900 transition-colors">
            For Drivers
          </Link>
          <Link href="/admin" className="hover:text-slate-900 transition-colors">
            Company
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Log In
          </Link>
          <Link href="/booking">
            <Button variant="primary" className="py-2 px-4 text-sm">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
