import React from 'react';
import DataTable from '../components/DataTable';

const AdminDashboard = () => {
    // Mock Data
    const userData = [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', plan: 'Basic', invested: '100 USDT', wallet: '0x123...abc', txHash: '0xabc...123', date: '2026-01-15', status: 'Approved' },
        { id: 2, name: 'Bob Jones', email: 'bob@example.com', plan: 'Premium', invested: '1000 USDT', wallet: '0x456...def', txHash: '0xdef...456', date: '2026-01-16', status: 'Pending' },
        { id: 3, name: 'Charlie Day', email: 'charlie@example.com', plan: 'Pro', invested: '500 USDT', wallet: '0x789...ghi', txHash: '0xghi...789', date: '2026-01-17', status: 'Approved' },
    ];

    const columns = [
        { header: 'User', accessor: 'name' }, // Or custom render with avatar
        { header: 'Email', accessor: 'email' },
        {
            header: 'Plan', accessor: 'plan', render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300`}>
                    {row.plan}
                </span>
            )
        },
        { header: 'Invested', accessor: 'invested', render: (row) => <span className="font-bold text-emerald-400">{row.invested}</span> },
        { header: 'Wallet', accessor: 'wallet', render: (row) => <span className="font-mono text-xs text-slate-500">{row.wallet}</span> },
        {
            header: 'Status', accessor: 'status', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${row.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { header: 'Date', accessor: 'date' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Generate Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Users', value: '1,234' },
                    { label: 'Total Invested', value: '$45,000' },
                    { label: 'Pending Approvals', value: '5', highlight: true },
                    { label: 'Today\'s Deposits', value: '$2,500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
                        <h3 className={`text-2xl font-bold ${stat.highlight ? 'text-yellow-400' : 'text-white'}`}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <DataTable
                title="Recent Investments"
                columns={columns}
                data={userData}
                searchPlaceholder="Search by name, email or hash..."
            />
        </div>
    );
};

export default AdminDashboard;
