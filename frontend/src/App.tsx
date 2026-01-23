import React, { useState } from 'react'
import { GraphVisualization } from './components/GraphVisualization'
import { DiscoveryQuestion } from './components/DiscoveryQuestion'
import { DiscoveryResult } from './components/DiscoveryResult'
import { ActivityFeed } from './components/ActivityFeed'
import { PlatformArchitecture } from './components/architecture/PlatformArchitecture'

interface ActivityStep {
  step: string
  message: string
  progress: number
  timestamp: number
}

interface DiscoveryResponse {
  success: boolean
  found_paths: boolean
  drug: string
  disease: string
  hypothesis: string
  key_insight: string
  mechanism_summary: string
  clinical_significance?: string
  mechanism_explanation?: string
  confidence_assessment?: string
  hidden_knowledge_insight?: string
  safety_rationale?: string
  knowledge_fragmentation?: string
  key_risks?: string
  next_steps?: string[]
  top_path: {
    node_ids: string[]
    edges: string[]
    confidence: number
    path_length: number
    hidden_connections: number
    mechanism: string
  }
  scores: {
    overall_score: number
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<'discovery' | 'architecture'>('discovery')
  const [discovering, setDiscovering] = useState(false)
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryResponse | null>(null)
  const [activitySteps, setActivitySteps] = useState<ActivityStep[]>([])

  const handleDiscover = async (question: string) => {
    console.log('Discovery question:', question)
    setDiscovering(true)
    setDiscoveryResult(null)
    setActivitySteps([])
    
    try {
      const response = await fetch('/api/discover-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      })

      if (!response.ok) {
        throw new Error(`Discovery failed: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is not readable')
      }

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6))
            
            setActivitySteps(prev => [...prev, {
              ...data,
              timestamp: Date.now()
            }])

            if (data.step === 'complete') {
              setDiscoveryResult(data.result)
              setDiscovering(false)
            }

            if (data.step === 'error') {
              alert(data.message)
              setDiscovering(false)
            }
          }
        }
      }
    } catch (error) {
      console.error('Discovery error:', error)
      alert(error instanceof Error ? error.message : 'Discovery failed')
      setDiscovering(false)
    }
  }

  const handleCloseResult = () => {
    setDiscoveryResult(null)
    setActivitySteps([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      {/* Subtle animated gradient overlay */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
      </div>
      
      <div className="relative">
        {/* Tab Navigation */}
        <div className="container mx-auto px-6 pt-8">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('discovery')}
              className={`
                px-8 py-4 rounded-2xl font-semibold transition-all text-base
                ${activeTab === 'discovery' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 scale-105' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                }
              `}
            >
              <span className="mr-2">🔬</span>
              Discovery Demo
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`
                px-8 py-4 rounded-2xl font-semibold transition-all text-base
                ${activeTab === 'architecture' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 scale-105' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                }
              `}
            >
              <span className="mr-2">🏗️</span>
              Platform Architecture
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'discovery' ? (
          <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <header className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Drug Repurposing Discovery
              </h1>
              <p className="text-xl text-gray-300">
                AI-Powered Knowledge Graph for Pharmaceutical R&D
              </p>
            </header>

            {/* Graph - Glowing Card */}
            <div className="max-w-7xl mx-auto mb-12">
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(99,102,241,0.15)] overflow-hidden">
                <GraphVisualization 
                  highlightedPath={discoveryResult ? {
                    nodeIds: discoveryResult.top_path.node_ids,
                    edges: discoveryResult.top_path.edges
                  } : undefined}
                />
              </div>
            </div>

            {/* Discovery Question - Glowing Card */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
                <DiscoveryQuestion 
                  onDiscover={handleDiscover}
                  isLoading={discovering}
                />
              </div>
            </div>

            {/* Activity Feed - Glowing Card */}
            {(activitySteps.length > 0 || discovering) && (
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
                  <ActivityFeed 
                    steps={activitySteps}
                    isActive={discovering}
                  />
                </div>
              </div>
            )}

            {/* Discovery Result - Glowing Card */}
            {discoveryResult && (
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
                  <DiscoveryResult 
                    result={discoveryResult}
                    onClose={handleCloseResult}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-24 pt-12 border-t border-white/5 text-center">
              <p className="text-base text-gray-300 mb-2">
                Powered by <span className="text-cyan-400 font-semibold">Cloudera Machine Learning</span>
              </p>
              <p className="text-sm text-gray-500">
                AI Agents • Knowledge Graphs • Claude API
              </p>
            </footer>
          </div>
        ) : (
          <PlatformArchitecture />
        )}
      </div>
    </div>
  )
}

export default App