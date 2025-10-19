/**
 * ChartDisplay Component
 * 
 * Comprehensive chart component with all Recharts types, export, and customization
 */

'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Download, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'radar'
  data: any[]
  xKey?: string
  yKeys: string[]
  title: string
  description?: string
  colors?: string[]
}

interface ChartDisplayProps {
  chartConfig: ChartConfig
  height?: number
  showExport?: boolean
  className?: string
}

const DEFAULT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

export function ChartDisplay({ 
  chartConfig, 
  height = 400, 
  showExport = true,
  className 
}: ChartDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const colors = chartConfig.colors || DEFAULT_COLORS

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Export data as CSV
      const csv = convertToCSV(chartConfig.data)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${chartConfig.title.replace(/\s+/g, '-').toLowerCase()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const displayHeight = isExpanded ? height * 1.5 : height

  return (
    <div className={cn('bg-white border border-slate-200 rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-900">{chartConfig.title}</h3>
          {chartConfig.description && (
            <p className="text-sm text-slate-600 mt-1">{chartConfig.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showExport && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Export data as CSV"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4 text-slate-600" />
            ) : (
              <Maximize2 className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        {renderChart(chartConfig, displayHeight, colors)}
      </div>
    </div>
  )
}

/**
 * Render appropriate chart based on type
 */
function renderChart(config: ChartConfig, height: number, colors: string[]) {
  switch (config.type) {
    case 'bar':
      return <BarChartDisplay config={config} height={height} colors={colors} />
    case 'line':
      return <LineChartDisplay config={config} height={height} colors={colors} />
    case 'pie':
      return <PieChartDisplay config={config} height={height} colors={colors} />
    case 'area':
      return <AreaChartDisplay config={config} height={height} colors={colors} />
    case 'scatter':
      return <ScatterChartDisplay config={config} height={height} colors={colors} />
    case 'radar':
      return <RadarChartDisplay config={config} height={height} colors={colors} />
    default:
      return <div className="text-slate-500">Unsupported chart type: {config.type}</div>
  }
}

/**
 * Bar Chart
 */
function BarChartDisplay({ config, height, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={config.data} 
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={config.xKey || 'name'} 
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        {config.yKeys.map((key: string, index: number) => (
          <Bar 
            key={key}
            dataKey={key} 
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

/**
 * Line Chart
 */
function LineChartDisplay({ config, height, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart 
        data={config.data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={config.xKey || 'name'} 
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        {config.yKeys.map((key: string, index: number) => (
          <Line 
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ fill: colors[index % colors.length], r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

/**
 * Pie Chart
 */
function PieChartDisplay({ config, height, colors }: any) {
  const RADIAN = Math.PI / 180
  
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={config.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={Math.min(height / 3, 120)}
          fill="#8884d8"
          dataKey={config.yKeys[0]}
          nameKey={config.xKey || 'name'}
        >
          {config.data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

/**
 * Area Chart
 */
function AreaChartDisplay({ config, height, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart 
        data={config.data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={config.xKey || 'name'} 
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        {config.yKeys.map((key: string, index: number) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="1"
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

/**
 * Scatter Chart
 */
function ScatterChartDisplay({ config, height, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          type="number" 
          dataKey={config.xKey || 'x'} 
          name={config.xKey || 'X'}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis 
          type="number" 
          dataKey={config.yKeys[0] || 'y'} 
          name={config.yKeys[0] || 'Y'}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Scatter 
          name={config.title}
          data={config.data} 
          fill={colors[0]}
        >
          {config.data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}

/**
 * Radar Chart
 */
function RadarChartDisplay({ config, height, colors }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius={Math.min(height / 3, 120)} 
        data={config.data}
      >
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey={config.xKey || 'subject'} tick={{ fill: '#64748b', fontSize: 12 }} />
        <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
          }}
        />
        <Legend />
        {config.yKeys.map((key: string, index: number) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.6}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return ''

  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Example usage configurations
 */
export const EXAMPLE_CONFIGS: Record<string, ChartConfig> = {
  revenue: {
    type: 'bar',
    title: 'Monthly Revenue',
    description: 'Revenue breakdown by month',
    data: [
      { month: 'Jan', revenue: 45000, costs: 28000 },
      { month: 'Feb', revenue: 52000, costs: 30000 },
      { month: 'Mar', revenue: 48000, costs: 29000 },
      { month: 'Apr', revenue: 61000, costs: 33000 },
      { month: 'May', revenue: 68000, costs: 35000 },
      { month: 'Jun', revenue: 73000, costs: 36000 },
    ],
    xKey: 'month',
    yKeys: ['revenue', 'costs'],
    colors: ['#3b82f6', '#ef4444'],
  },
  
  growth: {
    type: 'line',
    title: 'User Growth Trend',
    description: 'Monthly active users over time',
    data: [
      { month: 'Jan', users: 1200, target: 1000 },
      { month: 'Feb', users: 1450, target: 1300 },
      { month: 'Mar', users: 1680, target: 1600 },
      { month: 'Apr', users: 2100, target: 1900 },
      { month: 'May', users: 2450, target: 2200 },
    ],
    xKey: 'month',
    yKeys: ['users', 'target'],
    colors: ['#10b981', '#94a3b8'],
  },
  
  marketShare: {
    type: 'pie',
    title: 'Market Share Distribution',
    description: 'Revenue distribution by segment',
    data: [
      { name: 'Enterprise', value: 45 },
      { name: 'Mid-Market', value: 30 },
      { name: 'SMB', value: 15 },
      { name: 'Startup', value: 10 },
    ],
    xKey: 'name',
    yKeys: ['value'],
  },
  
  efficiency: {
    type: 'area',
    title: 'Operational Efficiency',
    description: 'Efficiency metrics over time',
    data: [
      { quarter: 'Q1', efficiency: 65, utilization: 70, satisfaction: 75 },
      { quarter: 'Q2', efficiency: 72, utilization: 75, satisfaction: 78 },
      { quarter: 'Q3', efficiency: 78, utilization: 80, satisfaction: 82 },
      { quarter: 'Q4', efficiency: 85, utilization: 85, satisfaction: 88 },
    ],
    xKey: 'quarter',
    yKeys: ['efficiency', 'utilization', 'satisfaction'],
  },
  
  customerSegments: {
    type: 'scatter',
    title: 'Customer Segmentation (RFM)',
    description: 'Recency vs Frequency analysis',
    data: [
      { recency: 5, frequency: 12, value: 5000 },
      { recency: 15, frequency: 8, value: 3200 },
      { recency: 30, frequency: 5, value: 1800 },
      { recency: 60, frequency: 15, value: 8000 },
      { recency: 90, frequency: 3, value: 1200 },
      { recency: 120, frequency: 20, value: 12000 },
    ],
    xKey: 'recency',
    yKeys: ['frequency'],
  },
  
  competitiveAnalysis: {
    type: 'radar',
    title: 'Competitive Analysis',
    description: 'Feature comparison across competitors',
    data: [
      { subject: 'Features', ourProduct: 120, competitorA: 110, competitorB: 130 },
      { subject: 'Price', ourProduct: 95, competitorA: 100, competitorB: 85 },
      { subject: 'Support', ourProduct: 140, competitorA: 90, competitorB: 100 },
      { subject: 'UX', ourProduct: 130, competitorA: 120, competitorB: 110 },
      { subject: 'Performance', ourProduct: 110, competitorA: 130, competitorB: 120 },
      { subject: 'Integration', ourProduct: 125, competitorA: 100, competitorB: 115 },
    ],
    xKey: 'subject',
    yKeys: ['ourProduct', 'competitorA', 'competitorB'],
    colors: ['#3b82f6', '#8b5cf6', '#f59e0b'],
  },
}

