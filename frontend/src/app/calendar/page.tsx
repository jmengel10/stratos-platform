'use client';
import { Plus, Calendar } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Calendar</h1>
          <p className="text-gray-text mt-2">Schedule and manage your meetings</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5" />
          New Event
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-border rounded-lg p-8">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No events scheduled</h3>
          <p className="text-gray-text mb-6">Schedule your first meeting or event</p>
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
            Schedule Your First Event
          </button>
        </div>
      </div>
    </div>
  );
}