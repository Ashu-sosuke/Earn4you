import React from 'react';
import PricingCard from '../components/PricingCard';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        // Navigate to payment with plan details
        navigate('/payment', { state: { plan } });
    };

    const plans = [
        {
            name: 'Basic',
            price: '100',
            features: [
                '5% Weekly Returns',
                'Standard Support',
                'Direct Wallet Cashout',
                'Basic Analytics',
                '30 Days contract'
            ],
            recommended: false
        },
        {
            name: 'Pro',
            price: '500',
            features: [
                '8% Weekly Returns',
                'Priority Support 24/7',
                'Instant Cashout',
                'Advanced Analytics',
                'Personal Advisor',
                '60 Days contract'
            ],
            recommended: true
        },
        {
            name: 'Premium',
            price: '1000',
            features: [
                '12% Weekly Returns',
                'VIP Dedicated Support',
                'Zero Fee Cashout',
                'Full Portfolio Access',
                'Exclusive Events',
                '90 Days contract'
            ],
            recommended: false
        }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Choose Your Investment Plan</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Select the best plan that suits your investment goals. All plans include secure USDT processing and transparency.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {plans.map((plan) => (
                    <PricingCard key={plan.name} plan={plan} onSelect={handleSelectPlan} />
                ))}
            </div>
        </div>
    );
};

export default Plans;
