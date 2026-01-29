import React from 'react'

interface DiscoveryResultProps {
  result: {
    drug: string
    disease: string
    hypothesis: string
    key_insight: string
    mechanism_summary: string
    clinical_significance?: string
    top_path: {
      node_ids: string[]
      edges: string[]
      confidence: number
      path_length: number
      hidden_connections: number
      mechanism: string
    }
    scores: {
      overall_score: number
    }
    knowledge_fragmentation?: string
    next_steps?: string[]
  }
  onClose: () => void
}

export function DiscoveryResult({ result, onClose }: DiscoveryResultProps) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Discovery Results</h2>
          <p className="text-gray-600">
            {result.drug} → {result.disease}
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ✕ Close
        </button>
      </div>

      <div className="space-y-6">
        {/* Hypothesis */}
        <div className="p-4 bg-orange-50 border-l-4 border-cloudera-orange rounded-r-lg">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Hypothesis</h3>
          <p className="text-gray-700">{result.hypothesis}</p>
        </div>

        {/* Key Insight */}
        <div className="p-4 bg-blue-50 border-l-4 border-cloudera-blue rounded-r-lg">
          <h3 className="font-semibold text-gray-800 mb-2">🔍 Key Insight</h3>
          <p className="text-gray-700">{result.key_insight}</p>
        </div>

        {/* Mechanism */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">🧬 Mechanism</h3>
          <p className="text-gray-700">{result.mechanism_summary}</p>
        </div>

        {/* Clinical Significance */}
        {result.clinical_significance && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <h3 className="font-semibold text-gray-800 mb-2">🏥 Clinical Significance</h3>
            <p className="text-gray-700">{result.clinical_significance}</p>
          </div>
        )}

        {/* Knowledge Fragmentation */}
        {result.knowledge_fragmentation && (
          <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
            <h3 className="font-semibold text-gray-800 mb-2">🔗 Knowledge Fragmentation Analysis</h3>
            <p className="text-gray-700">{result.knowledge_fragmentation}</p>
          </div>
        )}

        {/* Path Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="text-2xl font-bold text-cloudera-orange">{result.top_path.path_length}</div>
            <div className="text-sm text-gray-600 mt-1">Path Length</div>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="text-2xl font-bold text-cloudera-blue">{result.top_path.hidden_connections}</div>
            <div className="text-sm text-gray-600 mt-1">Hidden Links</div>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{(result.top_path.confidence * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-600 mt-1">Confidence</div>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{(result.scores.overall_score * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-600 mt-1">Overall Score</div>
          </div>
        </div>

        {/* Next Steps */}
        {result.next_steps && result.next_steps.length > 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Recommended Next Steps</h3>
            <ul className="space-y-2">
              {result.next_steps.map((step, idx) => (
                <li key={idx} className="flex gap-2 text-gray-700">
                  <span className="text-cloudera-orange font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong className="font-semibold">Note:</strong> These results are AI-generated hypotheses 
          based on knowledge graph analysis. Clinical validation is required before any therapeutic application.
        </p>
      </div>
    </div>
  )
}