import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { ExternalLink, Check, X, Eye, Loader2 } from 'lucide-react';
import api from '../api/axios';

const AdminPayments = () => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/admin/payments?status=${activeTab}`);
                if (response.data.success) {
                    setPayments(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [activeTab]);

    const handleVerify = async (id) => {
        setActionLoading(id);
        try {
            const response = await api.post(`/admin/payments/verify/${id}`, { verificationNotes: 'Approved by Admin' });
            if (response.data.success) {
                // Remove from list or update status
                setPayments(prev => prev.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error("Verification failed", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this payment?')) return;
        setActionLoading(id);
        try {
            const response = await api.post(`/admin/payments/reject/${id}`, { verificationNotes: 'Rejected by Admin' });
            if (response.data.success) {
                setPayments(prev => prev.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error("Rejection failed", error);
        } finally {
            setActionLoading(null);
        }
    };

    const columns = [
        { header: 'User', accessor: 'userId.username' },
        {
            header: 'Amount',
            accessor: 'amount',
            render: (row) => <span className="font-bold text-emerald-400">{row.amount} USDT</span>
        },
        {
            header: 'Plan',
            accessor: 'planId.name',
            render: (row) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                    {row.planId?.name || 'N/A'}
                </span>
            )
        },
        {
            header: 'TX Hash',
            accessor: 'transactionHash',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{row.transactionHash?.substring(0, 10)}...</span>
                    <button className="text-slate-400 hover:text-white" onClick={() => navigator.clipboard.writeText(row.transactionHash)} title="Copy Full Hash">
                         <ExternalLink size={12} />
                    </button>
                </div>
            )
        },
        { header: 'Date', accessor: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Actions',
            accessor: '_id',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'pending' && (
                        <>
                            <button 
                                onClick={() => handleVerify(row._id)}
                                disabled={actionLoading === row._id}
                                className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors disabled:opacity-50" 
                                title="Approve"
                            >
                                {actionLoading === row._id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            </button>
                            <button 
                                onClick={() => handleReject(row._id)}
                                disabled={actionLoading === row._id}
                                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50" 
                                title="Reject"
                            >
                                <X size={16} />
                            </button>
                        </>
                    )}
                    {row.status !== 'pending' && (
                        <span className={`text-xs font-medium ${row.status === 'verified' ? 'text-emerald-500' : 'text-red-500'}`}>
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

            {loading ? (
                <div className="text-center text-slate-500 py-10">Loading payments...</div>
            ) : (
                <DataTable
                    title={`${activeTab} Payments`}
                    columns={columns}
                    data={payments}
                    searchPlaceholder="Search hash or user..."
                />
            )}
        </div>
    );
};

export default AdminPayments;
