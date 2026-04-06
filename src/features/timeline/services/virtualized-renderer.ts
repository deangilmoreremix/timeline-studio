/**
 * Virtualized Timeline Renderer - High-Performance Rendering for Large Projects
 *
 * Efficiently renders thousands of clips using virtual scrolling and GPU acceleration
 */

import type { TimelineClip, TimelineTrack } from "../types/timeline"

/**
 * Virtual Window Configuration
 */
export interface VirtualWindow {
  /** Horizontal scroll position (time) */
  scrollX: number

  /** Vertical scroll position (tracks) */
  scrollY: number

  /** Visible width in pixels */
  viewportWidth: number

  /** Visible height in pixels */
  viewportHeight: number

  /** Time scale (pixels per second) */
  timeScale: number

  /** Track height in pixels */
  trackHeight: number
}

/**
 * Virtual Item (Clip or Track)
 */
export interface VirtualItem {
  id: string
  index: number
  start: number
  end: number
  size: number
  visible: boolean
  data: any
}

/**
 * Render Batch for Efficient GPU Rendering
 */
export interface RenderBatch {
  clips: TimelineClip[]
  tracks: TimelineTrack[]
  startTime: number
  endTime: number
  priority: "high" | "medium" | "low"
}

/**
 * Virtualized Timeline Renderer
 */
export class VirtualizedTimelineRenderer {
  private static instance: VirtualizedTimelineRenderer

  // Configuration
  private bufferSize = 2 // Render items outside viewport by this factor
  private maxConcurrentRenders = 3
  private enableGPUAcceleration = true
  private memoryLimit = 500 * 1024 * 1024 // 500MB memory limit

  // State
  private virtualWindow: VirtualWindow | null = null
  private visibleItems = new Map<string, VirtualItem>()
  private renderQueue: RenderBatch[] = []
  private activeRenders = new Set<string>()

  static getInstance(): VirtualizedTimelineRenderer {
    if (!VirtualizedTimelineRenderer.instance) {
      VirtualizedTimelineRenderer.instance = new VirtualizedTimelineRenderer()
    }
    return VirtualizedTimelineRenderer.instance
  }

  /**
   * Update virtual window and recalculate visible items
   */
  updateVirtualWindow(window: VirtualWindow): void {
    this.virtualWindow = window
  }

  /**
   * Calculate visible clips for current virtual window
   */
  calculateVisibleClips(
    clips: TimelineClip[],
    tracks: TimelineTrack[],
  ): {
    visibleClips: TimelineClip[]
    virtualItems: VirtualItem[]
    renderBatches: RenderBatch[]
  } {
    if (!this.virtualWindow) {
      return {
        visibleClips: clips,
        virtualItems: [],
        renderBatches: [],
      }
    }

    const { scrollX, viewportWidth, timeScale, trackHeight } = this.virtualWindow

    // Calculate visible time range with buffer
    const visibleStartTime = scrollX - (viewportWidth / timeScale) * this.bufferSize
    const visibleEndTime = scrollX + (viewportWidth / timeScale) * (1 + this.bufferSize)

    // Calculate visible track range
    const visibleStartTrack = Math.max(0, Math.floor(this.virtualWindow.scrollY / trackHeight) - this.bufferSize)
    const visibleEndTrack =
      Math.ceil((this.virtualWindow.scrollY + this.virtualWindow.viewportHeight) / trackHeight) + this.bufferSize

    // Filter clips by time and track visibility
    const visibleClips: TimelineClip[] = []
    const virtualItems: VirtualItem[] = []

    clips.forEach((clip, index) => {
      const trackIndex = tracks.findIndex((t) => t.id === clip.trackId)
      if (trackIndex === -1) return

      // Check track visibility
      if (trackIndex < visibleStartTrack || trackIndex > visibleEndTrack) {
        return
      }

      // Check time visibility (with intersection)
      const clipEndTime = clip.startTime + clip.duration
      if (clipEndTime < visibleStartTime || clip.startTime > visibleEndTime) {
        return
      }

      visibleClips.push(clip)

      // Create virtual item for efficient updates
      virtualItems.push({
        id: clip.id,
        index,
        start: clip.startTime,
        end: clipEndTime,
        size: clip.duration * timeScale,
        visible: this.isClipFullyVisible(clip, visibleStartTime, visibleEndTime),
        data: clip,
      })
    })

    // Create render batches for efficient GPU rendering
    const renderBatches = this.createRenderBatches(visibleClips, tracks, visibleStartTime, visibleEndTime)

    return {
      visibleClips,
      virtualItems,
      renderBatches,
    }
  }

