import React, { useState, useEffect } from 'react'

interface StageProps {
  active: boolean
}

export function GraphBuilder({ active }: StageProps) {
  const [nodeCount, setNodeCount] = useState(23)
  const [edgeCount, setEdgeCount] = useState(31)

  useEffect(() => {
    if (!active) {
      setNodeCount(23)
      setEdgeCount(31)
      return
    }

    // Animate growth: 23 → 100 → 1000 → 10000
    const interval = setInterval(() => {
      setNodeCount(prev => {
        if (prev < 100) return prev + 15
        if (prev < 1000) return prev + 150
        if (prev < 10000) return prev + 700
        return 10247 // Final count
      })
      setEdgeCount(prev => {
        if (prev < 200) return prev + 30
        if (prev < 2000) return prev + 300
        if (prev < 45000) return prev + 1500
        return 45893 // Final count
      })
    }, 200)

    return () => clearInterval(interval)
  }, [active])

  return (
    <div className={`
      bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6
      transition-all duration-500
      ${active ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-400/20 scale-105' : 'opacity-60'}
    `}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Knowledge Graph</h3>
        <p className="text-xs text-gray-400">Neo4j on CDP</p>
      </div>

      {/* Graph Visualization */}
      <div className="relative h-32 bg-black/20 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
        {/* Animated nodes */}
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: Math.min(30, Math.floor(nodeCount / 340)) }).map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 via-purple-400 to-blue-400"
              style={{ 
                animation: active ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none',
                animationDelay: `${i * 100}ms`,
                opacity: active ? 1 : 0.3
              }}
            />
          ))}
        </div>

        {/* Source badges */}
        {active && nodeCount > 5000 && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center animate-fadeIn">
            <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 rounded text-[8px] text-blue-300">💊</span>
            <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-400/30 rounded text-[8px] text-purple-300">🧠</span>
            <span className="px-2 py-0.5 bg-red-500/20 border border-red-400/30 rounded text-[8px] text-red-300">🏥</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded text-[8px] text-emerald-300">🔬</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-lg p-2 text-center">
          <div className="text-xl font-bold text-purple-400">
            {nodeCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400">entities</div>
        </div>
        <div className="bg-white/10 rounded-lg p-2 text-center">
          <div className="text-xl font-bold text-blue-400">
            {edgeCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400">relationships</div>
        </div>
      </div>

      {active && nodeCount > 10000 && (
        <div className="mt-4 text-xs text-purple-400 animate-fadeIn text-center">
          → Cross-domain integrated
        </div>
      )}
    </div>
  )
}