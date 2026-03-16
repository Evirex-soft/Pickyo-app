export default function RecentTrips() {
    const trips = [
        { id: "TRIP-001", time: "10:30 AM", from: "Andheri East", to: "Bandra West", earn: "₹240", status: "Completed" },
        { id: "TRIP-002", time: "09:15 AM", from: "Juhu Beach", to: "Airport T2", earn: "₹350", status: "Completed" },
        { id: "TRIP-003", time: "08:00 AM", from: "Dadar", to: "Lower Parel", earn: "₹120", status: "Cancelled" },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-zinc-900 dark:text-white">Recent Trips</h3>
                <button className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">View All</button>
            </div>

            <div className="space-y-3">
                {trips.map((trip) => (
                    <div key={trip.id} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[150px]">{trip.to}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{trip.time} • {trip.id}</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${trip.status === 'Cancelled' ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-white'}`}>
                                {trip.earn}
                            </p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${trip.status === 'Completed' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                }`}>
                                {trip.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}