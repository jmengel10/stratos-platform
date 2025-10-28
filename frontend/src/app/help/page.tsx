'use client';

import { useState } from 'react';
import { Search, Home, BookOpen, CreditCard, HelpCircle, Mail, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>('article-1');

  const sidebarItems = [
    { id: 'getting-started', label: 'Getting Started', icon: Home },
    { id: 'features', label: 'Features', icon: BookOpen },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const articles = [
    {
      id: 'article-1',
      title: 'Getting Started with Stratos',
      section: 'getting-started',
      content: `Welcome to Stratos! This guide will help you get started with our AI-powered strategic consulting platform.

**Step 1: Set Up Your Profile**
Complete your profile information to personalize your experience. Navigate to Settings > Profile to add your details.

**Step 2: Create Your First Project**
Click the "New Project" button from your dashboard. Fill in the project details including name, client, and objectives.

**Step 3: Start a Conversation**
Use the AI Console to start strategic conversations. Our AI agents will help you with market analysis, strategy development, and more.

**Step 4: Invite Your Team**
Collaborate with colleagues by inviting them to your workspace. Go to Settings > Team to send invitations.

**Next Steps:**
- Explore different AI agents and their capabilities
- Upload documents for analysis
- Generate strategic reports and presentations`,
    },
    {
      id: 'article-2',
      title: 'Creating Your First Project',
      section: 'getting-started',
      content: `Projects are the foundation of your work in Stratos. Here's how to create one:

**What You'll Need:**
- Project name
- Client selection (or create a new client)
- Project type and timeline
- Key objectives

**Creating a Project:**
1. Click "New Project" from the dashboard or Projects page
2. Fill in the required information
3. Set project goals and success metrics
4. Assign team members (optional)
5. Click "Create Project"

**Project Types:**
- Market Analysis
- Strategy Development
- Go-to-Market Planning
- Competitive Analysis
- Fundraising Support

**Best Practices:**
- Use descriptive project names
- Define clear objectives upfront
- Set realistic timelines
- Document key milestones`,
    },
    {
      id: 'article-3',
      title: 'Understanding AI Agents',
      section: 'features',
      content: `Stratos uses specialized AI agents to help with different aspects of strategic consulting.

**Available Agents:**

**Data Analyst Agent**
- Analyzes quantitative data
- Creates charts and visualizations
- Identifies trends and patterns

**GTM Strategist Agent**
- Develops go-to-market strategies
- Analyzes market positioning
- Creates launch plans

**Product Strategist Agent**
- Evaluates product roadmaps
- Analyzes competitive landscape
- Recommends feature prioritization

**Fundraising Advisor Agent**
- Prepares investor materials
- Creates financial models
- Analyzes market opportunities

**How to Use Agents:**
1. Start a new conversation
2. Select the appropriate agent for your task
3. Provide context and ask questions
4. Review and refine the agent's recommendations`,
    },
    {
      id: 'article-4',
      title: 'Managing Your Subscription',
      section: 'billing',
      content: `Learn how to manage your Stratos subscription and billing.

**Available Plans:**
- Starter: $49/month - Individual use
- Professional: $299/month - Teams up to 10
- Enterprise: Custom pricing - Unlimited users

**Upgrading Your Plan:**
1. Go to Settings > Billing
2. Click "Upgrade Plan"
3. Select your desired plan
4. Enter payment information
5. Confirm upgrade

**Payment Methods:**
We accept all major credit cards and ACH transfers for Enterprise plans.

**Billing Cycle:**
Subscriptions are billed monthly or annually (20% discount for annual).

**Cancellation Policy:**
Cancel anytime from Settings > Billing. Access continues until the end of your billing period.

**Refund Policy:**
30-day money-back guarantee for all new subscriptions.`,
    },
    {
      id: 'article-5',
      title: 'Inviting Team Members',
      section: 'features',
      content: `Collaborate with your team by inviting members to your workspace.

**Who Can Invite:**
Admins and Owners can invite team members.

**How to Invite:**
1. Navigate to Settings > Team
2. Click "Invite Team Member"
3. Enter email address
4. Select role (Admin, Member, or Viewer)
5. Add a personal message (optional)
6. Click "Send Invitation"

**User Roles:**

**Owner**
- Full access to all features
- Manage billing and subscription
- Remove team members

**Admin**
- Manage projects and clients
- Invite and remove members
- Access all content

**Member**
- Create and edit projects
- Use AI agents
- Collaborate on content

**Viewer**
- Read-only access
- View projects and reports
- Cannot edit content

**Managing Invitations:**
Track pending invitations from the Team page. Resend or cancel invitations as needed.`,
    },
  ];

  const filteredArticles = articles.filter(
    (article) =>
      article.section === activeSection &&
      (searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0">
        <h2 className="text-xl font-bold text-navy mb-6">Help Center</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-teal/10 text-teal'
                    : 'text-gray-text hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-text mb-6">
          <a href="/home" className="hover:text-navy">Home</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-navy font-medium">Help Center</span>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
        </div>

        {/* Articles */}
        <div className="max-w-4xl">
          <h1 className="text-4xl font-serif font-bold text-navy mb-8 capitalize">
            {activeSection.replace('-', ' ')}
          </h1>

          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedArticle(expandedArticle === article.id ? null : article.id)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-xl font-bold text-navy">{article.title}</h3>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedArticle === article.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {expandedArticle === article.id && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="prose prose-sm max-w-none py-4">
                      {article.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-gray-text whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Helpful Buttons */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-text mb-3">Was this helpful?</p>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm font-medium">Yes</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                          <span className="text-sm font-medium">No</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-text mb-4">No articles found matching your search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-teal hover:text-teal/80 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Contact Support CTA */}
          <div className="mt-12 bg-gradient-to-br from-teal to-navy rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
            <p className="text-white/90 mb-6">
              Our support team is here to assist you
            </p>
            <a
              href="/support"
              className="inline-block px-6 py-3 bg-white text-teal rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
