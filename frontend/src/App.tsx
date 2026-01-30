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
  const [activeTab, setActiveTab] = useState<'discovery' | 'architecture'>('architecture') // CHANGED: Default to 'architecture'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative">
        {/* Tab Navigation - SWAPPED ORDER */}
        <div className="container mx-auto px-6 pt-8">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`
                w-64 px-8 py-4 rounded-xl font-semibold transition-all text-base shadow-md
                ${activeTab === 'architecture' 
                  ? 'bg-cloudera-orange text-white shadow-cloudera-orange/30 scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <span className="mr-2">🏗️</span>
              Platform Architecture
            </button>
            <button
              onClick={() => setActiveTab('discovery')}
              className={`
                w-64 px-8 py-4 rounded-xl font-semibold transition-all text-base shadow-md
                ${activeTab === 'discovery' 
                  ? 'bg-cloudera-orange text-white shadow-cloudera-orange/30 scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <span className="mr-2">🔬</span>
              Discovery Demo
            </button>
          </div>
        </div>
        
        {/* Tab Content - SWAPPED ORDER */}
        {activeTab === 'architecture' ? (
          <PlatformArchitecture />
        ) : (
          <div className="container mx-auto px-6 pb-8">
            {/* Header - FIXED WITH EXPLICIT SPACING */}
            <header className="text-center mb-12 px-4">
              <div className="py-8">
                <h1 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-cloudera-orange via-cloudera-blue to-cloudera-navy bg-clip-text text-transparent"
                  style={{ 
                    lineHeight: '1.3',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    minHeight: '4rem'
                  }}
                >
                  Drug Repurposing Discovery
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  AI-Powered Knowledge Graph for Pharmaceutical R&D
                </p>
              </div>
            </header>

            {/* Graph - Card with Shadow */}
            <div className="max-w-7xl mx-auto mb-12">
              <div className="bg-white rounded-2xl border-2 border-cloudera-orange/20 shadow-xl overflow-hidden">
                <GraphVisualization 
                  highlightedPath={discoveryResult ? {
                    nodeIds: discoveryResult.top_path.node_ids,
                    edges: discoveryResult.top_path.edges
                  } : undefined}
                />
              </div>
            </div>

            {/* Discovery Question - Card */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-2xl border-2 border-cloudera-blue/20 shadow-lg">
                <DiscoveryQuestion 
                  onDiscover={handleDiscover}
                  isLoading={discovering}
                />
              </div>
            </div>

            {/* Activity Feed - Card */}
            {(activitySteps.length > 0 || discovering) && (
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white rounded-2xl border-2 border-cloudera-lightblue/20 shadow-lg">
                  <ActivityFeed 
                    steps={activitySteps}
                    isActive={discovering}
                  />
                </div>
              </div>
            )}

            {/* Discovery Result - Card */}
            {discoveryResult && (
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white rounded-2xl border-2 border-cloudera-orange/20 shadow-lg">
                  <DiscoveryResult 
                    result={discoveryResult}
                    onClose={handleCloseResult}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-24 pt-12 border-t border-gray-200 text-center">
              <p className="text-base text-gray-700 mb-2">
                Powered by <span className="text-cloudera-orange font-semibold">CLOUDERA</span>
              </p>
              <p className="text-sm text-gray-500">
                Ingestion • Ontologies • Data Engineering • Knowledge Graphs • Grounded AI 
              </p>
            </footer>
          </div>
        )}
      </div>
    </div>
  )
}

export default App