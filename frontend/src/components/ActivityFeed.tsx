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
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Discovery Progress</h2>
        {isActive && (
          <span className="flex items-center gap-2 text-sm text-cloudera-orange font-medium">
            <span className="animate-pulse">●</span>
            Active
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg animate-fadeIn"
          >
            <div className="flex-shrink-0 mt-1">
              {step.step === 'complete' ? (
                <span className="text-green-500 text-xl">✓</span>
              ) : step.step === 'error' ? (
                <span className="text-red-500 text-xl">✗</span>
              ) : (
                <span className="text-cloudera-blue text-xl">⚙️</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800 mb-1">{step.step}</div>
              <div className="text-sm text-gray-600">{step.message}</div>
              {step.progress > 0 && step.progress < 100 && (
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cloudera-orange transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isActive && steps.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✓ Discovery complete
          </p>
        </div>
      )}
    </div>
  )
}