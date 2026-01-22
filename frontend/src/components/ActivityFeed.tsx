import React from 'react'

interface ActivityStep {
  step: string
  message: string
  progress: number
  timestamp: number
}

interface ActivityFeedProps {
  steps: ActivityStep[]
  isActive: boolean
}

export function ActivityFeed({ steps, isActive }: ActivityFeedProps) {
  if (steps.length === 0 && !isActive) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-500">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        {isActive && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
        )}
        🤖 Agent Activity
      </h3>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 text-sm animate-fadeIn"
          >
            <div className="text-gray-400 text-xs mt-0.5 font-mono">
              {new Date(step.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="flex-1 text-gray-700">
              {step.message}
            </div>
          </div>
        ))}
      </div>
      
      {isActive && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${steps[steps.length - 1]?.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}