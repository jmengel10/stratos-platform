'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Save, 
  Upload, 
  Eye, 
  EyeOff,
  Trash2,
  AlertTriangle,
  Settings as SettingsIcon,
  Plug,
  Lock,
  Globe,
  Palette,
  Clock,
  Download
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Sarah Chen',
    email: 'sarah@stratos.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Strategic consultant helping companies scale and grow.',
    avatar: null
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newProjects: true,
    newMessages: true,
    weeklySummary: false,
    frequency: 'immediate'
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    itemsPerPage: 25
  });

  const [integrations, setIntegrations] = useState({
    slack: { enabled: false, webhook: '' },
    teams: { enabled: false, webhook: '' },
    googleDrive: { enabled: false, folderId: '' },
    dropbox: { enabled: false, token: '' }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile saved:', profileData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-navy mb-6">Profile Information</h2>
        
        {/* Avatar Upload */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-semibold">
            SC
          </div>
          <div>
            <button className="px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
            <p className="text-xs text-gray-text mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Location
            </label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-navy mb-6">Account Security</h2>
        
        {/* Change Password */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Change Password</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-navy transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-navy transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-navy transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Security Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy">Email Notifications</p>
                <p className="text-sm text-gray-text">Get notified about account changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy">Two-Factor Authentication</p>
                <p className="text-sm text-gray-text">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-navy mb-6">Notification Preferences</h2>
        
        {/* Email Notifications */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Email Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy">New Projects</p>
                <p className="text-sm text-gray-text">Get notified when new projects are created</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.newProjects}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, newProjects: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy">New Messages</p>
                <p className="text-sm text-gray-text">Get notified about new conversation messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.newMessages}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, newMessages: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy">Weekly Summary</p>
                <p className="text-sm text-gray-text">Receive a weekly summary of your activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.weeklySummary}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklySummary: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Push Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy">Browser Notifications</p>
              <p className="text-sm text-gray-text">Receive notifications in your browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationSettings.pushNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Notification Frequency */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Notification Frequency</h3>
          
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              How often would you like to receive notifications?
            </label>
            <select
              value={notificationSettings.frequency}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, frequency: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="immediate">Immediately</option>
              <option value="hourly">Hourly digest</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-navy mb-6">Billing & Subscription</h2>
        
        {/* Current Plan */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Current Plan</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-navy">Professional</p>
              <p className="text-gray-text">$299/month</p>
            </div>
            <button 
              onClick={() => router.push('/subscription')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Payment Method</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                V
              </div>
              <div>
                <p className="font-medium text-navy">Visa ending in 4242</p>
                <p className="text-sm text-gray-text">Expires 12/25</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors">
              Edit
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy">Billing History</h3>
            <button 
              onClick={() => router.push('/billing')}
              className="text-primary hover:underline text-sm"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-navy">December 2024</p>
                <p className="text-sm text-gray-text">Professional Plan</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-navy">$299.00</p>
                <p className="text-sm text-green-600">Paid</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-navy">November 2024</p>
                <p className="text-sm text-gray-text">Professional Plan</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-navy">$299.00</p>
                <p className="text-sm text-green-600">Paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-navy mb-6">Preferences</h2>
        
        {/* Appearance */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Appearance</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Localization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Timezone</label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Date Format</label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Time Format</label>
              <select
                value={preferences.timeFormat}
                onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Display Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-navy mb-2">Items per page</label>
            <select
              value={preferences.itemsPerPage}
              onChange={(e) => setPreferences({ ...preferences, itemsPerPage: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-navy mb-6">Integrations</h2>
        
        {/* Slack Integration */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy">Slack</h3>
                <p className="text-sm text-gray-text">Get notifications in your Slack workspace</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={integrations.slack.enabled}
                onChange={(e) => setIntegrations({ 
                  ...integrations, 
                  slack: { ...integrations.slack, enabled: e.target.checked } 
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          {integrations.slack.enabled && (
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Webhook URL</label>
              <input
                type="url"
                value={integrations.slack.webhook}
                onChange={(e) => setIntegrations({ 
                  ...integrations, 
                  slack: { ...integrations.slack, webhook: e.target.value } 
                })}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Microsoft Teams Integration */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                T
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy">Microsoft Teams</h3>
                <p className="text-sm text-gray-text">Send updates to your Teams channels</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={integrations.teams.enabled}
                onChange={(e) => setIntegrations({ 
                  ...integrations, 
                  teams: { ...integrations.teams, enabled: e.target.checked } 
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          {integrations.teams.enabled && (
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Webhook URL</label>
              <input
                type="url"
                value={integrations.teams.webhook}
                onChange={(e) => setIntegrations({ 
                  ...integrations, 
                  teams: { ...integrations.teams, webhook: e.target.value } 
                })}
                placeholder="https://outlook.office.com/webhook/..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Google Drive Integration */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-sm font-bold">
                G
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy">Google Drive</h3>
                <p className="text-sm text-gray-text">Sync files with your Google Drive</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={integrations.googleDrive.enabled}
                onChange={(e) => setIntegrations({ 
                  ...integrations, 
                  googleDrive: { ...integrations.googleDrive, enabled: e.target.checked } 
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          {integrations.googleDrive.enabled && (
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Folder ID</label>
              <input
                type="text"
                value={integrations.googleDrive.folderId}
                onChange={(e) => setIntegrations({ 
                  ...integrations, 
                  googleDrive: { ...integrations.googleDrive, folderId: e.target.value } 
                })}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Dropbox Integration */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">
                D
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy">Dropbox</h3>
                <p className="text-sm text-gray-text">Backup files to your Dropbox account</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={integrations.dropbox.enabled}
                onChange={(e) => setIntegrations({ 
                  ...integrations, 
                  dropbox: { ...integrations.dropbox, enabled: e.target.checked } 
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          {integrations.dropbox.enabled && (
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Access Token</label>
              <input
                type="password"
                value={integrations.dropbox.token}
                onChange={(e) => setIntegrations({ 
                  ...integrations, 
                  dropbox: { ...integrations.dropbox, token: e.target.value } 
                })}
                placeholder="Enter your Dropbox access token"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold text-navy mb-6">Security Settings</h2>
        
        {/* Two-Factor Authentication */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Two-Factor Authentication</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-navy">Authenticator App</p>
              <p className="text-sm text-gray-text">Use an authenticator app for additional security</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy">SMS Backup</p>
              <p className="text-sm text-gray-text">Receive backup codes via SMS</p>
            </div>
            <button className="px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors">
              Setup
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Active Sessions</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-navy">Current Session</p>
                  <p className="text-sm text-gray-text">Chrome on Windows • San Francisco, CA</p>
                  <p className="text-xs text-gray-500">Last active: Now</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Current</Badge>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-navy">Mobile App</p>
                  <p className="text-sm text-gray-text">iOS App • New York, NY</p>
                  <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                </div>
              </div>
              <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm">
                Revoke
              </button>
            </div>
          </div>
        </div>

        {/* Security Log */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Recent Security Activity</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy">Password changed</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy">Login from new device</p>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy">Failed login attempt</p>
                <p className="text-xs text-gray-500">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Data Export</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy">Download Your Data</p>
              <p className="text-sm text-gray-text">Export all your data in a portable format</p>
            </div>
            <button className="px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy">Settings</h1>
        <p className="text-gray-text mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="border-b border-border">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-blue-50'
                      : 'text-gray-text hover:text-navy hover:bg-bg-gray'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'account' && renderAccountTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'billing' && renderBillingTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'integrations' && renderIntegrationsTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
}