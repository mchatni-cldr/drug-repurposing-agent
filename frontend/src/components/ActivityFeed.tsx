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
    <div className="p-8">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
        {isActive && (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
        )}
        Agent Activity
      </h3>
      
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 animate-fadeIn"
          >
            <div className="text-gray-500 text-xs mt-1 font-mono w-20 flex-shrink-0">
              {new Date(step.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="flex-1 text-gray-200 text-base">
              {step.message}
            </div>
          </div>
        ))}
      </div>
      
      {isActive && (
        <div className="mt-6">
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 shadow-lg shadow-blue-500/50"
              style={{ width: `${steps[steps.length - 1]?.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}