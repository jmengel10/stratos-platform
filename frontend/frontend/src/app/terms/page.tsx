'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-serif font-bold text-navy">Terms of Service</h1>
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
              Welcome to Stratos ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our 
              strategic consulting platform and services (collectively, the "Service"). By accessing or using our 
              Service, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">2. Acceptance of Terms</h2>
            <p className="text-gray-text leading-relaxed mb-4">
              By creating an account, accessing our platform, or using any of our services, you acknowledge that you 
              have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-gray-text leading-relaxed">
              If you do not agree to these Terms, you may not access or use our Service.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">3. Description of Service</h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Stratos is a strategic consulting platform that provides tools and AI-powered assistants to help 
              consultants and businesses manage clients, projects, and strategic engagements. Our Service includes:
            </p>
            <ul className="list-disc list-inside text-gray-text space-y-2 ml-4">
              <li>Client and project management tools</li>
              <li>AI-powered strategic assistants</li>
              <li>Template and document management</li>
              <li>Team collaboration features</li>
              <li>Analytics and reporting capabilities</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">4. User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">4.1 Account Creation</h3>
                <p className="text-gray-text leading-relaxed">
                  To use our Service, you must create an account by providing accurate and complete information. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">4.2 Account Security</h3>
                <p className="text-gray-text leading-relaxed">
                  You are responsible for all activities that occur under your account. You must notify us immediately 
                  of any unauthorized use of your account or any other breach of security.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">4.3 Account Termination</h3>
                <p className="text-gray-text leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms 
                  or for any other reason at our sole discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">5. Acceptable Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">5.1 Permitted Uses</h3>
                <p className="text-gray-text leading-relaxed">
                  You may use our Service only for lawful purposes and in accordance with these Terms. You agree to 
                  use the Service in compliance with all applicable laws and regulations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">5.2 Prohibited Uses</h3>
                <p className="text-gray-text leading-relaxed mb-2">You may not use our Service:</p>
                <ul className="list-disc list-inside text-gray-text space-y-1 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent the security features of the Service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">6. Payment Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">6.1 Subscription Fees</h3>
                <p className="text-gray-text leading-relaxed">
                  Our Service is offered on a subscription basis. Subscription fees are billed in advance on a 
                  monthly or annual basis, as selected by you during the signup process.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">6.2 Payment Processing</h3>
                <p className="text-gray-text leading-relaxed">
                  All payments are processed securely through Stripe. By providing payment information, you authorize 
                  us to charge your payment method for the subscription fees.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">6.3 Refunds</h3>
                <p className="text-gray-text leading-relaxed">
                  Subscription fees are generally non-refundable. However, we may provide refunds at our sole 
                  discretion in certain circumstances.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">7. Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">7.1 Our Rights</h3>
                <p className="text-gray-text leading-relaxed">
                  The Service and its original content, features, and functionality are and will remain the exclusive 
                  property of Stratos and its licensors. The Service is protected by copyright, trademark, and other 
                  laws.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">7.2 Your Content</h3>
                <p className="text-gray-text leading-relaxed">
                  You retain ownership of all content you upload to our Service. By uploading content, you grant us 
                  a license to use, store, and process your content as necessary to provide the Service.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">8. Privacy</h2>
            <p className="text-gray-text leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of 
              the Service, to understand our practices.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-text leading-relaxed">
              In no event shall Stratos, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
              of the Service.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">10. Termination</h2>
            <p className="text-gray-text leading-relaxed">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice 
              or liability, under our sole discretion, for any reason whatsoever and without limitation, including but 
              not limited to a breach of the Terms.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">11. Changes to Terms</h2>
            <p className="text-gray-text leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
              revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-serif font-semibold text-navy mb-4">12. Contact Information</h2>
            <p className="text-gray-text leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-bg-gray rounded-lg">
              <p className="text-navy font-medium">Stratos Support</p>
              <p className="text-gray-text">Email: legal@stratos.com</p>
              <p className="text-gray-text">Address: 123 Business St, San Francisco, CA 94105</p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-text">
          By using our Service, you agree to these Terms of Service.
        </p>
      </div>
    </div>
  );
}
