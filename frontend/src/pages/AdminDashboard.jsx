import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import api from '../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        pendingPayments: 0,
        verifiedPayments: 0,
        totalRevenue: 0
    });
    const [recentPayments, setRecentPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await api.get('/admin/stats');
                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }

                const paymentsRes = await api.get('/admin/payments?status=pending');
                if (paymentsRes.data.success) {
                    setRecentPayments(paymentsRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const columns = [
        { header: 'User', accessor: 'userId.username' },
        { header: 'Amount', accessor: 'amount', render: (row) => <span className="font-bold text-emerald-400">{row.amount} USDT</span> },
        { header: 'Plan', accessor: 'planId.name' },
        { header: 'Hash', accessor: 'transactionHash', render: (row) => <span className="font-mono text-xs text-slate-500">{row.transactionHash?.substring(0, 10)}...</span> },
        {
            header: 'Status', accessor: 'status', render: (row) => (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    {row.status}
                </span>
            )
        },
        { header: 'Date', accessor: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    ];

    if (loading) return <div>Loading...</div>;

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
                    { label: 'Total Users', value: stats.totalUsers },
                    { label: 'Total Revenue', value: `$${stats.totalRevenue}` },
                    { label: 'Pending Approvals', value: stats.pendingPayments, highlight: true },
                    { label: 'Active Users', value: stats.activeUsers }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
                        <h3 className={`text-2xl font-bold ${stat.highlight ? 'text-yellow-400' : 'text-white'}`}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <DataTable
                title="Pending Investments"
                columns={columns}
                data={recentPayments}
                searchPlaceholder="Search..."
            />
        </div>
    );
};

export default AdminDashboard;
