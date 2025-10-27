'use client';
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Play, FileText, Mail, Phone } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    questions: [
      {
        question: 'How do I create my first client?',
        answer: 'To create your first client, go to the Clients page and click the "New Client" button. Fill in the client information including name, industry, and contact details.'
      },
      {
        question: 'What is the difference between projects and conversations?',
        answer: 'Projects are strategic engagements with clients, while conversations are AI-powered chat sessions that help you work on specific aspects of those projects.'
      },
      {
        question: 'How do I invite team members?',
        answer: 'Team members can be invited through the Settings page under the "Team" tab. You can send invitations via email and assign different permission levels.'
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    icon: '💳',
    questions: [
      {
        question: 'How do I upgrade my plan?',
        answer: 'You can upgrade your plan by going to Settings > Billing or visiting the Subscription page. Choose your new plan and follow the checkout process.'
      },
      {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to premium features until the end of your billing period.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and process payments securely through Stripe.'
      }
    ]
  },
  {
    id: 'features',
    title: 'Features & Usage',
    icon: '⚡',
    questions: [
      {
        question: 'How do AI agents work?',
        answer: 'AI agents are specialized assistants that help with different aspects of strategic consulting. Each agent has unique capabilities and can be used in conversations.'
      },
      {
        question: 'Can I customize templates?',
        answer: 'Yes, you can create custom templates for projects and conversations. Go to the Templates section to create and manage your custom templates.'
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes, we use enterprise-grade security measures including encryption, secure data centers, and regular security audits to protect your data.'
      }
    ]
  }
];

const TOPICS = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using our platform',
    icon: '🚀',
    articles: 12
  },
  {
    title: 'Billing & Plans',
    description: 'Manage your subscription and billing',
    icon: '💳',
    articles: 8
  },
  {
    title: 'Features',
    description: 'Explore all platform features',
    icon: '⚡',
    articles: 15
  },
  {
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: '🔧',
    articles: 6
  }
];

const VIDEO_TUTORIALS = [
  {
    title: 'Platform Overview',
    duration: '5:30',
    thumbnail: '📹'
  },
  {
    title: 'Creating Your First Project',
    duration: '3:45',
    thumbnail: '📹'
  },
  {
    title: 'Using AI Agents',
    duration: '7:20',
    thumbnail: '📹'
  },
  {
    title: 'Team Collaboration',
    duration: '4:15',
    thumbnail: '📹'
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleFAQToggle = (questionId: string) => {
    setExpandedFAQ(expandedFAQ === questionId ? null : questionId);
  };

  const filteredFAQs = FAQ_CATEGORIES.filter(category => 
    selectedCategory === null || category.id === selectedCategory
  );

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy">Help Center</h1>
        <p className="text-gray-text mt-2">Find answers to common questions and learn how to use our platform</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Quick Topics */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Popular Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOPICS.map((topic, index) => (
            <div
              key={index}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-3xl mb-3">{topic.icon}</div>
              <h3 className="font-semibold text-navy mb-2">{topic.title}</h3>
              <p className="text-sm text-gray-text mb-3">{topic.description}</p>
              <p className="text-xs text-primary">{topic.articles} articles</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold text-navy">Frequently Asked Questions</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-bg-gray text-gray-text hover:text-navy'
              }`}
            >
              All Categories
            </button>
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-bg-gray text-gray-text hover:text-navy'
                }`}
              >
                {category.icon} {category.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((category) => (
            <div key={category.id} className="bg-white border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-bg-gray border-b border-border">
                <h3 className="font-semibold text-navy flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.title}
                </h3>
              </div>
              
              <div className="divide-y divide-border">
                {category.questions.map((faq, index) => {
                  const questionId = `${category.id}-${index}`;
                  const isExpanded = expandedFAQ === questionId;
                  
                  return (
                    <div key={index}>
                      <button
                        onClick={() => handleFAQToggle(questionId)}
                        className="w-full px-6 py-4 text-left hover:bg-bg-gray transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium text-navy">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-text" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-text" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-text">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-semibold text-navy mb-6">Video Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VIDEO_TUTORIALS.map((video, index) => (
            <div key={index} className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-bg-gray flex items-center justify-center text-4xl">
                {video.thumbnail}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-navy mb-1">{video.title}</h3>
                <p className="text-sm text-gray-text">{video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-primary rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-serif font-semibold mb-4">Still need help?</h2>
        <p className="mb-6 opacity-90">
          Our support team is here to help you succeed. Get in touch and we'll respond within 24 hours.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
          
          <a
            href="mailto:support@stratos.com"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Email Us
          </a>
        </div>
        
        <div className="mt-6 text-sm opacity-75">
          <p>Average response time: 2-4 hours</p>
          <p>Available Monday - Friday, 9 AM - 6 PM PST</p>
        </div>
      </div>
    </div>
  );
}
