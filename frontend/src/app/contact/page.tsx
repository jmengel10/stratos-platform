'use client';
import { useState } from 'react';
import { Send, Upload, Mail, Phone, MessageSquare, AlertCircle, FileText } from 'lucide-react';

const ISSUE_TYPES = [
  'Technical Issue',
  'Billing Question',
  'Feature Request',
  'Account Problem',
  'Bug Report',
  'General Question',
  'Other'
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', description: 'General questions or minor issues' },
  { value: 'medium', label: 'Medium', description: 'Important issues affecting workflow' },
  { value: 'high', label: 'High', description: 'Critical issues blocking work' },
  { value: 'urgent', label: 'Urgent', description: 'System down or data loss' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    issueType: '',
    priority: 'medium',
    message: '',
    attachments: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.issueType) newErrors.issueType = 'Please select an issue type';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Contact form submitted:', formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, attachments: [...formData.attachments, ...files] });
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  if (isSubmitted) {
    return (
      <div className="p-8 max-w-2xl mx-auto w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-navy mb-4">Message Sent!</h1>
          <p className="text-gray-text mb-6">
            Thank you for contacting us. We've received your message and will get back to you within 24 hours.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-blue-800 mb-2">What happens next?</h2>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Our team will review your message</li>
              <li>• We'll respond within 24 hours (usually much faster)</li>
              <li>• For urgent issues, we'll prioritize your request</li>
            </ul>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Send Another Message
            </button>
            <a
              href="/help"
              className="px-6 py-3 border border-border text-navy rounded-lg hover:border-primary transition-colors"
            >
              Browse Help Center
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy">Contact Support</h1>
        <p className="text-gray-text mt-2">Get help from our support team. We're here to assist you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-lg p-8">
            <h2 className="text-xl font-serif font-semibold text-navy mb-6">Send us a message</h2>
            
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.name ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.email ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="john@company.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.subject ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Brief description of your issue"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              {/* Issue Type and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Issue Type *
                  </label>
                  <select
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.issueType ? 'border-red-500' : 'border-border'
                    }`}
                  >
                    <option value="">Select issue type</option>
                    {ISSUE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.issueType && <p className="text-red-500 text-sm mt-1">{errors.issueType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    {PRIORITY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.message ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, and what you were trying to accomplish."
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                <p className="text-xs text-gray-text mt-1">
                  {formData.message.length} characters (minimum 10)
                </p>
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-text mx-auto mb-2" />
                  <p className="text-sm text-gray-text mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-bg-gray text-navy rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-text mt-2">
                    Max file size: 10MB. Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, GIF
                  </p>
                </div>

                {/* Attached Files */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-navy mb-2">Attached Files:</p>
                    <div className="space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-bg-gray rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-text" />
                            <span className="text-sm text-navy">{file.name}</span>
                            <span className="text-xs text-gray-text">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Response Time */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">Response Time</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Urgent:</span>
                <span className="font-medium">1-2 hours</span>
              </div>
              <div className="flex justify-between">
                <span>High:</span>
                <span className="font-medium">2-4 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Medium:</span>
                <span className="font-medium">4-8 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Low:</span>
                <span className="font-medium">24 hours</span>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="font-semibold text-navy mb-4">Other Ways to Reach Us</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-navy">Email</p>
                  <p className="text-sm text-gray-text">support@stratos.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-navy">Phone</p>
                  <p className="text-sm text-gray-text">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="font-semibold text-navy mb-4">Business Hours</h3>
            <div className="space-y-2 text-sm text-gray-text">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Emergency Support</h3>
            </div>
            <p className="text-sm text-red-700 mb-2">
              For critical issues affecting your business operations:
            </p>
            <p className="text-sm font-medium text-red-800">
              emergency@stratos.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
