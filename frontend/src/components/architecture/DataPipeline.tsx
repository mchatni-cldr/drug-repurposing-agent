import React from 'react'

interface StageProps {
  active: boolean
}

export function DataPipeline({ active }: StageProps) {
  return (
    <div className={`
      bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6
      transition-all duration-500
      ${active ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20 scale-105' : 'opacity-60'}
    `}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Data Pipeline</h3>
        <p className="text-xs text-gray-400">Harmonization Layer</p>
      </div>

      <div className="space-y-3">
        {/* Path A: Structured Data */}
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-medium text-white">NiFi (Direct)</span>
          </div>
          <div className="text-xs text-gray-300 space-y-1 ml-7">
            <div>• Structured data</div>
            <div>• Real-time ingestion</div>
            <div className={active ? 'text-cyan-400 animate-pulse' : ''}>
              → Ontology-aligned
            </div>
          </div>
        </div>

        {/* Path B: Messy Data */}
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-medium text-white">CDE (Transform)</span>
          </div>
          <div className="text-xs text-gray-300 space-y-1 ml-7">
            <div>• Unstructured data</div>
            <div>• NLP extraction (Claude)</div>
            <div>• Spark processing</div>
            <div className={active ? 'text-cyan-400 animate-pulse' : ''}>
              → Iceberg staging
            </div>
          </div>
        </div>
      </div>

      {active && (
        <div className="mt-4 text-xs text-cyan-400 animate-fadeIn text-center">
          → Unified ontology
        </div>
      )}
    </div>
  )
}