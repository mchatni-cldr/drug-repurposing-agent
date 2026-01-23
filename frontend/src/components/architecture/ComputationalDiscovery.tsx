import React, { useState, useEffect } from 'react'

interface StageProps {
  active: boolean
}

interface ComputeJob {
  name: string
  description: string
  progress: number
  complete: boolean
  icon: string
  stats: {
    compute: string
    processed: string
    found: string
  }
}

const INITIAL_JOBS: ComputeJob[] = [
  {
    name: 'GWAS Analysis',
    description: 'Genetic variants',
    progress: 0,
    complete: false,
    icon: '🧬',
    stats: {
      compute: '100 GPU hrs',
      processed: '500K genomes',
      found: '47 variants'
    }
  },
  {
    name: 'PheWAS Analysis',
    description: 'Phenotype links',
    progress: 0,
    complete: false,
    icon: '📊',
    stats: {
      compute: '50 GPU hrs',
      processed: '1.8K phenotypes',
      found: '12 associations'
    }
  },
  {
    name: 'Molecular Docking',
    description: 'Drug screening',
    progress: 0,
    complete: false,
    icon: '⚗️',
    stats: {
      compute: '200 CPU hrs',
      processed: '1M compounds',
      found: '100 candidates'
    }
  }
]

export function ComputationalDiscovery({ active }: StageProps) {
  const [jobs, setJobs] = useState<ComputeJob[]>(INITIAL_JOBS)
  const [startTime, setStartTime] = useState<number>(0)

  useEffect(() => {
    if (!active) {
      setJobs(INITIAL_JOBS)
      setStartTime(0)
      return
    }

    if (startTime === 0) {
      setStartTime(Date.now())
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime

      setJobs(prev => prev.map((job, idx) => {
        // Stagger start times: 0s, 1s, 2s
        const jobStartDelay = idx * 1000
        if (elapsed < jobStartDelay) {
          return job
        }

        if (job.complete) return job

        // Progress faster for shorter jobs
        const progressRate = idx === 0 ? 2.5 : idx === 1 ? 3 : 3.5
        const newProgress = Math.min(job.progress + progressRate, 100)

        return {
          ...job,
          progress: newProgress,
          complete: newProgress === 100
        }
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [active, startTime])

  const allComplete = jobs.every(j => j.complete)

  return (
    <div className={`
      bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6
      transition-all duration-500
      ${active ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-400/20 scale-105' : 'opacity-60'}
    `}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          Computational Discovery
        </h3>
        <p className="text-xs text-gray-400">CDE + CML Compute</p>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.name} className="bg-black/20 rounded-lg p-3">
            {/* Job Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{job.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">
                  {job.name}
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {job.description}
                </div>
              </div>
              {job.complete && (
                <span className="text-emerald-400 text-sm">✓</span>
              )}
            </div>

            {/* Progress Bar */}
            {active && job.progress > 0 && (
              <div className="space-y-2">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 ease-out"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                {/* Stats (show when complete) */}
                {job.complete && (
                  <div className="text-[10px] text-gray-400 space-y-0.5 animate-fadeIn">
                    <div>💻 {job.stats.compute}</div>
                    <div>📊 {job.stats.processed}</div>
                    <div className="text-emerald-400 font-semibold">
                      ✨ {job.stats.found}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {active && allComplete && (
        <div className="mt-4 text-xs text-emerald-400 animate-fadeIn text-center">
          → NEW knowledge created
        </div>
      )}
    </div>
  )
}