  /**
   * Check if clip is fully visible in current window
   */
  private isClipFullyVisible(clip: TimelineClip, visibleStartTime: number, visibleEndTime: number): boolean {
    if (!this.virtualWindow) return false

    const clipEndTime = clip.startTime + clip.duration
    const clipStartPixel = (clip.startTime - this.virtualWindow.scrollX) * this.virtualWindow.timeScale
    const clipEndPixel = (clipEndTime - this.virtualWindow.scrollX) * this.virtualWindow.timeScale

    return clipStartPixel >= 0 && clipEndPixel <= this.virtualWindow.viewportWidth
  }

  /**
   * Create render batches for efficient GPU processing
   */
  private createRenderBatches(
    clips: TimelineClip[],
    tracks: TimelineTrack[],
    startTime: number,
    endTime: number,
  ): RenderBatch[] {
    const batches: RenderBatch[] = []

    // Group clips by track and time proximity
    const trackGroups = new Map<string, TimelineClip[]>()

    clips.forEach((clip) => {
      if (!trackGroups.has(clip.trackId)) {
        trackGroups.set(clip.trackId, [])
      }
      trackGroups.get(clip.trackId)!.push(clip)
    })

    // Create batches for each track group
    trackGroups.forEach((trackClips, trackId) => {
      const track = tracks.find((t) => t.id === trackId)
      if (!track) return

      // Split into time-based batches for better GPU utilization
      const timeRange = endTime - startTime
      const batchDuration = Math.max(10, timeRange / 10) // 10 second batches minimum

      let currentBatchStart = startTime
      while (currentBatchStart < endTime) {
        const currentBatchEnd = Math.min(currentBatchStart + batchDuration, endTime)

        const batchClips = trackClips.filter((clip) => {
          const clipEnd = clip.startTime + clip.duration
          return clip.startTime < currentBatchEnd && clipEnd > currentBatchStart
        })

        if (batchClips.length > 0) {
          batches.push({
            clips: batchClips,
            tracks: [track],
            startTime: currentBatchStart,
            endTime: currentBatchEnd,
            priority: this.calculateBatchPriority(batchClips, currentBatchStart, currentBatchEnd),
          })
        }

        currentBatchStart = currentBatchEnd
      }
    })

    // Sort batches by priority
    batches.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    return batches.slice(0, this.maxConcurrentRenders)
  }

  /**
   * Calculate render batch priority
   */
  private calculateBatchPriority(
    clips: TimelineClip[],
    batchStart: number,
    batchEnd: number,
  ): "high" | "medium" | "low" {
    if (!this.virtualWindow) return "low"

    const viewportCenter =
      this.virtualWindow.scrollX + this.virtualWindow.viewportWidth / this.virtualWindow.timeScale / 2
    const batchCenter = (batchStart + batchEnd) / 2
    const distanceFromViewport = Math.abs(batchCenter - viewportCenter)

    // High priority: currently visible or very close
    if (distanceFromViewport < 5) return "high"

    // Medium priority: near viewport
    if (distanceFromViewport < 30) return "medium"

    // Low priority: far from viewport
    return "low"
  }

  /**
   * Render virtual items efficiently
   */
  async renderVirtualItems(items: VirtualItem[], renderCallback: (item: VirtualItem) => Promise<void>): Promise<void> {
    // Prioritize visible items
    const visibleItems = items.filter((item) => item.visible)
    const bufferedItems = items.filter((item) => !item.visible)

    // Render visible items first
    await Promise.all(visibleItems.map((item) => this.renderItemWithPriority(item, renderCallback, "high")))

    // Render buffered items with lower priority
    await Promise.all(bufferedItems.map((item) => this.renderItemWithPriority(item, renderCallback, "low")))
  }

