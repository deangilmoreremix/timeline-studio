/**
 * Speed Ramping Engine - Advanced Time Remapping
 *
 * Handles speed changes with bezier curves, optical flow, and audio pitch preservation
 */

import type { SpeedKeyframe, SpeedRampingConfig } from "../types/advanced-clips"

/**
 * Speed Ramping Engine for advanced time remapping
 */
export class SpeedRampingEngine {
  private static instance: SpeedRampingEngine

  static getInstance(): SpeedRampingEngine {
    if (!SpeedRampingEngine.instance) {
      SpeedRampingEngine.instance = new SpeedRampingEngine()
    }
    return SpeedRampingEngine.instance
  }

  /**
   * Calculate speed at a given time using bezier interpolation
   */
  calculateSpeedAtTime(config: SpeedRampingConfig, time: number): number {
    if (!config.enabled || !config.curve || config.curve.length === 0) {
      return 1.0
    }

    const curve = config.curve
    const normalizedTime = time // Assume time is already normalized 0-1

    // Find the segment that contains this time
    let segmentIndex = 0
    for (let i = 1; i < curve.length; i++) {
      if (normalizedTime <= curve[i].time) {
        segmentIndex = i - 1
        break
      }
    }

    if (segmentIndex >= curve.length - 1) {
      return curve[curve.length - 1].speed
    }

    const startKeyframe = curve[segmentIndex]
    const endKeyframe = curve[segmentIndex + 1]

    // Calculate local time within the segment
    const segmentDuration = endKeyframe.time - startKeyframe.time
    const localTime = segmentDuration > 0 ? (normalizedTime - startKeyframe.time) / segmentDuration : 0

    // Apply interpolation
    const interpolatedTime = this.interpolateTime(localTime, startKeyframe, endKeyframe)
    return this.lerp(startKeyframe.speed, endKeyframe.speed, interpolatedTime)
  }

  /**
   * Interpolate time value using the specified interpolation method
   */
  private interpolateTime(localTime: number, startKeyframe: SpeedKeyframe, endKeyframe: SpeedKeyframe): number {
    switch (startKeyframe.interpolation) {
      case "linear":
        return localTime

      case "bezier":
        return this.bezierInterpolation(localTime, startKeyframe, endKeyframe)

      case "ease_in":
        return this.easeIn(localTime)

      case "ease_out":
        return this.easeOut(localTime)

      default:
        return localTime
    }
  }

  /**
   * Bezier curve interpolation for smooth speed changes
   */
  private bezierInterpolation(t: number, startKeyframe: SpeedKeyframe, endKeyframe: SpeedKeyframe): number {
    // Default bezier points if not specified
    const p0 = { x: 0, y: 0 }
    const p1 =
      startKeyframe.bezierPoints?.x1 !== undefined && startKeyframe.bezierPoints?.y1 !== undefined
        ? { x: startKeyframe.bezierPoints.x1, y: startKeyframe.bezierPoints.y1 }
        : { x: 0.25, y: 0.1 }
    const p2 =
      startKeyframe.bezierPoints?.x2 !== undefined && startKeyframe.bezierPoints?.y2 !== undefined
        ? { x: startKeyframe.bezierPoints.x2, y: startKeyframe.bezierPoints.y2 }
        : { x: 0.75, y: 0.9 }
    const p3 = { x: 1, y: 1 }

    // Cubic bezier calculation
    const u = 1 - t
    const tt = t * t
    const uu = u * u
    const uuu = uu * u
    const ttt = tt * t

    const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x
    const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y

    return y // Return the interpolated time value
  }

  /**
   * Ease-in interpolation (slow start)
   */
  private easeIn(t: number): number {
    return t * t * t
  }

  /**
   * Ease-out interpolation (slow end)
   */
  private easeOut(t: number): number {
    const t1 = t - 1
    return t1 * t1 * t1 + 1
  }

