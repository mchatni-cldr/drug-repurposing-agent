import React, { useState, useEffect } from 'react'

interface StageProps {
  active: boolean
}

export function AIAgents({ active }: StageProps) {
  const [queryProgress, setQueryProgress] = useState(0)
  const [discoveryComplete, setDiscoveryComplete] = useState(false)

  useEffect(() => {
    if (!active) {
      setQueryProgress(0)
      setDiscoveryComplete(false)
      return
    }

    // Animate query execution
    const interval = setInterval(() => {
      setQueryProgress(prev => {
        if (prev >= 100) {
          setDiscoveryComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [active])

  return (
    <div className={`
      bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6
      transition-all duration-500
      ${active ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-400/20 scale-105' : 'opacity-60'}
    `}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">AI Agents</h3>
        <p className="text-xs text-gray-400">CML + Claude API</p>
      </div>

      <div className="space-y-3">
        {/* Query */}
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-xs text-gray-300 mb-2 italic">
            "Could semaglutide treat obesity?"
          </div>
          {active && queryProgress > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-cyan-400">
                {queryProgress < 30 && '🔍 Searching graph...'}
                {queryProgress >= 30 && queryProgress < 60 && '🧠 Analyzing pathway...'}
                {queryProgress >= 60 && queryProgress < 100 && '💡 Generating insights...'}
                {queryProgress === 100 && '✓ Discovery complete!'}
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-300"
                  style={{ width: `${queryProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        {discoveryComplete && (
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-3 animate-fadeIn">
            <div className="text-xs font-semibold text-emerald-400 mb-2">
              ✓ Pathway Found
            </div>
            <div className="text-[10px] text-gray-300 space-y-1">
              <div>• 8-hop pathway via brain</div>
              <div>• 93% confidence</div>
              <div>• 3 hidden connections</div>
              <div className="text-emerald-400 font-semibold pt-1">
                Discovery time: 3 seconds
              </div>
            </div>
          </div>
        )}

        {/* Comparison */}
        {discoveryComplete && (
          <div className="bg-white/5 rounded-lg p-3 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-xs text-red-400 line-through">4 years</div>
                <div className="text-[9px] text-gray-500">Manual review</div>
              </div>
              <div>
                <div className="text-xs text-emerald-400 font-bold">3 seconds</div>
                <div className="text-[9px] text-gray-400">AI + Graph</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {discoveryComplete && (
        <div className="mt-4 text-xs text-amber-400 animate-fadeIn text-center">
          → Actionable insights
        </div>
      )}
    </div>
  )
}