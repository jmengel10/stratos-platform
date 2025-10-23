/**
 * Dashboard Page
 * 
 * Main dashboard with usage stats, recent conversations, and quick actions
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  TrendingUp,
  Database,
  FileText,
  Zap,
  Settings,
  Users,
  BarChart3,
  ArrowUpRight,
  Clock,
  Download,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatRelativeTime } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>({ name: 'User', plan: 'Pro' })
  const [isLoading, setIsLoading] = useState(true)
  
  // Mock data - replace with real API calls
  const stats = {
    queriesThisMonth: 127,
    monthlyLimit: 500,
    totalConversations: 45,
    savedOutputs: 12,
    storageUsedMB: 245,
    storageQuotaGB: 50,
  }
  
  const recentConversations = [
    { id: '1', title: 'GTM Strategy for SaaS Product', agent: 'GTM Strategist', time: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', title: 'Cost Optimization Analysis', agent: 'Ops Analyst', time: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: '3', title: 'Series A Pitch Deck', agent: 'Fundraising Advisor', time: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: '4', title: 'Product Roadmap Q1-Q2', agent: 'Product Strategist', time: new Date(Date.now() - 48 * 60 * 60 * 1000) },
  ]
  
  const quickActions = [
    { 
      id: 'new-chat', 
      title: 'New Strategy Chat', 
      description: 'Start a conversation with an AI agent',
      icon: MessageSquare,
      color: 'from-blue-600 to-indigo-600',
      action: () => router.push('/console')
    },
    { 
      id: 'upload-data', 
      title: 'Analyze Data', 
      description: 'Upload and analyze your business data',
      icon: Database,
      color: 'from-green-600 to-emerald-600',
      action: () => router.push('/console?action=upload')
    },
    { 
      id: 'view-outputs', 
      title: 'Saved Outputs', 
      description: 'Browse your generated frameworks and decks',
      icon: FileText,
      color: 'from-purple-600 to-pink-600',
      action: () => router.push('/outputs')
    },
    { 
      id: 'team', 
      title: 'Manage Team', 
      description: 'Invite members and assign roles',
      icon: Users,
      color: 'from-orange-600 to-red-600',
      action: () => router.push('/settings/team')
    },
  ]
  
  const usagePercentage = (stats.queriesThisMonth / stats.monthlyLimit) * 100
  const storagePercentage = (stats.storageUsedMB / (stats.storageQuotaGB * 1024)) * 100

  useEffect(() => {
    // TODO: Fetch real data from API
    // const fetchData = async () => {
    //   const usage = await api.getTenantUsage()
    //   const conversations = await api.getConversations(10)
    //   setStats(usage)
    //   setRecentConversations(conversations)
    // }
    // fetchData()
    
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">
                Welcome back, {user?.name} • <span className="text-primary-600 font-medium">{user?.plan} Plan</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/console')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Console
              </Button>
              <Button onClick={() => router.push('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Queries Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                {usagePercentage > 80 && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    usagePercentage > 90 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {usagePercentage > 90 ? 'Critical' : 'Warning'}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Queries This Month</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.queriesThisMonth}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{stats.monthlyLimit - stats.queriesThisMonth} remaining</span>
                    <span>{stats.monthlyLimit} limit</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        usagePercentage > 90
                          ? 'bg-red-600'
                          : usagePercentage > 80
                          ? 'bg-orange-600'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Conversations Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Total Conversations</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalConversations}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
            </div>

            {/* Outputs Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Saved Outputs</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.savedOutputs}
                </p>
                <p className="text-xs text-slate-500">
                  Frameworks, decks, reports
                </p>
              </div>
            </div>

            {/* Storage Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Storage Used</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.storageUsedMB} MB
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{storagePercentage.toFixed(0)}% used</span>
                    <span>{stats.storageQuotaGB} GB limit</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map(action => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all text-left"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {action.description}
                    </p>
                    <div className="mt-3 flex items-center text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Get started</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Conversations */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Conversations
                </h2>
                <button
                  onClick={() => router.push('/console')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all →
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {recentConversations.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 mb-4">No conversations yet</p>
                    <Button onClick={() => router.push('/console')}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Your First Chat
                    </Button>
                  </div>
                ) : (
                  recentConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => router.push(`/console?conversation=${conv.id}`)}
                      className="w-full p-4 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 mb-1 truncate">
                            {conv.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {conv.agent}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(conv.time)}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-primary-600" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Plan & Upgrade */}
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">Current Plan</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{user?.plan || 'Pro'}</h3>
                <p className="text-sm opacity-90 mb-4">
                  {stats.monthlyLimit.toLocaleString()} queries/month
                </p>
                {usagePercentage > 80 ? (
                  <Button
                    variant="outline"
                    className="w-full bg-white text-primary-600 hover:bg-white/90 border-white"
                    onClick={() => router.push('/settings/billing')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                ) : (
                  <div className="text-sm opacity-75">
                    You&apos;re doing great! {(100 - usagePercentage).toFixed(0)}% quota remaining
                  </div>
                )}
              </div>

              {/* Recent Exports */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Recent Exports
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { name: 'GTM-Strategy.pptx', time: new Date(Date.now() - 3 * 60 * 60 * 1000), type: 'PowerPoint' },
                    { name: 'Cost-Analysis.csv', time: new Date(Date.now() - 24 * 60 * 60 * 1000), type: 'CSV' },
                    { name: 'Roadmap-Q1.json', time: new Date(Date.now() - 48 * 60 * 60 * 1000), type: 'JSON' },
                  ].map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                        <Download className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatRelativeTime(file.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              What would you like to do?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map(action => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all text-left"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {action.description}
                    </p>
                    <div className="flex items-center text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Get started</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Usage Alert (if applicable) */}
          {usagePercentage > 80 && (
            <div className={`p-6 rounded-xl border ${
              usagePercentage > 90
                ? 'bg-red-50 border-red-200'
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  usagePercentage > 90 ? 'bg-red-600' : 'bg-orange-600'
                }`}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    usagePercentage > 90 ? 'text-red-900' : 'text-orange-900'
                  }`}>
                    {usagePercentage > 90 ? 'Quota Almost Reached' : 'Approaching Usage Limit'}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    usagePercentage > 90 ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    You&apos;ve used {usagePercentage.toFixed(0)}% of your monthly quota. 
                    {usagePercentage > 90 
                      ? ' Upgrade now to avoid interruptions.' 
                      : ' Consider upgrading for unlimited access.'}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => router.push('/settings/billing')}
                    className={usagePercentage > 90 ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    View Upgrade Options →
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

