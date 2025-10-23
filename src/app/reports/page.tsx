'use client';

import { 
  Users, 
  FolderOpen, 
  MessageSquare, 
  CheckCircle,
  TrendingUp,
  Calendar,
  Download,
  Target,
  BarChart3,
  DollarSign,
  Lightbulb,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', href: '/home' },
        { label: 'Reports & Analytics' }
      ]} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-navy font-serif">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Track your platform usage, performance metrics, and team activity</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </Button>
          <Button variant="secondary" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Users className="w-8 h-8" />}
          label="Total Clients"
          value="12"
          subtext="vs. 10 last month"
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          icon={<FolderOpen className="w-8 h-8" />}
          label="Active Projects"
          value="18"
          subtext="vs. 15 last month"
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          icon={<MessageSquare className="w-8 h-8" />}
          label="Conversations"
          value="47"
          subtext="vs. 32 last month"
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          icon={<CheckCircle className="w-8 h-8" />}
          label="Completion Rate"
          value="78%"
          subtext="vs. 73% last month"
          trend={{ value: "+12%", positive: true }}
        />
      </div>

      {/* Activity Trends Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-navy font-serif">Activity Trends</h3>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">Day</Button>
            <Button variant="secondary" size="sm">Week</Button>
            <Button variant="primary" size="sm">Month</Button>
          </div>
        </div>
        
        {/* Simple chart representation */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
          {[20, 35, 25, 40, 30, 45, 50, 35, 40, 45, 50, 55, 60, 45, 50, 55, 60, 65, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15].map((height, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-2 bg-primary rounded-t"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-gray-600">Conversations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span className="text-sm text-gray-600">Projects Created</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Agent Performance */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-navy font-serif mb-6">AI Agent Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-navy">GTM Strategist</p>
                  <p className="text-sm text-gray-600">conversations</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-navy">Operations Analyst</p>
                  <p className="text-sm text-gray-600">15 conversations</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-navy">Fundraising Advisor</p>
                  <p className="text-sm text-gray-600">8 conversations</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-navy">Product Strategist</p>
                  <p className="text-sm text-gray-600">conversations</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '79%' }}></div>
                </div>
                <span className="text-sm font-medium">79%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-navy">Data Analyst</p>
                  <p className="text-sm text-gray-600">9 conversations</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
                <span className="text-sm font-medium">71%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Client Engagement */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-navy font-serif mb-6">Client Engagement</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-navy">12</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-sm text-gray-700">Financial Services</span>
              </div>
              <span className="text-sm font-medium">4 (33%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">Healthcare</span>
              </div>
              <span className="text-sm font-medium">3 (25%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="text-sm text-gray-700">Technology</span>
              </div>
              <span className="text-sm font-medium">3 (25%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span className="text-sm text-gray-700">Other</span>
              </div>
              <span className="text-sm font-medium">2 (17%)</span>
            </div>
          </div>
        </Card>

        {/* Project Status */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-navy font-serif mb-6">Project Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">Active</span>
              </div>
              <Badge variant="active">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-700">In Progress</span>
              </div>
              <Badge variant="in-progress">4</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm text-gray-700">On Hold</span>
              </div>
              <Badge variant="completed">1</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span className="text-sm text-gray-700">Completed</span>
              </div>
              <Badge variant="completed">8</Badge>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Projects</span>
                <span className="text-sm font-bold text-navy">25</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Activity */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-navy font-serif mb-6">Team Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">SC</span>
                </div>
                <div>
                  <p className="font-medium text-navy">Sarah Chen</p>
                  <p className="text-sm text-gray-600">24 actions</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+8</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JW</span>
                </div>
                <div>
                  <p className="font-medium text-navy">John Williams</p>
                  <p className="text-sm text-gray-600">18 actions</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+5</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">MJ</span>
                </div>
                <div>
                  <p className="font-medium text-navy">Mike Johnson</p>
                  <p className="text-sm text-gray-600">12 actions</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-red-600">
                <TrendingUp className="w-4 h-4 rotate-180" />
                <span className="text-sm font-medium">-2</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Export Reports */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-navy font-serif mb-6">Export Reports</h3>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full flex items-center space-x-3">
              <Database className="w-4 h-4" />
              <span>Export as PDF</span>
            </Button>
            <Button variant="secondary" className="w-full flex items-center space-x-3">
              <Database className="w-4 h-4" />
              <span>Export as CSV</span>
            </Button>
            <Button variant="secondary" className="w-full flex items-center space-x-3">
              <Database className="w-4 h-4" />
              <span>Export as Excel</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
