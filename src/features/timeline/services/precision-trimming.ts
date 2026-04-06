/**
 * Precision Trimming - Advanced Edit Modes (Ripple, Roll, Slip, Slide)
 *
 * Professional trimming tools with multiple edit modes and precision controls
 */

import type { TimelineClip, TimelineTrack } from "../types/timeline"

/**
 * Edit Mode Types
 */
export enum EditMode {
  SELECT = "select",
  RIPPLE = "ripple", // Moves subsequent clips when trimming
  ROLL = "roll", // Adjusts adjacent clip boundaries
  SLIP = "slip", // Moves media within clip without changing duration
  SLIDE = "slide", // Moves entire clip, rippling adjacent clips
  TRIM = "trim", // Simple trim without affecting other clips
}

/**
 * Trim Handle Types
 */
export enum TrimHandle {
  START = "start",
  END = "end",
  BOTH = "both",
}

/**
 * Precision Trim Operation
 */
export interface TrimOperation {
  clipId: string
  handle: TrimHandle
  mode: EditMode
  originalTime: number
  newTime: number
  delta: number
  affectedClips: string[]
  canExecute: boolean
  preview: boolean
}

/**
 * Ripple Edit Result
 */
export interface RippleEditResult {
  primaryClip: Partial<TimelineClip>
  affectedClips: Array<{
    clipId: string
    originalClip: TimelineClip
    modifiedClip: Partial<TimelineClip>
  }>
  totalTimeShift: number
  valid: boolean
  conflicts: string[]
}

/**
 * Roll Edit Result
 */
export interface RollEditResult {
  leftClip: {
    clipId: string
    originalEndTime: number
    newEndTime: number
  }
  rightClip: {
    clipId: string
    originalStartTime: number
    newStartTime: number
  }
  valid: boolean
  conflicts: string[]
}

/**
 * Precision Trimming Engine
 */
export class PrecisionTrimmingEngine {
  private static instance: PrecisionTrimmingEngine

  // Configuration
  private minClipDuration = 0.1 // Minimum clip duration in seconds
  private maxRippleDistance = 3600 // Maximum ripple distance (1 hour)
  private enableAudioScrubbing = true
  private snapToFrames = true
  private frameRate = 30

  static getInstance(): PrecisionTrimmingEngine {
    if (!PrecisionTrimmingEngine.instance) {
      PrecisionTrimmingEngine.instance = new PrecisionTrimmingEngine()
    }
    return PrecisionTrimmingEngine.instance
  }

  /**
   * Execute precision trim operation
   */
  executeTrim(
    operation: TrimOperation,
    clips: TimelineClip[],
    tracks: TimelineTrack[],
  ): {
    result: TimelineClip[]
    rippleResult?: RippleEditResult
    rollResult?: RollEditResult
    valid: boolean
    conflicts: string[]
  } {
    const conflicts: string[] = []

    // Validate operation
    const validation = this.validateTrimOperation(operation, clips)
    if (!validation.valid) {
      return {
        result: clips,
        valid: false,
        conflicts: validation.errors,
      }
    }

    let result: TimelineClip[] = [...clips]

    switch (operation.mode) {
      case EditMode.RIPPLE:
        const rippleResult = this.executeRippleTrim(operation, clips, tracks)
        if (rippleResult.valid) {
          result = this.applyRippleResult(rippleResult, clips)
          return { result, rippleResult, valid: true, conflicts: [] }
        }
        return { result: clips, rippleResult, valid: false, conflicts: rippleResult.conflicts }

      case EditMode.ROLL:
        const rollResult = this.executeRollTrim(operation, clips)
        if (rollResult.valid) {
          result = this.applyRollResult(rollResult, clips)
          return { result, rollResult, valid: true, conflicts: [] }
        }
        return { result: clips, rollResult, valid: false, conflicts: rollResult.conflicts }

      case EditMode.SLIP:
        result = this.executeSlipTrim(operation, clips)
        return { result, valid: true, conflicts: [] }

      case EditMode.SLIDE:
        const slideResult = this.executeSlideTrim(operation, clips, tracks)
        result = slideResult.clips
        return { result, valid: slideResult.valid, conflicts: slideResult.conflicts }

      case EditMode.TRIM:
      default:
        result = this.executeSimpleTrim(operation, clips)
        return { result, valid: true, conflicts: [] }
    }
  }

