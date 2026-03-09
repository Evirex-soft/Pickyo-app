export default function RecentTrips() {
    const trips = [
        { id: "TRIP-001", time: "10:30 AM", from: "Andheri East", to: "Bandra West", earn: "₹240", status: "Completed" },
        { id: "TRIP-002", time: "09:15 AM", from: "Juhu Beach", to: "Airport T2", earn: "₹350", status: "Completed" },
        { id: "TRIP-003", time: "08:00 AM", from: "Dadar", to: "Lower Parel", earn: "₹120", status: "Cancelled" },
    ];

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Recent Trips</h3>
                <button className="text-sm text-zinc-500 hover:text-black dark:hover:text-white font-medium">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Trip ID</th>
                            <th className="px-6 py-4 font-medium">Route</th>
                            <th className="px-6 py-4 font-medium">Earnings</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {trips.map((trip) => (
                            <tr key={trip.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 text-zinc-500">
                                    <div className="font-medium text-zinc-900 dark:text-white">{trip.id}</div>
                                    <div className="text-xs">{trip.time}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-zinc-900 dark:text-white">{trip.to}</div>
                                    <div className="text-xs text-zinc-500">From: {trip.from}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{trip.earn}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trip.status === 'Completed'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                                        }`}>
                                        {trip.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}