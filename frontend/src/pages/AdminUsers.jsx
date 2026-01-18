import React from 'react';
import DataTable from '../components/DataTable';
import { User, Shield, Ban, CheckCircle } from 'lucide-react';

const AdminUsers = () => {
    // Mock Data
    const usersData = [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', country: 'USA', joined: '2025-12-01', status: 'Active', role: 'User' },
        { id: 2, name: 'Bob Jones', email: 'bob@example.com', country: 'UK', joined: '2026-01-10', status: 'Banned', role: 'User' },
        { id: 3, name: 'Charlie Day', email: 'charlie@example.com', country: 'Canada', joined: '2026-01-15', status: 'Active', role: 'User' },
        { id: 4, name: 'David Lee', email: 'david@example.com', country: 'Australia', joined: '2026-01-16', status: 'Active', role: 'User' },
        { id: 5, name: 'Eva Green', email: 'eva@example.com', country: 'France', joined: '2026-01-17', status: 'Active', role: 'User' },
    ];

    const columns = [
        {
            header: 'User',
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                        <User size={16} />
                    </div>
                    <div>
                        <div className="font-medium text-white">{row.name}</div>
                    </div>
                </div>
            )
        },
        { header: 'Email', accessor: 'email' },
        { header: 'Country', accessor: 'country' },
        { header: 'Joined', accessor: 'joined' },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${row.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'id',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="View Details">
                        <Shield size={16} />
                    </button>
                    {row.status === 'Active' ? (
                        <button className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors" title="Ban User">
                            <Ban size={16} />
                        </button>
                    ) : (
                        <button className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors" title="Activate User">
                            <CheckCircle size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <div className="flex gap-3">
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700">
                        Export List
                    </button>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
                        Add New User
                    </button>
                </div>
            </div>

            <DataTable
                title="Registered Users"
                columns={columns}
                data={usersData}
                searchPlaceholder="Search users..."
            />
        </div>
    );
};

export default AdminUsers;
