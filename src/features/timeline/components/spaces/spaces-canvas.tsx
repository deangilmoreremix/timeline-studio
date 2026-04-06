/**
 * CineGen Spaces - Node-Based AI Workflow Editor
 *
 * Revolutionary node-based workflow editor inspired by CineGen Spaces
 * Features React Flow canvas with 50+ AI models for visual AI pipeline construction
 */

import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react"
import { useCallback, useMemo, useState } from "react"

import "@xyflow/react/dist/style.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import custom node types
import { AIModelNode } from "./nodes/ai-model-node"
import { AssetOutputNode } from "./nodes/asset-output-node"
import { CompositionPlanNode } from "./nodes/composition-plan-node"
import { FilePickerNode } from "./nodes/file-picker-node"
import { PromptNode } from "./nodes/prompt-node"
import { ShotBoardNode } from "./nodes/shot-board-node"
import { StoryboarderNode } from "./nodes/storyboarder-node"

// Node types mapping
const nodeTypes = {
  aiModel: AIModelNode,
  storyboarder: StoryboarderNode,
  shotBoard: ShotBoardNode,
  compositionPlan: CompositionPlanNode,
  prompt: PromptNode,
  filePicker: FilePickerNode,
  assetOutput: AssetOutputNode,
}

// Initial nodes for demonstration
const initialNodes: Node[] = [
  {
    id: "1",
    type: "prompt",
    position: { x: 100, y: 100 },
    data: { label: "Main Prompt", prompt: "A cinematic scene with dramatic lighting" },
  },
  {
    id: "2",
    type: "aiModel",
    position: { x: 400, y: 100 },
    data: { model: "kling-3.0", label: "Kling 3.0 Video" },
  },
  {
    id: "3",
    type: "assetOutput",
    position: { x: 700, y: 100 },
    data: { label: "Generated Video" },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
]

interface SpacesProps {
  className?: string
  onWorkflowExecute?: (nodes: Node[], edges: Edge[]) => void
}

export function Spaces({ className, onWorkflowExecute }: SpacesProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeType, setSelectedNodeType] = useState<string>("aiModel")

  // Add new node to canvas
  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: selectedNodeType,
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 150,
      },
      data: getDefaultNodeData(selectedNodeType),
    }

    setNodes((nds) => [...nds, newNode])
  }, [nodes.length, selectedNodeType, setNodes])

  // Handle connections between nodes
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  // Execute workflow
  const executeWorkflow = useCallback(() => {
    if (onWorkflowExecute) {
      onWorkflowExecute(nodes, edges)
    }
    console.log("Executing workflow:", { nodes, edges })
  }, [nodes, edges, onWorkflowExecute])

  // Get default data for node type
  const getDefaultNodeData = (type: string) => {
    switch (type) {
      case "aiModel":
        return { model: "kling-3.0", label: "AI Model" }
      case "prompt":
        return { label: "Prompt", prompt: "" }
      case "storyboarder":
        return { label: "Storyboarder", scenes: [] }
      case "shotBoard":
        return { label: "Shot Board", reference: null }
      case "compositionPlan":
        return { label: "Composition Plan", sections: [] }
      case "filePicker":
        return { label: "File Picker", files: [] }
      case "assetOutput":
        return { label: "Asset Output" }
      default:
        return { label: type }
    }
  }

  // Node templates for toolbar
  const nodeTemplates = useMemo(
    () => [
      { value: "prompt", label: "Prompt Node", description: "Text input for AI generation" },
      { value: "aiModel", label: "AI Model", description: "50+ AI models for generation" },
      { value: "storyboarder", label: "Storyboarder", description: "Break scenes into shots" },
      { value: "shotBoard", label: "Shot Board", description: "Camera angle planning" },
      { value: "compositionPlan", label: "Composition Plan", description: "Music scoring workflow" },
      { value: "filePicker", label: "File Picker", description: "Input files and assets" },
      { value: "assetOutput", label: "Asset Output", description: "Generated content output" },
    ],
    [],
  )

  return (
    <div className={`spaces-editor h-full w-full bg-background ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Add Node:</span>
          <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {nodeTemplates.map((template) => (
                <SelectItem key={template.value} value={template.value}>
                  <div>
                    <div className="font-medium">{template.label}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addNode} size="sm">
            Add Node
          </Button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button onClick={executeWorkflow} variant="default">
            Execute Workflow
          </Button>
          <Button variant="outline" size="sm">
            Save Workflow
          </Button>
          <Button variant="outline" size="sm">
            Load Workflow
          </Button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
        >
          <Background />
          <Controls />
          <MiniMap />

          {/* Node Library Panel */}
          <Panel position="top-left">
            <Card className="w-64">
              <CardHeader>
                <CardTitle className="text-sm">Node Library</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">AI Models (50+)</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded">FLUX Dev</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 rounded">Kling 3.0</div>
                  <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded">LTX 2.3</div>
                  <div className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Sora 2</div>
                  <div className="px-2 py-1 bg-red-100 text-red-800 rounded">Runway Gen-4</div>
                  <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Veo 3.1</div>
                </div>
                <div className="text-xs text-muted-foreground mt-3">+44 more models available</div>
              </CardContent>
            </Card>
          </Panel>

          {/* Workflow Info Panel */}
          <Panel position="top-right">
            <Card className="w-64">
              <CardHeader>
                <CardTitle className="text-sm">Workflow Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Nodes:</span>
                  <span>{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Connections:</span>
                  <span>{edges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Models:</span>
                  <span>{nodes.filter((n) => n.type === "aiModel").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Outputs:</span>
                  <span>{nodes.filter((n) => n.type === "assetOutput").length}</span>
                </div>
              </CardContent>
            </Card>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}
