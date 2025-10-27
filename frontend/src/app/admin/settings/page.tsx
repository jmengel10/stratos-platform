'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getPlatformSettings, 
  updatePlatformSettings, 
  isAdmin,
  type PlatformSettings 
} from '@/lib/admin-storage';
import { testAzureConnection } from '@/lib/azure-ai-service';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { 
  Save, 
  Settings,
  Globe,
  Mail,
  Upload,
  Shield,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [formData, setFormData] = useState({
    siteName: '',
    supportEmail: '',
    maxFileSize: 10,
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],
    maintenanceMode: false,
    stripeKeys: {
      publishableKey: '',
      secretKey: ''
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/home');
      return;
    }

    const currentSettings = getPlatformSettings();
    setSettings(currentSettings);
    setFormData({
      siteName: currentSettings.siteName,
      supportEmail: currentSettings.supportEmail,
      maxFileSize: currentSettings.maxFileSize,
      allowedFileTypes: [...currentSettings.allowedFileTypes],
      maintenanceMode: currentSettings.maintenanceMode,
      stripeKeys: {
        publishableKey: currentSettings.stripeKeys.publishableKey,
        secretKey: currentSettings.stripeKeys.secretKey
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!formData.supportEmail.trim()) newErrors.supportEmail = 'Support email is required';
    if (!formData.supportEmail.includes('@')) newErrors.supportEmail = 'Valid email is required';
    if (formData.maxFileSize <= 0) newErrors.maxFileSize = 'Max file size must be greater than 0';
    if (formData.allowedFileTypes.length === 0) newErrors.allowedFileTypes = 'At least one file type is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      updatePlatformSettings(formData);
      setSettings(getPlatformSettings());
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    
    const result = await testAzureConnection();
    setConnectionResult(result);
    setTestingConnection(false);
  };

  const addFileType = () => {
    setFormData({
      ...formData,
      allowedFileTypes: [...formData.allowedFileTypes, '']
    });
  };

  const removeFileType = (index: number) => {
    const newFileTypes = formData.allowedFileTypes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      allowedFileTypes: newFileTypes
    });
  };

  const updateFileType = (index: number, value: string) => {
    const newFileTypes = [...formData.allowedFileTypes];
    newFileTypes[index] = value;
    setFormData({
      ...formData,
      allowedFileTypes: newFileTypes
    });
  };

  if (!settings) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="w-12 h-12 text-gray-text mx-auto mb-4 animate-spin" />
            <p className="text-gray-text">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy">Platform Settings</h1>
        <p className="text-gray-text mt-2">Configure platform-wide settings and preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveMessage.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {saveMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-serif font-semibold text-navy">General Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Site Name *
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                  errors.siteName ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Stratos"
              />
              {errors.siteName && <p className="text-red-500 text-sm mt-1">{errors.siteName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Support Email *
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                  errors.supportEmail ? 'border-red-500' : 'border-border'
                }`}
                placeholder="support@stratos.com"
              />
              {errors.supportEmail && <p className="text-red-500 text-sm mt-1">{errors.supportEmail}</p>}
            </div>
          </div>
        </div>

        {/* File Upload Settings */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-serif font-semibold text-navy">File Upload Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Max File Size (MB) *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.maxFileSize}
                onChange={(e) => setFormData({ ...formData, maxFileSize: parseInt(e.target.value) || 10 })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                  errors.maxFileSize ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.maxFileSize && <p className="text-red-500 text-sm mt-1">{errors.maxFileSize}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Allowed File Types *
              </label>
              <div className="space-y-2">
                {formData.allowedFileTypes.map((fileType, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={fileType}
                      onChange={(e) => updateFileType(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder=".pdf"
                    />
                    {formData.allowedFileTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFileType(index)}
                        className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFileType}
                  className="text-sm text-primary hover:underline"
                >
                  + Add File Type
                </button>
              </div>
              {errors.allowedFileTypes && <p className="text-red-500 text-sm mt-1">{errors.allowedFileTypes}</p>}
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-serif font-semibold text-navy">System Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="maintenanceMode" className="text-sm font-medium text-navy">
                Maintenance Mode
              </label>
            </div>
            <p className="text-xs text-gray-text ml-7">
              When enabled, the site will show a maintenance message to all users except admins.
            </p>
          </div>
        </div>

        {/* Azure OpenAI Connection */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-serif font-semibold text-navy">Azure OpenAI Connection</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Endpoint</label>
              <input
                type="text"
                value="https://ai-core-openai-5605.openai.azure.com"
                disabled
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg-gray text-gray-text"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Model</label>
              <input
                type="text"
                value="gpt-4"
                disabled
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg-gray text-gray-text"
              />
            </div>
            
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {testingConnection ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
            
            {connectionResult && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                connectionResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {connectionResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <p className={`text-sm ${
                  connectionResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {connectionResult.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stripe Settings */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-serif font-semibold text-navy">Payment Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Stripe Publishable Key
              </label>
              <input
                type="text"
                value={formData.stripeKeys.publishableKey}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  stripeKeys: { ...formData.stripeKeys, publishableKey: e.target.value }
                })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                placeholder="pk_test_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Stripe Secret Key
              </label>
              <input
                type="password"
                value={formData.stripeKeys.secretKey}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  stripeKeys: { ...formData.stripeKeys, secretKey: e.target.value }
                })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                placeholder="sk_test_..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Security Notice</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Stripe keys are stored locally for demo purposes. In production, these should be stored securely as environment variables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
