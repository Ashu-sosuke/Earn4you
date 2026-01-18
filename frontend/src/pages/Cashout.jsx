import React from 'react';
import { AlertTriangle, Copy, ArrowRight, Wallet, CheckCircle } from 'lucide-react';

const Cashout = () => {
    const binanceWallet = "TRC20...USER_WALLET_ADDRESS"; // In real app, this would be user's input or setting

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
                <p className="text-slate-400">Follow the steps below to withdraw your earnings safely.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-blue-500 font-bold text-xl">1</span>
                    </div>
                    <h3 className="text-white font-bold mb-2">Login to Binance</h3>
                    <p className="text-sm text-slate-400">Open your Binance app or website and navigate to standard wallet.</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-purple-500 font-bold text-xl">2</span>
                    </div>
                    <h3 className="text-white font-bold mb-2">Select Deposit</h3>
                    <p className="text-sm text-slate-400">Choose USDT coin and select BEP-20 (BSC) network.</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-emerald-500 font-bold text-xl">3</span>
                    </div>
                    <h3 className="text-white font-bold mb-2">Copy Address</h3>
                    <p className="text-sm text-slate-400">Copy your deposit address and verify it before pasting.</p>
                </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 flex items-start gap-4">
                <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h3 className="text-red-400 font-bold mb-1">Important Warning</h3>
                    <p className="text-red-300/80 text-sm">
                        Direct withdrawals to Indian Bank Accounts (INR) are NOT supported. You must withdraw to a crypto wallet (Binance, Trust Wallet, MetaMask) using the BEP-20 network.
                    </p>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Request Withdrawal</h3>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Your Binance USDT (BEP-20) Address</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Paste your address here"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USDT)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Available: 0.00</span>
                        </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2">
                        Withdraw Funds
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Cashout;
