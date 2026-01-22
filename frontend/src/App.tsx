import React, { useState } from 'react'
import { GraphVisualization } from './components/GraphVisualization'
import { DiscoveryQuestion } from './components/DiscoveryQuestion'
import { DiscoveryResult } from './components/DiscoveryResult'
import { ActivityFeed } from './components/ActivityFeed'

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
  safety_rationale?: string  // ← ADD THIS
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
            
            // Add to activity feed
            setActivitySteps(prev => [...prev, {
              ...data,
              timestamp: Date.now()
            }])

            // If complete, set result
            if (data.step === 'complete') {
              setDiscoveryResult(data.result)
              setDiscovering(false)
            }

            // If error, show alert
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
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🧬 Drug Repurposing Discovery Platform
        </h1>
        <p className="text-lg text-gray-600">
          AI-Powered Knowledge Graph for Pharma R&D
        </p>
      </header>

      {/* GRAPH FIRST - Always visible */}
      <div className="max-w-7xl mx-auto mb-8">
        <GraphVisualization 
          highlightedPath={discoveryResult ? {
            nodeIds: discoveryResult.top_path.node_ids,
            edges: discoveryResult.top_path.edges
          } : undefined}
        />
      </div>

      {/* Discovery Question - Below graph */}
      <div className="max-w-4xl mx-auto mb-8">
        <DiscoveryQuestion 
          onDiscover={handleDiscover}
          isLoading={discovering}
        />
      </div>

      {/* Activity Feed - Appears when running */}
      {(activitySteps.length > 0 || discovering) && (
        <div className="max-w-4xl mx-auto mb-8">
          <ActivityFeed 
            steps={activitySteps}
            isActive={discovering}
          />
        </div>
      )}

      {/* Discovery Result - Appears when complete */}
      {discoveryResult && (
        <div className="max-w-4xl mx-auto mb-8">
          <DiscoveryResult 
            result={discoveryResult}
            onClose={handleCloseResult}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Platform: Cloudera AI</p>
        <p>Stack: AI Agents + Flask + React + Claude</p>
        <p className="mt-2 text-xs">
          Demo scenario: Discovering Ozempic's obesity potential from diabetes data (2017)
        </p>
      </footer>
    </div>
  </div>
)
}

export default App