  /**
   * Linear interpolation
   */
  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t
  }

  /**
   * Generate time mapping for frame-by-frame processing
   */
  generateTimeMapping(config: SpeedRampingConfig, totalFrames: number, fps: number): Float32Array {
    const timeMapping = new Float32Array(totalFrames)

    for (let frame = 0; frame < totalFrames; frame++) {
      const time = frame / (totalFrames - 1) // Normalized time 0-1
      const speed = this.calculateSpeedAtTime(config, time)
      timeMapping[frame] = speed
    }

    return timeMapping
  }

  /**
   * Calculate the total duration of a clip with speed ramping
   */
  calculateTotalDuration(config: SpeedRampingConfig, originalDuration: number): number {
    if (!config.enabled || !config.curve || config.curve.length < 2) {
      return originalDuration
    }

    // Numerical integration of the speed curve
    const samples = 1000
    let totalTime = 0

    for (let i = 0; i < samples; i++) {
      const t1 = i / samples
      const t2 = (i + 1) / samples

      const speed1 = this.calculateSpeedAtTime(config, t1)
      const speed2 = this.calculateSpeedAtTime(config, t2)

      const averageSpeed = (speed1 + speed2) / 2
      const dt = (t2 - t1) * originalDuration

      if (averageSpeed > 0) {
        totalTime += dt / averageSpeed
      }
    }

    return totalTime
  }

  /**
   * Convert timeline time to media time (for playback)
   */
  timelineToMediaTime(config: SpeedRampingConfig, timelineTime: number, originalDuration: number): number {
    if (!config.enabled || timelineTime <= 0) {
      return timelineTime
    }

    // Binary search to find the media time that corresponds to the timeline time
    let low = 0
    let high = originalDuration
    let bestMediaTime = timelineTime

    const tolerance = 0.001 // 1ms tolerance
    const maxIterations = 50

    for (let i = 0; i < maxIterations; i++) {
      const mediaTime = (low + high) / 2
      const normalizedTime = mediaTime / originalDuration
      const speed = this.calculateSpeedAtTime(config, normalizedTime)
      const calculatedTimelineTime = this.integrateSpeed(0, mediaTime, config, originalDuration)

      if (Math.abs(calculatedTimelineTime - timelineTime) < tolerance) {
        bestMediaTime = mediaTime
        break
      }

      if (calculatedTimelineTime < timelineTime) {
        low = mediaTime
      } else {
        high = mediaTime
      }
    }

    return Math.min(bestMediaTime, originalDuration)
  }

  /**
   * Integrate speed from start to end time
   */
  private integrateSpeed(
    startTime: number,
    endTime: number,
    config: SpeedRampingConfig,
    originalDuration: number,
  ): number {
    const samples = 100
    let totalTime = 0
    const dt = (endTime - startTime) / samples

    for (let i = 0; i < samples; i++) {
      const t = startTime + i * dt
      const normalizedTime = t / originalDuration
      const speed = this.calculateSpeedAtTime(config, normalizedTime)
      totalTime += dt / Math.max(speed, 0.01) // Avoid division by zero
    }

    return totalTime
  }

  /**
   * Validate speed ramping configuration
   */
  validateConfig(config: SpeedRampingConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!config.curve || config.curve.length === 0) {
      errors.push("Speed curve must have at least one keyframe")
      return { valid: false, errors }
    }

    // Check that keyframes are sorted by time
    for (let i = 1; i < config.curve.length; i++) {
      if (config.curve[i].time < config.curve[i - 1].time) {
        errors.push("Speed curve keyframes must be sorted by time")
        break
      }
    }

    // Check time range
    if (config.curve[0].time < 0 || config.curve[config.curve.length - 1].time > 1) {
      errors.push("Speed curve time values must be between 0 and 1")
    }

    // Check speed range
    for (const keyframe of config.curve) {
      if (keyframe.speed < 0.1 || keyframe.speed > 10.0) {
        errors.push(`Speed values must be between 0.1 and 10.0, found: ${keyframe.speed}`)
        break
      }
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Optimize speed curve for performance
   */
  optimizeCurve(config: SpeedRampingConfig): SpeedRampingConfig {
    if (!config.curve || config.curve.length <= 2) {
      return config
    }

    // Remove redundant keyframes (those that don't significantly change the curve)
    const optimizedCurve: SpeedKeyframe[] = [config.curve[0]]
    const tolerance = 0.01 // Speed tolerance for considering keyframes redundant

    for (let i = 1; i < config.curve.length - 1; i++) {
      const prev = config.curve[i - 1]
      const curr = config.curve[i]
      const next = config.curve[i + 1]

      // Calculate interpolated value at current keyframe position
      const segmentDuration = next.time - prev.time
      const localTime = segmentDuration > 0 ? (curr.time - prev.time) / segmentDuration : 0
      const interpolatedSpeed = this.lerp(prev.speed, next.speed, localTime)

      // Keep keyframe if it deviates significantly from interpolation
      if (Math.abs(curr.speed - interpolatedSpeed) > tolerance) {
        optimizedCurve.push(curr)
      }
    }

    optimizedCurve.push(config.curve[config.curve.length - 1])

    return {
      ...config,
      curve: optimizedCurve,
    }
  }

  /**
   * Generate preset speed curves
   */
  static getPresets(): Record<string, SpeedKeyframe[]> {
    return {
      // Slow motion to fast motion
      hero: [
        { time: 0.0, speed: 0.3, interpolation: "ease_out" },
        { time: 0.7, speed: 0.3, interpolation: "linear" },
        { time: 0.8, speed: 2.0, interpolation: "ease_in" },
        { time: 1.0, speed: 2.0, interpolation: "linear" },
      ],

      // Fast motion to slow motion
      dramatic: [
        { time: 0.0, speed: 3.0, interpolation: "linear" },
        { time: 0.6, speed: 3.0, interpolation: "ease_out" },
        { time: 0.9, speed: 0.25, interpolation: "ease_in" },
        { time: 1.0, speed: 0.25, interpolation: "linear" },
      ],

      // Pulsing effect
      pulse: [
        { time: 0.0, speed: 1.0, interpolation: "linear" },
        { time: 0.2, speed: 0.5, interpolation: "ease_out" },
        { time: 0.4, speed: 1.5, interpolation: "ease_in" },
        { time: 0.6, speed: 0.8, interpolation: "ease_out" },
        { time: 0.8, speed: 1.2, interpolation: "ease_in" },
        { time: 1.0, speed: 1.0, interpolation: "linear" },
      ],

      // Smooth acceleration
      acceleration: [
        { time: 0.0, speed: 0.5, interpolation: "ease_out" },
        { time: 0.3, speed: 0.8, interpolation: "bezier", bezierPoints: { x1: 0.2, y1: 0.1, x2: 0.8, y2: 0.9 } },
        { time: 0.7, speed: 1.5, interpolation: "bezier", bezierPoints: { x1: 0.1, y1: 0.8, x2: 0.9, y2: 0.2 } },
        { time: 1.0, speed: 2.0, interpolation: "ease_in" },
      ],
    }
  }

  /**
   * Create speed ramping config from preset
   */
  createFromPreset(presetName: string, quality: "draft" | "standard" | "high" = "standard"): SpeedRampingConfig {
    const presets = SpeedRampingEngine.getPresets()
    const curve = presets[presetName]

    if (!curve) {
      throw new Error(`Unknown speed ramping preset: ${presetName}`)
    }

    return {
      enabled: true,
      method: quality === "high" ? "optical_flow" : quality === "standard" ? "frame_blending" : "time_stretching",
      quality,
      preservePitch: true,
      curve,
      audioMode: "maintain",
    }
  }
}

