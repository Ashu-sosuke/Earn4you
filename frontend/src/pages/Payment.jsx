import React, { useState } from 'react';
import { Copy, AlertTriangle, QrCode, CheckCircle, Upload } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPlan = location.state?.plan;
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Mock address

    const [txHash, setTxHash] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(walletAddress);
        alert("Wallet address copied!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!txHash) return;
        setSubmitted(true);
        // Simulate submission
        setTimeout(() => {
            alert("Payment submitted for verification successfully!");
            navigate('/dashboard');
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
                <p className="text-slate-400">Complete your investment manually via USDT (BEP-20).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Details */}
                <div className="space-y-6">
                    {selectedPlan && (
                        <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-500/30 p-6 rounded-2xl">
                            <p className="text-sm text-blue-300 mb-1">Selected Plan</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">{selectedPlan.name}</h3>
                                <span className="text-2xl font-bold text-cyan-400">{selectedPlan.price} USDT</span>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Payment Instructions</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Network</label>
                                <div className="flex items-center gap-2 px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-medium">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    BNB Smart Chain (BEP-20)
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Deposit Address (USDT)</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-sm truncate">
                                        {walletAddress}
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-400">
                                    <span className="font-bold">Important:</span> Send only USDT on the BEP-20 network. Sending any other currency may result in permanent loss.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Form */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl md:h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6">Confirm Transaction</h3>

                            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                                {/* QR Code Placeholder */}
                                <QrCode className="w-32 h-32 text-slate-900" />
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Hash (TXID)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-mono text-sm"
                                        placeholder="0x..."
                                        value={txHash}
                                        onChange={(e) => setTxHash(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitted}
                                    className={`
                    w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                    ${submitted
                                            ? 'bg-emerald-500/20 text-emerald-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                        }
                  `}
                                >
                                    {submitted ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Submitted
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            Submit Payment
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