  /**
   * Preview trim operation without executing
   */
  previewTrim(
    operation: TrimOperation,
    clips: TimelineClip[],
    tracks: TimelineTrack[],
  ): {
    previewClips: TimelineClip[]
    affectedClips: string[]
    valid: boolean
    warnings: string[]
  } {
    operation.preview = true
    const result = this.executeTrim(operation, clips, tracks)

    return {
      previewClips: result.result,
      affectedClips:
        result.rippleResult?.affectedClips.map((a) => a.clipId) || result.rollResult
          ? [result.rollResult.leftClip.clipId, result.rollResult.rightClip.clipId]
          : [operation.clipId],
      valid: result.valid,
      warnings: result.conflicts,
    }
  }

  /**
   * Execute ripple trim (moves subsequent clips)
   */
  private executeRippleTrim(
    operation: TrimOperation,
    clips: TimelineClip[],
    tracks: TimelineTrack[],
  ): RippleEditResult {
    const targetClip = clips.find((c) => c.id === operation.clipId)
    if (!targetClip) {
      return {
        primaryClip: {},
        affectedClips: [],
        totalTimeShift: 0,
        valid: false,
        conflicts: ["Target clip not found"],
      }
    }

    const affectedClips: RippleEditResult["affectedClips"] = []
    let totalTimeShift = 0

    // Calculate the time shift based on trim operation
    switch (operation.handle) {
      case TrimHandle.START:
        totalTimeShift = operation.originalTime - operation.newTime
        break
      case TrimHandle.END:
        totalTimeShift = operation.newTime - operation.originalTime
        break
    }

    // Validate total shift doesn't exceed limits
    if (Math.abs(totalTimeShift) > this.maxRippleDistance) {
      return {
        primaryClip: {},
        affectedClips: [],
        totalTimeShift: 0,
        valid: false,
        conflicts: [`Ripple distance ${Math.abs(totalTimeShift)}s exceeds maximum ${this.maxRippleDistance}s`],
      }
    }

    // Find clips that come after the target clip on the same track
    const trackClips = clips.filter((c) => c.trackId === targetClip.trackId).sort((a, b) => a.startTime - b.startTime)

    const targetIndex = trackClips.findIndex((c) => c.id === operation.clipId)

    // Apply ripple to subsequent clips
    for (let i = targetIndex + 1; i < trackClips.length; i++) {
      const clip = trackClips[i]
      affectedClips.push({
        clipId: clip.id,
        originalClip: { ...clip },
        modifiedClip: {
          startTime: clip.startTime + totalTimeShift,
          endTime: clip.endTime + totalTimeShift,
        },
      })
    }

    // Create primary clip modification
    const primaryClip: Partial<TimelineClip> = {}
    switch (operation.handle) {
      case TrimHandle.START:
        primaryClip.startTime = operation.newTime
        primaryClip.duration = targetClip.duration + (operation.originalTime - operation.newTime)
        break
      case TrimHandle.END:
        primaryClip.endTime = operation.newTime
        primaryClip.duration = targetClip.duration + (operation.newTime - operation.originalTime)
        break
    }

    return {
      primaryClip,
      affectedClips,
      totalTimeShift,
      valid: true,
      conflicts: [],
    }
  }

