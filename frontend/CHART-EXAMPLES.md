# Chart Examples & Usage Guide

## 📊 ChartDisplay Component

The `ChartDisplay` component provides comprehensive chart visualization with 6 chart types, export functionality, and responsive design.

## 🎨 Chart Types Supported

### 1. Bar Chart
**Best for**: Comparisons, rankings, categorical data

**Example**:
```tsx
import { ChartDisplay } from '@/components/console/ChartDisplay'

<ChartDisplay
  chartConfig={{
    type: 'bar',
    title: 'Monthly Revenue',
    description: 'Revenue vs Costs by month',
    data: [
      { month: 'Jan', revenue: 45000, costs: 28000 },
      { month: 'Feb', revenue: 52000, costs: 30000 },
      { month: 'Mar', revenue: 48000, costs: 29000 },
    ],
    xKey: 'month',
    yKeys: ['revenue', 'costs'],
    colors: ['#3b82f6', '#ef4444'],
  }}
  height={400}
  showExport={true}
/>
```

### 2. Line Chart
**Best for**: Trends, time series, progress over time

**Example**:
```tsx
<ChartDisplay
  chartConfig={{
    type: 'line',
    title: 'User Growth',
    data: [
      { month: 'Jan', users: 1200, target: 1000 },
      { month: 'Feb', users: 1450, target: 1300 },
      { month: 'Mar', users: 1680, target: 1600 },
    ],
    xKey: 'month',
    yKeys: ['users', 'target'],
  }}
/>
```

### 3. Pie Chart
**Best for**: Proportions, market share, percentages

**Example**:
```tsx
<ChartDisplay
  chartConfig={{
    type: 'pie',
    title: 'Market Share',
    data: [
      { name: 'Enterprise', value: 45 },
      { name: 'Mid-Market', value: 30 },
      { name: 'SMB', value: 25 },
    ],
    xKey: 'name',
    yKeys: ['value'],
  }}
/>
```

### 4. Area Chart
**Best for**: Volume over time, stacked metrics

**Example**:
```tsx
<ChartDisplay
  chartConfig={{
    type: 'area',
    title: 'Operational Efficiency',
    data: [
      { quarter: 'Q1', efficiency: 65, utilization: 70 },
      { quarter: 'Q2', efficiency: 72, utilization: 75 },
      { quarter: 'Q3', efficiency: 78, utilization: 80 },
    ],
    xKey: 'quarter',
    yKeys: ['efficiency', 'utilization'],
  }}
/>
```

### 5. Scatter Chart
**Best for**: Correlations, clustering, relationships

**Example**:
```tsx
<ChartDisplay
  chartConfig={{
    type: 'scatter',
    title: 'Customer Segmentation',
    data: [
      { recency: 5, frequency: 12 },
      { recency: 15, frequency: 8 },
      { recency: 30, frequency: 5 },
    ],
    xKey: 'recency',
    yKeys: ['frequency'],
  }}
/>
```

### 6. Radar Chart
**Best for**: Multi-dimensional comparisons, scorecards

**Example**:
```tsx
<ChartDisplay
  chartConfig={{
    type: 'radar',
    title: 'Competitive Analysis',
    data: [
      { subject: 'Features', us: 120, competitorA: 110 },
      { subject: 'Price', us: 95, competitorA: 100 },
      { subject: 'Support', us: 140, competitorA: 90 },
    ],
    xKey: 'subject',
    yKeys: ['us', 'competitorA'],
  }}
/>
```

## 🎨 Customization

### Custom Colors

```tsx
<ChartDisplay
  chartConfig={{
    type: 'bar',
    // ...other config
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'],
  }}
/>
```

### Custom Height

```tsx
<ChartDisplay
  chartConfig={config}
  height={600}  // Taller chart
/>
```

### Hide Export Button

```tsx
<ChartDisplay
  chartConfig={config}
  showExport={false}
/>
```

## 📦 Integration with AI Responses

When the AI agent returns chart data:

```tsx
// From backend response
const response = await api.chat({ message: "Show me revenue trends" })

// Extract chart from artifacts
const chartArtifact = response.response.artifacts?.find(a => a.type === 'chart')

if (chartArtifact) {
  // Use ChartDisplay
  <ChartDisplay
    chartConfig={{
      type: chartArtifact.data.type,
      title: chartArtifact.title,
      data: chartArtifact.data.data,
      xKey: chartArtifact.data.xKey,
      yKeys: chartArtifact.data.yKeys || ['value'],
    }}
  />
}
```

