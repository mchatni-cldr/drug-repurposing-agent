import React from 'react'

interface DiscoveryResultProps {
  result: {
    drug: string
    disease: string
    hypothesis: string
    key_insight: string
    mechanism_summary: string
    clinical_significance?: string
    mechanism_explanation?: string
    confidence_assessment?: string
    hidden_knowledge_insight?: string
    safety_rationale?: string
    key_risks?: string
    next_steps?: string[]
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-start p-8 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            Discovery Result
          </h2>
          <p className="text-lg">
            <span className="text-cyan-400 font-medium">{result.drug}</span>
            <span className="text-gray-400 mx-2">→</span>
            <span className="text-blue-400 font-medium">{result.disease}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl transition-colors"
        >
          ×
        </button>
      </div>

      <div className="p-8 space-y-8">
        {/* Hypothesis */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Hypothesis</h3>
          <p className="text-white text-lg leading-relaxed">{result.hypothesis}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-5 text-center border border-blue-400/20">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {result.top_path.path_length}
            </div>
            <div className="text-sm text-blue-200">pathway hops</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-2xl p-5 text-center border border-cyan-400/20">
            <div className="text-3xl font-bold text-cyan-400 mb-1">
              {(result.top_path.confidence * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-cyan-200">confidence</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl p-5 text-center border border-purple-400/20">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {result.top_path.hidden_connections}
            </div>
            <div className="text-sm text-purple-200">hidden links</div>
          </div>
        </div>

        {/* Clinical Significance */}
        {result.clinical_significance && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Clinical Significance</h3>
            <p className="text-gray-200 leading-relaxed">{result.clinical_significance}</p>
          </div>
        )}

        {/* Mechanism */}
        {result.mechanism_explanation && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Mechanism of Action</h3>
            <p className="text-gray-200 leading-relaxed">{result.mechanism_explanation}</p>
          </div>
        )}

        {/* Safety */}
        {result.safety_rationale && (
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-6 border border-emerald-400/20">
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wide mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Safety Profile
            </h3>
            <p className="text-emerald-100 leading-relaxed">{result.safety_rationale}</p>
          </div>
        )}

        {/* Hidden Knowledge */}
        {result.hidden_knowledge_insight && (
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl p-6 border border-purple-400/20">
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-3">Cross-Domain Discovery</h3>
            <p className="text-purple-100 leading-relaxed">{result.hidden_knowledge_insight}</p>
          </div>
        )}

        {/* Confidence */}
        {result.confidence_assessment && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Confidence Assessment</h3>
            <p className="text-gray-200 leading-relaxed">{result.confidence_assessment}</p>
          </div>
        )}

        {/* Risks */}
        {result.key_risks && (
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-2xl p-6 border border-amber-400/20">
            <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wide mb-3">Key Considerations</h3>
            <p className="text-amber-100 leading-relaxed">{result.key_risks}</p>
          </div>
        )}

        {/* Next Steps */}
        {result.next_steps && result.next_steps.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">Recommended Actions</h3>
            <ol className="space-y-3">
              {result.next_steps.map((step: string, index: number) => (
                <li key={index} className="flex gap-4 text-gray-200">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 flex items-center justify-center text-sm font-semibold border border-cyan-400/30">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Detailed Path */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors list-none flex items-center gap-2 uppercase tracking-wide">
            <span className="transform group-open:rotate-90 transition-transform text-cyan-400">▶</span>
            View Detailed Pathway
          </summary>
          <div className="mt-4 p-5 bg-black/20 rounded-2xl border border-white/10 text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
            {result.top_path.mechanism}
          </div>
        </details>

        {/* Opportunity Score */}
        <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-400/20">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-200 uppercase tracking-wide">
              Repurposing Opportunity Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {(result.scores.overall_score * 100).toFixed(0)}
              </span>
              <span className="text-lg text-gray-400">/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}