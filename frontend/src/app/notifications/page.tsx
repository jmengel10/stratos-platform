'use client';

import { useMemo, useState } from 'react';
import { Bell, AtSign, FolderOpen, Check, Filter } from 'lucide-react';

type NotificationItem = {
  id: string;
  type: 'all' | 'unread' | 'mentions' | 'projects';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

const seed: NotificationItem[] = [
  { id: '1', type: 'projects', title: 'Project updated', message: 'Roadmap Q4 was updated', timestamp: '2h', read: false },
  { id: '2', type: 'mentions', title: 'You were mentioned', message: '@you in Market Analysis convo', timestamp: '4h', read: false },
  { id: '3', type: 'all', title: 'Invoice ready', message: 'October invoice is available', timestamp: '1d', read: true },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions' | 'projects'>('all');
  const [items, setItems] = useState<NotificationItem[]>(seed);
  const [filterType, setFilterType] = useState<'all' | 'projects' | 'billing'>('all');

  const filtered = useMemo(() => {
    return items.filter(i => {
      const byTab = activeTab === 'all'
        ? true
        : activeTab === 'unread'
          ? !i.read
          : i.type === activeTab;
      const byFilter = filterType === 'all' ? true : (filterType === 'projects' ? i.type === 'projects' : i.title.toLowerCase().includes('invoice'));
      return byTab && byFilter;
    });
  }, [items, activeTab, filterType]);

  const markAllAsRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })));
  const toggleRead = (id: string) => setItems(prev => prev.map(i => i.id === id ? ({ ...i, read: !i.read }) : i));

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-4xl font-serif font-bold text-navy">Notifications</h1>
        <p className="text-gray-text mt-2">Stay on top of updates across projects, mentions, and billing.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-sm border-b border-border mb-4">
        {([
          { key: 'all', label: 'All', Icon: Bell },
          { key: 'unread', label: 'Unread', Icon: Check },
          { key: 'mentions', label: 'Mentions', Icon: AtSign },
          { key: 'projects', label: 'Projects', Icon: FolderOpen },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-2 -mb-px border-b-2 ${activeTab === key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-navy'}`}
          >
            <span className="inline-flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</span>
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-border rounded px-2 py-1 text-sm"
          >
            <option value="all">All types</option>
            <option value="projects">Projects</option>
            <option value="billing">Billing</option>
          </select>
          <button onClick={markAllAsRead} className="px-3 py-1 border border-border rounded text-sm hover:bg-gray-50">Mark all as read</button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-border rounded-lg bg-white">
          <Bell className="w-10 h-10 text-gray-text mx-auto mb-2" />
          <p className="text-gray-text">No notifications yet</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg divide-y divide-border">
          {filtered.map(item => (
            <div key={item.id} className="p-4 flex items-start gap-3">
              <input type="checkbox" checked={item.read} onChange={() => toggleRead(item.id)} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-navy">{item.title}</div>
                  <div className="text-xs text-gray-text">{item.timestamp}</div>
                </div>
                <div className="text-sm text-gray-700">{item.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


