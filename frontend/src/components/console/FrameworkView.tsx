/**
 * FrameworkView Component
 * 
 * Displays strategic frameworks in a structured, collapsible format
 */

'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FrameworkViewProps {
  data: any
}

export function FrameworkView({ data }: FrameworkViewProps) {
  // Handle different data structures
  if (data.personas) {
    return <PersonasView personas={data.personas} />
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    return <StructuredFrameworkView data={data} />
  }

  return (
    <div className="prose prose-sm max-w-none">
      <pre className="bg-slate-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

// Structured framework view (key-value pairs)
function StructuredFrameworkView({ data }: { data: Record<string, any> }) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (key: string) => {
    const newSet = new Set(expandedSections)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setExpandedSections(newSet)
  }

  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => {
        const isExpanded = expandedSections.has(key)
        const isComplex = typeof value === 'object' && value !== null

        return (
          <div key={key} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => isComplex && toggleSection(key)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                {isComplex && (
                  isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )
                )}
                <span className="font-medium text-slate-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </div>
            </button>

            {(!isComplex || isExpanded) && (
              <div className="p-4 bg-white">
                {typeof value === 'string' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {value}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Personas view (for user personas)
function PersonasView({ personas }: { personas: any[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {personas.map((persona, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-gradient-to-br from-white to-slate-50">
          <h4 className="font-semibold text-slate-900 mb-3">{persona.name}</h4>
          
          {persona.role && (
            <div className="text-sm text-slate-600 mb-3">{persona.role}</div>
          )}

          {persona.goals && (
            <div className="mb-3">
              <div className="text-xs font-medium text-slate-700 mb-1">Goals</div>
              <ul className="text-sm text-slate-600 space-y-1">
                {persona.goals.map((goal: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {persona.painPoints && (
            <div className="mb-3">
              <div className="text-xs font-medium text-slate-700 mb-1">Pain Points</div>
              <ul className="text-sm text-slate-600 space-y-1">
                {persona.painPoints.map((pain: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>{pain}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {persona.behaviors && (
            <div>
              <div className="text-xs font-medium text-slate-700 mb-1">Behaviors</div>
              <div className="flex flex-wrap gap-1">
                {persona.behaviors.map((behavior: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full"
                  >
                    {behavior}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