/**
 * Optical Flow Processor for high-quality speed ramping
 */
export class OpticalFlowProcessor {
  /**
   * Process optical flow between frames for smooth motion interpolation
   */
  processOpticalFlow(frame1: ImageData, frame2: ImageData, speed: number): ImageData[] {
    // This would contain the actual optical flow algorithm
    // For now, return interpolated frames
    const interpolatedFrames: ImageData[] = []

    if (speed < 1.0) {
      // Slow motion - interpolate additional frames
      const numFrames = Math.ceil(1 / speed) - 1
      for (let i = 0; i < numFrames; i++) {
        const t = (i + 1) / (numFrames + 1)
        interpolatedFrames.push(this.interpolateFrames(frame1, frame2, t))
      }
    }

    return interpolatedFrames
  }

  /**
   * Interpolate between two frames using optical flow
   */
  private interpolateFrames(frame1: ImageData, frame2: ImageData, t: number): ImageData {
    // Simplified interpolation - in reality this would use optical flow vectors
    const result = new ImageData(frame1.width, frame1.height)
    const data1 = frame1.data
    const data2 = frame2.data
    const resultData = result.data

    for (let i = 0; i < data1.length; i += 4) {
      resultData[i] = Math.round(data1[i] * (1 - t) + data2[i] * t) // R
      resultData[i + 1] = Math.round(data1[i + 1] * (1 - t) + data2[i + 1] * t) // G
      resultData[i + 2] = Math.round(data1[i + 2] * (1 - t) + data2[i + 2] * t) // B
      resultData[i + 3] = 255 // A
    }

    return result
  }
}

