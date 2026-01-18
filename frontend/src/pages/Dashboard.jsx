import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { ShieldCheck, Wallet, Activity, TrendingUp, Copy, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/user/dashboard');
                if (response.data.success) {
                    setUser(response.data.data.user);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const copyReferralLink = () => {
        const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="text-white text-center mt-20">Loading dashboard...</div>;
    }

    if (!user) {
        return <div className="text-white text-center mt-20">Failed to load user data.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                    <p className="text-slate-400">Welcome back, {user.username}.</p>
                </div>
                {/* Referral Link Card (Small) */}
                <div className="hidden md:block bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                     <p className="text-xs text-slate-400 mb-1">Your Referral Code</p>
                     <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-mono font-bold">{user.referralCode}</span>
                        <button onClick={copyReferralLink} className="text-slate-400 hover:text-white transition-colors">
                            {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                     </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Active Plan"
                    value={user.plan ? user.plan.name : "No Plan"}
                    status={user.isActive ? "Active" : "Inactive"}
                    icon={ShieldCheck}
                    color="purple"
                    subValue={user.plan ? `Price: ${user.plan.price} ${user.plan.currency}` : "Upgrade now"}
                />

                <StatCard
                    title="Available Balance"
                    value={`${user.availableBalance} USDT`}
                    icon={Wallet}
                    color="emerald"
                    subValue={`Total Earned: ${user.totalEarnings} USDT`}
                />

                <StatCard
                    title="Payment Status"
                    value={user.paymentStatus === 'completed' ? "Verified" : "Pending"}
                    status={user.paymentStatus}
                    icon={Activity}
                    color="blue"
                    subValue={user.isActive ? "Account is active" : "Needs activation"}
                />
            </div>

            {/* Referral Section (Mobile/Prominent) */}
            <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Refer & Earn</h3>
                <p className="text-slate-300 mb-4 max-w-2xl relative z-10">
                    Share your unique referral link with friends and earn commissions when they subscribe to a plan.
                </p>
                
                <div className="flex items-center gap-4 relative z-10 max-w-md">
                    <div className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 font-mono text-sm truncate">
                        {`${window.location.origin}/register?ref=${user.referralCode}`}
                    </div>
                    <button 
                        onClick={copyReferralLink}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
                    >
                        {copied ? 'Copied!' : 'Copy Link'}
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Referrals List Placeholder (Would need another API call) */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Your Referral Network</h3>
                 <p className="text-slate-400">Refer users to see them appear here and earn rewards.</p>
                 {/* Logic to list referred users can be added here later */}
            </div>
        </div>
    );
};

export default Dashboard;
