/**
 * Magnetic Timeline - Smart Snap Zones and Proximity Detection
 *
 * Provides intelligent snapping for professional timeline editing
 * with visual feedback and customizable snap behavior
 */

import type { TimelineClip, TimelineMarker } from "../types/timeline"

/**
 * Snap Target Types
 */
export enum SnapTargetType {
  CLIP_EDGE = "clip_edge",
  CLIP_CENTER = "clip_center",
  MARKER = "marker",
  PLAYHEAD = "playhead",
  GRID = "grid",
  SECTION_BOUNDARY = "section_boundary",
  TRANSITION = "transition",
}

/**
 * Snap Target Interface
 */
export interface SnapTarget {
  id: string
  type: SnapTargetType
  time: number
  strength: number // 0-1, how strongly it attracts
  priority: number // Higher priority targets snap first
  visual: {
    color: string
    label?: string
    showLine: boolean
    showLabel: boolean
  }
  metadata?: {
    clipId?: string
    markerId?: string
    trackId?: string
    sectionId?: string
  }
}

/**
 * Snap Zone Configuration
 */
export interface SnapZone {
  center: number // Time in seconds
  radius: number // Snap radius in seconds
  strength: number // Snap strength multiplier
  type: SnapTargetType
  targets: SnapTarget[]
}

/**
 * Magnetic Timeline Engine
 */
export class MagneticTimelineEngine {
  private static instance: MagneticTimelineEngine

  // Configuration
  private snapThreshold = 0.1 // seconds
  private snapStrength = 0.8 // 0-1
  private proximityRadius = 0.5 // seconds
  private showSnapLines = true
  private snapToGrid = true
  private gridSize = 1.0 // seconds

  // Snap targets cache
  private snapTargets: SnapTarget[] = []
  private lastUpdateTime = 0

  static getInstance(): MagneticTimelineEngine {
    if (!MagneticTimelineEngine.instance) {
      MagneticTimelineEngine.instance = new MagneticTimelineEngine()
    }
    return MagneticTimelineEngine.instance
  }

  /**
   * Update snap targets from timeline data
   */
  updateSnapTargets(clips: TimelineClip[], markers: TimelineMarker[], currentTime: number, timeScale: number): void {
    this.snapTargets = []

    // Add clip edges
    clips.forEach((clip) => {
      // Start edge
      this.snapTargets.push({
        id: `clip-start-${clip.id}`,
        type: SnapTargetType.CLIP_EDGE,
        time: clip.startTime,
        strength: 0.9,
        priority: 10,
        visual: {
          color: "#3b82f6",
          label: "Clip Start",
          showLine: true,
          showLabel: false,
        },
        metadata: {
          clipId: clip.id,
        },
      })

      // End edge
      this.snapTargets.push({
        id: `clip-end-${clip.id}`,
        type: SnapTargetType.CLIP_EDGE,
        time: clip.startTime + clip.duration,
        strength: 0.9,
        priority: 10,
        visual: {
          color: "#3b82f6",
          label: "Clip End",
          showLine: true,
          showLabel: false,
        },
        metadata: {
          clipId: clip.id,
        },
      })

      // Center (for alignment)
      this.snapTargets.push({
        id: `clip-center-${clip.id}`,
        type: SnapTargetType.CLIP_CENTER,
        time: clip.startTime + clip.duration / 2,
        strength: 0.6,
        priority: 5,
        visual: {
          color: "#6b7280",
          label: "Clip Center",
          showLine: false,
          showLabel: false,
        },
        metadata: {
          clipId: clip.id,
        },
      })
    })

    // Add markers
    markers.forEach((marker) => {
      this.snapTargets.push({
        id: `marker-${marker.id}`,
        type: SnapTargetType.MARKER,
        time: marker.time,
        strength: 0.8,
        priority: 8,
        visual: {
          color: marker.color || "#ef4444",
          label: marker.name,
          showLine: true,
          showLabel: true,
        },
        metadata: {
          markerId: marker.id,
        },
      })
    })

    // Add playhead
    if (currentTime >= 0) {
      this.snapTargets.push({
        id: "playhead",
        type: SnapTargetType.PLAYHEAD,
        time: currentTime,
        strength: 0.7,
        priority: 15, // High priority
        visual: {
          color: "#10b981",
          label: "Playhead",
          showLine: true,
          showLabel: false,
        },
      })
    }

    // Add grid lines if enabled
    if (this.snapToGrid) {
      this.addGridSnapTargets(timeScale)
    }

    // Sort by priority (higher first)
    this.snapTargets.sort((a, b) => b.priority - a.priority)
    this.lastUpdateTime = Date.now()
  }

