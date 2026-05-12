export const UserManagement = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">User & Driver Management</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Add New User</button>
        </div>
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4 font-semibold text-sm">User</th>
                        <th className="p-4 font-semibold text-sm">Role</th>
                        <th className="p-4 font-semibold text-sm">Status</th>
                        <th className="p-4 font-semibold text-sm">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {[1, 2, 3].map(i => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="p-4 text-sm font-medium">John Doe {i}</td>
                            <td className="p-4 text-sm text-gray-600">Driver</td>
                            <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">ACTIVE</span></td>
                            <td className="p-4 text-blue-600 text-sm cursor-pointer font-bold">Manage</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);