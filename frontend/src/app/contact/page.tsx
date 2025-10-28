'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Twitter, Github } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-teal to-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-white/90">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-navy mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <div className="font-medium text-navy mb-1">Email</div>
                    <div className="text-gray-text">support@stratos.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <div className="font-medium text-navy mb-1">Phone</div>
                    <div className="text-gray-text">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <div className="font-medium text-navy mb-1">Office</div>
                    <div className="text-gray-text">
                      123 Market Street<br />
                      San Francisco, CA 94103
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <div className="font-medium text-navy mb-1">Business Hours</div>
                    <div className="text-gray-text">
                      Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                      Weekend: Closed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Map View</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-navy mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center hover:bg-teal/20 transition-colors">
                  <Linkedin className="w-5 h-5 text-teal" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center hover:bg-teal/20 transition-colors">
                  <Twitter className="w-5 h-5 text-teal" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center hover:bg-teal/20 transition-colors">
                  <Github className="w-5 h-5 text-teal" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