  /**
   * Execute roll trim (adjusts adjacent clip boundaries)
   */
  private executeRollTrim(operation: TrimOperation, clips: TimelineClip[]): RollEditResult {
    const targetClip = clips.find((c) => c.id === operation.clipId)
    if (!targetClip) {
      return {
        leftClip: { clipId: "", originalEndTime: 0, newEndTime: 0 },
        rightClip: { clipId: "", originalStartTime: 0, newStartTime: 0 },
        valid: false,
        conflicts: ["Target clip not found"],
      }
    }

    // Find adjacent clips on the same track
    const trackClips = clips.filter((c) => c.trackId === targetClip.trackId).sort((a, b) => a.startTime - b.startTime)

    const targetIndex = trackClips.findIndex((c) => c.id === operation.clipId)

    if (targetIndex === -1) {
      return {
        leftClip: { clipId: "", originalEndTime: 0, newEndTime: 0 },
        rightClip: { clipId: "", originalStartTime: 0, newStartTime: 0 },
        valid: false,
        conflicts: ["Target clip not found on track"],
      }
    }

    const leftClip = targetIndex > 0 ? trackClips[targetIndex - 1] : null
    const rightClip = targetIndex < trackClips.length - 1 ? trackClips[targetIndex + 1] : null

    if (!leftClip && !rightClip) {
      return {
        leftClip: { clipId: "", originalEndTime: 0, newEndTime: 0 },
        rightClip: { clipId: "", originalStartTime: 0, newStartTime: 0 },
        valid: false,
        conflicts: ["No adjacent clips for roll edit"],
      }
    }

    let newTime = operation.newTime

    // Validate against adjacent clips
    if (leftClip && operation.handle === TrimHandle.START) {
      newTime = Math.max(newTime, leftClip.startTime + this.minClipDuration)
    }
    if (rightClip && operation.handle === TrimHandle.END) {
      newTime = Math.min(newTime, rightClip.endTime - this.minClipDuration)
    }

    const result: RollEditResult = {
      leftClip: {
        clipId: leftClip?.id || "",
        originalEndTime: leftClip?.endTime || 0,
        newEndTime: operation.handle === TrimHandle.START && leftClip ? newTime : leftClip?.endTime || 0,
      },
      rightClip: {
        clipId: rightClip?.id || "",
        originalStartTime: rightClip?.startTime || 0,
        newStartTime: operation.handle === TrimHandle.END && rightClip ? newTime : rightClip?.startTime || 0,
      },
      valid: true,
      conflicts: [],
    }

    return result
  }

  /**
   * Execute slip trim (moves media within clip)
   */
  private executeSlipTrim(operation: TrimOperation, clips: TimelineClip[]): TimelineClip[] {
    return clips.map((clip) => {
      if (clip.id !== operation.clipId) return clip

      const delta = operation.newTime - operation.originalTime
      const newClip = { ...clip }

      switch (operation.handle) {
        case TrimHandle.START:
          newClip.mediaStartTime = (clip.mediaStartTime || 0) + delta
          break
        case TrimHandle.END:
          newClip.mediaEndTime = (clip.mediaEndTime || clip.duration) + delta
          break
      }

      return newClip
    })
  }

  /**
   * Execute slide trim (moves entire clip with ripple)
   */
  private executeSlideTrim(
    operation: TrimOperation,
    clips: TimelineClip[],
    tracks: TimelineTrack[],
  ): { clips: TimelineClip[]; valid: boolean; conflicts: string[] } {
    const targetClip = clips.find((c) => c.id === operation.clipId)
    if (!targetClip) {
      return { clips, valid: false, conflicts: ["Target clip not found"] }
    }

    const delta = operation.newTime - operation.originalTime

    // Find clips that would be affected by the slide
    const affectedClips = clips.filter(
      (c) =>
        c.trackId === targetClip.trackId &&
        c.id !== targetClip.id &&
        ((c.startTime >= targetClip.startTime && c.startTime < targetClip.endTime) ||
          (c.endTime > targetClip.startTime && c.endTime <= targetClip.endTime)),
    )

    if (affectedClips.length > 0) {
      return {
        clips,
        valid: false,
        conflicts: ["Slide operation would overlap with adjacent clips"],
      }
    }

    // Execute ripple trim for the slide operation
    const rippleOperation: TrimOperation = {
      ...operation,
      handle: TrimHandle.BOTH,
    }

    const rippleResult = this.executeRippleTrim(rippleOperation, clips, tracks)
    if (!rippleResult.valid) {
      return { clips, valid: false, conflicts: rippleResult.conflicts }
    }

    const resultClips = this.applyRippleResult(rippleResult, clips)
    return { clips: resultClips, valid: true, conflicts: [] }
  }

