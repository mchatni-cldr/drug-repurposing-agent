import React from 'react'

interface StageProps {
  active: boolean
}

const SOURCES = [
  { name: 'PubMed', icon: '📚', detail: '35M papers' },
  { name: 'ClinicalTrials.gov', icon: '🏥', detail: '400K trials' },
  { name: 'Internal R&D', icon: '💊', detail: 'Proprietary' },
  { name: 'DrugBank', icon: '🧬', detail: '14K drugs' },
  { name: 'Lab Notebooks', icon: '🔬', detail: 'Unstructured' }
]

export function DataSources({ active }: StageProps) {
  return (
    <div className={`
      bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 
      transition-all duration-500
      ${active ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-400/20 scale-105' : 'opacity-60'}
    `}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Data Sources</h3>
        <p className="text-xs text-gray-400">Fragmented Knowledge</p>
      </div>
      
      <div className="space-y-2">
        {SOURCES.map((source, i) => (
          <div 
            key={source.name}
            className={`
              bg-white/10 rounded-lg p-3 text-sm
              transition-all duration-300
              ${active ? 'animate-pulse' : ''}
            `}
            style={{ 
              animationDelay: `${i * 200}ms`,
              animationDuration: '2s'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{source.icon}</span>
              <span className="text-gray-200 font-medium text-xs">{source.name}</span>
            </div>
            <div className="text-xs text-gray-400 ml-7">{source.detail}</div>
          </div>
        ))}
      </div>
      
      {active && (
        <div className="mt-4 text-xs text-blue-400 animate-fadeIn text-center">
          → Siloed across organizations
        </div>
      )}
    </div>
  )
}