  /**
   * Add grid-based snap targets
   */
  private addGridSnapTargets(timeScale: number): void {
    // Calculate visible time range (rough estimate)
    const visibleDuration = 100 / timeScale // pixels per second * 100 pixels

    // Generate grid lines within reasonable range
    const startTime = Math.max(0, Math.floor(Date.now() / 1000) - visibleDuration)
    const endTime = startTime + visibleDuration * 2

    for (let time = startTime; time <= endTime; time += this.gridSize) {
      this.snapTargets.push({
        id: `grid-${time}`,
        type: SnapTargetType.GRID,
        time,
        strength: 0.4,
        priority: 1,
        visual: {
          color: "#9ca3af",
          showLine: false,
          showLabel: false,
        },
      })
    }
  }

  /**
   * Find the best snap target for a given time
   */
  findSnapTarget(currentTime: number, excludedTargets: string[] = []): SnapResult | null {
    let bestTarget: SnapTarget | null = null
    let bestDistance = this.snapThreshold
    let bestStrength = 0

    for (const target of this.snapTargets) {
      if (excludedTargets.includes(target.id)) continue

      const distance = Math.abs(currentTime - target.time)
      if (distance <= this.snapThreshold) {
        // Calculate effective strength based on distance and target strength
        const effectiveStrength = target.strength * (1 - distance / this.snapThreshold)

        if (effectiveStrength > bestStrength) {
          bestTarget = target
          bestDistance = distance
          bestStrength = effectiveStrength
        }
      }
    }

    if (bestTarget) {
      return {
        target: bestTarget,
        snappedTime: bestTarget.time,
        originalTime: currentTime,
        distance: bestDistance,
        strength: bestStrength,
      }
    }

    return null
  }

  /**
   * Find multiple snap targets within proximity
   */
  findNearbySnapTargets(currentTime: number, radius: number = this.proximityRadius): SnapTarget[] {
    return this.snapTargets
      .filter((target) => Math.abs(currentTime - target.time) <= radius)
      .sort((a, b) => {
        const distA = Math.abs(currentTime - a.time)
        const distB = Math.abs(currentTime - b.time)
        return distA - distB
      })
  }

  /**
   * Calculate snap zones for visual feedback
   */
  calculateSnapZones(currentTime: number): SnapZone[] {
    const zones: SnapZone[] = []
    const nearbyTargets = this.findNearbySnapTargets(currentTime)

    nearbyTargets.forEach((target) => {
      const distance = Math.abs(currentTime - target.time)
      if (distance <= this.proximityRadius) {
        zones.push({
          center: target.time,
          radius: Math.max(0.1, distance * 0.5),
          strength: target.strength * (1 - distance / this.proximityRadius),
          type: target.type,
          targets: [target],
        })
      }
    })

    return zones
  }

  /**
   * Apply magnetic snapping to a time value
   */
  snapTime(currentTime: number, snapEnabled: boolean = true, excludedTargets: string[] = []): SnapResult | null {
    if (!snapEnabled) return null

    return this.findSnapTarget(currentTime, excludedTargets)
  }

  /**
   * Get visual snap indicators
   */
  getSnapIndicators(currentTime: number): SnapIndicator[] {
    if (!this.showSnapLines) return []

    const indicators: SnapIndicator[] = []
    const nearbyTargets = this.findNearbySnapTargets(currentTime, 2.0) // 2 second radius

    nearbyTargets.forEach((target) => {
      if (target.visual.showLine) {
        indicators.push({
          time: target.time,
          color: target.color,
          label: target.visual.showLabel ? target.visual.label : undefined,
          opacity: Math.max(0.3, target.strength * 0.7),
        })
      }
    })

    return indicators
  }

