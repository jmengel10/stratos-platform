'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { mockCalendarEvents } from '@/lib/mockData';

export default function CalendarPage() {
  const [currentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const currentMonth = currentDate.getMonth();

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Calendar' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">February 2024</h1>
          <p className="text-gray-600 mt-2">Tuesday, February 13</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="secondary">Today</Button>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex border border-border rounded-lg">
            <button 
              className={`px-3 py-1 text-sm ${viewMode === 'day' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button 
              className={`px-3 py-1 text-sm ${viewMode === 'week' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button 
              className={`px-3 py-1 text-sm ${viewMode === 'month' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
          </div>
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mini Calendar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy">February 2024</h3>
              <div className="flex items-center space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-xs text-gray-500 text-center py-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.slice(0, 35).map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isToday = date.toDateString() === today.toDateString();
                const hasEvent = mockCalendarEvents.some(event => 
                  new Date(event.date).toDateString() === date.toDateString()
                );
                
                return (
                  <button
                    key={index}
                    className={`w-8 h-8 text-xs rounded-full flex items-center justify-center ${
                      isToday 
                        ? 'bg-primary text-white' 
                        : isCurrentMonth 
                          ? 'text-gray-900 hover:bg-gray-100' 
                          : 'text-gray-400'
                    }`}
                  >
                    {date.getDate()}
                    {hasEvent && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card className="p-4 mt-6">
            <h3 className="font-semibold text-navy mb-4">Upcoming</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-navy text-sm">GTM Strategy Call</p>
                  <p className="text-xs text-gray-600">Acme Corporation</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-navy text-sm">Operations Review</p>
                  <p className="text-xs text-gray-600">TechVentures Group</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-navy text-sm">Fundraising Prep</p>
                  <p className="text-xs text-gray-600">HealthFirst Systems</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-sm font-medium text-gray-700 text-center py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isToday = date.toDateString() === today.toDateString();
                const dayEvents = mockCalendarEvents.filter(event => 
                  new Date(event.date).toDateString() === date.toDateString()
                );
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-1 border border-gray-100 ${
                      isToday ? 'bg-primary/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-sm ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1 mt-1">
                      {dayEvents.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="text-xs p-1 rounded text-white bg-primary truncate"
                        >
                          {event.time} {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Add */}
      <div className="flex justify-end">
        <div className="w-96">
          <input
            type="text"
            placeholder="Quick add: '2pm Strategy call with Acme'"
            className="w-full px-3 py-2 border border-border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
