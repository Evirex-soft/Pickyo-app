import StatItem from './StatItem';

export default function StatsSection() {
  return (
    <div className="bg-slate-900 py-16 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <StatItem number="12+" label="Cities" />
        <StatItem number="50k+" label="Deliveries" />
        <StatItem number="15k+" label="Drivers" />
        <StatItem number="4.9" label="Rating" />
      </div>
    </div>
  );
}
