import React, { useState } from 'react'

interface DiscoveryQuestionProps {
  onDiscover: (question: string) => void
  isLoading: boolean
}

export function DiscoveryQuestion({ onDiscover, isLoading }: DiscoveryQuestionProps) {
  const [question, setQuestion] = useState('')

  const exampleQuestions = [
    "Could semaglutide treat obesity?",
    "Find repurposing opportunities for GLP-1 agonists",
    "What diseases could benefit from GLP-1 receptor modulation?"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && !isLoading) {
      onDiscover(question.trim())
    }
  }

  const handleExampleClick = (example: string) => {
    if (!isLoading) {
      setQuestion(example)
      onDiscover(example)
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Discovery Query
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about drug repurposing opportunities..."
            disabled={isLoading}
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 transition-all text-base"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-medium hover:from-blue-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 text-base flex items-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Discovering...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-white/5">
        <p className="text-sm text-gray-400 mb-4">Example queries:</p>
        <div className="flex flex-wrap gap-3">
          {exampleQuestions.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}