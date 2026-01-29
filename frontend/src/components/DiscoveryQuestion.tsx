import React, { useState } from 'react'

interface DiscoveryQuestionProps {
  onDiscover: (question: string) => void
  isLoading: boolean
}

const EXAMPLE_QUESTIONS = [
  "Could semaglutide treat obesity?",
  "What drugs might help with Alzheimer's disease?",
  "Are there connections between metformin and longevity?"
]

export function DiscoveryQuestion({ onDiscover, isLoading }: DiscoveryQuestionProps) {
  const [question, setQuestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && !isLoading) {
      onDiscover(question.trim())
    }
  }

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Discovery Question</h2>
      <p className="text-gray-600 mb-6">
        Ask a drug repurposing question and let AI agents explore the knowledge graph
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Could semaglutide treat obesity?"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cloudera-orange focus:ring-2 focus:ring-cloudera-orange/20 outline-none transition-all resize-none text-gray-800 placeholder-gray-400"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-600 font-medium">Examples:</span>
          {EXAMPLE_QUESTIONS.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-cloudera-orange/10 text-gray-700 hover:text-cloudera-orange rounded-lg transition-colors border border-gray-200 hover:border-cloudera-orange disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="w-full px-6 py-3 bg-cloudera-orange hover:bg-opacity-90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚙️</span>
              Discovering...
            </span>
          ) : (
            <span>🔍 Discover Hidden Connections</span>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong className="font-semibold">How it works:</strong> AI agents query the knowledge graph, 
          trace pathways across organizational silos, and explain scientific mechanisms using Claude API.
        </p>
      </div>
    </div>
  )
}