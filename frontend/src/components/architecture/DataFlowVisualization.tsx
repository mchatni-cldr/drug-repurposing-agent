import React from 'react'

interface DataFlowVisualizationProps {
  phase: number
}

export function DataFlowVisualization({ phase }: DataFlowVisualizationProps) {
  return (
    <div className="relative h-24 max-w-[1400px] mx-auto mb-8">
      {/* Stream 1: Extracted Knowledge (Blue) */}
      <div className="absolute top-6 left-0 right-0 flex items-center">
        <div className={`
          h-1 flex-1 bg-gradient-to-r from-blue-400 via-blue-400/50 to-transparent
          transition-all duration-1000
          ${phase >= 1 ? 'opacity-100' : 'opacity-20'}
        `}>
          {phase >= 2 && (
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 w-4 h-1 bg-blue-400 rounded-full animate-flow" />
            </div>
          )}
        </div>
        <div className={`
          text-xs px-4 py-1 rounded-full transition-all duration-500
          ${phase >= 1 ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-white/5 text-gray-600'}
        `}>
          Extracted from sources
        </div>
      </div>

      {/* Stream 2: Computed Knowledge (Green) */}
      <div className="absolute top-14 left-0 right-0 flex items-center">
        <div className={`
          h-1 flex-1 bg-gradient-to-r from-emerald-400 via-emerald-400/50 to-transparent
          transition-all duration-1000
          ${phase >= 2 ? 'opacity-100' : 'opacity-20'}
        `}>
          {phase >= 3 && (
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 w-4 h-1 bg-emerald-400 rounded-full animate-flow" />
            </div>
          )}
        </div>
        <div className={`
          text-xs px-4 py-1 rounded-full transition-all duration-500
          ${phase >= 2 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-white/5 text-gray-600'}
        `}>
          Computed via GWAS/PheWAS
        </div>
      </div>

      {/* Merge Point */}
      {phase >= 3 && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-fadeIn">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-emerald-400 animate-pulse shadow-lg shadow-purple-500/50" />
        </div>
      )}
    </div>
  )
}