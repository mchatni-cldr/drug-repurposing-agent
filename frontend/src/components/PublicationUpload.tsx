import React, { useState } from 'react'

interface UploadResult {
  success: boolean
  filename: string
  content: string
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
          <span className="ml-3 text-gray-600">Uploading and processing...</span>
        </div>
      )}

      {result && result.success && (
        <div className="mt-4 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✓ Successfully uploaded: {result.filename}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-700">Content Preview:</h3>
            <div className="text-sm text-gray-600 max-h-60 overflow-y-auto whitespace-pre-wrap font-mono">
              {result.content.substring(0, 500)}
              {result.content.length > 500 && '...'}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {result.content.length} characters
            </p>
          </div>
        </div>
      )}

      {result && !result.success && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">
            ❌ Upload failed: {result.error}
          </p>
        </div>
      )}
    </div>
  )
}