import React from 'react';
import StatCard from '../components/StatCard';
import { ShieldCheck, Wallet, Activity, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-slate-400">Welcome back, check your investment status.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Active Plan"
                    value="Premium Plan"
                    status="Active"
                    icon={ShieldCheck}
                    color="purple"
                    subValue="Expires in 28 days"
                />

                <StatCard
                    title="Total Invested"
                    value="2,500 USDT"
                    icon={Wallet}
                    color="blue"
                    subValue="+500 USDT this month"
                />

                <StatCard
                    title="Payment Status"
                    value="Verified"
                    status="Active"
                    icon={Activity}
                    color="emerald"
                    subValue="Last payment: 2 days ago"
                />
            </div>

            {/* Recent Activity / Chart Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Earnings Growth</h3>
                        <select className="bg-slate-800 border-none text-slate-400 text-sm rounded-lg focus:ring-0 cursor-pointer p-2">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>All Time</option>
                        </select>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="h-64 flex items-end gap-4 px-4 pb-4 border-b border-slate-800/50">
                        {[40, 70, 45, 90, 60, 80, 95].map((height, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="bg-gradient-to-t from-cyan-500/20 to-cyan-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                                    style={{ height: `${height}%` }}
                                ></div>
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs text-white px-2 py-1 rounded border border-slate-700 transition-opacity">
                                    {height}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { type: 'Deposit', amount: '+500 USDT', date: 'Today, 10:23 AM', status: 'Completed' },
                            { type: 'Withdrawal', amount: '-200 USDT', date: 'Yesterday, 4:00 PM', status: 'Pending' },
                            { type: 'Deposit', amount: '+1000 USDT', date: 'Jan 15, 2026', status: 'Completed' }
                        ].map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                        <TrendingUp className={`w-4 h-4 ${tx.type === 'Withdrawal' ? 'rotate-180' : ''}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{tx.type}</p>
                                        <p className="text-xs text-slate-500">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</p>
                                    <p className="text-xs text-slate-500">{tx.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
