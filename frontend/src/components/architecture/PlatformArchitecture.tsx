import React, { useState, useEffect } from 'react'
import { DataSources } from './DataSources'
import { DataPipeline } from './DataPipeline'
import { ComputationalDiscovery } from './ComputationalDiscovery'
import { GraphBuilder } from './GraphBuilder'
import { AIAgents } from './AIAgents'
import { PlatformStats } from './PlatformStats'
import { DataFlowVisualization } from './DataFlowVisualization'

const PHASES = [
  {
    name: 'Data Sources',
    message: 'Knowledge fragmented across 5+ organizational silos',
    duration: 8000
  },
  {
    name: 'Data Pipeline',
    message: 'Cloudera Data Flow harmonizes heterogeneous data sources',
    duration: 8000
  },
  {
    name: 'Computational Discovery',
    message: 'GWAS, PheWAS, and molecular docking create NEW knowledge through heavy compute',
    duration: 12000
  },
  {
    name: 'Graph Building',
    message: 'Knowledge graph integrates extracted + computed insights in real-time',
    duration: 10000
  },
  {
    name: 'AI Discovery',
    message: 'AI agents find insights in 3 seconds that take humans 4 years',
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
          From Fragmented Data to AI-Powered Insights
        </p>
      </header>

      {/* Stage Flow - 5 columns */}
      <div className="grid grid-cols-5 gap-4 max-w-[1400px] mx-auto mb-8">
        <DataSources active={phase === 0} />
        <DataPipeline active={phase === 1} />
        <ComputationalDiscovery active={phase === 2} />
        <GraphBuilder active={phase === 3} />
        <AIAgents active={phase === 4} />
      </div>

      {/* Data Flow Visualization */}
      <DataFlowVisualization phase={phase} />

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-sm font-medium text-gray-300 min-w-[200px]">
            Phase {phase + 1}/5: {PHASES[phase].name}
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
          <span>Cloudera Machine Learning (GPU)</span>
          <span>•</span>
          <span>Apache Iceberg</span>
          <span>•</span>
          <span>Neo4j on CDP</span>
        </div>
      </div>
    </div>
  )
}