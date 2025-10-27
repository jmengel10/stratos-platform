'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, CreditCard, Shield, Zap } from 'lucide-react';

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 99,
    interval: 'month',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 5 clients',
      'Unlimited projects',
      'Basic AI agents',
      'Email support',
      'Standard templates',
      'Basic analytics'
    ],
    popular: false,
    current: false
  },
  {
    name: 'Professional',
    price: 299,
    interval: 'month',
    description: 'Most popular for growing businesses',
    features: [
      'Up to 25 clients',
      'Unlimited projects',
      'All AI agents',
      'Priority support',
      'Advanced templates',
      'Custom branding',
      'API access',
      'Advanced analytics',
      'Team collaboration'
    ],
    popular: true,
    current: true
  },
  {
    name: 'Enterprise',
    price: 999,
    interval: 'month',
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited clients',
      'Unlimited projects',
      'All AI agents',
      '24/7 support',
      'Custom templates',
      'White-label solution',
      'Full API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee'
    ],
    popular: false,
    current: false
  }
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('Professional');
  const [isLoading, setIsLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Upgrading to:', planName);
      // In a real app, this would redirect to Stripe checkout
    } finally {
      setIsLoading(false);
    }
  };

  const handleDowngrade = async (planName: string) => {
    if (confirm('Are you sure you want to downgrade? This will take effect at the end of your current billing period.')) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Downgrading to:', planName);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      // Handle cancellation
      console.log('Subscription cancelled');
    }
  };

  const getPrice = (plan: typeof PRICING_PLANS[0]) => {
    if (billingInterval === 'year') {
      return Math.round(plan.price * 12 * 0.8); // 20% discount for annual
    }
    return plan.price;
  };

  const getIntervalText = () => {
    return billingInterval === 'year' ? 'year' : 'month';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy">Subscription Management</h1>
        <p className="text-gray-text mt-2">Choose the plan that best fits your needs</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-bg-gray rounded-lg p-1 flex">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingInterval === 'month'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-text hover:text-navy'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingInterval === 'year'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-text hover:text-navy'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs bg-primary text-white px-2 py-0.5 rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative border rounded-lg p-8 transition-all ${
              plan.popular
                ? 'border-primary ring-2 ring-primary bg-blue-50'
                : plan.current
                ? 'border-green-500 bg-green-50'
                : 'border-border hover:border-primary'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}

            {/* Current Plan Badge */}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Current Plan
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-navy mb-2">{plan.name}</h3>
              <p className="text-gray-text text-sm mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-navy">${getPrice(plan)}</span>
                <span className="text-gray-text">/{getIntervalText()}</span>
                {billingInterval === 'year' && (
                  <div className="text-sm text-green-600 font-medium mt-1">
                    Save ${plan.price * 12 - getPrice(plan)}/year
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-gray-text">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="text-center">
              {plan.current ? (
                <div className="text-green-600 font-medium text-sm">
                  ✓ You're on this plan
                </div>
              ) : plan.name === 'Starter' ? (
                <button
                  onClick={() => handleDowngrade(plan.name)}
                  disabled={isLoading}
                  className="w-full px-6 py-3 border border-border text-navy rounded-lg hover:border-primary disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Downgrade'}
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Upgrade to {plan.name}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-navy mb-2">Secure Payment</h3>
          <p className="text-sm text-gray-text">All payments are processed securely through Stripe</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-navy mb-2">Cancel Anytime</h3>
          <p className="text-sm text-gray-text">No long-term contracts. Cancel or change plans anytime</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6 text-center">
          <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-navy mb-2">Instant Access</h3>
          <p className="text-sm text-gray-text">Get immediate access to all features after upgrade</p>
        </div>
      </div>

      {/* Current Subscription Details */}
      <div className="bg-white border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-serif font-semibold text-navy mb-4">Current Subscription</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-navy mb-2">Plan Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-text">Current Plan:</span>
                <span className="text-navy font-medium">Professional</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-text">Billing Cycle:</span>
                <span className="text-navy font-medium">Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-text">Next Billing Date:</span>
                <span className="text-navy font-medium">January 15, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-text">Amount:</span>
                <span className="text-navy font-medium">$299.00</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-navy mb-2">Payment Method</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                V
              </div>
              <div>
                <p className="font-medium text-navy">Visa ending in 4242</p>
                <p className="text-sm text-gray-text">Expires 12/25</p>
              </div>
            </div>
            <button className="text-primary hover:underline text-sm">
              Update Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Subscription */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Cancel Subscription</h3>
        <p className="text-sm text-red-700 mb-4">
          If you cancel your subscription, you'll continue to have access to premium features until the end of your current billing period.
        </p>
        <button
          onClick={handleCancelSubscription}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
