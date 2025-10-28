/**
 * ChartView Component
 * 
 * Renders different chart types using Recharts
 */

'use client'

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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartViewProps {
  data: any
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function ChartView({ data }: ChartViewProps) {
  const chartType = data.type || 'bar'

  // Render based on chart type
  switch (chartType) {
    case 'bar':
      return <BarChartView data={data} />
    case 'line':
      return <LineChartView data={data} />
    case 'pie':
      return <PieChartView data={data} />
    case 'area':
      return <AreaChartView data={data} />
    case 'scatter':
      return <ScatterChartView data={data} />
    default:
      return <BarChartView data={data} />
  }
}

// Bar Chart
function BarChartView({ data }: { data: any }) {
  const chartData = data.data || []
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={data.xKey || 'name'} 
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        />
        <Legend />
        {data.series ? (
          data.series.map((s: any, idx: number) => (
            <Bar
              key={idx}
              dataKey={s.name}
              fill={s.color || COLORS[idx % COLORS.length]}
            />
          ))
        ) : (
          <Bar dataKey={data.yKey || 'value'} fill="#3b82f6" />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}

// Line Chart
function LineChartView({ data }: { data: any }) {
  const chartData = data.data || []
  const series = data.series || []
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey={data.xKey || 'name'} 
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        />
        <Legend />
        {series.length > 0 ? (
          series.map((s: any, idx: number) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={s.name}
              stroke={s.color || COLORS[idx % COLORS.length]}
              strokeWidth={2}
              strokeDasharray={s.style === 'dashed' ? '5 5' : undefined}
              dot={{ r: 4 }}
            />
          ))
        ) : (
          <Line
            type="monotone"
            dataKey={data.yKey || 'value'}
            stroke="#3b82f6"
            strokeWidth={2}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

// Pie Chart
function PieChartView({ data }: { data: any }) {
  const chartData = data.data || []
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={(entry) => `${entry.category}: ${entry.value}%`}
        >
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Area Chart
function AreaChartView({ data }: { data: any }) {
  const chartData = data.data || []
  const series = data.series || []
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={data.xKey || 'name'} tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {series.length > 0 ? (
          series.map((s: any, idx: number) => (
            <Area
              key={idx}
              type="monotone"
              dataKey={s.name}
              stroke={s.color || COLORS[idx % COLORS.length]}
              fill={s.color || COLORS[idx % COLORS.length]}
              fillOpacity={0.6}
            />
          ))
        ) : (
          <Area
            type="monotone"
            dataKey={data.yKey || 'value'}
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Scatter Chart
function ScatterChartView({ data }: { data: any }) {
  const clusters = data.clusters || []
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name={data.xAxis || 'X'}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name={data.yAxis || 'Y'}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        {clusters.map((cluster: any, idx: number) => (
          <Scatter
            key={idx}
            name={cluster.name}
            data={cluster.points.map((p: number[]) => ({ x: p[0], y: p[1], z: p[2] }))}
            fill={cluster.color || COLORS[idx % COLORS.length]}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  )
}