  /**
   * Execute simple trim without affecting other clips
   */
  private executeSimpleTrim(operation: TrimOperation, clips: TimelineClip[]): TimelineClip[] {
    return clips.map((clip) => {
      if (clip.id !== operation.clipId) return clip

      const newClip = { ...clip }

      switch (operation.handle) {
        case TrimHandle.START:
          newClip.startTime = operation.newTime
          newClip.duration = clip.duration - (operation.newTime - clip.startTime)
          break
        case TrimHandle.END:
          newClip.duration = operation.newTime - clip.startTime
          break
      }

      return newClip
    })
  }

  /**
   * Apply ripple edit result to clip array
   */
  private applyRippleResult(result: RippleEditResult, clips: TimelineClip[]): TimelineClip[] {
    return clips.map((clip) => {
      // Apply primary clip changes
      if (clip.id === result.primaryClip.id) {
        return { ...clip, ...result.primaryClip }
      }

      // Apply affected clip changes
      const affected = result.affectedClips.find((a) => a.clipId === clip.id)
      if (affected) {
        return { ...clip, ...affected.modifiedClip }
      }

      return clip
    })
  }

  /**
   * Apply roll edit result to clip array
   */
  private applyRollResult(result: RollEditResult, clips: TimelineClip[]): TimelineClip[] {
    return clips.map((clip) => {
      if (clip.id === result.leftClip.clipId) {
        return { ...clip, endTime: result.leftClip.newEndTime }
      }
      if (clip.id === result.rightClip.clipId) {
        return { ...clip, startTime: result.rightClip.newStartTime }
      }
      return clip
    })
  }

