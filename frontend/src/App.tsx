import React, { useState } from 'react'
import { GraphVisualization } from './components/GraphVisualization'
import { DiscoveryQuestion } from './components/DiscoveryQuestion'

function App() {
  const [discovering, setDiscovering] = useState(false)

  const handleDiscover = async (question: string) => {
    console.log('Discovery question:', question)
    setDiscovering(true)
    
    // TODO: Milestone 3.x - Call discovery endpoint
    // For now, just log
    
    setTimeout(() => {
      setDiscovering(false)
    }, 2000)
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

        {/* Knowledge Graph */}
        <div className="max-w-7xl mx-auto">
          <GraphVisualization />
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