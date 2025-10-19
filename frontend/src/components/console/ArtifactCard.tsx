/**
 * ArtifactCard Component
 * 
 * Displays different types of artifacts (frameworks, charts, tables, decks)
 * with preview and export capabilities.
 */

'use client'

import { useState } from 'react'
import { 
  FileText, 
  BarChart3, 
  Table as TableIcon, 
  FileSpreadsheet,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { Artifact } from '@/types/message.types'
import { FrameworkView } from './FrameworkView'
import { ChartView } from './ChartView'
import { TableView } from './TableView'
import { cn } from '@/lib/utils'

interface ArtifactCardProps {
  artifact: Artifact
}

const ARTIFACT_ICONS = {
  framework: FileText,
  chart: BarChart3,
  table: TableIcon,
  deck: FileText,
  excel: FileSpreadsheet,
  markdown: FileText,
}

const ARTIFACT_COLORS = {
  framework: 'bg-blue-100 text-blue-600',
  chart: 'bg-green-100 text-green-600',
  table: 'bg-purple-100 text-purple-600',
  deck: 'bg-orange-100 text-orange-600',
  excel: 'bg-emerald-100 text-emerald-600',
  markdown: 'bg-slate-100 text-slate-600',
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  const [expanded, setExpanded] = useState(false)

  const Icon = ARTIFACT_ICONS[artifact.type] || FileText
  const colorClass = ARTIFACT_COLORS[artifact.type] || 'bg-slate-100 text-slate-600'

  const handleExport = async () => {
    // TODO: Implement export based on artifact type
    console.log('Exporting artifact:', artifact)
    
    // For now, download as JSON
    const blob = new Blob([JSON.stringify(artifact.data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${artifact.title.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden hover:border-primary-300 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-slate-900">{artifact.title}</h4>
            <p className="text-sm text-slate-600 capitalize">{artifact.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {artifact.exportable && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <Minimize2 className="w-4 h-4 text-slate-600" />
            ) : (
              <Maximize2 className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={cn('p-4', expanded ? '' : 'max-h-64 overflow-hidden')}>
        {artifact.type === 'framework' && <FrameworkView data={artifact.data} />}
        {artifact.type === 'chart' && <ChartView data={artifact.data} />}
        {artifact.type === 'table' && <TableView data={artifact.data} />}
        {artifact.type === 'deck' && <DeckView data={artifact.data} />}
        {artifact.type === 'excel' && <TableView data={artifact.data} />}
        {artifact.type === 'markdown' && (
          <div className="prose prose-sm max-w-none">
            {artifact.data}
          </div>
        )}
      </div>

      {!expanded && (
        <div className="px-4 pb-3">
          <button
            onClick={() => setExpanded(true)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Show more →
          </button>
        </div>
      )}
    </div>
  )
}

// Deck preview component
function DeckView({ data }: { data: any }) {
  const slides = data.slides || []
  
  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-600 mb-3">
        {slides.length} slides
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {slides.slice(0, 6).map((slide: any, idx: number) => (
          <div
            key={idx}
            className="aspect-video bg-slate-100 rounded-lg p-3 border border-slate-200 hover:border-primary-300 transition-colors cursor-pointer"
          >
            <div className="text-xs font-medium text-slate-700 mb-1">
              {idx + 1}. {slide.title}
            </div>
            <div className="text-xs text-slate-500 line-clamp-2">
              {slide.content}
            </div>
          </div>
        ))}
      </div>
      {slides.length > 6 && (
        <div className="text-sm text-slate-500 text-center pt-2">
          +{slides.length - 6} more slides
        </div>
      )}
    </div>
  )
}

