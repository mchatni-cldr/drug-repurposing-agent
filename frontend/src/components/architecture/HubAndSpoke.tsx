import React, { useState, useEffect } from 'react'

interface HubAndSpokeProps {
  phase: number
}

export function HubAndSpoke({ phase }: HubAndSpokeProps) {
  const [nodeCount, setNodeCount] = useState(23)
  const [edgeCount, setEdgeCount] = useState(31)

  useEffect(() => {
    if (phase < 2) {
      setNodeCount(23)
      setEdgeCount(31)
      return
    }

    const interval = setInterval(() => {
      setNodeCount(prev => {
        if (prev < 100) return prev + 12
        if (prev < 1000) return prev + 120
        if (prev < 10000) return prev + 600
        return 10247
      })
      setEdgeCount(prev => {
        if (prev < 200) return prev + 25
        if (prev < 2000) return prev + 250
        if (prev < 45000) return prev + 1300
        return 45893
      })
    }, 150)

    return () => clearInterval(interval)
  }, [phase])

  return (
    <div className="relative h-[700px] max-w-7xl mx-auto mb-12">
      
      {/* AI Context Layer Halo - appears in Phase 4 */}
      {phase >= 3 && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
          style={{
            animation: 'fadeInPlace 0.8s ease-out forwards'
          }}
        >
          {/* Outer orbital ring */}
          <div className="w-[420px] h-[420px] rounded-full border-2 border-cyan-400/30 animate-spin-slow relative">
            {/* Gradient glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-cyan-500/30 to-purple-500/20 blur-2xl" />
            
            {/* Additional inner glow */}
            <div className="absolute inset-4 rounded-full border border-purple-400/20 blur-sm" />
          </div>
          
          {/* Label above the ring */}
          <div 
            className="absolute -top-20 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-xl px-5 py-3 border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
            style={{
              animation: 'fadeInPlace 0.8s ease-out 0.3s forwards',
              opacity: 0
            }}
          >
            <div className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1">
              <span>🧠</span>
              <span>AI Context Layer</span>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Graph powers agent reasoning
            </div>
          </div>
        </div>
      )}
      
      {/* Center Hub: Knowledge Graph */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className={`
          w-64 h-64 rounded-full 
          bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20
          border-4 transition-all duration-1000
          flex flex-col items-center justify-center
          ${phase >= 2 
            ? 'border-purple-400 scale-110 shadow-[0_0_80px_rgba(168,85,247,0.5)]' 
            : 'border-purple-400/30 scale-100'
          }
          ${phase >= 2 ? 'animate-pulse-slow' : ''}
        `}>
          <div className="text-center">
            <div className={`
              text-5xl font-bold mb-3 transition-all duration-500
              ${phase >= 2
                ? 'bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent' 
                : 'text-gray-500'
              }
            `}>
              {nodeCount.toLocaleString()}
            </div>
            <div className="text-xl font-bold text-white mb-1">Knowledge Graph</div>
            <div className="text-sm text-gray-300">Integration Hub</div>
            {phase >= 2 && (
              <div className="text-xs text-cyan-400 mt-2 animate-fadeIn">
                {edgeCount.toLocaleString()} relationships
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INPUT SPOKES - Data flowing INTO the graph */}

      {/* Spoke 1: Data Sources (Top Left) */}
      <div className="absolute top-4 left-4">
        <div className={`
          w-52 rounded-xl border transition-all duration-500 p-4
          ${phase >= 0
            ? 'bg-blue-500/10 border-blue-400/40 shadow-lg shadow-blue-500/20' 
            : 'bg-white/5 border-white/10'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📚</span>
            <div>
              <div className="text-sm font-bold text-blue-300">Data Sources</div>
              <div className="text-xs text-gray-400">5 Organizations</div>
            </div>
          </div>
          {phase >= 0 && (
            <div className="space-y-1 text-xs text-gray-400">
              <div>• PubMed (35M papers)</div>
              <div>• Clinical trials</div>
              <div>• Internal R&D</div>
              <div>• DrugBank</div>
              <div>• Lab notebooks</div>
            </div>
          )}
        </div>
        
        {phase >= 1 && (
          <div className="absolute left-full top-1/2 ml-6">
            <svg width="180" height="160" className="overflow-visible">
              <defs>
                <linearGradient id="source-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,0 Q 90,20 160,90" stroke="url(#source-gradient)" strokeWidth="2" fill="none" />
              <circle r="5" fill="#60A5FA">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 0,0 Q 90,20 160,90" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 2: Data Pipeline (Left) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2">
        <div className={`
          w-56 rounded-xl border transition-all duration-500 p-4
          ${phase >= 1
            ? 'bg-cyan-500/10 border-cyan-400/40 shadow-lg shadow-cyan-500/20' 
            : 'bg-white/5 border-white/10'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔄</span>
            <div>
              <div className="text-sm font-bold text-cyan-300">Data Pipeline</div>
              <div className="text-xs text-gray-400">CDE + NiFi</div>
            </div>
          </div>
          {phase >= 1 && (
            <div className="space-y-1 text-xs text-gray-400">
              <div className="text-emerald-400">✓ Ontology-native → NiFi</div>
              <div className="text-blue-400">✓ Unmapped → CDE → Iceberg</div>
              <div className="text-cyan-400">✓ NiFi ingests all</div>
            </div>
          )}
        </div>
        
        {phase >= 1 && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6">
            <svg width="200" height="80" className="overflow-visible">
              <defs>
                <linearGradient id="pipeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="1" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,40 Q 100,30 190,40" stroke="url(#pipeline-gradient)" strokeWidth="3" fill="none" />
              <circle r="5" fill="#22D3EE">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0,40 Q 100,30 190,40" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 3: Discovery Compute (Bottom Left) */}
      <div className="absolute bottom-4 left-4">
        <div className={`
          w-52 rounded-xl border transition-all duration-500 p-4
          ${phase >= 1
            ? 'bg-emerald-500/10 border-emerald-400/40 shadow-lg shadow-emerald-500/20' 
            : 'bg-white/5 border-white/10'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🧬</span>
            <div>
              <div className="text-sm font-bold text-emerald-300">Discovery Compute</div>
              <div className="text-xs text-gray-400">Cloudera AI (GPU)</div>
            </div>
          </div>
          {phase >= 1 && (
            <div className="space-y-1 text-xs text-gray-400">
              <div>• GWAS (100 GPU hrs)</div>
              <div>• PheWAS (50 GPU hrs)</div>
              <div>• scRNA-seq (75 GPU hrs)</div>
              <div>• Protein structure</div>
              <div>• Docking (200 CPU hrs)</div>
            </div>
          )}
        </div>
        
        {phase >= 1 && (
          <div className="absolute left-full bottom-1/2 ml-6">
            <svg width="180" height="160" className="overflow-visible">
              <defs>
                <linearGradient id="compute-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34D399" stopOpacity="1" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,160 Q 90,140 160,70" stroke="url(#compute-gradient)" strokeWidth="2" fill="none" />
              <circle r="5" fill="#34D399">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M 0,160 Q 90,140 160,70" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* OUTPUT SPOKES - Data flowing OUT OF the graph */}

      {/* Spoke 4: Query Agent (Top Right) */}
      <div className="absolute top-4 right-4">
        <div className={`
          w-52 rounded-xl border transition-all duration-500 p-4
          ${phase >= 3
            ? 'bg-amber-500/10 border-amber-400/40 shadow-lg shadow-amber-500/20' 
            : 'bg-white/5 border-white/10'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔍</span>
            <div>
              <div className="text-sm font-bold text-amber-300">Query Agent</div>
              <div className="text-xs text-gray-400">Fast Graph Queries</div>
            </div>
          </div>
          {phase >= 3 && (
            <div className="space-y-1 text-xs text-gray-400">
              <div>• BFS pathfinding</div>
              <div>• Cypher queries</div>
              <div>• Sub-graph extraction</div>
              <div className="text-amber-400 font-semibold mt-2">
                ⚡ 50ms response
              </div>
            </div>
          )}
        </div>
        
        {phase >= 3 && (
          <div className="absolute right-full top-1/2 mr-6">
            <svg width="180" height="160" className="overflow-visible">
              <defs>
                <linearGradient id="query-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M 0,90 Q 90,20 180,0" stroke="url(#query-gradient)" strokeWidth="2" fill="none" strokeDasharray="4 2" />
              <circle r="5" fill="#F59E0B">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 0,90 Q 90,20 180,0" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 5: Reasoning Agent (Right) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2">
        <div className={`
          w-56 rounded-xl border transition-all duration-500 p-4
          ${phase >= 3
            ? 'bg-purple-500/10 border-purple-400/40 shadow-lg shadow-purple-500/20' 
            : 'bg-white/5 border-white/10'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="text-sm font-bold text-purple-300">Reasoning Agent</div>
              <div className="text-xs text-gray-400">Claude API + GPU</div>
            </div>
          </div>
          {phase >= 3 && (
            <div className="space-y-1 text-xs text-gray-400">
              <div>• Hypothesis generation</div>
              <div>• On-demand GNN</div>
              <div>• Graph embeddings</div>
              <div className="text-purple-400 font-semibold mt-2">
                🧠 3 sec discovery
              </div>
            </div>
          )}
        </div>
        
        {phase >= 3 && (
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-6">
            <svg width="200" height="80" className="overflow-visible">
              <defs>
                <linearGradient id="reasoning-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M 0,40 Q 100,50 200,40" stroke="url(#reasoning-gradient)" strokeWidth="3" fill="none" strokeDasharray="4 2" />
              <circle r="5" fill="#A855F7">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0,40 Q 100,50 200,40" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 6: Discovery Insights (Bottom Right) */}
      <div className="absolute bottom-4 right-4">
        <div className={`
          w-52 rounded-xl border transition-all duration-500 p-4
          ${phase >= 3
            ? 'bg-pink-500/10 border-pink-400/40 shadow-lg shadow-pink-500/20' 
            : 'bg-white/5 border-white/10'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="text-sm font-bold text-pink-300">Discovery Insights</div>
              <div className="text-xs text-gray-400">Actionable Results</div>
            </div>
          </div>
          {phase >= 3 && (
            <div className="space-y-1 text-xs text-gray-400">
              <div>• Drug repurposing</div>
              <div>• Hidden pathways</div>
              <div>• Safety analysis</div>
              <div className="text-pink-400 font-semibold mt-2">
                🎯 vs 4 years manual
              </div>
            </div>
          )}
        </div>
        
        {phase >= 3 && (
          <div className="absolute right-full bottom-1/2 mr-6">
            <svg width="180" height="160" className="overflow-visible">
              <defs>
                <linearGradient id="insight-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M 0,70 Q 90,140 180,160" stroke="url(#insight-gradient)" strokeWidth="2" fill="none" strokeDasharray="4 2" />
              <circle r="5" fill="#EC4899">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 0,70 Q 90,140 180,160" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
        <div className="flex items-center gap-8 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="text-lg">→</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400"></div>
            <span className="text-gray-300">Data flows IN (solid lines)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="text-lg">⇢</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 via-purple-400 to-pink-400"></div>
            <span className="text-gray-300">Insights flow OUT (dashed lines)</span>
          </div>
        </div>
      </div>
    </div>
  )
}