/**
 * Audio Time Stretching Processor
 */
export class AudioTimeStretchingProcessor {
  /**
   * Stretch audio to match video speed changes while preserving pitch
   */
  stretchAudio(audioBuffer: AudioBuffer, speedCurve: Float32Array, preservePitch: boolean): AudioBuffer {
    // This would implement phase vocoder or similar time stretching algorithm
    // For now, return the original buffer
    return audioBuffer
  }

  /**
   * Apply pitch shifting when preservePitch is false
   */
  shiftPitch(audioBuffer: AudioBuffer, pitchRatio: number): AudioBuffer {
    // Implement pitch shifting algorithm
    return audioBuffer
  }
}

/**
 * Speed Ramping Cache Manager
 */
export class SpeedRampingCache {
  private cache = new Map<
    string,
    {
      config: SpeedRampingConfig
      timeMapping: Float32Array
      lastAccessed: Date
      size: number
    }
  >()

  private maxCacheSize = 100 * 1024 * 1024 // 100MB

  /**
   * Get cached time mapping for a speed ramping config
   */
  get(config: SpeedRampingConfig, totalFrames: number): Float32Array | null {
    const key = this.generateKey(config, totalFrames)
    const cached = this.cache.get(key)

    if (cached) {
      cached.lastAccessed = new Date()
      return cached.timeMapping
    }

    return null
  }

  /**
   * Store time mapping in cache
   */
  set(config: SpeedRampingConfig, totalFrames: number, timeMapping: Float32Array): void {
    const key = this.generateKey(config, totalFrames)
    const size = timeMapping.byteLength

    // Check cache size limit
    if (this.getTotalCacheSize() + size > this.maxCacheSize) {
      this.evictOldEntries(size)
    }

    this.cache.set(key, {
      config: { ...config },
      timeMapping: new Float32Array(timeMapping),
      lastAccessed: new Date(),
      size,
    })
  }

  /**
   * Generate cache key for speed ramping config
   */
  private generateKey(config: SpeedRampingConfig, totalFrames: number): string {
    const curveHash = config.curve?.map((k) => `${k.time}:${k.speed}:${k.interpolation}`).join("|") || ""

    return `${config.method}:${config.quality}:${totalFrames}:${curveHash}`
  }

  /**
   * Get total cache size
   */
  private getTotalCacheSize(): number {
    return Array.from(this.cache.values()).reduce((total, item) => total + item.size, 0)
  }

  /**
   * Evict old entries to make room for new data
   */
  private evictOldEntries(requiredSize: number): void {
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime(),
    )

    let freedSize = 0
    for (const [key] of entries) {
      if (freedSize >= requiredSize) break
      const entry = this.cache.get(key)
      if (entry) {
        freedSize += entry.size
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear()
  }
}

// Export singleton instances
export const speedRampingEngine = SpeedRampingEngine.getInstance()
export const opticalFlowProcessor = new OpticalFlowProcessor()
export const audioStretchingProcessor = new AudioTimeStretchingProcessor()
export const speedRampingCache = new SpeedRampingCache()
