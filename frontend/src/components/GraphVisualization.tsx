import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

interface Node {
  id: string
  name: string
  type: string
  group: string
  knowledge_source?: string
}

interface Link {
  source: string | Node
  target: string | Node
  label: string
  confidence: number
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

interface GraphVisualizationProps {
  highlightedPath?: {
    nodeIds: string[]
    edges: string[]
  }
}

export function GraphVisualization({ highlightedPath }: GraphVisualizationProps) {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const graphRef = useRef<any>()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchGraphData()
  }, [])

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ 
          width: rect.width - 4,
          height: 600 
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const fetchGraphData = async () => {
    try {
      const response = await fetch('/api/graph-data')
      if (!response.ok) throw new Error('Failed to fetch graph data')
      
      const data = await response.json()
      setGraphData(data)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  const getNodeColor = (node: Node) => {
    const sourceColors: Record<string, string> = {
      pharma_proprietary: '#3B82F6',      // Blue - Pharma
      fundamental_biology: '#10B981',     // Green - Biology
      academic_neuroscience: '#8B5CF6',   // Purple - Neuroscience
      clinical_observation: '#EF4444',    // Red - Clinical
      public_databases: '#F59E0B'         // Amber - Public
    }
    return sourceColors[node.knowledge_source || ''] || '#6B7280'
  }

  const isNodeHighlighted = (nodeId: string) => {
    return highlightedPath?.nodeIds.includes(nodeId) || false
  }

  const isLinkHighlighted = (sourceId: string, targetId: string) => {
    if (!highlightedPath) return false
    const edge1 = `${sourceId}->${targetId}`
    const edge2 = `${targetId}->${sourceId}`
    return highlightedPath.edges.includes(edge1) || highlightedPath.edges.includes(edge2)
  }

  const paintNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name
    const fontSize = 12 / globalScale
    const highlighted = isNodeHighlighted(node.id)
    const nodeSize = highlighted ? 9 : 5
    
    const opacity = highlightedPath && !highlighted ? 0.3 : 1.0
    
    if (highlighted) {
      ctx.shadowBlur = 25
      ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
    }
    
    ctx.globalAlpha = opacity
    ctx.fillStyle = highlighted ? '#22D3EE' : getNodeColor(node)
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false)
    ctx.fill()
    
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1.0
    
    ctx.globalAlpha = opacity
    ctx.font = `${fontSize}px Sans-Serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = highlighted ? '#22D3EE' : '#E2E8F0'
    ctx.fontWeight = highlighted ? 'bold' : 'normal'
    ctx.fillText(label, node.x, node.y + nodeSize + fontSize)
    ctx.globalAlpha = 1.0
  }

  const paintLink = (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const fontSize = 10 / globalScale
    const start = link.source
    const end = link.target
    
    const sourceId = typeof start === 'object' ? start.id : start
    const targetId = typeof end === 'object' ? end.id : end
    const highlighted = isLinkHighlighted(sourceId, targetId)
    
    const opacity = highlightedPath && !highlighted ? 0.2 : 1.0
    
    const middleX = (start.x + end.x) / 2
    const middleY = (start.y + end.y) / 2
    
    ctx.globalAlpha = opacity
    ctx.strokeStyle = highlighted ? '#22D3EE' : '#94A3B8'
    ctx.lineWidth = highlighted ? 4 / globalScale : 1 / globalScale
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    
    ctx.globalAlpha = 1.0
    
    const arrowLength = highlighted ? 14 / globalScale : 8 / globalScale
    const angle = Math.atan2(end.y - start.y, end.x - start.x)
    const arrowX = end.x - Math.cos(angle) * (highlighted ? 7 : 5)
    const arrowY = end.y - Math.sin(angle) * (highlighted ? 7 : 5)
    
    if (highlighted) {
      ctx.shadowBlur = 12
      ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
    }
    
    ctx.fillStyle = highlighted ? '#22D3EE' : (highlightedPath && !highlighted ? 'rgba(148, 163, 184, 0.2)' : '#94A3B8')
    ctx.beginPath()
    ctx.moveTo(arrowX, arrowY)
    ctx.lineTo(
      arrowX - arrowLength * Math.cos(angle - Math.PI / 6.5),
      arrowY - arrowLength * Math.sin(angle - Math.PI / 6.5)
    )
    ctx.lineTo(
      arrowX - arrowLength * Math.cos(angle + Math.PI / 6.5),
      arrowY - arrowLength * Math.sin(angle + Math.PI / 6.5)
    )
    ctx.closePath()
    ctx.fill()
    
    ctx.shadowBlur = 0
    
    if (highlighted || globalScale > 0.5) {
      ctx.globalAlpha = opacity
      ctx.font = `${fontSize}px Sans-Serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const labelText = link.label
      const textWidth = ctx.measureText(labelText).width
      ctx.fillStyle = highlighted ? 'rgba(34, 211, 238, 0.95)' : 'rgba(51, 65, 85, 0.9)'
      ctx.fillRect(
        middleX - textWidth / 2 - 2,
        middleY - fontSize / 2 - 1,
        textWidth + 4,
        fontSize + 2
      )
      
      ctx.fillStyle = highlighted ? '#0F172A' : '#E2E8F0'
      ctx.fillText(labelText, middleX, middleY)
      ctx.globalAlpha = 1.0
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <h2 className="text-lg font-semibold text-white mb-3">Knowledge Graph</h2>
        <div className="flex gap-4 text-xs flex-wrap">
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            💊 Pharma ({graphData?.nodes.filter(n => n.knowledge_source === 'pharma_proprietary').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            🧠 Neuroscience ({graphData?.nodes.filter(n => n.knowledge_source === 'academic_neuroscience').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            🏥 Clinical ({graphData?.nodes.filter(n => n.knowledge_source === 'clinical_observation').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            🔬 Biology ({graphData?.nodes.filter(n => n.knowledge_source === 'fundamental_biology').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            📚 Public ({graphData?.nodes.filter(n => n.knowledge_source === 'public_databases').length || 0})
          </span>
        </div>
      </div>

      {/* Graph Container */}
      <div 
        ref={containerRef}
        className="overflow-hidden"
        style={{ 
          height: '600px',
          width: '100%',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(51, 65, 85, 0.4) 0%, rgba(30, 41, 59, 0.6) 100%)'
        }}
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-300">Loading knowledge graph...</div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full p-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-300">Error: {error}</p>
            </div>
          </div>
        )}
        
        {graphData && !loading && !error && (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            nodeCanvasObject={paintNode}
            nodeCanvasObjectMode={() => 'replace'}
            linkCanvasObject={paintLink}
            linkCanvasObjectMode={() => 'replace'}
            linkDirectionalArrowLength={0}
            d3VelocityDecay={0.3}
            enableNodeDrag={true}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            cooldownTime={3000}
            backgroundColor="transparent"
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-slate-400 text-center bg-white/5">
        {graphData && (
          <>
            {graphData.nodes.length} entities • {graphData.links.length} relationships
            <div className="text-xs mt-1 text-slate-500">
              💡 Colors show knowledge sources: Pharma, Neuroscience, Clinical, Biology, Public
            </div>
          </>
        )}
      </div>
    </div>
  )
}