/**
 * DeckGeneratorModal Component
 * 
 * Modal for generating PowerPoint presentations from AI content
 */

'use client'

import { useState } from 'react'
import { Presentation, Download, Loader2, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

interface DeckGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  initialContent?: string
  initialTitle?: string
}

interface Template {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

const TEMPLATES: Template[] = [
  { 
    id: 'strategy', 
    name: 'Strategy & GTM', 
    description: 'Blue theme, business-focused',
    color: 'from-blue-600 to-indigo-600',
    icon: '📊'
  },
  { 
    id: 'fundraising', 
    name: 'Fundraising Pitch', 
    description: 'Purple theme, investor-focused',
    color: 'from-purple-600 to-pink-600',
    icon: '💰'
  },
  { 
    id: 'product', 
    name: 'Product Roadmap', 
    description: 'Green theme, product-focused',
    color: 'from-green-600 to-emerald-600',
    icon: '🚀'
  },
]

export function DeckGeneratorModal({ 
  isOpen, 
  onClose, 
  initialContent = '',
  initialTitle = 'Strategy Presentation'
}: DeckGeneratorModalProps) {
  const [title, setTitle] = useState(initialTitle)
  const [template, setTemplate] = useState('strategy')
  const [content, setContent] = useState(initialContent)
  const [isGenerating, setIsGenerating] = useState(false)

  const slideCount = content.split(/^##\s+/m).filter(s => s.trim()).length || 1

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast.error('Please provide content for the presentation')
      return
    }

    if (!title.trim()) {
      toast.error('Please provide a title')
      return
    }

    setIsGenerating(true)

    try {
      // Call backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate-deck`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getAccessToken()}`, // TODO: Implement
          },
          body: JSON.stringify({
            title,
            template,
            content,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate presentation')
      }

      const result = await response.json()

      toast.success('✅ Presentation generated successfully!')

      // Auto-download
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank')
      }

      // Close modal
      setTimeout(() => {
        onClose()
        setIsGenerating(false)
      }, 1000)

    } catch (error: any) {
      console.error('Generate deck error:', error)
      toast.error(error.message || 'Failed to generate presentation')
      setIsGenerating(false)
    }
  }

  // Placeholder for token retrieval
  async function getAccessToken(): Promise<string> {
    // TODO: Get from auth store
    return 'mock-token'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Generate PowerPoint Presentation
              </h2>
              <p className="text-sm text-slate-600">
                Create a professional deck from your AI insights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Presentation Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., GTM Strategy for SaaS Product"
              disabled={isGenerating}
            />
          </div>

          {/* Template Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Template
            </label>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => setTemplate(tmpl.id)}
                  disabled={isGenerating}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    template === tmpl.id
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">{tmpl.icon}</div>
                  <p className="font-medium text-sm text-slate-900 mb-1">
                    {tmpl.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    {tmpl.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content <span className="text-slate-500">(use ## for new slides)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isGenerating}
              className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#33A7B5]-500 focus:border-transparent disabled:bg-slate-50"
              placeholder="## Executive Summary

- Key point 1
- Key point 2
- Key point 3

## Market Analysis

- Total addressable market: $5B
- Growing at 15% CAGR
- Competitive landscape

## Next Steps

..."
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-500">
                💡 Tip: Start each slide with <code className="px-1 py-0.5 bg-slate-100 rounded">##</code> followed by the title. Use <code className="px-1 py-0.5 bg-slate-100 rounded">-</code> for bullet points.
              </p>
              <p className="text-xs text-slate-600 font-medium">
                {content.length} characters
              </p>
            </div>
          </div>

          {/* Preview Info */}
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Preview: {slideCount + 1} slides total
              </p>
              <p className="text-sm text-blue-700 mt-1">
                • 1 title slide
                {slideCount > 0 && ` • ${slideCount} content slide${slideCount !== 1 ? 's' : ''}`}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Template: {TEMPLATES.find(t => t.id === template)?.name}
              </p>
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-900">
                  Generating presentation...
                </p>
                <p className="text-xs text-purple-700">
                  Creating {slideCount + 1} slides with {TEMPLATES.find(t => t.id === template)?.name} template
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !content.trim() || !title.trim()}
            loading={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Deck
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

