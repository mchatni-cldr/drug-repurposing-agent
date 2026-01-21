import React, { useState } from 'react'

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = async () => {
    setLoading(true)
    const response = await fetch('/api/hello')
    const data = await response.json()
    setMessage(data.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧬 Drug Repurposing Discovery Platform
          </h1>
          <p className="text-lg text-gray-600">
            AI-Powered Knowledge Graph for Pharma R&D
          </p>
        </header>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            System Status
          </h2>
          
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

          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            <p>Platform: Cloudera AI</p>
            <p>Stack: CrewAI + Flask + React + Claude</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App