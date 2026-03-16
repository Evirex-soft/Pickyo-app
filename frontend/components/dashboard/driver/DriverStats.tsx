import { ArrowUpRight, Clock, IndianRupee, Map } from "lucide-react";
import { useDriver } from "./DriverContext";

export default function DriverStats() {
    const { earnings } = useDriver();

    const stats = [
        { label: "Today's Earnings", value: `₹${earnings}`, icon: IndianRupee, trend: "+12%" },
        { label: "Online Hours", value: "6.5 hrs", icon: Clock, trend: null },
        { label: "Trips Done", value: "12", icon: Map, trend: "+2" },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {/* Earnings spans 2 columns */}
            <div className="col-span-2 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                        {(() => {
                            const EarningsIcon = stats[0].icon;
                            return <EarningsIcon className="w-5 h-5 text-green-600 dark:text-green-400" />;
                        })()}
                    </div>
                    <span className="flex items-center text-[10px] font-bold text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        {stats[0].trend}
                    </span>
                </div>
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mt-1">{stats[0].label}</p>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-0.5">{stats[0].value}</h3>
            </div>

            {/* Other stats split */}
            {stats.slice(1).map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="mb-2">
                        <stat.icon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">{stat.value}</h3>
                </div>
            ))}
        </div>
    );
}