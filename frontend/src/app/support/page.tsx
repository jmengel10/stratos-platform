'use client';

import { useState } from 'react';
import { Search, Rocket, CreditCard, Wrench, ChevronDown, ChevronUp, Send } from 'lucide-react';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    issueType: 'technical',
    message: '',
  });

  const faqs = [
    {
      question: 'How do I get started with Stratos?',
      answer: 'Start by creating your first project from the dashboard. Click the "New Project" button, fill in the details, and you\'re ready to begin working with our AI agents.',
    },
    {
      question: 'What AI models do you use?',
      answer: 'We use Azure OpenAI Service with GPT-4 and GPT-3.5-turbo models, optimized for strategic consulting and business analysis.',
    },
    {
      question: 'How is my data secured?',
      answer: 'All data is encrypted at rest and in transit. We use Azure\'s enterprise-grade security infrastructure and are SOC 2 Type II compliant.',
    },
    {
      question: 'Can I invite team members?',
      answer: 'Yes! Professional and Enterprise plans include team collaboration features. Go to Settings > Team to invite members.',
    },
    {
      question: 'What\'s your refund policy?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support to request a refund within 30 days of purchase.',
    },
    {
      question: 'How do I upgrade my plan?',
      answer: 'Visit Settings > Billing to view available plans and upgrade instantly. Changes take effect immediately.',
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Yes! Contact our sales team for custom pricing and features tailored to your organization\'s needs.',
    },
    {
      question: 'How can I export my data?',
      answer: 'You can export all your data from Settings > Data & Privacy. We provide exports in JSON and CSV formats.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Support ticket submitted! We\'ll respond within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      issueType: 'technical',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal to-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">How can we help?</h1>
          <p className="text-xl text-white/90 mb-8">
            Search our knowledge base or contact our support team
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Support Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-teal" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Getting Started</h3>
            <p className="text-gray-text mb-4">
              Learn the basics and get up and running quickly
            </p>
            <a href="/help" className="text-teal hover:text-teal/80 font-medium">
              View Documentation →
            </a>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-teal" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Billing & Plans</h3>
            <p className="text-gray-text mb-4">
              Manage your subscription and payment details
            </p>
            <a href="/settings" className="text-teal hover:text-teal/80 font-medium">
              Go to Billing →
            </a>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6 text-teal" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Technical Support</h3>
            <p className="text-gray-text mb-4">
              Get help with technical issues and bugs
            </p>
            <a href="#contact" className="text-teal hover:text-teal/80 font-medium">
              Contact Support →
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-navy mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-navy">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-text border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div id="contact" className="bg-white rounded-lg border border-gray-200 p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-navy mb-2">Contact Support</h2>
          <p className="text-gray-text mb-6">Expected response time: 24 hours</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Issue Type</label>
              <select
                value={formData.issueType}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Send className="w-5 h-5" />
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