  /**
   * Render item with priority scheduling
   */
  private async renderItemWithPriority(
    item: VirtualItem,
    renderCallback: (item: VirtualItem) => Promise<void>,
    priority: "high" | "medium" | "low",
  ): Promise<void> {
    if (this.activeRenders.size >= this.maxConcurrentRenders && priority !== "high") {
      // Queue for later if too many concurrent renders
      return
    }

    this.activeRenders.add(item.id)

    try {
      await renderCallback(item)
    } finally {
      this.activeRenders.delete(item.id)
    }
  }

  /**
   * Update visible items cache
   */
  updateVisibleItemsCache(items: VirtualItem[]): void {
    this.visibleItems.clear()
    items.forEach((item) => {
      this.visibleItems.set(item.id, item)
    })
  }

  /**
   * Get cached visible item
   */
  getCachedVisibleItem(id: string): VirtualItem | undefined {
    return this.visibleItems.get(id)
  }

  /**
   * Check if item needs re-rendering
   */
  needsRerender(item: VirtualItem, newStart: number, newEnd: number): boolean {
    const cached = this.visibleItems.get(item.id)
    if (!cached) return true

    return Math.abs(cached.start - newStart) > 0.001 || Math.abs(cached.end - newEnd) > 0.001
  }

  /**
   * Optimize memory usage
   */
  optimizeMemory(): {
    freedMemory: number
    remainingItems: number
  } {
    let freedMemory = 0
    const itemsToRemove: string[] = []

    // Remove items that are far from viewport
    if (this.virtualWindow) {
      const viewportEndTime =
        this.virtualWindow.scrollX +
        (this.virtualWindow.viewportWidth / this.virtualWindow.timeScale) * (1 + this.bufferSize)

      this.visibleItems.forEach((item, id) => {
        if (item.end < this.virtualWindow!.scrollX - 10 || item.start > viewportEndTime + 10) {
          itemsToRemove.push(id)
          freedMemory += this.estimateItemMemoryUsage(item)
        }
      })
    }

    // Remove old items
    itemsToRemove.forEach((id) => this.visibleItems.delete(id))

    return {
      freedMemory,
      remainingItems: this.visibleItems.size,
    }
  }

  /**
   * Estimate memory usage of a virtual item
   */
  private estimateItemMemoryUsage(item: VirtualItem): number {
    // Rough estimation: clip data + rendering data
    return 1024 + (item.data ? JSON.stringify(item.data).length * 2 : 0)
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): {
    cachedItems: number
    estimatedMemoryUsage: number
    activeRenders: number
  } {
    let totalMemory = 0
    this.visibleItems.forEach((item) => {
      totalMemory += this.estimateItemMemoryUsage(item)
    })

    return {
      cachedItems: this.visibleItems.size,
      estimatedMemoryUsage: totalMemory,
      activeRenders: this.activeRenders.size,
    }
  }

  /**
   * Configure virtualized rendering
   */
  configure(options: {
    bufferSize?: number
    maxConcurrentRenders?: number
    enableGPUAcceleration?: boolean
    memoryLimit?: number
  }): void {
    if (options.bufferSize !== undefined) this.bufferSize = options.bufferSize
    if (options.maxConcurrentRenders !== undefined) this.maxConcurrentRenders = options.maxConcurrentRenders
    if (options.enableGPUAcceleration !== undefined) this.enableGPUAcceleration = options.enableGPUAcceleration
    if (options.memoryLimit !== undefined) this.memoryLimit = options.memoryLimit
  }

  /**
   * Get current configuration
   */
  getConfiguration(): {
    bufferSize: number
    maxConcurrentRenders: number
    enableGPUAcceleration: boolean
    memoryLimit: number
  } {
    return {
      bufferSize: this.bufferSize,
      maxConcurrentRenders: this.maxConcurrentRenders,
      enableGPUAcceleration: this.enableGPUAcceleration,
      memoryLimit: this.memoryLimit,
    }
  }

