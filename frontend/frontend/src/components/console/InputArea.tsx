/**
 * InputArea Component
 * 
 * Message input with send button, file upload, and keyboard shortcuts
 */

'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Paperclip, Loader2, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DataUploadModal } from './DataUploadModal'

interface InputAreaProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
  onFileUpload?: (file: File) => void
  onDataAnalysisComplete?: (analysis: any) => void
  disabled?: boolean
  placeholder?: string
}

export function InputArea({
  value,
  onChange,
  onSend,
  onFileUpload,
  onDataAnalysisComplete,
  disabled = false,
  placeholder = 'Ask me anything about your business strategy...',
}: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    
    // Auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Send message
  const handleSend = () => {
    if (!value.trim() || disabled) return
    
    onSend(value.trim())
    onChange('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onFileUpload) return

    setIsUploading(true)
    try {
      await onFileUpload(file)
    } catch (error) {
      console.error('File upload error:', error)
    } finally {
      setIsUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleAnalysisComplete = (analysis: any) => {
    setShowDataModal(false)
    if (onDataAnalysisComplete) {
      onDataAnalysisComplete(analysis)
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-2">
          {/* Data upload button */}
          {onDataAnalysisComplete && (
            <button
              type="button"
              onClick={() => setShowDataModal(true)}
              disabled={disabled}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-slate-100',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              title="Upload data for analysis"
            >
              <Database className="w-5 h-5 text-slate-600" />
            </button>
          )}

          {/* File upload button */}
          {onFileUpload && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.csv"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  'hover:bg-slate-100',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                title="Attach file"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
                ) : (
                  <Paperclip className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </>
          )}

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={placeholder}
              rows={1}
              className={cn(
                'w-full resize-none rounded-lg border border-slate-300 px-4 py-3 pr-12',
                'focus:outline-none focus:ring-2 focus:ring-[#33A7B5]-500 focus:border-transparent',
                'disabled:bg-slate-50 disabled:cursor-not-allowed',
                'placeholder:text-slate-400'
              )}
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />

            {/* Character count (optional) */}
            {value.length > 0 && (
              <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                {value.length}
              </div>
            )}
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className={cn(
              'p-3 rounded-lg transition-all',
              'bg-primary-600 hover:bg-primary-700',
              'disabled:bg-slate-300 disabled:cursor-not-allowed',
              'text-white'
            )}
            title="Send message (Enter)"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Hint text */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {onDataAnalysisComplete && (
              <span className="text-blue-600">• Click <Database className="inline w-3 h-3" /> to analyze data</span>
            )}
          </div>
          {disabled && <span className="text-amber-600">⏳ Processing...</span>}
        </div>
      </div>

      {/* Data upload modal */}
      {onDataAnalysisComplete && (
        <DataUploadModal
          isOpen={showDataModal}
          onClose={() => setShowDataModal(false)}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
    </div>
  )
}

