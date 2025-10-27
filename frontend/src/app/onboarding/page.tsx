'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Building, Users, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/storage';

const INDUSTRIES = [
  'Financial Services',
  'Healthcare Technology',
  'Medical Devices',
  'Enterprise Software',
  'Healthcare IT',
  'SaaS Platform',
  'Manufacturing',
  'Fintech',
  'Enterprise Solutions',
  'Consulting',
  'Other'
];

const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1000 employees',
  '1000+ employees'
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 99,
    interval: 'month',
    features: [
      'Up to 5 clients',
      'Unlimited projects',
      'Basic AI agents',
      'Email support',
      'Standard templates'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: 299,
    interval: 'month',
    features: [
      'Up to 25 clients',
      'Unlimited projects',
      'All AI agents',
      'Priority support',
      'Advanced templates',
      'Custom branding',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 999,
    interval: 'month',
    features: [
      'Unlimited clients',
      'Unlimited projects',
      'All AI agents',
      '24/7 support',
      'Custom templates',
      'White-label solution',
      'Full API access',
      'Dedicated account manager'
    ],
    popular: false
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Company Setup
    companyName: '',
    industry: '',
    companySize: '',
    
    // Step 2: First Client
    clientName: '',
    clientIndustry: '',
    clientEmail: '',
    
    // Step 3: Plan Selection
    selectedPlan: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
      if (!formData.companySize) newErrors.companySize = 'Company size is required';
    } else if (step === 2) {
      // Step 2 is optional, no validation needed
    } else if (step === 3) {
      if (!formData.selectedPlan) newErrors.selectedPlan = 'Please select a plan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSkipClient = () => {
    setCurrentStep(3);
  };

  const handleAddClient = async () => {
    if (!formData.clientName.trim()) {
      setErrors({ clientName: 'Client name is required' });
      return;
    }

    try {
      // Create first client
      createClient({
        name: formData.clientName,
        industry: formData.clientIndustry || 'Other',
        avatar: formData.clientName.charAt(0).toUpperCase(),
        avatarColor: '#33A7B5',
        projects: 0,
        conversations: 0,
        lastActive: new Date().toISOString()
      });
      
      setCurrentStep(3);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate plan selection
      console.log('Selected plan:', formData.selectedPlan);
      
      // Redirect to home with welcome message
      router.push('/home?welcome=true');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Building className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-semibold text-navy mb-2">Company Setup</h2>
        <p className="text-gray-text">Tell us about your company</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
            errors.companyName ? 'border-red-500' : 'border-border'
          }`}
          placeholder="Your Company Inc."
        />
        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Industry *
        </label>
        <select
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
            errors.industry ? 'border-red-500' : 'border-border'
          }`}
        >
          <option value="">Select your industry</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Company Size *
        </label>
        <select
          value={formData.companySize}
          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
            errors.companySize ? 'border-red-500' : 'border-border'
          }`}
        >
          <option value="">Select company size</option>
          {COMPANY_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Users className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-semibold text-navy mb-2">Add Your First Client</h2>
        <p className="text-gray-text">Get started by adding your first client (optional)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Client Name
        </label>
        <input
          type="text"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          placeholder="Client Company Name"
        />
        {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Client Industry
        </label>
        <select
          value={formData.clientIndustry}
          onChange={(e) => setFormData({ ...formData, clientIndustry: e.target.value })}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">Select client industry</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Client Email
        </label>
        <input
          type="email"
          value={formData.clientEmail}
          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          placeholder="client@company.com"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-semibold text-navy mb-2">Choose Your Plan</h2>
        <p className="text-gray-text">Select the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
              formData.selectedPlan === plan.name
                ? 'border-primary bg-blue-50'
                : 'border-border hover:border-primary'
            } ${plan.popular ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setFormData({ ...formData, selectedPlan: plan.name })}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-navy mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-navy">${plan.price}</span>
                <span className="text-gray-text">/{plan.interval}</span>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-text mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.selectedPlan === plan.name
                    ? 'bg-primary text-white'
                    : 'bg-bg-gray text-navy hover:bg-gray-200'
                }`}
              >
                {formData.selectedPlan === plan.name ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {errors.selectedPlan && <p className="text-red-500 text-sm text-center">{errors.selectedPlan}</p>}
      
      <div className="text-center">
        <button
          onClick={() => router.push('/home?welcome=true')}
          className="text-primary hover:underline text-sm"
        >
          I'll choose later
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-navy">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-text">{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-bg-gray rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-border rounded-lg p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-border text-navy rounded-lg hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep === 2 && (
                <button
                  onClick={handleSkipClient}
                  className="px-6 py-3 border border-border text-navy rounded-lg hover:border-primary transition-colors"
                >
                  Skip for now
                </button>
              )}
              
              {currentStep === 2 ? (
                <button
                  onClick={handleAddClient}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Client
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : currentStep === 3 ? (
                <button
                  onClick={handleComplete}
                  disabled={isLoading || !formData.selectedPlan}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
