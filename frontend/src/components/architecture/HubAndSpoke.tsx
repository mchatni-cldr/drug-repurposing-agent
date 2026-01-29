import React, { useState, useEffect } from 'react'

interface HubAndSpokeProps {
  phase: number
}

export function HubAndSpoke({ phase }: HubAndSpokeProps) {
  const [nodeCount, setNodeCount] = useState(0)
  const [edgeCount, setEdgeCount] = useState(0)

  useEffect(() => {
    if (phase < 2) {
      setNodeCount(0)
      setEdgeCount(0)
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
    <div className="relative h-[700px] w-full max-w-[1600px] mx-auto mb-12 px-4">
      
      {/* AI Context Layer Halo */}
      {phase >= 3 && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
          style={{
            animation: 'fadeInPlace 0.8s ease-out forwards'
          }}
        >
          <div className="w-[420px] h-[420px] rounded-full border-2 border-cloudera-orange/30 animate-spin-slow relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cloudera-orange/20 via-cloudera-blue/30 to-cloudera-orange/20 blur-2xl" />
            <div className="absolute inset-4 rounded-full border border-cloudera-blue/20 blur-sm" />
          </div>
          
          <div 
            className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-xl px-5 py-3 border-2 border-cloudera-orange shadow-lg"
            style={{
              animation: 'fadeInPlace 0.8s ease-out 0.3s forwards',
              opacity: 0
            }}
          >
            <div className="text-sm font-bold text-cloudera-orange flex items-center gap-2 mb-1">
              <span>🧠</span>
              <span>AI Context Layer</span>
            </div>
            <div className="text-xs text-gray-600 text-center">
              Graph powers agent reasoning
            </div>
          </div>
        </div>
      )}
      
      {/* Center Hub: Knowledge Graph */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className={`
          w-64 h-64 rounded-full 
          bg-gradient-to-br from-cloudera-orange/20 via-cloudera-blue/20 to-cloudera-lightblue/20
          border-4 transition-all duration-1000
          flex flex-col items-center justify-center
          ${phase >= 2 
            ? 'border-cloudera-orange scale-110 shadow-[0_0_80px_rgba(255,105,0,0.3)]' 
            : 'border-cloudera-orange/30 scale-100'
          }
          ${phase >= 2 ? 'animate-pulse-slow' : ''}
        `}>
          <div className="text-center">
            <div className={`
              text-5xl font-bold mb-3 transition-all duration-500
              ${phase >= 2
                ? 'bg-gradient-to-r from-cloudera-orange to-cloudera-blue bg-clip-text text-transparent' 
                : 'text-gray-400'
              }
            `}>
              {nodeCount.toLocaleString()}
            </div>
            <div className="text-xl font-bold text-gray-800 mb-1">Knowledge Graph</div>
            <div className="text-sm text-gray-600">Integration Hub</div>
            {phase >= 2 && (
              <div className="text-xs text-cloudera-blue mt-2 animate-fadeIn font-semibold">
                {edgeCount.toLocaleString()} relationships
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spoke 1: Data Sources (Top Left) */}
      <div className="absolute top-4 left-4">
        <div className={`
          w-48 rounded-xl border-2 transition-all duration-500 p-4 bg-white
          ${phase >= 0
            ? 'border-cloudera-blue shadow-lg' 
            : 'border-gray-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📚</span>
            <div>
              <div className="text-sm font-bold text-gray-800">Data Sources</div>
              <div className="text-xs text-gray-500">5 Organizations</div>
            </div>
          </div>
          {phase >= 0 && (
            <div className="space-y-1 text-xs text-gray-600">
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
                  <stop offset="0%" stopColor="#0073E6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0073E6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,0 Q 90,20 160,90" stroke="url(#source-gradient)" strokeWidth="2" fill="none" />
              <circle r="5" fill="#0073E6">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 0,0 Q 90,20 160,90" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 2: Data Pipeline (Left) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2">
        <div className={`
          w-52 rounded-xl border-2 transition-all duration-500 p-4 bg-white
          ${phase >= 1
            ? 'border-cloudera-lightblue shadow-lg' 
            : 'border-gray-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔄</span>
            <div>
              <div className="text-sm font-bold text-gray-800">Data Pipeline</div>
              <div className="text-xs text-gray-500">CDE + NiFi</div>
            </div>
          </div>
          {phase >= 1 && (
            <div className="space-y-1 text-xs text-gray-600">
              <div className="text-cloudera-orange font-semibold">✓ Ontology-native → NiFi</div>
              <div className="text-cloudera-blue font-semibold">✓ Unmapped → CDE → Iceberg</div>
              <div className="text-cloudera-lightblue font-semibold">✓ NiFi ingests all</div>
            </div>
          )}
        </div>
        
        {phase >= 1 && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6">
            <svg width="200" height="80" className="overflow-visible">
              <defs>
                <linearGradient id="pipeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00B8E6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00B8E6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,40 Q 100,30 190,40" stroke="url(#pipeline-gradient)" strokeWidth="3" fill="none" />
              <circle r="5" fill="#00B8E6">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0,40 Q 100,30 190,40" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 3: Discovery Compute (Bottom Left) */}
      <div className="absolute bottom-4 left-4">
        <div className={`
          w-48 rounded-xl border-2 transition-all duration-500 p-4 bg-white
          ${phase >= 1
            ? 'border-cloudera-teal shadow-lg' 
            : 'border-gray-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🧬</span>
            <div>
              <div className="text-sm font-bold text-gray-800">Discovery Compute</div>
              <div className="text-xs text-gray-500">Cloudera AI (GPU)</div>
            </div>
          </div>
          {phase >= 1 && (
            <div className="space-y-1 text-xs text-gray-600">
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
                  <stop offset="0%" stopColor="#00A3A3" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00A3A3" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,160 Q 90,140 160,70" stroke="url(#compute-gradient)" strokeWidth="2" fill="none" />
              <circle r="5" fill="#00A3A3">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M 0,160 Q 90,140 160,70" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 4: Query Agent (Top Right) */}
      <div className="absolute top-4 right-4">
        <div className={`
          w-48 rounded-xl border-2 transition-all duration-500 p-4 bg-white
          ${phase >= 3
            ? 'border-cloudera-orange shadow-lg' 
            : 'border-gray-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔍</span>
            <div>
              <div className="text-sm font-bold text-gray-800">Query Agent</div>
              <div className="text-xs text-gray-500">Fast Graph Queries</div>
            </div>
          </div>
          {phase >= 3 && (
            <div className="space-y-1 text-xs text-gray-600">
              <div>• BFS pathfinding</div>
              <div>• Cypher queries</div>
              <div>• Sub-graph extraction</div>
              <div className="text-cloudera-orange font-semibold mt-2">
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
                  <stop offset="0%" stopColor="#FF6900" stopOpacity="0" />
                  <stop offset="100%" stopColor="#FF6900" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M 0,90 Q 90,20 180,0" stroke="url(#query-gradient)" strokeWidth="2" fill="none" strokeDasharray="4 2" />
              <circle r="5" fill="#FF6900">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 0,90 Q 90,20 180,0" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 5: Reasoning Agent (Right) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2">
        <div className={`
          w-52 rounded-xl border-2 transition-all duration-500 p-4 bg-white
          ${phase >= 3
            ? 'border-cloudera-blue shadow-lg' 
            : 'border-gray-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="text-sm font-bold text-gray-800">Reasoning Agent</div>
              <div className="text-xs text-gray-500">Claude API + GPU</div>
            </div>
          </div>
          {phase >= 3 && (
            <div className="space-y-1 text-xs text-gray-600">
              <div>• Hypothesis generation</div>
              <div>• On-demand GNN</div>
              <div>• Graph embeddings</div>
              <div className="text-cloudera-blue font-semibold mt-2">
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
                  <stop offset="0%" stopColor="#0073E6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#0073E6" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M 0,40 Q 100,50 200,40" stroke="url(#reasoning-gradient)" strokeWidth="3" fill="none" strokeDasharray="4 2" />
              <circle r="5" fill="#0073E6">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0,40 Q 100,50 200,40" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Spoke 6: Discovery Insights (Bottom Right) */}
      <div className="absolute bottom-4 right-4">
        <div className={`
          w-48 rounded-xl border-2 transition-all duration-500 p-4 bg-white
          ${phase >= 3
            ? 'border-cloudera-lightblue shadow-lg' 
            : 'border-gray-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="text-sm font-bold text-gray-800">Discovery Insights</div>
              <div className="text-xs text-gray-500">Actionable Results</div>
            </div>
          </div>
          {phase >= 3 && (
            <div className="space-y-1 text-xs text-gray-600">
              <div>• Drug repurposing</div>
              <div>• Hidden pathways</div>
              <div>• Safety analysis</div>
              <div className="text-cloudera-lightblue font-semibold mt-2">
                🎯 Automated
              </div>
            </div>
          )}
        </div>
        
        {phase >= 3 && (
          <div className="absolute right-full bottom-1/2 mr-6">
            <svg width="180" height="160" className="overflow-visible">
              <defs>
                <linearGradient id="insight-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00B8E6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#00B8E6" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M 0,70 Q 90,140 180,160" stroke="url(#insight-gradient)" strokeWidth="2" fill="none" strokeDasharray="4 2" />
              <circle r="5" fill="#00B8E6">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 0,70 Q 90,140 180,160" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 border-2 border-gray-200 shadow-md">
        <div className="flex items-center gap-8 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">→</span>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cloudera-blue via-cloudera-lightblue to-cloudera-teal"></div>
            <span className="text-gray-700 font-medium">Data flows IN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⇢</span>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cloudera-orange via-cloudera-blue to-cloudera-lightblue"></div>
            <span className="text-gray-700 font-medium">Insights flow OUT</span>
          </div>
        </div>
      </div>
    </div>
  )
}