'use client';

import { Target, Users, Lightbulb, Award, TrendingUp, Shield } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We push the boundaries of what\'s possible with AI and strategic consulting.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We deliver exceptional results through rigorous analysis and expert guidance.',
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'We build lasting relationships with our clients based on trust and mutual success.',
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      initials: 'SC',
      color: 'from-teal to-navy',
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO',
      initials: 'MR',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Product',
      initials: 'EW',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'David Kim',
      role: 'Head of AI',
      initials: 'DK',
      color: 'from-green-500 to-teal',
    },
    {
      name: 'Lisa Thompson',
      role: 'Head of Strategy',
      initials: 'LT',
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'James Carter',
      role: 'Head of Sales',
      initials: 'JC',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal to-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-serif font-bold mb-6">
            Empowering Strategic Decisions with AI
          </h1>
          <p className="text-xl text-white/90">
            We're building the future of strategic consulting by combining human expertise
            with artificial intelligence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Our Story */}
        <div className="mb-20">
          <h2 className="text-4xl font-serif font-bold text-navy mb-8 text-center">Our Story</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-text text-lg">
            <p>
              Founded in 2024, Stratos was born from a simple observation: strategic consulting
              was ripe for transformation. Traditional consulting models were slow, expensive,
              and often inaccessible to growing businesses that needed them most.
            </p>
            <p>
              We set out to democratize access to world-class strategic guidance by building
              an AI-powered platform that combines the depth of human expertise with the speed
              and scalability of artificial intelligence. Our team of former strategy consultants
              and AI researchers has created a new category of business tools.
            </p>
            <p>
              Today, Stratos serves hundreds of companies worldwide, from startups to enterprises,
              helping them make better strategic decisions faster. We're just getting started.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-4xl font-serif font-bold text-navy mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-teal" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-3">{value.title}</h3>
                  <p className="text-gray-text">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meet the Team */}
        <div className="mb-20">
          <h2 className="text-4xl font-serif font-bold text-navy mb-8 text-center">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                  {member.initials}
                </div>
                <h3 className="text-xl font-bold text-navy mb-1">{member.name}</h3>
                <p className="text-gray-text">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-teal to-navy rounded-lg p-12 mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-white/90">Active Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-white/90">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-white/90">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/90">AI Support</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-3xl font-serif font-bold text-navy mb-4">
            Ready to Transform Your Strategy?
          </h2>
          <p className="text-gray-text text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of companies using Stratos to make better strategic decisions faster.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors font-medium"
            >
              Start Free Trial
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border border-gray-200 text-navy rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

