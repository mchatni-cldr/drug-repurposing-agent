import React, { useState } from 'react'

interface Triplet {
  subject: string
  subject_type: string
  predicate: string
  object: string
  object_type: string
  confidence: number
  source_sentence: string
}

interface UploadResult {
  success: boolean
  filename: string
  content: string
  triplets?: Triplet[]
  triplet_count?: number
  error?: string
}

export function PublicationUpload() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-publication', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        filename: file.name,
        content: '',
        error: error instanceof Error ? error.message : 'Upload failed'
      })
    } finally {
      setUploading(false)
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      drug: 'bg-blue-100 text-blue-800',
      protein: 'bg-green-100 text-green-800',
      disease: 'bg-orange-100 text-orange-800',
      pathway: 'bg-purple-100 text-purple-800',
      biomarker: 'bg-pink-100 text-pink-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">📄 Upload Publication</h2>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select a scientific publication (TXT or PDF)
        </label>
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
        />
      </div>

      {uploading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Extracting knowledge with Claude AI...</span>
        </div>
      )}

      {result && result.success && (
        <div className="mt-4 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✓ Successfully processed: {result.filename}
            </p>
            <p className="text-green-700 text-sm mt-1">
              Extracted {result.triplet_count} knowledge triplets
            </p>
          </div>

          {/* Extracted Triplets */}
          {result.triplets && result.triplets.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-gray-700">
                🧠 Extracted Knowledge Triplets:
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.triplets.map((triplet, index) => (
                  <div key={index} className="border-l-4 border-purple-400 bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(triplet.subject_type)}`}>
                        {triplet.subject}
                      </span>
                      <span className="text-gray-600 text-sm font-mono">
                        {triplet.predicate}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(triplet.object_type)}`}>
                        {triplet.object}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        {(triplet.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic">
                      "{triplet.source_sentence.substring(0, 150)}{triplet.source_sentence.length > 150 ? '...' : ''}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Preview */}
          <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer text-gray-700">
              View Original Text ({result.content.length} characters)
            </summary>
            <div className="mt-2 text-sm text-gray-600 max-h-60 overflow-y-auto whitespace-pre-wrap font-mono">
              {result.content}
            </div>
          </details>
        </div>
      )}

      {result && !result.success && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">
            ❌ Error: {result.error}
          </p>
        </div>
      )}
    </div>
  )
}