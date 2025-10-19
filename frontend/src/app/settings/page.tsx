/**
 * Settings Page
 * 
 * Comprehensive settings with profile, organization, team, billing, and API sections
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Building, 
  Users, 
  CreditCard, 
  Key, 
  Bell,
  ArrowLeft,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('profile')
  
  // Mock user data - replace with real auth store
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    roles: ['admin'],
    tenantName: 'Acme Corp',
    plan: 'Pro',
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Keys', icon: Key },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-8">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeSection === 'profile' && <ProfileSection user={user} />}
            {activeSection === 'organization' && <OrganizationSection user={user} />}
            {activeSection === 'team' && <TeamSection user={user} />}
            {activeSection === 'billing' && <BillingSection user={user} />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'api' && <APIKeysSection />}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Profile Section
 */
function ProfileSection({ user }: any) {
  const [name, setName] = useState(user?.name || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Call API to update profile
      // await api.updateProfile({ name })
      
      setTimeout(() => {
        toast.success('Profile updated successfully')
        setIsSaving(false)
      }, 500)
    } catch (error) {
      toast.error('Failed to update profile')
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Profile Information</h2>
      
      <div className="space-y-6 max-w-md">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <Input value={user?.email} disabled />
          <p className="text-xs text-slate-500 mt-1">
            Contact support to change your email address
          </p>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Role
          </label>
          <Input 
            value={user?.roles[0]?.charAt(0).toUpperCase() + user?.roles[0]?.slice(1) || 'Member'} 
            disabled 
          />
          <p className="text-xs text-slate-500 mt-1">
            Your role is assigned by an administrator
          </p>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

/**
 * Organization Section
 */
function OrganizationSection({ user }: any) {
  const [orgName, setOrgName] = useState(user?.tenantName || '')

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Organization Settings</h2>
      
      <div className="space-y-6 max-w-md">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Organization Name
          </label>
          <Input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Your organization"
          />
        </div>

        {/* Current Plan */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Plan
          </label>
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-slate-900">{user?.plan || 'Free'}</p>
                <p className="text-sm text-slate-600 mt-1">
                  500 queries/month • 10 GB storage • All agents
                </p>
              </div>
              <Button size="sm">
                Upgrade
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              <span>Active subscription</span>
            </div>
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Industry
          </label>
          <select className="w-full h-10 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>SaaS</option>
            <option>Fintech</option>
            <option>Healthcare</option>
            <option>E-commerce</option>
            <option>Enterprise Software</option>
            <option>Other</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Helps AI agents provide industry-specific insights
          </p>
        </div>

        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

/**
 * Team Section
 */
function TeamSection({ user }: any) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address')
      return
    }
    
    // TODO: Call API to invite user
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
    setShowInviteModal(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Team Members</h2>
        <Button onClick={() => setShowInviteModal(!showInviteModal)}>
          <Users className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteModal && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
          <h3 className="font-medium text-slate-900">Invite Team Member</h3>
          <div className="grid gap-3">
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <select 
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-10 px-3 border border-slate-300 rounded-md"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={handleInvite} className="flex-1">
                Send Invitation
              </Button>
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Team List */}
      <div className="space-y-3">
        {/* Current user */}
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">
              {user?.roles[0]}
            </span>
            <span className="text-xs text-slate-500 font-medium">You</span>
          </div>
        </div>

        {/* Empty state */}
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600 mb-2 font-medium">No team members yet</p>
          <p className="text-sm text-slate-500 mb-4">
            Invite colleagues to collaborate on strategies
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowInviteModal(true)}
          >
            Invite Your First Team Member
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Billing Section
 */
function BillingSection({ user }: any) {
  const plans = [
    { 
      name: 'Free', 
      price: '$0', 
      queries: 50, 
      storage: '1 GB',
      features: ['1 agent', 'Basic support']
    },
    { 
      name: 'Starter', 
      price: '$29', 
      queries: 500, 
      storage: '10 GB',
      features: ['3 agents', 'Email support', 'Export features']
    },
    { 
      name: 'Pro', 
      price: '$99', 
      queries: 2000, 
      storage: '50 GB',
      features: ['All 5 agents', 'Priority support', 'Advanced analytics', 'PowerPoint export'],
      current: true
    },
    { 
      name: 'Enterprise', 
      price: 'Custom', 
      queries: 10000, 
      storage: '500 GB',
      features: ['Custom agents', 'Dedicated support', 'SSO', 'API access']
    },
  ]

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Billing & Subscription</h2>

        <div className="p-6 bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-200 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Current Plan</p>
              <p className="text-3xl font-bold text-slate-900">{user?.plan || 'Free'}</p>
            </div>
            <Button>Upgrade Plan</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Queries</p>
              <p className="font-semibold text-slate-900">2,000/month</p>
            </div>
            <div>
              <p className="text-slate-600">Storage</p>
              <p className="font-semibold text-slate-900">50 GB</p>
            </div>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Queries This Month</span>
              <span className="font-medium">127 / 2,000</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '6.35%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Storage Used</span>
              <span className="font-medium">2.4 GB / 50 GB</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: '4.8%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Available Plans</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 border-2 rounded-xl ${
                plan.current
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.current && (
                <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full mb-3">
                  Current Plan
                </span>
              )}
              <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {plan.price}
                {plan.price !== 'Custom' && <span className="text-base font-normal text-slate-600">/mo</span>}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>✓ {plan.queries.toLocaleString()} queries/month</li>
                <li>✓ {plan.storage} storage</li>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
              {!plan.current && (
                <Button className="w-full mt-4" variant={plan.name === 'Enterprise' ? 'outline' : 'default'}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h3>
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600 mb-3">No payment method on file</p>
          <Button variant="outline" size="sm">
            Add Payment Method
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Team Section
 */
function TeamSection({ user }: any) {
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  const handleInvite = () => {
    if (!inviteEmail || !/\S+@\S+\.\S+/.test(inviteEmail)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
    setShowInviteForm(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Team Members</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your team and assign roles
          </p>
        </div>
        <Button onClick={() => setShowInviteForm(!showInviteForm)}>
          <Users className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-slate-900 mb-4">Invite New Member</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select 
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full h-10 px-3 border border-slate-300 rounded-md"
              >
                <option value="member">Member - Can use agents</option>
                <option value="admin">Admin - Can manage team</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleInvite} className="flex-1">
                Send Invitation
              </Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Team List */}
      <div className="space-y-3">
        {/* Current user */}
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">
              {user?.roles[0]}
            </span>
            <span className="text-xs text-slate-500 font-medium">You</span>
          </div>
        </div>

        {/* Empty state */}
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600 mb-2">No team members yet</p>
          <p className="text-sm text-slate-500 mb-4">
            Invite colleagues to collaborate on strategies
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Billing Section (same as OrganizationSection but focused on billing)
 */
function BillingSection({ user }: any) {
  return <OrganizationSection user={user} />
}

/**
 * Notifications Section
 */
function NotificationsSection() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [usageAlerts, setUsageAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [teamActivity, setTeamActivity] = useState(true)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Notification Preferences</h2>

      <div className="space-y-4">
        <ToggleItem
          label="Email Notifications"
          description="Receive updates and alerts via email"
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />
        
        <ToggleItem
          label="Usage Alerts"
          description="Get notified when approaching quota limits"
          checked={usageAlerts}
          onChange={setUsageAlerts}
        />
        
        <ToggleItem
          label="Weekly Digest"
          description="Weekly summary of your activity"
          checked={weeklyDigest}
          onChange={setWeeklyDigest}
        />
        
        <ToggleItem
          label="Team Activity"
          description="Notifications when team members take actions"
          checked={teamActivity}
          onChange={setTeamActivity}
        />
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}

/**
 * API Keys Section
 */
function APIKeysSection() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">API Keys</h2>
          <p className="text-sm text-slate-500 mt-1">
            Integrate StratOS with your applications
          </p>
        </div>
        <Button>
          <Key className="w-4 h-4 mr-2" />
          Create New Key
        </Button>
      </div>

      {/* Empty state */}
      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
        <Key className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-slate-600 mb-2">No API keys created</p>
        <p className="text-sm text-slate-500 mb-4">
          Create a key to integrate with external tools
        </p>
        <Button variant="outline" size="sm">
          View API Documentation
        </Button>
      </div>

      {/* API Usage Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 font-medium mb-2">
          📚 API Documentation Available
        </p>
        <p className="text-sm text-blue-700">
          Learn how to integrate StratOS agents into your workflows with our comprehensive API docs.
        </p>
      </div>
    </div>
  )
}

/**
 * Toggle Item Component
 */
function ToggleItem({ 
  label, 
  description, 
  checked, 
  onChange 
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
      <div>
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
      </label>
    </div>
  )
}

