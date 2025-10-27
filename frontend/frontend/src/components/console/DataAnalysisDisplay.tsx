/**
 * DataAnalysisDisplay Component
 * 
 * Rich display for data analysis results with stats, charts, and recommendations
 */

'use client'

import { FileText, TrendingUp, AlertTriangle, CheckCircle, Database } from 'lucide-react'
import { ChartDisplay } from './ChartDisplay'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface DataAnalysisDisplayProps {
  analysis: any
  onFollowUp?: (question: string) => void
}

export function DataAnalysisDisplay({ analysis, onFollowUp }: DataAnalysisDisplayProps) {
  const dataQuality = 100 - (analysis.profile?.missingDataPercentage || 0)

  return (
    <div className="space-y-6 mt-4">
      {/* File Info Header */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-900">
            📊 Data Analysis: {analysis.fileInfo?.name || 'Uploaded Dataset'}
          </p>
          <p className="text-sm text-slate-600">
            {analysis.profile?.rowCount?.toLocaleString() || 0} rows × {analysis.profile?.columnCount || 0} columns
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Analysis Type</p>
          <p className="text-sm font-medium text-slate-900 capitalize">
            {analysis.metadata?.analysisType || 'Exploratory'}
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Data Quality</span>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {dataQuality.toFixed(0)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Complete data</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Missing Values</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {analysis.profile?.missingDataPercentage?.toFixed(1) || 0}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Needs attention</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Variables</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {analysis.profile?.columns?.length || 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">Data columns</p>
        </div>
      </div>

      {/* AI Insights */}
      {analysis.analysis?.content && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Key Insights</h4>
          </div>
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {analysis.analysis.content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Visualizations */}
      {analysis.analysis?.visualizations && analysis.analysis.visualizations.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            Recommended Visualizations
          </h4>
          <div className="grid gap-4">
            {analysis.analysis.visualizations.map((chart: any, index: number) => (
              <ChartDisplay 
                key={index} 
                chartConfig={{
                  type: chart.type || 'bar',
                  title: chart.title,
                  data: chart.data || [],
                  xKey: chart.xAxis,
                  yKeys: chart.series || [chart.yAxis] || ['value'],
                  description: chart.insight,
                  colors: chart.config?.colors,
                }}
                height={350}
              />
            ))}
          </div>
        </div>
      )}

      {/* Column Details */}
      {analysis.profile?.columns && analysis.profile.columns.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Column Analysis
          </h4>
          <div className="space-y-3">
            {analysis.profile.columns.slice(0, 8).map((col: any, idx: number) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{col.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-slate-600">
                      Type: <span className="font-medium">{col.type}</span>
                    </span>
                    <span className="text-sm text-slate-600">
                      Unique: <span className="font-medium">{col.uniqueCount?.toLocaleString()}</span>
                    </span>
                    {col.statistics && (
                      <span className="text-sm text-slate-600">
                        Range: <span className="font-medium">{col.statistics.min} - {col.statistics.max}</span>
                      </span>
                    )}
                  </div>
                </div>
                {col.nullCount > 0 && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    {col.nullCount} missing
                  </span>
                )}
                {col.nullCount === 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    ✓ Complete
                  </span>
                )}
              </div>
            ))}
            {analysis.profile.columns.length > 8 && (
              <p className="text-sm text-slate-500 text-center pt-2">
                +{analysis.profile.columns.length - 8} more columns
              </p>
            )}
          </div>
        </div>
      )}

      {/* Follow-up Questions */}
      {onFollowUp && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-lg p-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            💡 Explore further with these questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Show correlation between variables',
              'Identify outliers in the data',
              'Perform statistical significance tests',
              'Create advanced visualizations',
              'Generate executive summary',
              'Predict future trends',
            ].map((question, i) => (
              <button
                key={i}
                onClick={() => onFollowUp(question)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Import at top
import { BarChart3 } from 'lucide-react'

