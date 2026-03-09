import { ArrowUpRight, Clock, IndianRupee, Map } from "lucide-react";

export default function DriverStats() {
    const stats = [
        { label: "Total Earnings", value: "₹2,450", icon: IndianRupee, trend: "+12%" },
        { label: "Hours Online", value: "6.5 hrs", icon: Clock, trend: null },
        { label: "Trips Completed", value: "12", icon: Map, trend: "+2" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                            <stat.icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                        </div>
                        {stat.trend && (
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                {stat.trend}
                            </span>
                        )}
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{stat.value}</h3>
                </div>
            ))}
        </div>
    );
}