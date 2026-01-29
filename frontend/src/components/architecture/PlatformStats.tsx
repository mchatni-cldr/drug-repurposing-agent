import React from 'react'

interface PlatformStatsProps {
  phase: number
}

export function PlatformStats({ phase }: PlatformStatsProps) {
  return (
    <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto mt-12">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 text-center">
        <div className="text-3xl font-bold text-blue-400 mb-1">
          {phase >= 1 ? '35M+' : '—'}
        </div>
        <div className="text-xs text-gray-400">Papers Ingested</div>
        {phase >= 1 && (
          <div className="mt-2 text-[10px] text-blue-300/60">via NiFi</div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 text-center">
        <div className="text-3xl font-bold text-emerald-400 mb-1">
          {phase >= 1 ? '500K' : '—'}
        </div>
        <div className="text-xs text-gray-400">Genomes Analyzed</div>
        {phase >= 1 && (
          <div className="mt-2 text-[10px] text-emerald-300/60">Cloudera AI</div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 text-center">
        <div className="text-3xl font-bold text-purple-400 mb-1">
          {phase >= 2 ? '10,247' : '0'}
        </div>
        <div className="text-xs text-gray-400">Graph Entities</div>
        {phase >= 2 && (
          <div className="mt-2 text-[10px] text-purple-300/60">All via NiFi</div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 text-center">
        <div className="text-3xl font-bold text-cyan-400 mb-1">
          {phase >= 2 ? '45,893' : '0'}
        </div>
        <div className="text-xs text-gray-400">Relationships</div>
        {phase >= 2 && (
          <div className="mt-2 text-[10px] text-cyan-300/60">Cross-domain</div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 text-center">
        <div className="text-3xl font-bold text-amber-400 mb-1">
          {phase >= 3 ? 'hours' : '—'}
        </div>
        <div className="text-xs text-gray-400">Discovery Time</div>
        {phase >= 3 && (
          <div className="mt-2 text-[10px] text-amber-300/60">vs 2 years</div>
        )}
      </div>
    </div>
  )
}