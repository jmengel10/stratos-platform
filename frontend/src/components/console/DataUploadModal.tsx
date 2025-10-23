/**
 * DataUploadModal Component
 * 
 * File upload with drag-and-drop, preview, and AI analysis
 */

'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileText, 
  X, 
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface DataUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onAnalysisComplete?: (result: any) => void
}

type AnalysisType = 'exploratory' | 'statistical' | 'visualization' | 'insights'

export function DataUploadModal({ 
  isOpen, 
  onClose, 
  onAnalysisComplete 
}: DataUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[] | null>(null)
  const [analysisType, setAnalysisType] = useState<AnalysisType>('exploratory')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setSelectedFile(file)
    setError(null)

    // Generate preview for CSV/JSON
    try {
      const text = await file.text()
      
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        // Simple CSV parsing
        const lines = text.split('\n').filter(line => line.trim())
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
        
        const parsed = lines.slice(1, 11).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
          const row: any = {}
          headers.forEach((header, idx) => {
            row[header] = values[idx] || ''
          })
          return row
        })
        
        setPreview(parsed)
      } else if (file.type === 'application/json') {
        const parsed = JSON.parse(text)
        setPreview(Array.isArray(parsed) ? parsed.slice(0, 10) : [parsed])
      }
    } catch (err) {
      console.error('Preview error:', err)
      setPreview(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
    },
    maxSize: 10485760, // 10MB
    maxFiles: 1,
  })

  // Handle analyze
  const handleAnalyze = async () => {
    if (!selectedFile) return

    setError(null)
    
    try {
      // Step 1: Upload file
      setIsUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', selectedFile.name)
      formData.append('documentType', 'data-analysis')

      // Simulate progress (in production, use actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${await getAccessToken()}`, // TODO: Implement
          },
        }
      )

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const uploadData = await uploadResponse.json()
      setIsUploading(false)

      // Step 2: Analyze data
      setIsAnalyzing(true)

      const analysisResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/analyze-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getAccessToken()}`,
          },
          body: JSON.stringify({
            fileId: uploadData.documentId,
            analysisType,
          }),
        }
      )

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed')
      }

      const analysisData = await analysisResponse.json()
      setIsAnalyzing(false)

      // Success!
      toast.success('Analysis complete!')
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisData)
      }

      // Close modal
      handleClose()

    } catch (err: any) {
      console.error('Analysis error:', err)
      setError(err.message || 'Something went wrong')
      setIsUploading(false)
      setIsAnalyzing(false)
      toast.error('Analysis failed')
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    setUploadProgress(0)
    setIsUploading(false)
    setIsAnalyzing(false)
    onClose()
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
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Upload Data for Analysis
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Upload CSV, Excel, or JSON files for AI-powered insights
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading || isAnalyzing}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!selectedFile ? (
            // Dropzone
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              {isDragActive ? (
                <p className="text-lg text-primary-600 font-medium">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-lg text-slate-700 font-medium mb-2">
                    Drag & drop a data file here
                  </p>
                  <p className="text-sm text-slate-500 mb-4">or click to browse</p>
                  <p className="text-xs text-slate-400">
                    Supports: CSV, Excel (.xlsx, .xls), JSON • Max 10MB
                  </p>
                </>
              )}
            </div>
          ) : (
            // File selected view
            <div className="space-y-4">
              {/* File info */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <FileText className="w-10 h-10 text-primary-600" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-700 p-1"
                  disabled={isUploading || isAnalyzing}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Data preview */}
              {preview && preview.length > 0 && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-700">Data Preview</p>
                  </div>
                  <div className="overflow-x-auto max-h-64">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          {Object.keys(preview[0]).map(key => (
                            <th key={key} className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {preview.slice(0, 5).map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            {Object.values(row).map((val: any, j) => (
                              <td key={j} className="px-4 py-2 text-slate-600">
                                {String(val).substring(0, 50)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-xs text-slate-500">
                    Showing 5 of {preview.length}+ rows
                  </div>
                </div>
              )}

              {/* Analysis type selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Analysis Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      id: 'exploratory' as AnalysisType, 
                      name: 'Exploratory Analysis', 
                      desc: 'Comprehensive overview',
                      icon: '🔍'
                    },
                    { 
                      id: 'statistical' as AnalysisType, 
                      name: 'Statistical Summary', 
                      desc: 'Detailed statistics',
                      icon: '📈'
                    },
                    { 
                      id: 'visualization' as AnalysisType, 
                      name: 'Chart Suggestions', 
                      desc: 'Best visualizations',
                      icon: '📊'
                    },
                    { 
                      id: 'insights' as AnalysisType, 
                      name: 'Business Insights', 
                      desc: 'Actionable recommendations',
                      icon: '💡'
                    },
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setAnalysisType(type.id)}
                      disabled={isUploading || isAnalyzing}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        analysisType === type.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-medium text-sm text-slate-900">
                          {type.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload progress */}
              {isUploading && (
                <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between text-sm text-blue-900">
                    <span className="font-medium">Uploading file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Analysis progress */}
              {isAnalyzing && (
                <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <Loader2 className="w-5 h-5 text-primary-600 animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary-900">
                      Analyzing data with AI...
                    </p>
                    <p className="text-xs text-primary-700">
                      This may take 10-30 seconds depending on data size
                    </p>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading || isAnalyzing}
          >
            Cancel
          </Button>
          {selectedFile && (
            <Button
              onClick={handleAnalyze}
              disabled={isUploading || isAnalyzing}
              loading={isUploading || isAnalyzing}
            >
              {isUploading ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

