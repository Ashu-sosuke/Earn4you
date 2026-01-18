import React, { useState, useEffect } from 'react';
import { Copy, AlertTriangle, QrCode, CheckCircle, Upload, Wallet, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ethers } from 'ethers';

const BSC_TESTNET_USDT_ADDRESS = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; 
const ERC20_ABI = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address owner) view returns (uint256)"
];

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPlan = location.state?.plan;
    
    // Testnet Receiving Wallet
    const companyWalletAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; 

    const [txHash, setTxHash] = useState('');
    const [userWalletAddress, setUserWalletAddress] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        if (!selectedPlan) {
            navigate('/plans');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.walletAddress) {
            setUserWalletAddress(user.walletAddress);
        }
    }, [selectedPlan, navigate]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(companyWalletAddress);
        alert("Wallet address copied!");
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install a Web3 Wallet (like Rainbow or MetaMask)!");
            return;
        }
        setIsConnecting(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setUserWalletAddress(address);
        } catch (err) {
            console.error(err);
            setError("Failed to connect wallet");
        } finally {
            setIsConnecting(false);
        }
    };

    const handleCryptoPayment = async () => {
        if (!window.ethereum) {
            alert("Please install a Web3 Wallet (like Rainbow or MetaMask)!");
            return;
        }
        
        setIsPaying(true);
        setError('');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            
            // Switch to BSC Testnet if not already
            const network = await provider.getNetwork();
            if (network.chainId !== 97n) { // 97 is BSC Testnet
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x61' }], // 97 in hex
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x61',
                                        chainName: 'Binance Smart Chain Testnet',
                                        nativeCurrency: {
                                            name: 'BNB',
                                            symbol: 'tBNB',
                                            decimals: 18,
                                        },
                                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                                        blockExplorerUrls: ['https://testnet.bscscan.com'],
                                    },
                                ],
                            });
                        } catch (addError) {
                            throw addError;
                        }
                    } else {
                        throw switchError;
                    }
                }
            }

            // 1. Check BNB Balance (Gas)
            const bnbBalance = await provider.getBalance(userAddress);
            if (bnbBalance < ethers.parseEther("0.002")) {
                const msg = `Insufficient BNB for gas! You have ${ethers.formatEther(bnbBalance).substring(0,6)} BNB. You need at least 0.002 BNB so you can pay for transaction fees.`;
                alert(msg);
                throw new Error(msg);
            }

            const usdtContract = new ethers.Contract(BSC_TESTNET_USDT_ADDRESS, ERC20_ABI, signer);
            
            let decimals = 18;
            try {
                 decimals = await usdtContract.decimals();
            } catch(e) {
                console.warn("Could not fetch decimals, defaulting to 18");
            }

            const amount = ethers.parseUnits(selectedPlan.price.toString(), decimals); 

            // 2. Check USDT Balance
            const usdtBalance = await usdtContract.balanceOf(userAddress);
            if (usdtBalance < amount) {
                const msg = `Insufficient USDT Balance! You have ${ethers.formatUnits(usdtBalance, decimals)} USDT but need ${selectedPlan.price} USDT.`;
                alert(msg);
                throw new Error(msg);
            }

            // 3. Perform Transfer
            const tx = await usdtContract.transfer(companyWalletAddress, amount);
            await tx.wait();

            setTxHash(tx.hash);
            setUserWalletAddress(userAddress);
            
            alert("Payment Successful! Submitting details...");
            
            // Auto submit
            await submitPayment(userAddress, tx.hash);

        } catch (err) {
            console.error(err);
             const msg = err.message && (err.message.includes("Insufficient") || err.message.includes("rejected")) 
                ? err.message 
                : "Transaction failed: " + (err.reason || "Unknown error");
            setError(msg);
        } finally {
            setIsPaying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitPayment(userWalletAddress, txHash);
    };

    const submitPayment = async (wallet, hash) => {
        if (!hash || !wallet) {
            setError('Please fill in all fields');
            return;
        }
        
        setSubmitted(true);
        setError('');

        try {
            const response = await api.post('/payments/initiate', {
                planId: selectedPlan._id,
                walletAddress: wallet,
                transactionHash: hash
            });

            if (response.data.success) {
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Payment submission failed');
            setSubmitted(false);
        }
    };

    if (!selectedPlan) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
                <p className="text-slate-400">Complete your investment via USDT (Testnet).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-500/30 p-6 rounded-2xl">
                        <p className="text-sm text-blue-300 mb-1">Selected Plan</p>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">{selectedPlan.name}</h3>
                            <span className="text-2xl font-bold text-cyan-400">{selectedPlan.price} USDT</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Payment Options</h3>

                        <div className="space-y-4">
                             <button
                                onClick={handleCryptoPayment}
                                disabled={isPaying || submitted}
                                className={`
                                    w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                                    ${isPaying 
                                        ? 'bg-amber-500/20 text-amber-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                                    }
                                `}
                            >
                                <Zap className="w-5 h-5" />
                                {isPaying ? 'Processing...' : 'Pay with Wallet (Testnet USDT)'}
                            </button>

                             {/* Dev Only: Simulation Button */}
                            <button
                                onClick={() => {
                                    const fakeHash = "0xMockHash" + Math.random().toString(16).slice(2);
                                    const address = userWalletAddress || "0xUserWalletAddress" + Math.random().toString(16).slice(2);
                                    submitPayment(address, fakeHash);
                                }}
                                disabled={submitted}
                                className="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700 dashed"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Simulate Success (Dev Mode)
                            </button>

                             <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-700"></div>
                                <span className="flex-shrink mx-4 text-slate-500 text-xs">OR MANUAL TRANSFER</span>
                                <div className="flex-grow border-t border-slate-700"></div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Deposit Address (Testnet USDT)</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-sm truncate">
                                        {companyWalletAddress}
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
                                    <span className="font-bold">Important:</span> Use this Simulate button if you do not have Testnet BNB.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl md:h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6">Confirm Transaction</h3>

                            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                                <QrCode className="w-32 h-32 text-slate-900" />
                            </div>

                            {error && (
                                <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {submitted ? (
                                <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-xl mb-4 text-sm text-center">
                                    Payment Submitted Successfully! Redirecting...
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                     <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Your Wallet Address</label>
                                        <div className="relative">
                                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-mono text-sm"
                                                placeholder="Your address"
                                                value={userWalletAddress}
                                                onChange={(e) => setUserWalletAddress(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={connectWallet}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-slate-800 px-2 py-1 rounded text-cyan-400 hover:text-cyan-300"
                                            >
                                                {isConnecting ? '...' : 'Connect'}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
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
                                            bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]
                                        `}
                                    >
                                        <Upload className="w-5 h-5" />
                                        Submit Payment
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
