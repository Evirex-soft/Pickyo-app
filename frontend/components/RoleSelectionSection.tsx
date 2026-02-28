'use client';

import { Package, Truck, LayoutDashboard } from 'lucide-react';
import RoleCard from './RoleCard';
import AnimatedHeader from './AnimatedHeader';

export default function RoleSelectionSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedHeader
          title="Who are you?"
          subtitle="Choose your gateway to access the platform."
        />

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <RoleCard
            href="/login?role=customer"
            title="Customer"
            description="I want to move goods securely."
            icon={<Package className="w-6 h-6" />}
            colorClass="bg-blue-50 text-blue-600"
            delay={0.1}
          />
          <RoleCard
            href="login?role=driver"
            title="Driver Partner"
            description="I want to earn by driving."
            icon={<Truck className="w-6 h-6" />}
            colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
            delay={0.2}
          />
          <RoleCard
            href="/login?role=admin"
            title="Administrator"
            description="I manage the fleet & ops."
            icon={<LayoutDashboard className="w-6 h-6" />}
            colorClass="bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
