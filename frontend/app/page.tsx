import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/HeroSection';
import RoleSelectionSection from '@/components/RoleSelectionSection';
import StatsSection from '@/components/StatsSection';
import FeatureSection from '@/components/FeatureSection';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <RoleSelectionSection />
      <StatsSection />
      <FeatureSection />
      <CTASection />
    </main>
  );
}
