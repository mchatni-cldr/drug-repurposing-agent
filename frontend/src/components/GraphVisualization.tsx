import React, { useEffect, useState, useRef } from 'react'
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

export function GraphVisualization() {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const graphRef = useRef<any>()

  useEffect(() => {
    fetchGraphData()
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
      drug: '#3B82F6',      // blue
      protein: '#10B981',   // green
      disease: '#F59E0B',   // orange
      pathway: '#8B5CF6'    // purple
    }
    return colors[node.type] || '#6B7280'
  }

  // Custom node rendering with labels
  const paintNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name
    const fontSize = 12 / globalScale
    const nodeSize = 5
    
    // Draw node circle
    ctx.fillStyle = getNodeColor(node)
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false)
    ctx.fill()
    
    // Draw label
    ctx.font = `${fontSize}px Sans-Serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#1F2937'
    ctx.fillText(label, node.x, node.y + nodeSize + fontSize)
  }

  // Custom link rendering with labels
  const paintLink = (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const fontSize = 10 / globalScale
    const start = link.source
    const end = link.target
    
    // Calculate link middle point
    const middleX = (start.x + end.x) / 2
    const middleY = (start.y + end.y) / 2
    
    // Draw link line (default behavior)
    ctx.strokeStyle = '#9CA3AF'
    ctx.lineWidth = 1 / globalScale
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    
    // Draw arrow
    const arrowLength = 8 / globalScale
    const angle = Math.atan2(end.y - start.y, end.x - start.x)
    const arrowX = end.x - Math.cos(angle) * 5
    const arrowY = end.y - Math.sin(angle) * 5
    
    ctx.fillStyle = '#9CA3AF'
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
    
    // Draw relationship label
    ctx.font = `${fontSize}px Sans-Serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#6B7280'
    
    // Background for label (for better readability)
    const labelText = link.label
    const textWidth = ctx.measureText(labelText).width
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillRect(
      middleX - textWidth / 2 - 2,
      middleY - fontSize / 2 - 1,
      textWidth + 4,
      fontSize + 2
    )
    
    // Draw text
    ctx.fillStyle = '#6B7280'
    ctx.fillText(labelText, middleX, middleY)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading knowledge graph...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    )
  }

  if (!graphData) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Knowledge Graph</h2>
        <div className="flex gap-4 text-sm flex-wrap">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            Drugs ({graphData.nodes.filter(n => n.type === 'drug').length})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Proteins ({graphData.nodes.filter(n => n.type === 'protein').length})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            Diseases ({graphData.nodes.filter(n => n.type === 'disease').length})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            Pathways ({graphData.nodes.filter(n => n.type === 'pathway').length})
          </span>
        </div>
      </div>

      <div className="border rounded-lg bg-gray-50" style={{ height: '600px' }}>
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
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
        />
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        {graphData.nodes.length} entities • {graphData.links.length} relationships
        <div className="text-xs mt-1 text-gray-500">
          💡 Tip: Drag nodes to rearrange • Scroll to zoom • Drag background to pan
        </div>
      </div>
    </div>
  )
}