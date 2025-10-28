import { ReactNode } from 'react';
import { Card } from './Card';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({ icon, label, value, subtext, trend }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-text">{label}</p>
            <p className="text-3xl font-bold text-navy">{value}</p>
            {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
          </div>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '↑' : '↓'}{trend.value}
          </div>
        )}
      </div>
    </Card>
  );
}
