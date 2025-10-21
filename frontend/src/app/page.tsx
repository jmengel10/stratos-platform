'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Database, FileText, Users, BarChart3, Zap } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Logo/Brand */}
          <div className="flex justify-center">
            <div className="px-6 py-3 bg-blue-600 rounded-2xl">
              <h1 className="text-4xl font-bold text-white">StratOS</h1>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight">
            AI-Powered Strategy Consulting Platform
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transform your business with specialized AI agents for strategy, operations, 
            fundraising, product development, and data analysis.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => router.push('/dashboard')}
              className="text-lg px-8 py-6"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/settings')}
              className="text-lg px-8 py-6"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">5 Specialized AI Agents</h3>
            <p className="text-slate-600">
              Access expert AI agents for GTM strategy, operations, fundraising, product development, and data analysis.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Database className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Data Analysis</h3>
            <p className="text-slate-600">
              Upload your data and get instant insights, visualizations, and business intelligence.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Generate Presentations</h3>
            <p className="text-slate-600">
              Automatically create professional PowerPoint decks from your conversations and analyses.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Analytics</h3>
            <p className="text-slate-600">
              Track your usage, monitor performance, and optimize your strategic workflows.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Team Collaboration</h3>
            <p className="text-slate-600">
              Invite team members, manage roles, and collaborate on strategic initiatives.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Enterprise Ready</h3>
            <p className="text-slate-600">
              Built on Azure with enterprise-grade security, scalability, and multi-tenant architecture.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">Explore the platform:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push('/settings')}>
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-slate-500">
          <p>StratOS Platform v1.0.0 - AI-Powered Strategy Consulting</p>
          <p className="mt-2">Built with Azure OpenAI, Cosmos DB, and Next.js</p>
        </div>
      </footer>
    </div>
  );
}