  /**
   * Clear all caches and reset state
   */
  clearCaches(): void {
    this.visibleItems.clear()
    this.renderQueue = []
    this.activeRenders.clear()
  }
}

/**
 * Virtual Scrolling Manager
 */
export class VirtualScrollingManager {
  private scrollPosition = { x: 0, y: 0 }
  private scrollVelocity = { x: 0, y: 0 }
  private lastScrollTime = 0
  private momentumScrolling = true
  private bounceEnabled = true

  /**
   * Handle scroll event with momentum
   */
  handleScroll(
    deltaX: number,
    deltaY: number,
    timestamp: number,
  ): {
    newPosition: { x: number; y: number }
    velocity: { x: number; y: number }
    shouldRender: boolean
  } {
    const timeDelta = timestamp - this.lastScrollTime
    this.lastScrollTime = timestamp

    if (timeDelta > 0) {
      // Calculate velocity for momentum scrolling
      const alpha = 0.8 // Smoothing factor
      this.scrollVelocity.x = alpha * this.scrollVelocity.x + (1 - alpha) * (deltaX / timeDelta)
      this.scrollVelocity.y = alpha * this.scrollVelocity.y + (1 - alpha) * (deltaY / timeDelta)
    }

    // Update position
    this.scrollPosition.x += deltaX
    this.scrollPosition.y += deltaY

    // Apply constraints if bounce is disabled
    if (!this.bounceEnabled) {
      this.scrollPosition.x = Math.max(0, this.scrollPosition.x)
      this.scrollPosition.y = Math.max(0, this.scrollPosition.y)
    }

    return {
      newPosition: { ...this.scrollPosition },
      velocity: { ...this.scrollVelocity },
      shouldRender: Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1,
    }
  }

  /**
   * Apply momentum scrolling
   */
  applyMomentum(deltaTime: number): {
    position: { x: number; y: number }
    velocity: { x: number; y: number }
    isDecelerating: boolean
  } {
    if (!this.momentumScrolling) {
      return {
        position: { ...this.scrollPosition },
        velocity: { ...this.scrollVelocity },
        isDecelerating: false,
      }
    }

    // Apply friction
    const friction = 0.95
    this.scrollVelocity.x *= friction
    this.scrollVelocity.y *= friction

    // Apply velocity to position
    this.scrollPosition.x += this.scrollVelocity.x * deltaTime
    this.scrollPosition.y += this.scrollVelocity.y * deltaTime

    // Check if still decelerating
    const isDecelerating = Math.abs(this.scrollVelocity.x) > 0.01 || Math.abs(this.scrollVelocity.y) > 0.01

    if (!isDecelerating) {
      this.scrollVelocity = { x: 0, y: 0 }
    }

    return {
      position: { ...this.scrollPosition },
      velocity: { ...this.scrollVelocity },
      isDecelerating,
    }
  }

  /**
   * Set scroll position directly
   */
  setScrollPosition(x: number, y: number): void {
    this.scrollPosition = { x, y }
    this.scrollVelocity = { x: 0, y: 0 }
  }

  /**
   * Get current scroll state
   */
  getScrollState(): {
    position: { x: number; y: number }
    velocity: { x: number; y: number }
  } {
    return {
      position: { ...this.scrollPosition },
      velocity: { ...this.scrollVelocity },
    }
  }

  /**
   * Configure scrolling behavior
   */
  configure(options: { momentumScrolling?: boolean; bounceEnabled?: boolean }): void {
    if (options.momentumScrolling !== undefined) this.momentumScrolling = options.momentumScrolling
    if (options.bounceEnabled !== undefined) this.bounceEnabled = options.bounceEnabled
  }
}

/**
 * GPU-Accelerated Clip Renderer
 */
export class GPUClipRenderer {
  private canvas: HTMLCanvasElement | null = null
  private gl: WebGLRenderingContext | null = null
  private clipProgram: WebGLProgram | null = null
  private vertexBuffer: WebGLBuffer | null = null
  private clipTextureCache = new Map<string, WebGLTexture>()

