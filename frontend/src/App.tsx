import React, { useState } from 'react'
import { GraphVisualization } from './components/GraphVisualization'

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = async () => {
    setLoading(true)
    const response = await fetch('/api/health')
    const data = await response.json()
    setMessage(`Backend healthy! Graph has ${data.graph_entities} entities and ${data.graph_relationships} relationships.`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧬 Drug Repurposing Discovery Platform
          </h1>
          <p className="text-lg text-gray-600">
            AI-Powered Knowledge Graph for Pharma R&D
          </p>
        </header>

        {/* Status Check */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={handleClick}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? '⏳ Checking...' : '✓ Test Backend Connection'}
            </button>

            {message && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-center font-medium">
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Graph Visualization */}
        <div className="max-w-6xl mx-auto">
          <GraphVisualization />
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Platform: Cloudera AI</p>
          <p>Stack: CrewAI + Flask + React + Claude</p>
        </footer>
      </div>
    </div>
  )
}

export default App