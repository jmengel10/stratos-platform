'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-serif font-bold text-navy">Privacy Policy</h1>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-text">
          <Calendar className="w-4 h-4" />
          <span>Last updated: December 15, 2024</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-border rounded-lg p-8 prose prose-lg max-w-none">
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">1. Introduction</h2>
            <p className="text-gray-text leading-relaxed">
              At Stratos ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the 
              security of your personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our strategic consulting platform.
            </p>
            <p className="text-gray-text leading-relaxed mt-4">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, 
              please do not access the application.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">2. Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  2.1 Information You Provide Directly
                </h3>
                <p className="text-gray-text leading-relaxed mb-3">
                  We collect information you provide directly to us, such as when you create an account, use our 
                  services, or contact us for support:
                </p>
                <ul className="list-disc list-inside text-gray-text space-y-2 ml-4">
                  <li>Account information (name, email address, company name)</li>
                  <li>Profile information (phone number, location, bio)</li>
                  <li>Client and project data you input into our platform</li>
                  <li>Communication data (messages, support requests)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  2.2 Information We Collect Automatically
                </h3>
                <p className="text-gray-text leading-relaxed mb-3">
                  When you use our Service, we automatically collect certain information:
                </p>
                <ul className="list-disc list-inside text-gray-text space-y-2 ml-4">
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Log data (access times, error logs, performance data)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  2.3 Information from Third Parties
                </h3>
                <p className="text-gray-text leading-relaxed">
                  We may receive information about you from third-party services, such as:
                </p>
                <ul className="list-disc list-inside text-gray-text space-y-2 ml-4 mt-3">
                  <li>Social media platforms (if you choose to connect your accounts)</li>
                  <li>Payment processors (Stripe) for billing purposes</li>
                  <li>Analytics services (Google Analytics) for usage insights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-text leading-relaxed mb-4">
              We use the information we collect to provide, maintain, and improve our Service:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-navy mb-2">Service Provision</h4>
                  <ul className="list-disc list-inside text-sm text-gray-text space-y-1">
                    <li>Provide and maintain our platform</li>
                    <li>Process transactions and payments</li>
                    <li>Provide customer support</li>
                    <li>Send service-related communications</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy mb-2">Improvement & Analytics</h4>
                  <ul className="list-disc list-inside text-sm text-gray-text space-y-1">
                    <li>Analyze usage patterns</li>
                    <li>Improve features and functionality</li>
                    <li>Develop new products and services</li>
                    <li>Conduct research and analytics</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-navy mb-2">Communication</h4>
                  <ul className="list-disc list-inside text-sm text-gray-text space-y-1">
                    <li>Send marketing communications</li>
                    <li>Respond to inquiries and support requests</li>
                    <li>Send important updates and notifications</li>
                    <li>Conduct surveys and feedback collection</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy mb-2">Security & Compliance</h4>
                  <ul className="list-disc list-inside text-sm text-gray-text space-y-1">
                    <li>Protect against fraud and abuse</li>
                    <li>Ensure platform security</li>
                    <li>Comply with legal obligations</li>
                    <li>Enforce our terms of service</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-text leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties except in 
              the following circumstances:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">4.1 Service Providers</h3>
                <p className="text-gray-text leading-relaxed">
                  We may share your information with trusted third-party service providers who assist us in operating 
                  our platform, conducting our business, or serving our users. These providers are bound by 
                  confidentiality agreements and are prohibited from using your information for any other purpose.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">4.2 Legal Requirements</h3>
                <p className="text-gray-text leading-relaxed">
                  We may disclose your information if required to do so by law or in response to valid requests by 
                  public authorities (e.g., a court or a government agency).
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">4.3 Business Transfers</h3>
                <p className="text-gray-text leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as 
                  part of that transaction. We will provide notice before your information is transferred and becomes 
                  subject to a different privacy policy.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">4.4 Consent</h3>
                <p className="text-gray-text leading-relaxed">
                  We may share your information with your explicit consent or at your direction.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">5. Data Security</h2>
            <p className="text-gray-text leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-navy mb-2">Technical Measures</h4>
                <ul className="list-disc list-inside text-sm text-gray-text space-y-1">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Encryption at rest for stored data</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security audits and assessments</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-navy mb-2">Organizational Measures</h4>
                <ul className="list-disc list-inside text-sm text-gray-text space-y-1">
                  <li>Employee training on data protection</li>
                  <li>Access controls and authorization procedures</li>
                  <li>Incident response and breach notification</li>
                  <li>Regular policy reviews and updates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">6. Your Privacy Rights</h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">6.1 Access and Portability</h3>
                <p className="text-gray-text leading-relaxed">
                  You have the right to access your personal information and receive a copy of your data in a 
                  portable format.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">6.2 Correction and Updates</h3>
                <p className="text-gray-text leading-relaxed">
                  You can update or correct your personal information at any time through your account settings.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">6.3 Deletion</h3>
                <p className="text-gray-text leading-relaxed">
                  You have the right to request deletion of your personal information, subject to certain exceptions 
                  for legal and business purposes.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">6.4 Opt-out</h3>
                <p className="text-gray-text leading-relaxed">
                  You can opt out of marketing communications and certain data processing activities through your 
                  account preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-text leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our platform:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">7.1 Types of Cookies</h3>
                <ul className="list-disc list-inside text-gray-text space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">7.2 Managing Cookies</h3>
                <p className="text-gray-text leading-relaxed">
                  You can control cookies through your browser settings. However, disabling certain cookies may 
                  affect the functionality of our platform.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">8. Data Retention</h2>
            <p className="text-gray-text leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined 
              in this Privacy Policy, unless a longer retention period is required or permitted by law. When we 
              no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">9. International Data Transfers</h2>
            <p className="text-gray-text leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure 
              that such transfers comply with applicable data protection laws and implement appropriate safeguards 
              to protect your information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">10. Children's Privacy</h2>
            <p className="text-gray-text leading-relaxed">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-text leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review 
              this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">12. Contact Us</h2>
            <p className="text-gray-text leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            
            <div className="bg-bg-gray rounded-lg p-6">
              <h3 className="font-semibold text-navy mb-3">Privacy Team</h3>
              <div className="space-y-2 text-gray-text">
                <p><strong>Email:</strong> privacy@stratos.com</p>
                <p><strong>Address:</strong> 123 Business St, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-text">
          This Privacy Policy is effective as of the date listed above and will remain in effect except with 
          respect to any changes in its provisions in the future.
        </p>
      </div>
    </div>
  );
}