  /**
   * Initialize WebGL context
   */
  initialize(canvas: HTMLCanvasElement): boolean {
    this.canvas = canvas
    this.gl = canvas.getContext("webgl")

    if (!this.gl) return false

    // Initialize shaders and buffers
    this.initializeShaders()
    this.initializeBuffers()

    return true
  }

  /**
   * Render clips using GPU acceleration
   */
  renderClips(
    clips: TimelineClip[],
    timeScale: number,
    scrollX: number,
    viewportWidth: number,
    viewportHeight: number,
  ): void {
    if (!this.gl || !this.clipProgram) return

    this.gl.viewport(0, 0, viewportWidth, viewportHeight)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    clips.forEach((clip) => {
      this.renderSingleClip(clip, timeScale, scrollX)
    })
  }

  /**
   * Render single clip
   */
  private renderSingleClip(clip: TimelineClip, timeScale: number, scrollX: number): void {
    if (!this.gl || !this.clipProgram) return

    // Calculate clip position and size in screen coordinates
    const clipStart = (clip.startTime - scrollX) * timeScale
    const clipWidth = clip.duration * timeScale
    const clipHeight = 40 // Fixed height for now

    // Skip if outside viewport
    if (clipStart + clipWidth < 0 || clipStart > this.canvas!.width) return

    // Set up shader uniforms
    const uPosition = this.gl.getUniformLocation(this.clipProgram, "u_position")
    const uSize = this.gl.getUniformLocation(this.clipProgram, "u_size")
    const uColor = this.gl.getUniformLocation(this.clipProgram, "u_color")

    this.gl.uniform2f(uPosition, clipStart, 0)
    this.gl.uniform2f(uSize, clipWidth, clipHeight)
    this.gl.uniform3f(uColor, 0.2, 0.6, 0.8) // Blue color for clips

    // Draw clip rectangle
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }

  /**
   * Initialize WebGL shaders
   */
  private initializeShaders(): void {
    if (!this.gl) return

    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      `
      attribute vec2 a_position;
      uniform vec2 u_position;
      uniform vec2 u_size;
      uniform vec2 u_resolution;

      void main() {
        vec2 position = (a_position * u_size + u_position) / u_resolution * 2.0 - 1.0;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,
    )

    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      uniform vec3 u_color;

      void main() {
        gl_FragColor = vec4(u_color, 1.0);
      }
    `,
    )

    if (vertexShader && fragmentShader) {
      this.clipProgram = this.createProgram(vertexShader, fragmentShader)
    }
  }

  /**
   * Initialize WebGL buffers
   */
  private initializeBuffers(): void {
    if (!this.gl) return

    this.vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)

    // Rectangle vertices (0,0), (1,0), (0,1), (1,1)
    const vertices = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])

    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

    const positionAttributeLocation = this.gl.getAttribLocation(this.clipProgram!, "a_position")
    this.gl.enableVertexAttribArray(positionAttributeLocation)
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
  }

  /**
   * Create WebGL shader
   */
  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null

    const shader = this.gl.createShader(type)
    if (!shader) return null

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      return null
    }

    return shader
  }

  /**
   * Create WebGL program
   */
  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    if (!this.gl) return null

    const program = this.gl.createProgram()
    if (!program) return null

    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("Program linking error:", this.gl.getProgramInfoLog(program))
      this.gl.deleteProgram(program)
      return null
    }

    return program
  }

  /**
   * Clean up GPU resources
   */
  destroy(): void {
    if (this.gl) {
      if (this.clipProgram) this.gl.deleteProgram(this.clipProgram)
      if (this.vertexBuffer) this.gl.deleteBuffer(this.vertexBuffer)

      this.clipTextureCache.forEach((texture) => this.gl!.deleteTexture(texture))
      this.clipTextureCache.clear()
    }
  }
}

// Export singleton instances
export const virtualizedTimelineRenderer = VirtualizedTimelineRenderer.getInstance()
export const virtualScrollingManager = new VirtualScrollingManager()
export const gpuClipRenderer = new GPUClipRenderer()