  /**
   * Configure snapping behavior
   */
  configure(options: {
    snapThreshold?: number
    snapStrength?: number
    proximityRadius?: number
    showSnapLines?: boolean
    snapToGrid?: boolean
    gridSize?: number
  }): void {
    if (options.snapThreshold !== undefined) this.snapThreshold = options.snapThreshold
    if (options.snapStrength !== undefined) this.snapStrength = options.snapStrength
    if (options.proximityRadius !== undefined) this.proximityRadius = options.proximityRadius
    if (options.showSnapLines !== undefined) this.showSnapLines = options.showSnapLines
    if (options.snapToGrid !== undefined) this.snapToGrid = options.snapToGrid
    if (options.gridSize !== undefined) this.gridSize = options.gridSize
  }

  /**
   * Get current configuration
   */
  getConfiguration(): {
    snapThreshold: number
    snapStrength: number
    proximityRadius: number
    showSnapLines: boolean
    snapToGrid: boolean
    gridSize: number
  } {
    return {
      snapThreshold: this.snapThreshold,
      snapStrength: this.snapStrength,
      proximityRadius: this.proximityRadius,
      showSnapLines: this.showSnapLines,
      snapToGrid: this.snapToGrid,
      gridSize: this.gridSize,
    }
  }

  /**
   * Clear all snap targets
   */
  clearSnapTargets(): void {
    this.snapTargets = []
  }

  /**
   * Get all current snap targets
   */
  getSnapTargets(): SnapTarget[] {
    return [...this.snapTargets]
  }
}

/**
 * Snap Result Interface
 */
export interface SnapResult {
  target: SnapTarget
  snappedTime: number
  originalTime: number
  distance: number
  strength: number
}

/**
 * Snap Indicator for Visual Feedback
 */
export interface SnapIndicator {
  time: number
  color: string
  label?: string
  opacity: number
}

/**
 * Advanced Snap Detection Algorithm
 */
export class AdvancedSnapDetector {
  /**
   * Multi-target snap detection with priority weighting
   */
  static findBestSnapTarget(
    currentTime: number,
    targets: SnapTarget[],
    options: {
      maxDistance?: number
      priorityWeight?: number
      temporalWeight?: number
    } = {},
  ): SnapResult | null {
    const { maxDistance = 0.5, priorityWeight = 0.7, temporalWeight = 0.3 } = options

    let bestTarget: SnapTarget | null = null
    let bestScore = 0

    for (const target of targets) {
      const distance = Math.abs(currentTime - target.time)

      if (distance <= maxDistance) {
        // Calculate composite score
        const distanceScore = 1 - distance / maxDistance
        const priorityScore = target.priority / 10 // Normalize to 0-1
        const strengthScore = target.strength

        const compositeScore =
          distanceScore * temporalWeight +
          priorityScore * priorityWeight +
          strengthScore * (1 - priorityWeight - temporalWeight)

        if (compositeScore > bestScore) {
          bestTarget = target
          bestScore = compositeScore
        }
      }
    }

    if (bestTarget) {
      const distance = Math.abs(currentTime - bestTarget.time)
      return {
        target: bestTarget,
        snappedTime: bestTarget.time,
        originalTime: currentTime,
        distance,
        strength: bestScore,
      }
    }

    return null
  }

  /**
   * Predictive snapping for smooth user interaction
   */
  static predictSnapTarget(
    currentTime: number,
    velocity: number, // pixels per second
    targets: SnapTarget[],
    timeScale: number,
  ): SnapResult | null {
    if (Math.abs(velocity) < 10) return null // Minimum velocity threshold

    // Predict future position based on velocity
    const predictionTime = 0.2 // Look ahead 200ms
    const predictedTime = currentTime + (velocity / timeScale) * predictionTime

    // Find targets near predicted position
    const nearbyTargets = targets.filter((target) => Math.abs(predictedTime - target.time) <= 0.3)

    return AdvancedSnapDetector.findBestSnapTarget(predictedTime, nearbyTargets, {
      maxDistance: 0.3,
      priorityWeight: 0.5,
      temporalWeight: 0.5,
    })
  }

