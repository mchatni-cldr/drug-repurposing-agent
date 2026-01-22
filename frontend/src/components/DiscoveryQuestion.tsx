import React, { useState } from 'react'

interface DiscoveryQuestionProps {
  onDiscover: (question: string) => void
  isLoading?: boolean
}

export function DiscoveryQuestion({ onDiscover, isLoading = false }: DiscoveryQuestionProps) {
  const [question, setQuestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      onDiscover(question)
    }
  }

  const exampleQuestions = [
    "Could semaglutide be used to treat obesity?",
    "Find repurposing opportunities for GLP-1 agonists",
    "What diseases could benefit from GLP-1 receptor modulation?"
  ]

  const handleExampleClick = (example: string) => {
    setQuestion(example)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🔍 Discovery Question</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a drug repurposing question..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? '🔄 Discovering...' : '🚀 Discover'}
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">💡 Example questions:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="text-xs px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition-colors disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}