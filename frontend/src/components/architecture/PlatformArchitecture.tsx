import React, { useState, useEffect } from 'react'
import { HubAndSpoke } from './HubAndSpoke'
import { PlatformStats } from './PlatformStats'

const PHASES = [
  {
    name: 'Data Sources',
    message: 'Knowledge fragmented across 5+ organizational silos',
    duration: 8000
  },
  {
    name: 'Data Ingestion',
    message: 'Multiple paths converge: Direct NiFi, CDE harmonization, Cloudera AI compute',
    duration: 10000
  },
  {
    name: 'Graph Integration',
    message: 'Knowledge Graph integrates all data - becomes central hub',
    duration: 10000
  },
  {
    name: 'AI Discovery',
    message: 'Agents query graph + invoke Discovery Compute on-demand',
    duration: 10000
  }
]

export function PlatformArchitecture() {
  const [phase, setPhase] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)

  useEffect(() => {
    const currentPhaseDuration = PHASES[phase].duration
    const interval = setInterval(() => {
      setPhaseProgress(prev => {
        const increment = (100 / currentPhaseDuration) * 100
        const newProgress = prev + increment
        
        if (newProgress >= 100) {
          setPhase(p => (p + 1) % PHASES.length)
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [phase])

  return (
    <div className="container mx-auto px-6 pb-16">
      {/* Title */}
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Cloudera Platform Architecture
        </h1>
        <p className="text-xl text-gray-300">
          Knowledge Graph as Central Integration Hub
        </p>
      </header>

      {/* Hub and Spoke Visualization */}
      <HubAndSpoke phase={phase} />

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-sm font-medium text-gray-300 min-w-[180px]">
            Phase {phase + 1}/4: {PHASES[phase].name}
          </div>
          <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 transition-all duration-100 ease-linear"
              style={{ width: `${phaseProgress}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-400 text-center">
          {PHASES[phase].message}
        </p>
      </div>

      {/* Platform Stats */}
      <PlatformStats phase={phase} />

      {/* Footer Info */}
      <div className="mt-16 pt-8 border-t border-white/10 text-center">
        <p className="text-sm text-gray-400 mb-4">
          <span className="text-cyan-400 font-semibold">Cloudera Data Platform</span> powers the complete workflow:
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <span>Cloudera Data Flow (NiFi)</span>
          <span>•</span>
          <span>Cloudera Data Engineering (Spark)</span>
          <span>•</span>
          <span>Cloudera AI (GPU Compute)</span>
          <span>•</span>
          <span>Apache Iceberg</span>
          <span>•</span>
          <span>Neo4j on CDP</span>
        </div>
      </div>
    </div>
  )
}