'use client';

import { ArrowLeft, Printer, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    { id: 'collection', title: 'Data Collection' },
    { id: 'usage', title: 'Data Usage' },
    { id: 'storage', title: 'Data Storage' },
    { id: 'sharing', title: 'Data Sharing' },
    { id: 'rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies' },
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

          <div className="mt-8 p-4 bg-teal/10 rounded-lg">
            <Shield className="w-8 h-8 text-teal mb-2" />
            <p className="text-sm text-gray-text">
              Your privacy is our priority. We're GDPR and CCPA compliant.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-navy mb-4">Privacy Policy</h1>
            <p className="text-gray-text">Last updated: October 28, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section id="collection">
              <h2 className="text-2xl font-bold text-navy mb-4">1. Data Collection</h2>
              <p className="text-gray-text mb-4">
                We collect information that you provide directly to us, including when you create an account, use our services,
                or contact us for support. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-text space-y-2 mb-4">
                <li><strong>Account Information:</strong> Name, email address, password, and profile details</li>
                <li><strong>Usage Data:</strong> Information about how you use the platform, including features accessed and time spent</li>
                <li><strong>Content Data:</strong> Projects, conversations, documents, and other content you create</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
                <li><strong>Payment Information:</strong> Billing details (processed securely through our payment provider)</li>
              </ul>
              <p className="text-gray-text">
                We may also collect information from third parties, such as authentication providers if you use social login.
              </p>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-bold text-navy mb-4">2. How We Use Your Data</h2>
              <p className="text-gray-text mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-text space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns and improve user experience</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-gray-text">
                We do not sell your personal data to third parties. We use your data solely to provide and improve our services.
              </p>
            </section>

            <section id="storage">
              <h2 className="text-2xl font-bold text-navy mb-4">3. Data Storage & Security</h2>
              <p className="text-gray-text mb-4">
                Your data is stored securely using industry-standard practices:
              </p>
              <ul className="list-disc pl-6 text-gray-text space-y-2 mb-4">
                <li><strong>Encryption:</strong> All data is encrypted at rest and in transit using AES-256 and TLS 1.3</li>
                <li><strong>Infrastructure:</strong> We use Azure's enterprise-grade cloud infrastructure</li>
                <li><strong>Access Controls:</strong> Strict access controls limit who can access your data</li>
                <li><strong>Regular Audits:</strong> We conduct regular security audits and penetration testing</li>
                <li><strong>Compliance:</strong> SOC 2 Type II, GDPR, and CCPA compliant</li>
              </ul>
              <p className="text-gray-text">
                We retain your data for as long as your account is active or as needed to provide services. You can request
                deletion of your data at any time.
              </p>
            </section>

            <section id="sharing">
              <h2 className="text-2xl font-bold text-navy mb-4">4. Data Sharing</h2>
              <p className="text-gray-text mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-text space-y-2 mb-4">
                <li><strong>Service Providers:</strong> With vendors who help us provide services (e.g., hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
              <p className="text-gray-text">
                All third-party service providers are contractually bound to protect your data and use it only for the purposes
                we specify.
              </p>
            </section>

            <section id="rights">
              <h2 className="text-2xl font-bold text-navy mb-4">5. Your Rights</h2>
              <p className="text-gray-text mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-gray-text space-y-2 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
              </ul>
              <p className="text-gray-text">
                To exercise these rights, contact us at privacy@stratos.com or use the data management tools in your account
                settings.
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-bold text-navy mb-4">6. Cookies & Tracking</h2>
              <p className="text-gray-text mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-text space-y-2 mb-4">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Understand how you use our platform</li>
                <li>Improve our services</li>
              </ul>
              <p className="text-gray-text mb-4">
                <strong>Types of Cookies:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-text space-y-2 mb-4">
                <li><strong>Essential:</strong> Required for the platform to function</li>
                <li><strong>Functional:</strong> Remember your preferences</li>
                <li><strong>Analytics:</strong> Help us understand usage patterns</li>
                <li><strong>Marketing:</strong> Used to deliver relevant ads (with your consent)</li>
              </ul>
              <p className="text-gray-text">
                You can control cookies through your browser settings. Note that disabling certain cookies may affect
                platform functionality.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-navy mb-4">Contact Us About Privacy</h3>
              <p className="text-gray-text">
                If you have questions about this Privacy Policy or our data practices:
                <br />
                Email: privacy@stratos.com
                <br />
                Address: 123 Market Street, San Francisco, CA 94103
                <br />
                Data Protection Officer: dpo@stratos.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
