'use client';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Reports & Analytics</h1>
          <p className="text-gray-text mt-2">Track your platform usage and performance</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-border rounded-lg p-8">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No data available yet</h3>
          <p className="text-gray-text mb-6">Start using the platform to see analytics and reports</p>
        </div>
      </div>
    </div>
  );
}