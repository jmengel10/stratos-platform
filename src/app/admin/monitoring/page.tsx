'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Activity, 
  Server, 
  Database, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: string;
    api: string;
    memory: string;
    disk: string;
  };
  responseTime: number;
}

interface Metrics {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
  totalConversations: number;
  apiCalls: number;
  errorRate: number;
  responseTime: number;
}

export default function MonitoringPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('Failed to fetch health status:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Mock metrics - in production, this would come from your analytics service
      const mockMetrics: Metrics = {
        totalUsers: 1247,
        activeUsers: 89,
        totalProjects: 342,
        activeProjects: 156,
        totalConversations: 2847,
        apiCalls: 12450,
        errorRate: 0.02,
        responseTime: 245
      };
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchHealthStatus(), fetchMetrics()]);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'unhealthy': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading && !healthStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading monitoring data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600">Real-time system health and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button
            onClick={refreshData}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status Overview */}
      {healthStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Status</p>
                <div className="flex items-center mt-2">
                  {getStatusIcon(healthStatus.status)}
                  <span className="ml-2 text-lg font-semibold capitalize">
                    {healthStatus.status}
                  </span>
                </div>
              </div>
              <Badge variant={healthStatus.status === 'healthy' ? 'active' : healthStatus.status === 'degraded' ? 'in-progress' : 'planning'}>   
                {healthStatus.status}
              </Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatUptime(healthStatus.uptime)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthStatus.responseTime}ms
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Environment</p>
                <p className="text-lg font-semibold text-gray-900">
                  {healthStatus.environment}
                </p>
                <p className="text-sm text-gray-500">v{healthStatus.version}</p>
              </div>
              <Server className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>
      )}

      {/* System Checks */}
      {healthStatus && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Checks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(healthStatus.checks).map(([check, status]) => (
              <div key={check} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {check === 'database' && <Database className="h-5 w-5 text-blue-600 mr-3" />}
                  {check === 'api' && <Server className="h-5 w-5 text-green-600 mr-3" />}
                  {check === 'memory' && <Activity className="h-5 w-5 text-purple-600 mr-3" />}
                  {check === 'disk' && <Server className="h-5 w-5 text-orange-600 mr-3" />}
                  <span className="font-medium capitalize">{check}</span>
                </div>
                <Badge variant={status === 'healthy' ? 'active' : status === 'degraded' ? 'in-progress' : 'planning'}>
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% from last week
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.apiCalls.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Last 24 hours</p>
              </div>
              <Server className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900">{(metrics.errorRate * 100).toFixed(2)}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -0.5% from last week
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium">System health check passed</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <Badge variant="active">Success</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">New user registration</p>
                <p className="text-sm text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <Badge variant="in-progress">Info</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium">High API usage detected</p>
                <p className="text-sm text-gray-500">10 minutes ago</p>
              </div>
            </div>
            <Badge variant="planning">Warning</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}

