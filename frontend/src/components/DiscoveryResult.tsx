import React from 'react'

interface DiscoveryResultProps {
  result: {
    drug: string
    disease: string
    hypothesis: string
    key_insight: string
    mechanism_summary: string
    top_path: {
      confidence: number
      path_length: number
      hidden_connections: number
      mechanism: string
    }
    scores: {
      overall_score: number
    }
  }
  onClose: () => void
}

export function DiscoveryResult({ result, onClose }: DiscoveryResultProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-purple-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-700 mb-2">
            🎯 Discovery Result
          </h2>
          <p className="text-lg text-gray-700">
            <span className="font-semibold text-blue-600">{result.drug}</span>
            {' → '}
            <span className="font-semibold text-red-600">{result.disease}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Key Insight */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p className="text-purple-900 font-medium">
          💡 {result.key_insight}
        </p>
      </div>

      {/* Hypothesis */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Hypothesis:</h3>
        <p className="text-gray-600">{result.hypothesis}</p>
      </div>

      {/* Pathway Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {result.top_path.path_length}
          </div>
          <div className="text-xs text-blue-800">hops</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {(result.top_path.confidence * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-green-800">confidence</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {result.top_path.hidden_connections}
          </div>
          <div className="text-xs text-purple-800">hidden links</div>
        </div>
      </div>

      {/* Mechanism Summary */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Mechanism:</h3>
        <p className="text-sm text-gray-600">{result.mechanism_summary}</p>
      </div>

      {/* Detailed Path */}
      <details className="mb-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-purple-600">
          View Detailed Pathway →
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono whitespace-pre-wrap">
          {result.top_path.mechanism}
        </div>
      </details>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">
            Repurposing Opportunity Score:
          </span>
          <span className="text-2xl font-bold text-purple-600">
            {(result.scores.overall_score * 100).toFixed(0)}/100
          </span>
        </div>
      </div>
    </div>
  )
}