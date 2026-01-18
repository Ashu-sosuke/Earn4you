import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { ExternalLink, Check, X, Eye } from 'lucide-react';

const AdminPayments = () => {
    const [activeTab, setActiveTab] = useState('Pending');

    // Mock Data
    const paymentsData = [
        { id: 1, user: 'Alice Smith', amount: '100 USDT', plan: 'Basic', hash: '0xabc...123', date: '2026-01-17 10:30', status: 'Pending', proof: 'link' },
        { id: 2, user: 'Bob Jones', amount: '1000 USDT', plan: 'Premium', hash: '0xdef...456', date: '2026-01-16 14:20', status: 'Approved', proof: 'link' },
        { id: 3, user: 'Charlie Day', amount: '500 USDT', plan: 'Pro', hash: '0xghi...789', date: '2026-01-15 09:15', status: 'Rejected', proof: 'link' },
        { id: 4, user: 'David Lee', amount: '100 USDT', plan: 'Basic', hash: '0xjkl...012', date: '2026-01-17 11:45', status: 'Pending', proof: 'link' },
    ];

    const filteredData = paymentsData.filter(item => item.status === activeTab);

    const columns = [
        { header: 'User', accessor: 'user' },
        {
            header: 'Amount',
            accessor: 'amount',
            render: (row) => <span className="font-bold text-emerald-400">{row.amount}</span>
        },
        {
            header: 'Plan',
            accessor: 'plan',
            render: (row) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                    {row.plan}
                </span>
            )
        },
        {
            header: 'TX Hash',
            accessor: 'hash',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{row.hash}</span>
                    <button className="text-slate-400 hover:text-white"><ExternalLink size={12} /></button>
                </div>
            )
        },
        { header: 'Date', accessor: 'date' },
        {
            header: 'Proof',
            accessor: 'proof',
            render: () => (
                <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                    <Eye size={12} /> View
                </button>
            )
        },
        {
            header: 'Actions',
            accessor: 'id',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'Pending' && (
                        <>
                            <button className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors" title="Approve">
                                <Check size={16} />
                            </button>
                            <button className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors" title="Reject">
                                <X size={16} />
                            </button>
                        </>
                    )}
                    {row.status !== 'Pending' && (
                        <span className={`text-xs font-medium ${row.status === 'Approved' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {row.status}
                        </span>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Payment Verification</h1>

            <div className="flex gap-4 border-b border-slate-800">
                {['Pending', 'Approved', 'Rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-300'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            <DataTable
                title={`${activeTab} Payments`}
                columns={columns}
                data={filteredData}
                searchPlaceholder="Search hash or user..."
            />
        </div>
    );
};

export default AdminPayments;
