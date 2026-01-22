import React, { useState } from 'react'
import { GraphVisualization } from './components/GraphVisualization'
import { DiscoveryQuestion } from './components/DiscoveryQuestion'
import { DiscoveryResult } from './components/DiscoveryResult'

interface DiscoveryResponse {
  success: boolean
  found_paths: boolean
  drug: string
  disease: string
  hypothesis: string
  key_insight: string
  mechanism_summary: string
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

  const handleDiscover = async (question: string) => {
    console.log('Discovery question:', question)
    setDiscovering(true)
    setDiscoveryResult(null)
    
    try {
      const response = await fetch('/api/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      })

      if (!response.ok) {
        throw new Error(`Discovery failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success && data.found_paths) {
        setDiscoveryResult(data)
      } else {
        alert('No paths found between the entities.')
      }
    } catch (error) {
      console.error('Discovery error:', error)
      alert(error instanceof Error ? error.message : 'Discovery failed')
    } finally {
      setDiscovering(false)
    }
  }

  const handleCloseResult = () => {
    setDiscoveryResult(null)
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

        {/* Discovery Question */}
        <div className="max-w-4xl mx-auto mb-8">
          <DiscoveryQuestion 
            onDiscover={handleDiscover}
            isLoading={discovering}
          />
        </div>

        {/* Discovery Result */}
        {discoveryResult && (
          <div className="max-w-4xl mx-auto mb-8">
            <DiscoveryResult 
              result={discoveryResult}
              onClose={handleCloseResult}
            />
          </div>
        )}

        {/* Knowledge Graph */}
        <div className="max-w-7xl mx-auto">
          <GraphVisualization 
            highlightedPath={discoveryResult ? {
              nodeIds: discoveryResult.top_path.node_ids,
              edges: discoveryResult.top_path.edges
            } : undefined}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Platform: Cloudera AI</p>
          <p>Stack: CrewAI + Flask + React + Claude</p>
          <p className="mt-2 text-xs">
            Demo scenario: Discovering Ozempic's obesity potential from diabetes data (2017)
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App