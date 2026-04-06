/**
 * CineGen Spaces Workflow Engine
 *
 * Executes node-based AI workflows with data flow validation
 * Integrates all repository features into a unified pipeline
 */

import type { Edge, Node } from "@xyflow/react"

import { aiContentGenerationEngine } from "../services/repository-integration-engine"
import type {
  AIModelNodeData,
  AssetOutputNodeData,
  CompositionPlanNodeData,
  FilePickerNodeData,
  PromptNodeData,
  ShotBoardNodeData,
  StoryboarderNodeData,
} from "./nodes"

// Workflow execution context
export interface WorkflowContext {
  inputs: Map<string, any>
  outputs: Map<string, any>
  errors: Map<string, string>
  status: "idle" | "running" | "completed" | "error"
  progress: number
}

// Node execution result
export interface NodeResult {
  success: boolean
  data?: any
  error?: string
  duration?: number
}

// Workflow validation result
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export class SpacesWorkflowEngine {
  private context: WorkflowContext = {
    inputs: new Map(),
    outputs: new Map(),
    errors: new Map(),
    status: "idle",
    progress: 0,
  }

  /**
   * Validate workflow before execution
   */
  validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    }

    // Check for required nodes
    const hasPromptNode = nodes.some((n) => n.type === "prompt")
    const hasAIModelNode = nodes.some((n) => n.type === "aiModel")
    const hasOutputNode = nodes.some((n) => n.type === "assetOutput")

    if (!hasPromptNode) {
      result.errors.push("Workflow must include at least one Prompt node")
      result.valid = false
    }

    if (!hasAIModelNode) {
      result.errors.push("Workflow must include at least one AI Model node")
      result.valid = false
    }

    if (!hasOutputNode) {
      result.errors.push("Workflow must include at least one Asset Output node")
      result.valid = false
    }

    // Check connections
    const connectedNodes = new Set<string>()
    edges.forEach((edge) => {
      connectedNodes.add(edge.source)
      connectedNodes.add(edge.target)
    })

    // Check for isolated nodes
    const isolatedNodes = nodes.filter((n) => !connectedNodes.has(n.id))
    if (isolatedNodes.length > 0) {
      result.warnings.push(`${isolatedNodes.length} nodes are not connected to the workflow`)
    }

    // Validate node-specific requirements
    nodes.forEach((node) => {
      switch (node.type) {
        case "prompt":
          const promptData = node.data as PromptNodeData
          if (!promptData.prompt?.trim()) {
            result.errors.push(`Prompt node "${node.id}" requires prompt text`)
            result.valid = false
          }
          break

        case "aiModel":
          const aiData = node.data as AIModelNodeData
          if (!aiData.model) {
            result.errors.push(`AI Model node "${node.id}" requires model selection`)
            result.valid = false
          }
          break

        case "filePicker":
          const fileData = node.data as FilePickerNodeData
          if (fileData.files.length === 0) {
            result.warnings.push(`File Picker node "${node.id}" has no files selected`)
          }
          break
      }
    })

    return result
  }

  /**
   * Execute workflow with progress tracking
   */
  async executeWorkflow(nodes: Node[], edges: Edge[]): Promise<WorkflowContext> {
    this.resetContext()
    this.context.status = "running"

    try {
      // Validate workflow first
      const validation = this.validateWorkflow(nodes, edges)
      if (!validation.valid) {
        throw new Error(`Workflow validation failed: ${validation.errors.join(", ")}`)
      }

      // Build execution graph
      const executionOrder = this.buildExecutionOrder(nodes, edges)

      // Execute nodes in order
      for (let i = 0; i < executionOrder.length; i++) {
        const node = executionOrder[i]
        this.context.progress = (i / executionOrder.length) * 100

        const result = await this.executeNode(node, nodes, edges)
        if (!result.success) {
          this.context.errors.set(node.id, result.error || "Unknown error")
          this.context.status = "error"
          break
        }

        // Store output for connected nodes
        if (result.data) {
          this.context.outputs.set(node.id, result.data)
        }
      }

      this.context.status = this.context.errors.size > 0 ? "error" : "completed"
      this.context.progress = 100
    } catch (error) {
      this.context.status = "error"
      this.context.errors.set("workflow", error instanceof Error ? error.message : "Unknown error")
    }

    return this.context
  }

  /**
   * Execute individual node
   */
  private async executeNode(node: Node, allNodes: Node[], edges: Edge[]): Promise<NodeResult> {
    const startTime = Date.now()

    try {
      // Get inputs from connected nodes
      const inputs = this.getNodeInputs(node, allNodes, edges)

      switch (node.type) {
        case "prompt":
          return await this.executePromptNode(node.data as PromptNodeData, inputs)

        case "aiModel":
          return await this.executeAIModelNode(node.data as AIModelNodeData, inputs)

        case "storyboarder":
          return await this.executeStoryboarderNode(node.data as StoryboarderNodeData, inputs)

        case "shotBoard":
          return await this.executeShotBoardNode(node.data as ShotBoardNodeData, inputs)

        case "compositionPlan":
          return await this.executeCompositionPlanNode(node.data as CompositionPlanNodeData, inputs)

        case "filePicker":
          return await this.executeFilePickerNode(node.data as FilePickerNodeData, inputs)

        case "assetOutput":
          return await this.executeAssetOutputNode(node.data as AssetOutputNodeData, inputs)

        default:
          return { success: false, error: `Unknown node type: ${node.type}` }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Execute Prompt Node
   */
  private async executePromptNode(data: PromptNodeData, inputs: any): Promise<NodeResult> {
    // Enhance prompt with style and tone
    let enhancedPrompt = data.prompt

    if (data.style && data.style !== "Cinematic") {
      enhancedPrompt += `, ${data.style.toLowerCase()} style`
    }

    if (data.tone && data.tone !== "Professional") {
      enhancedPrompt += `, ${data.tone.toLowerCase()} tone`
    }

    // Add tags
    if (data.tags && data.tags.length > 0) {
      enhancedPrompt += `, tags: ${data.tags.join(", ")}`
    }

    return {
      success: true,
      data: { prompt: enhancedPrompt, original: data.prompt },
    }
  }

  /**
   * Execute AI Model Node
   */
  private async executeAIModelNode(data: AIModelNodeData, inputs: any): Promise<NodeResult> {
    // Get prompt from connected prompt nodes
    const prompt = inputs.prompt || data.prompt || ""

    if (!prompt) {
      return { success: false, error: "No prompt provided" }
    }

    try {
      // Use the AI content generation engine
      const result = await aiContentGenerationEngine.generateVideo({
        prompt,
        model: data.model,
        duration: data.duration,
        resolution: data.resolution,
        quality: data.quality,
        guidance: data.guidance,
        seed: data.seed,
      })

      return {
        success: true,
        data: {
          videoUrl: result.outputPath,
          metadata: result.metadata,
          model: data.model,
          settings: data,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: `AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  /**
   * Execute Storyboarder Node
   */
  private async executeStoryboarderNode(data: StoryboarderNodeData, inputs: any): Promise<NodeResult> {
    // Process scene description and break into shots
    const shots = data.shots || []

    // Validate shots have required data
    const validShots = shots.filter((shot) => shot.title && shot.description && shot.duration > 0)

    return {
      success: true,
      data: {
        sceneTitle: data.sceneTitle,
        sceneDescription: data.sceneDescription,
        shots: validShots,
        totalDuration: validShots.reduce((sum, shot) => sum + shot.duration, 0),
      },
    }
  }

  /**
   * Execute Shot Board Node
   */
  private async executeShotBoardNode(data: ShotBoardNodeData, inputs: any): Promise<NodeResult> {
    return {
      success: true,
      data: {
        shotTitle: data.shotTitle,
        cameraAngle: data.cameraAngle,
        cameraMovement: data.cameraMovement,
        framing: data.framing,
        notes: data.notes,
      },
    }
  }

  /**
   * Execute Composition Plan Node
   */
  private async executeCompositionPlanNode(data: CompositionPlanNodeData, inputs: any): Promise<NodeResult> {
    // Generate music composition based on cues
    const cues = data.cues || []

    return {
      success: true,
      data: {
        title: data.title,
        genre: data.genre,
        mood: data.mood,
        tempo: data.tempo,
        key: data.key,
        duration: data.duration,
        cues: cues,
      },
    }
  }

  /**
   * Execute File Picker Node
   */
  private async executeFilePickerNode(data: FilePickerNodeData, inputs: any): Promise<NodeResult> {
    return {
      success: true,
      data: {
        files: data.files,
        fileType: data.fileType,
      },
    }
  }

  /**
   * Execute Asset Output Node
   */
  private async executeAssetOutputNode(data: AssetOutputNodeData, inputs: any): Promise<NodeResult> {
    // Get generated content from connected nodes
    const generatedContent = inputs.generatedContent || inputs.videoUrl

    if (!generatedContent) {
      return { success: false, error: "No content to output" }
    }

    try {
      // Process output based on format and destination
      const outputData = {
        content: generatedContent,
        format: data.outputFormat,
        quality: data.quality,
        destination: data.destination,
        fileSize: inputs.fileSize || 0,
      }

      return {
        success: true,
        data: outputData,
      }
    } catch (error) {
      return {
        success: false,
        error: `Output processing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  /**
   * Build execution order based on node connections
   */
  private buildExecutionOrder(nodes: Node[], edges: Edge[]): Node[] {
    const graph = new Map<string, string[]>()
    const inDegree = new Map<string, number>()

    // Initialize graph
    nodes.forEach((node) => {
      graph.set(node.id, [])
      inDegree.set(node.id, 0)
    })

    // Build graph from edges
    edges.forEach((edge) => {
      const source = edge.source
      const target = edge.target

      if (graph.has(source) && graph.has(target)) {
        graph.get(source)!.push(target)
        inDegree.set(target, (inDegree.get(target) || 0) + 1)
      }
    })

    // Topological sort
    const queue: string[] = []
    const result: Node[] = []

    // Start with nodes that have no incoming edges
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId)
      }
    })

    while (queue.length > 0) {
      const nodeId = queue.shift()!
      const node = nodes.find((n) => n.id === nodeId)

      if (node) {
        result.push(node)
      }

      // Update in-degrees of neighbors
      graph.get(nodeId)?.forEach((neighborId) => {
        const newDegree = (inDegree.get(neighborId) || 0) - 1
        inDegree.set(neighborId, newDegree)

        if (newDegree === 0) {
          queue.push(neighborId)
        }
      })
    }

    return result
  }

  /**
   * Get inputs for a node from connected nodes
   */
  private getNodeInputs(node: Node, allNodes: Node[], edges: Edge[]): any {
    const inputs: any = {}

    // Find incoming edges
    const incomingEdges = edges.filter((edge) => edge.target === node.id)

    incomingEdges.forEach((edge) => {
      const sourceNode = allNodes.find((n) => n.id === edge.source)
      if (sourceNode) {
        // Get output from context or node data
        const nodeOutput = this.context.outputs.get(sourceNode.id)
        if (nodeOutput) {
          Object.assign(inputs, nodeOutput)
        }
      }
    })

    return inputs
  }

  /**
   * Reset execution context
   */
  private resetContext(): void {
    this.context = {
      inputs: new Map(),
      outputs: new Map(),
      errors: new Map(),
      status: "idle",
      progress: 0,
    }
  }

  /**
   * Get current execution context
   */
  getContext(): WorkflowContext {
    return this.context
  }
}

// Singleton instance
export const spacesWorkflowEngine = new SpacesWorkflowEngine()
