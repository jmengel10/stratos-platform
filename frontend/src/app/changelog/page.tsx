'use client';

import { useState } from 'react';
import { Calendar, Tag, Bell, CheckCircle, AlertCircle, Plus, Minus, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

type ChangeType = 'feature' | 'improvement' | 'bugfix' | 'breaking' | 'security';
type VersionType = 'major' | 'minor' | 'patch';

interface ChangelogEntry {
  id: string;
  version: string;
  versionType: VersionType;
  releaseDate: string;
  changes: {
    type: ChangeType;
    title: string;
    description: string;
    impact?: 'high' | 'medium' | 'low';
  }[];
  highlights: string[];
  migrationNotes?: string;
}

const mockChangelog: ChangelogEntry[] = [
  {
    id: '1',
    version: '2.1.0',
    versionType: 'minor',
    releaseDate: '2024-01-15',
    changes: [
      {
        type: 'feature',
        title: 'Advanced Analytics Dashboard',
        description: 'New comprehensive analytics dashboard with real-time metrics and customizable widgets.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Team Collaboration Tools',
        description: 'Added real-time collaboration features for team members working on projects.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Performance Optimizations',
        description: 'Significantly improved page load times and overall application performance.',
        impact: 'medium'
      },
      {
        type: 'bugfix',
        title: 'Fixed Export Issues',
        description: 'Resolved issues with PDF and Excel export functionality in reports.',
        impact: 'medium'
      }
    ],
    highlights: [
      'New analytics dashboard with customizable widgets',
      'Real-time team collaboration features',
      '50% faster page load times',
      'Improved mobile responsiveness'
    ]
  },
  {
    id: '2',
    version: '2.0.5',
    versionType: 'patch',
    releaseDate: '2024-01-08',
    changes: [
      {
        type: 'bugfix',
        title: 'Authentication Fix',
        description: 'Fixed intermittent authentication issues with Azure B2C integration.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'UI Polish',
        description: 'Minor UI improvements and accessibility enhancements.',
        impact: 'low'
      },
      {
        type: 'security',
        title: 'Security Updates',
        description: 'Updated dependencies to address security vulnerabilities.',
        impact: 'high'
      }
    ],
    highlights: [
      'Fixed authentication issues',
      'Enhanced security with dependency updates',
      'Improved accessibility'
    ]
  },
  {
    id: '3',
    version: '2.0.0',
    versionType: 'major',
    releaseDate: '2023-12-20',
    changes: [
      {
        type: 'breaking',
        title: 'New Architecture',
        description: 'Complete platform redesign with new architecture and improved scalability.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'AI-Powered Insights',
        description: 'Integrated AI capabilities for automated insights and recommendations.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Multi-tenant Support',
        description: 'Added support for multiple organizations and workspace management.',
        impact: 'high'
      },
      {
        type: 'breaking',
        title: 'API Changes',
        description: 'Updated API endpoints with new authentication and data structures.',
        impact: 'high'
      }
    ],
    highlights: [
      'Complete platform redesign',
      'AI-powered insights and recommendations',
      'Multi-tenant architecture',
      'Enhanced security and performance'
    ],
    migrationNotes: 'This is a major release with breaking changes. Please review the migration guide in our documentation.'
  },
  {
    id: '4',
    version: '1.8.2',
    versionType: 'patch',
    releaseDate: '2023-12-05',
    changes: [
      {
        type: 'bugfix',
        title: 'Data Sync Issues',
        description: 'Fixed data synchronization issues between client and server.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Error Handling',
        description: 'Improved error handling and user feedback throughout the application.',
        impact: 'medium'
      }
    ],
    highlights: [
      'Fixed data synchronization',
      'Better error messages and user feedback'
    ]
  }
];

const changeTypeIcons = {
  feature: Plus,
  improvement: ArrowRight,
  bugfix: CheckCircle,
  breaking: AlertCircle,
  security: AlertCircle
};

const changeTypeColors = {
  feature: 'bg-green-100 text-green-800 border-green-200',
  improvement: 'bg-blue-100 text-blue-800 border-blue-200',
  bugfix: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  breaking: 'bg-red-100 text-red-800 border-red-200',
  security: 'bg-purple-100 text-purple-800 border-purple-200'
};

const impactColors = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600'
};

export default function ChangelogPage() {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<ChangeType | 'all'>('all');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const filteredChangelog = mockChangelog.filter(entry => {
    if (filterType === 'all') return true;
    return entry.changes.some(change => change.type === filterType);
  });

  const handleSubscribe = () => {
    setIsSubscribed(true);
    // In a real app, this would integrate with email service
    console.log('Subscribed to changelog updates');
  };

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Changelog' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">Changelog</h1>
          <p className="text-gray-600 mt-2">Stay updated with the latest features, improvements, and fixes</p>
        </div>
        <div className="flex items-center space-x-3">
          {!isSubscribed ? (
            <Button 
              variant="secondary" 
              onClick={handleSubscribe}
              className="flex items-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>Subscribe to Updates</span>
            </Button>
          ) : (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Subscribed
            </Badge>
          )}
        </div>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by type:</span>
          <div className="flex space-x-2">
            {(['all', 'feature', 'improvement', 'bugfix', 'breaking', 'security'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-[#33A7B5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Changelog Timeline */}
      <div className="space-y-8">
        {filteredChangelog.map((entry, index) => (
          <Card key={entry.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-navy">v{entry.version}</h2>
                  <Badge 
                    className={
                      entry.versionType === 'major' 
                        ? 'bg-red-100 text-red-800' 
                        : entry.versionType === 'minor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {entry.versionType}
                  </Badge>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(entry.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedVersion(selectedVersion === entry.id ? null : entry.id)}
              >
                {selectedVersion === entry.id ? 'Show Less' : 'Show Details'}
              </Button>
            </div>

            {/* Highlights */}
            <div className="mb-4">
              <h3 className="font-semibold text-navy mb-2">Key Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {entry.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm">{highlight}</li>
                ))}
              </ul>
            </div>

            {/* Detailed Changes */}
            {selectedVersion === entry.id && (
              <div className="space-y-4">
                <h3 className="font-semibold text-navy">Detailed Changes</h3>
                <div className="space-y-3">
                  {entry.changes.map((change, idx) => {
                    const Icon = changeTypeIcons[change.type];
                    return (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className={`w-5 h-5 mt-0.5 ${
                          change.type === 'feature' ? 'text-green-600' :
                          change.type === 'improvement' ? 'text-blue-600' :
                          change.type === 'bugfix' ? 'text-yellow-600' :
                          change.type === 'breaking' ? 'text-red-600' :
                          'text-purple-600'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-navy">{change.title}</h4>
                            <Badge className={changeTypeColors[change.type]}>
                              {change.type}
                            </Badge>
                            {change.impact && (
                              <span className={`text-xs font-medium ${impactColors[change.impact]}`}>
                                {change.impact} impact
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{change.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Migration Notes */}
                {entry.migrationNotes && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Migration Required</h4>
                        <p className="text-sm text-yellow-700">{entry.migrationNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Subscribe CTA */}
      {!isSubscribed && (
        <Card className="p-6 bg-gradient-to-r from-[#33A7B5] to-[#0F172A] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Never Miss an Update</h3>
              <p className="text-blue-100">Get notified when we release new features and improvements</p>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleSubscribe}
              className="bg-white text-[#33A7B5] hover:bg-gray-100"
            >
              Subscribe Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
