import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

interface Node {
  id: string
  name: string
  type: string
  group: string
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

  // Fetch graph data
  useEffect(() => {
    fetchGraphData()
  }, [])

  // Update dimensions on mount and resize
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
    const colors: Record<string, string> = {
      drug: '#3B82F6',
      protein: '#10B981',
      disease: '#EF4444',
      pathway: '#8B5CF6',
      biomarker: '#EC4899',
      anatomy: '#F59E0B'
    }
    return colors[node.type] || '#6B7280'
  }

  // Check if node is highlighted
  const isNodeHighlighted = (nodeId: string) => {
    return highlightedPath?.nodeIds.includes(nodeId) || false
  }

  // Check if link is highlighted
  const isLinkHighlighted = (sourceId: string, targetId: string) => {
    if (!highlightedPath) return false
    const edge1 = `${sourceId}->${targetId}`
    const edge2 = `${targetId}->${sourceId}`
    return highlightedPath.edges.includes(edge1) || highlightedPath.edges.includes(edge2)
  }

  // Node painting function
  const paintNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name
    const fontSize = 12 / globalScale
    const highlighted = isNodeHighlighted(node.id)
    const nodeSize = highlighted ? 9 : 5
    
    // Set opacity for non-highlighted nodes when a path is active
    const opacity = highlightedPath && !highlighted ? 0.3 : 1.0
    
    // Draw glow if highlighted
    if (highlighted) {
      ctx.shadowBlur = 25
      ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
    }
    
    // Draw node circle with opacity
    ctx.globalAlpha = opacity
    ctx.fillStyle = highlighted ? '#22D3EE' : getNodeColor(node)
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false)
    ctx.fill()
    
    // Reset shadow and alpha
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1.0
    
    // Draw label with opacity
    ctx.globalAlpha = opacity
    ctx.font = `${fontSize}px Sans-Serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = highlighted ? '#22D3EE' : '#E2E8F0'
    ctx.fontWeight = highlighted ? 'bold' : 'normal'
    ctx.fillText(label, node.x, node.y + nodeSize + fontSize)
    ctx.globalAlpha = 1.0
  }

  // Link painting function
  const paintLink = (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const fontSize = 10 / globalScale
    const start = link.source
    const end = link.target
    
    // Get source and target IDs properly
    const sourceId = typeof start === 'object' ? start.id : start
    const targetId = typeof end === 'object' ? end.id : end
    const highlighted = isLinkHighlighted(sourceId, targetId)
    
    // Set opacity for non-highlighted links when a path is active
    const opacity = highlightedPath && !highlighted ? 0.2 : 1.0
    
    // Calculate link middle point
    const middleX = (start.x + end.x) / 2
    const middleY = (start.y + end.y) / 2
    
    // Draw link line with opacity
    ctx.globalAlpha = opacity
    ctx.strokeStyle = highlighted ? '#22D3EE' : '#94A3B8'
    ctx.lineWidth = highlighted ? 4 / globalScale : 1 / globalScale
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    
    // Reset alpha before drawing arrow (so it's always fully visible)
    ctx.globalAlpha = 1.0
    
    // Draw arrow
    const arrowLength = highlighted ? 14 / globalScale : 8 / globalScale
    const angle = Math.atan2(end.y - start.y, end.x - start.x)
    const arrowX = end.x - Math.cos(angle) * (highlighted ? 7 : 5)
    const arrowY = end.y - Math.sin(angle) * (highlighted ? 7 : 5)
    
    // Add glow for highlighted arrows
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
    
    // Reset shadow
    ctx.shadowBlur = 0
    
    // Draw relationship label
    if (highlighted || globalScale > 0.5) {
      ctx.globalAlpha = opacity
      ctx.font = `${fontSize}px Sans-Serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Background for label
      const labelText = link.label
      const textWidth = ctx.measureText(labelText).width
      ctx.fillStyle = highlighted ? 'rgba(34, 211, 238, 0.95)' : 'rgba(51, 65, 85, 0.9)'
      ctx.fillRect(
        middleX - textWidth / 2 - 2,
        middleY - fontSize / 2 - 1,
        textWidth + 4,
        fontSize + 2
      )
      
      // Draw text
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
            Drugs ({graphData?.nodes.filter(n => n.type === 'drug').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            Proteins ({graphData?.nodes.filter(n => n.type === 'protein').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Diseases ({graphData?.nodes.filter(n => n.type === 'disease').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            Pathways ({graphData?.nodes.filter(n => n.type === 'pathway').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            Biomarkers ({graphData?.nodes.filter(n => n.type === 'biomarker').length || 0})
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            Anatomy ({graphData?.nodes.filter(n => n.type === 'anatomy').length || 0})
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
              💡 Tip: Drag nodes to rearrange • Scroll to zoom • Drag background to pan
            </div>
          </>
        )}
      </div>
    </div>
  )
}