## 🎯 Use Cases

### Business Analytics
```tsx
// KPI Dashboard
<ChartDisplay chartConfig={EXAMPLE_CONFIGS.revenue} />
<ChartDisplay chartConfig={EXAMPLE_CONFIGS.growth} />
```

### Market Analysis
```tsx
// Market share and segments
<ChartDisplay chartConfig={EXAMPLE_CONFIGS.marketShare} />
<ChartDisplay chartConfig={EXAMPLE_CONFIGS.customerSegments} />
```

### Competitive Intelligence
```tsx
// Feature comparison
<ChartDisplay chartConfig={EXAMPLE_CONFIGS.competitiveAnalysis} />
```

### Operations
```tsx
// Efficiency tracking
<ChartDisplay chartConfig={EXAMPLE_CONFIGS.efficiency} />
```

## 🔧 Advanced Features

### Multi-Series Data

```tsx
// Multiple lines/bars on same chart
{
  type: 'line',
  yKeys: ['actual', 'forecast', 'target'],  // 3 lines
  colors: ['#3b82f6', '#94a3b8', '#10b981'],
}
```

### Stacked Areas

```tsx
// Areas stack on top of each other
{
  type: 'area',
  yKeys: ['product1', 'product2', 'product3'],
  // Automatically stacked with stackId in component
}
```

### Custom Labels

Pie charts automatically show percentage labels inside slices.

### Responsive Sizing

All charts use `ResponsiveContainer` - they adapt to container width automatically.

## 📱 Responsive Behavior

| Screen Size | Chart Behavior |
|-------------|----------------|
| Mobile | Full width, height adjusts, simplified labels |
| Tablet | 2-column grid possible, full features |
| Desktop | Can be placed in grids, full interactivity |

## ✨ Interactive Features

All charts include:
- ✅ **Hover tooltips** - Show exact values
- ✅ **Legend** - Click to show/hide series
- ✅ **Export** - Download data as CSV
- ✅ **Expand** - View in larger size
- ✅ **Animations** - Smooth transitions
- ✅ **Responsive** - Adapts to container

## 🎨 Color Palettes

### Default
```typescript
['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
// Blue, Purple, Green, Amber, Red, Cyan
```

### Business
```typescript
['#0369a1', '#0891b2', '#0d9488', '#059669', '#16a34a']
// Blue gradient - professional
```

### Vibrant
```typescript
['#ec4899', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981']
// Pink, Amber, Blue, Purple, Green - eye-catching
```

### Monochrome
```typescript
['#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1']
// Slate gradient - minimalist
```

## 📊 Sample Data Structures

### Time Series
```typescript
{
  data: [
    { date: '2024-01', value: 100 },
    { date: '2024-02', value: 150 },
  ],
  xKey: 'date',
  yKeys: ['value']
}
```

### Multi-Metric
```typescript
{
  data: [
    { category: 'A', metric1: 100, metric2: 80, metric3: 90 },
    { category: 'B', metric1: 120, metric2: 95, metric3: 85 },
  ],
  xKey: 'category',
  yKeys: ['metric1', 'metric2', 'metric3']
}
```

### Percentage Breakdown
```typescript
{
  data: [
    { segment: 'North', share: 35 },
    { segment: 'South', share: 25 },
    { segment: 'East', share: 20 },
    { segment: 'West', share: 20 },
  ],
  xKey: 'segment',
  yKeys: ['share']
}
```

## 🚀 Quick Start

```bash
# Install Recharts
npm install recharts

# Import and use
import { ChartDisplay, EXAMPLE_CONFIGS } from '@/components/console/ChartDisplay'

<ChartDisplay chartConfig={EXAMPLE_CONFIGS.revenue} />
```

## ✅ Complete!

The ChartDisplay component is production-ready with:
- 6 chart types
- Export functionality
- Expand/collapse
- Responsive design
- Interactive tooltips
- Custom colors
- Clean styling
- TypeScript support

---

*Use with AI-generated chart data or manual configuration!* 📊

