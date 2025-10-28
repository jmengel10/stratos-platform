'use client';

import { ArrowLeft, Printer } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    { id: 'terms', title: 'Terms of Service' },
    { id: 'usage', title: 'Acceptable Use' },
    { id: 'privacy', title: 'Privacy & Data' },
    { id: 'liability', title: 'Liability' },
    { id: 'termination', title: 'Termination' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <a href="/home" className="flex items-center gap-2 text-gray-text hover:text-navy">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to app</span>
          </a>
          <button onClick={() => window.print()} className="flex items-center gap-2 text-gray-text hover:text-navy">
            <Printer className="w-5 h-5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 flex gap-12">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 sticky top-24 h-fit">
          <h3 className="font-bold text-navy mb-4">Contents</h3>
          <nav className="space-y-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-gray-text hover:text-teal transition-colors"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-navy mb-4">Terms of Service</h1>
            <p className="text-gray-text">Last updated: October 28, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section id="terms">
              <h2 className="text-2xl font-bold text-navy mb-4">1. Terms of Service</h2>
              <p className="text-gray-text mb-4">
                Welcome to Stratos. By accessing or using our platform, you agree to be bound by these Terms of Service
                and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
                from using or accessing this site.
              </p>
              <p className="text-gray-text mb-4">
                These terms apply to all users of the site, including without limitation users who are browsers, vendors,
                customers, merchants, and/or contributors of content.
              </p>
              <p className="text-gray-text">
                We reserve the right to update or modify these terms at any time without prior notice. Your continued use
                of the platform following the posting of any changes constitutes acceptance of those changes.
              </p>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-bold text-navy mb-4">2. Acceptable Use</h2>
              <p className="text-gray-text mb-4">
                You agree not to use the platform for any unlawful purpose or in any way that interrupts, damages,
                impairs, or renders the platform less efficient. Specifically, you agree not to:
              </p>
              <ul className="list-disc pl-6 text-gray-text space-y-2 mb-4">
                <li>Use the platform to transmit any malicious code or interfere with any security features</li>
                <li>Attempt to gain unauthorized access to any portion of the platform</li>
                <li>Use automated systems to access the platform without express permission</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Share your account credentials with others</li>
              </ul>
              <p className="text-gray-text">
                Violation of these terms may result in immediate termination of your account.
              </p>
            </section>

            <section id="privacy">
              <h2 className="text-2xl font-bold text-navy mb-4">3. Privacy & Data</h2>
              <p className="text-gray-text mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                personal information. By using the platform, you consent to our collection and use of personal data
                as outlined in the Privacy Policy.
              </p>
              <p className="text-gray-text mb-4">
                We use industry-standard security measures to protect your data, including encryption and secure
                data centers. However, no method of transmission over the internet is 100% secure, and we cannot
                guarantee absolute security.
              </p>
              <p className="text-gray-text">
                You retain ownership of all content you create using the platform. We do not claim any ownership
                rights to your content.
              </p>
            </section>

            <section id="liability">
              <h2 className="text-2xl font-bold text-navy mb-4">4. Limitation of Liability</h2>
              <p className="text-gray-text mb-4">
                The platform and all content are provided "as is" without warranty of any kind, either express or
                implied, including but not limited to warranties of merchantability, fitness for a particular purpose,
                or non-infringement.
              </p>
              <p className="text-gray-text mb-4">
                In no event shall Stratos, its directors, employees, or agents be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without limitation, loss of profits, data, use,
                or other intangible losses.
              </p>
              <p className="text-gray-text">
                Our total liability to you for all claims arising out of or related to the platform shall not exceed
                the amount you paid to us in the twelve months preceding the claim.
              </p>
            </section>

            <section id="termination">
              <h2 className="text-2xl font-bold text-navy mb-4">5. Termination</h2>
              <p className="text-gray-text mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any
                reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-text mb-4">
                Upon termination, your right to use the platform will immediately cease. If you wish to terminate
                your account, you may do so by contacting us or using the account deletion feature in your settings.
              </p>
              <p className="text-gray-text">
                All provisions of the Terms which by their nature should survive termination shall survive termination,
                including, without limitation, ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-navy mb-4">Contact Us</h3>
              <p className="text-gray-text">
                If you have any questions about these Terms, please contact us at:
                <br />
                Email: legal@stratos.com
                <br />
                Address: 123 Market Street, San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