  /**
   * Validate trim operation
   */
  private validateTrimOperation(operation: TrimOperation, clips: TimelineClip[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const targetClip = clips.find((c) => c.id === operation.clipId)

    if (!targetClip) {
      errors.push("Target clip not found")
      return { valid: false, errors }
    }

    // Validate minimum duration
    let newDuration = targetClip.duration
    switch (operation.handle) {
      case TrimHandle.START:
        newDuration = targetClip.duration - (operation.newTime - targetClip.startTime)
        break
      case TrimHandle.END:
        newDuration = operation.newTime - targetClip.startTime
        break
    }

    if (newDuration < this.minClipDuration) {
      errors.push(`Clip duration ${newDuration.toFixed(2)}s is below minimum ${this.minClipDuration}s`)
    }

    // Validate against adjacent clips for certain modes
    if (operation.mode === EditMode.ROLL) {
      const trackClips = clips.filter((c) => c.trackId === targetClip.trackId).sort((a, b) => a.startTime - b.startTime)

      const targetIndex = trackClips.findIndex((c) => c.id === operation.clipId)

      if (operation.handle === TrimHandle.START && targetIndex > 0) {
        const leftClip = trackClips[targetIndex - 1]
        if (operation.newTime < leftClip.startTime + this.minClipDuration) {
          errors.push("Trim would make left adjacent clip too short")
        }
      }

      if (operation.handle === TrimHandle.END && targetIndex < trackClips.length - 1) {
        const rightClip = trackClips[targetIndex + 1]
        if (operation.newTime > rightClip.endTime - this.minClipDuration) {
          errors.push("Trim would make right adjacent clip too short")
        }
      }
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Snap time to frame boundaries if enabled
   */
  snapToFrame(time: number): number {
    if (!this.snapToFrames) return time
    const frameDuration = 1 / this.frameRate
    return Math.round(time / frameDuration) * frameDuration
  }

  /**
   * Configure trimming behavior
   */
  configure(options: {
    minClipDuration?: number
    maxRippleDistance?: number
    enableAudioScrubbing?: boolean
    snapToFrames?: boolean
    frameRate?: number
  }): void {
    if (options.minClipDuration !== undefined) this.minClipDuration = options.minClipDuration
    if (options.maxRippleDistance !== undefined) this.maxRippleDistance = options.maxRippleDistance
    if (options.enableAudioScrubbing !== undefined) this.enableAudioScrubbing = options.enableAudioScrubbing
    if (options.snapToFrames !== undefined) this.snapToFrames = options.snapToFrames
    if (options.frameRate !== undefined) this.frameRate = options.frameRate
  }

  /**
   * Get current configuration
   */
  getConfiguration(): {
    minClipDuration: number
    maxRippleDistance: number
    enableAudioScrubbing: boolean
    snapToFrames: boolean
    frameRate: number
  } {
    return {
      minClipDuration: this.minClipDuration,
      maxRippleDistance: this.maxRippleDistance,
      enableAudioScrubbing: this.enableAudioScrubbing,
      snapToFrames: this.snapToFrames,
      frameRate: this.frameRate,
    }
  }
}

/**
 * Trim Handle Manager for UI interactions
 */
export class TrimHandleManager {
  private activeHandle: TrimHandle | null = null
  private activeClipId: string | null = null
  private dragStartTime = 0
  private originalClip: TimelineClip | null = null

  /**
   * Start trim operation
   */
  startTrim(clipId: string, handle: TrimHandle, startTime: number, clips: TimelineClip[]): boolean {
    const clip = clips.find((c) => c.id === clipId)
    if (!clip) return false

    this.activeClipId = clipId
    this.activeHandle = handle
    this.dragStartTime = startTime
    this.originalClip = { ...clip }

    return true
  }

  /**
   * Update trim operation during drag
   */
  updateTrim(
    currentTime: number,
    mode: EditMode,
    clips: TimelineClip[],
    tracks: TimelineTrack[],
  ): {
    operation: TrimOperation | null
    preview: TimelineClip[]
    valid: boolean
  } {
    if (!this.activeClipId || !this.activeHandle || !this.originalClip) {
      return { operation: null, preview: clips, valid: false }
    }

    const operation: TrimOperation = {
      clipId: this.activeClipId,
      handle: this.activeHandle,
      mode,
      originalTime: this.dragStartTime,
      newTime: currentTime,
      delta: currentTime - this.dragStartTime,
      affectedClips: [],
      canExecute: false,
      preview: true,
    }

    const engine = PrecisionTrimmingEngine.getInstance()
    const preview = engine.previewTrim(operation, clips, tracks)

    return {
      operation,
      preview: preview.previewClips,
      valid: preview.valid,
    }
  }

  /**
   * Complete trim operation
   */
  completeTrim(
    clips: TimelineClip[],
    tracks: TimelineTrack[],
  ): {
    result: TimelineClip[]
    executed: boolean
    conflicts: string[]
  } {
    if (!this.activeClipId || !this.activeHandle) {
      return { result: clips, executed: false, conflicts: ["No active trim operation"] }
    }

    const operation: TrimOperation = {
      clipId: this.activeClipId,
      handle: this.activeHandle,
      mode: EditMode.TRIM, // Default mode, should be set by caller
      originalTime: this.dragStartTime,
      newTime: 0, // Should be set by caller
      delta: 0,
      affectedClips: [],
      canExecute: true,
      preview: false,
    }

    const engine = PrecisionTrimmingEngine.getInstance()
    const result = engine.executeTrim(operation, clips, tracks)

    this.reset()

    return {
      result: result.result,
      executed: result.valid,
      conflicts: result.conflicts,
    }
  }

  /**
   * Cancel trim operation
   */
  cancelTrim(): void {
    this.reset()
  }

  /**
   * Reset trim state
   */
  private reset(): void {
    this.activeHandle = null
    this.activeClipId = null
    this.dragStartTime = 0
    this.originalClip = null
  }

  /**
   * Get current trim state
   */
  getTrimState(): {
    active: boolean
    clipId: string | null
    handle: TrimHandle | null
  } {
    return {
      active: this.activeClipId !== null,
      clipId: this.activeClipId,
      handle: this.activeHandle,
    }
  }
}

// Export singleton instances
export const precisionTrimmingEngine = PrecisionTrimmingEngine.getInstance()
export const trimHandleManager = new TrimHandleManager()
