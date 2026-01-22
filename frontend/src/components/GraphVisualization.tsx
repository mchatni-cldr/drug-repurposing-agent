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

  // Node painting function - uses closure to access highlightedPath
  const paintNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
  const label = node.name
  const fontSize = 12 / globalScale
  const highlighted = isNodeHighlighted(node.id)
  const nodeSize = highlighted ? 8 : 5
  
  // Set opacity for non-highlighted nodes when a path is active
  const opacity = highlightedPath && !highlighted ? 0.2 : 1.0
  
  // Draw glow if highlighted
  if (highlighted) {
    ctx.shadowBlur = 20
    ctx.shadowColor = 'rgba(92, 228, 246, 0.6)'
  }
  
  // Draw node circle with opacity
  ctx.globalAlpha = opacity
  ctx.fillStyle = highlighted ? '#8B5CF6' : getNodeColor(node)
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
  ctx.fillStyle = highlighted ? '#6B21A8' : '#1F2937'
  ctx.fillText(label, node.x, node.y + nodeSize + fontSize)
  ctx.globalAlpha = 1.0
}

  // Link painting function - uses closure to access highlightedPath
  const paintLink = (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
  const fontSize = 10 / globalScale
  const start = link.source
  const end = link.target
  
  // Get source and target IDs properly
  const sourceId = typeof start === 'object' ? start.id : start
  const targetId = typeof end === 'object' ? end.id : end
  const highlighted = isLinkHighlighted(sourceId, targetId)
  
  // Set opacity for non-highlighted links when a path is active
  const opacity = highlightedPath && !highlighted ? 0.5 : 1.0
  
  // Calculate link middle point
  const middleX = (start.x + end.x) / 2
  const middleY = (start.y + end.y) / 2
  
  // Draw link line with opacity
  ctx.globalAlpha = opacity
  ctx.strokeStyle = highlighted ? '#8B5CF6' : '#9CA3AF'
  ctx.lineWidth = highlighted ? 3 / globalScale : 1 / globalScale
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.stroke()
  
  // Draw arrow with opacity
  const arrowLength = highlighted ? 10 / globalScale : 8 / globalScale
  const angle = Math.atan2(end.y - start.y, end.x - start.x)
  const arrowX = end.x - Math.cos(angle) * 5
  const arrowY = end.y - Math.sin(angle) * 5
  
  ctx.fillStyle = highlighted ? '#8B5CF6' : '#9CA3AF'
  ctx.beginPath()
  ctx.moveTo(arrowX, arrowY)
  ctx.lineTo(
    arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
    arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
  )
  ctx.lineTo(
    arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
    arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
  )
  ctx.closePath()
  ctx.fill()
  
  ctx.globalAlpha = 1.0
  
  // Draw relationship label (only for highlighted or visible links)
  if (highlighted || globalScale > 0.5) {
    ctx.globalAlpha = opacity
    ctx.font = `${fontSize}px Sans-Serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Background for label
    const labelText = link.label
    const textWidth = ctx.measureText(labelText).width
    ctx.fillStyle = highlighted ? 'rgba(139, 92, 246, 0.95)' : 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(
      middleX - textWidth / 2 - 2,
      middleY - fontSize / 2 - 1,
      textWidth + 4,
      fontSize + 2
    )
    
    // Draw text
    ctx.fillStyle = highlighted ? '#FFFFFF' : '#6B7280'
    ctx.fillText(labelText, middleX, middleY)
    ctx.globalAlpha = 1.0
  }
}

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Knowledge Graph</h2>
        <div className="flex gap-4 text-sm flex-wrap">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            Drugs ({graphData?.nodes.filter(n => n.type === 'drug').length || 0})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            Proteins ({graphData?.nodes.filter(n => n.type === 'protein').length || 0})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Diseases ({graphData?.nodes.filter(n => n.type === 'disease').length || 0})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            Pathways ({graphData?.nodes.filter(n => n.type === 'pathway').length || 0})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            Biomarkers ({graphData?.nodes.filter(n => n.type === 'biomarker').length || 0})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            Anatomy ({graphData?.nodes.filter(n => n.type === 'anatomy').length || 0})
          </span>
        </div>
      </div>

      {/* Graph Container */}
      <div 
        ref={containerRef}
        className="border-2 border-gray-300 rounded-lg bg-gray-50 overflow-hidden"
        style={{ 
          height: '600px',
          width: '100%',
          position: 'relative'
        }}
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading knowledge graph...</div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error: {error}</p>
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
            backgroundColor="#F9FAFB"
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        {graphData && (
          <>
            {graphData.nodes.length} entities • {graphData.links.length} relationships
            <div className="text-xs mt-1 text-gray-500">
              💡 Tip: Drag nodes to rearrange • Scroll to zoom • Drag background to pan
            </div>
          </>
        )}
      </div>
    </div>
  )
}