  /**
   * Group nearby snap targets into zones
   */
  static groupSnapTargets(targets: SnapTarget[], maxGroupDistance: number = 0.1): SnapTarget[][] {
    const groups: SnapTarget[][] = []
    const sortedTargets = [...targets].sort((a, b) => a.time - b.time)

    let currentGroup: SnapTarget[] = []

    for (const target of sortedTargets) {
      if (currentGroup.length === 0 || target.time - currentGroup[currentGroup.length - 1].time <= maxGroupDistance) {
        currentGroup.push(target)
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup)
        }
        currentGroup = [target]
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }
}

/**
 * Timeline Interaction Handler with Magnetic Snapping
 */
export class MagneticTimelineInteraction {
  private engine = MagneticTimelineEngine.getInstance()
  private isDragging = false
  private dragStartTime = 0
  private currentSnapResult: SnapResult | null = null

  /**
   * Handle timeline interaction with magnetic snapping
   */
  handleInteraction(
    event: MouseEvent | TouchEvent,
    timelineRect: DOMRect,
    timeScale: number,
    snapEnabled: boolean = true,
  ): {
    time: number
    snapped: boolean
    snapResult: SnapResult | null
  } {
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX
    const relativeX = clientX - timelineRect.left
    const time = relativeX / timeScale

    if (!snapEnabled) {
      return { time, snapped: false, snapResult: null }
    }

    const snapResult = this.engine.snapTime(time)

    if (snapResult) {
      this.currentSnapResult = snapResult
      return {
        time: snapResult.snappedTime,
        snapped: true,
        snapResult,
      }
    }

    this.currentSnapResult = null
    return { time, snapped: false, snapResult: null }
  }

  /**
   * Start drag operation
   */
  startDrag(startTime: number): void {
    this.isDragging = true
    this.dragStartTime = startTime
    this.currentSnapResult = null
  }

  /**
   * Update drag with magnetic feedback
   */
  updateDrag(
    currentTime: number,
    velocity: number = 0,
    timeScale: number = 60,
  ): {
    time: number
    snapped: boolean
    snapResult: SnapResult | null
  } {
    if (!this.isDragging) {
      return { time: currentTime, snapped: false, snapResult: null }
    }

    // Use predictive snapping for smooth interaction
    const predictiveSnap = AdvancedSnapDetector.predictSnapTarget(
      currentTime,
      velocity,
      this.engine.getSnapTargets(),
      timeScale,
    )

    if (predictiveSnap) {
      this.currentSnapResult = predictiveSnap
      return {
        time: predictiveSnap.snappedTime,
        snapped: true,
        snapResult: predictiveSnap,
      }
    }

    // Fall back to regular snapping
    const snapResult = this.engine.snapTime(currentTime)
    if (snapResult) {
      this.currentSnapResult = snapResult
      return {
        time: snapResult.snappedTime,
        snapped: true,
        snapResult,
      }
    }

    this.currentSnapResult = null
    return { time: currentTime, snapped: false, snapResult: null }
  }

  /**
   * End drag operation
   */
  endDrag(): SnapResult | null {
    const result = this.currentSnapResult
    this.isDragging = false
    this.currentSnapResult = null
    return result
  }

  /**
   * Get current snap indicators for visual feedback
   */
  getSnapIndicators(currentTime: number): SnapIndicator[] {
    return this.engine.getSnapIndicators(currentTime)
  }

  /**
   * Get snap zones for visual feedback
   */
  getSnapZones(currentTime: number): SnapZone[] {
    return this.engine.calculateSnapZones(currentTime)
  }
}

// Export singleton instances
export const magneticTimelineEngine = MagneticTimelineEngine.getInstance()
export const advancedSnapDetector = AdvancedSnapDetector
export const magneticTimelineInteraction = new MagneticTimelineInteraction()
