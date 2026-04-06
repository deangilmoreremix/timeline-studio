/**
 * Advanced Clip Types - Compound Clips, Nested Sequences, Multicam
 *
 * Professional editing features inspired by DaVinci Resolve and Adobe Premiere
 */

import type { MediaFile, TimelineClip, TimelineProject } from "./timeline"

/**
 * Base interface for all advanced clip types
 */
export interface AdvancedClip extends TimelineClip {
  /** Advanced clip type */
  clipType: AdvancedClipType

  /** Nested timeline for compound clips */
  nestedTimeline?: NestedTimeline

  /** Multicam source information */
  multicamSource?: MulticamSource

  /** Compound clip metadata */
  compoundMetadata?: CompoundMetadata

  /** Advanced editing properties */
  advancedProperties: AdvancedClipProperties
}

/**
 * Types of advanced clips
 */
export type AdvancedClipType =
  | "compound" // Compound clip with nested timeline
  | "nested" // Reference to another sequence
  | "multicam" // Multicam clip with angle switching
  | "adjustment" // Adjustment clip for color/tone
  | "subclip" // Subclip of a larger media file
  | "gap" // Gap clip for organization

/**
 * Nested Timeline for Compound Clips
 */
export interface NestedTimeline {
  /** Unique identifier for the nested timeline */
  id: string

  /** Name of the nested timeline */
  name: string

  /** Parent timeline ID */
  parentTimelineId: string

  /** Clips within this nested timeline */
  clips: TimelineClip[]

  /** Tracks within this nested timeline */
  tracks: NestedTrack[]

  /** Timeline properties */
  properties: {
    duration: number
    fps: number
    resolution: { width: number; height: number }
    colorSpace: string
  }

  /** Cache for rendered output */
  cache?: {
    renderedPath?: string
    thumbnailPath?: string
    lastRendered?: Date
    renderHash: string // For cache invalidation
  }
}

/**
 * Nested Track for Compound Clips
 */
export interface NestedTrack {
  id: string
  name: string
  type: "video" | "audio" | "subtitle"
  clips: TimelineClip[]
  locked: boolean
  muted: boolean
  volume: number
  order: number
}

/**
 * Multicam Source Information
 */
export interface MulticamSource {
  /** Multicam sequence ID */
  sequenceId: string

  /** Available camera angles */
  angles: MulticamAngle[]

  /** Active angle index */
  activeAngle: number

  /** Switching points */
  switches: MulticamSwitch[]

  /** Synchronization method */
  syncMethod: "timecode" | "audio" | "manual"

  /** Sync reference */
  syncReference?: {
    type: "audio" | "timecode"
    track?: string
    confidence: number
  }
}

/**
 * Camera Angle in Multicam Sequence
 */
export interface MulticamAngle {
  /** Angle index (0-based) */
  index: number

  /** Angle name (Camera A, B, C, etc.) */
  name: string

  /** Source clip or media */
  source: {
    clipId?: string
    mediaId?: string
    startTime: number
    endTime: number
  }

  /** Angle color for UI identification */
  color: string

  /** Angle metadata */
  metadata: {
    camera?: string
    lens?: string
    position?: string
    notes?: string
  }
}

/**
 * Multicam Switching Point
 */
export interface MulticamSwitch {
  /** Time in the multicam sequence */
  time: number

  /** From angle index */
  fromAngle: number

  /** To angle index */
  toAngle: number

  /** Switch type */
  type: "cut" | "dissolve" | "wipe"

  /** Transition duration (for dissolves/wipes) */
  transitionDuration?: number

  /** User who made the switch */
  switchedBy?: string

  /** Notes about the switch */
  notes?: string
}

/**
 * Compound Clip Metadata
 */
export interface CompoundMetadata {
  /** Original clips that make up this compound */
  sourceClips: string[]

  /** Creation method */
  createdBy: "user" | "auto" | "import"

  /** Creation date */
  createdAt: Date

  /** Last modified */
  modifiedAt: Date

  /** Version history */
  versions: CompoundVersion[]

  /** Usage statistics */
  usage: {
    usedInSequences: string[]
    totalUsageCount: number
    lastUsed?: Date
  }
}

/**
 * Version History for Compound Clips
 */
export interface CompoundVersion {
  id: string
  name: string
  createdAt: Date
  changes: string
  createdBy?: string
}

/**
 * Advanced Clip Properties
 */
export interface AdvancedClipProperties {
  /** Speed ramping configuration */
  speedRamping?: SpeedRampingConfig

  /** Retiming properties */
  retiming?: RetimingProperties

  /** Stabilization settings */
  stabilization?: StabilizationSettings

  /** Color grading overrides */
  colorOverrides?: ColorOverrides

  /** Audio processing */
  audioProcessing?: AudioProcessing

  /** Effects stack */
  effectsStack?: EffectInstance[]

  /** Keyframes */
  keyframes?: TimelineKeyframe[]

  /** Masking and rotoscoping */
  masking?: MaskingData

  /** Motion tracking data */
  motionTracking?: MotionTrackingData
}

/**
 * Speed Ramping Configuration
 */
export interface SpeedRampingConfig {
  enabled: boolean
  method: "optical_flow" | "frame_blending" | "time_stretching"
  quality: "draft" | "standard" | "high"
  preservePitch: boolean

  /** Speed curve defined by keyframes */
  curve: SpeedKeyframe[]

  /** Audio handling during speed changes */
  audioMode: "maintain" | "pitch_shift" | "stretch"
}

/**
 * Speed Keyframe
 */
export interface SpeedKeyframe {
  time: number // Time in clip (0-1)
  speed: number // Speed multiplier (0.1 - 10.0)
  interpolation: "linear" | "bezier" | "ease_in" | "ease_out"
  bezierPoints?: { x1: number; y1: number; x2: number; y2: number }
}

/**
 * Retiming Properties
 */
export interface RetimingProperties {
  /** Frame rate conversion */
  frameRateConversion?: {
    from: number
    to: number
    method: "drop" | "blend" | "interpolate"
  }

  /** Time remapping */
  timeRemapping?: {
    enabled: boolean
    inputRange: { start: number; end: number }
    outputRange: { start: number; end: number }
    interpolation: "linear" | "bezier"
  }

  /** Motion blur for retiming */
  motionBlur: {
    enabled: boolean
    samples: number
    shutterAngle: number
  }
}

/**
 * Stabilization Settings
 */
export interface StabilizationSettings {
  enabled: boolean
  method: "optical_flow" | "feature_tracking" | "hybrid"
  smoothing: number // 0-1, amount of stabilization
  cropToFill: boolean

  /** Advanced stabilization options */
  advanced: {
    rollingShutterCorrection: boolean
    lensCorrection: boolean
    horizonLock: boolean
  }

  /** Stabilization data cache */
  cache?: {
    stabilizationData: Float32Array
    confidence: number
    lastCalculated: Date
  }
}

/**
 * Color Grading Overrides
 */
export interface ColorOverrides {
  /** Lift/Gamma/Gain controls */
  lgg: {
    lift: { r: number; g: number; b: number }
    gamma: { r: number; g: number; b: number }
    gain: { r: number; g: number; b: number }
  }

  /** Color wheels */
  colorWheels: {
    shadows: { r: number; g: number; b: number; luma: number }
    midtones: { r: number; g: number; b: number; luma: number }
    highlights: { r: number; g: number; b: number; luma: number }
  }

  /** Curves */
  curves: {
    master: CurvePoint[]
    red: CurvePoint[]
    green: CurvePoint[]
    blue: CurvePoint[]
  }

  /** LUT application */
  lut?: {
    path: string
    intensity: number // 0-1
    enabled: boolean
  }
}

/**
 * Curve Point for Color Curves
 */
export interface CurvePoint {
  x: number // 0-1
  y: number // 0-1
}

/**
 * Audio Processing Settings
 */
export interface AudioProcessing {
  /** Equalizer */
  equalizer: {
    enabled: boolean
    bands: EQBand[]
  }

  /** Dynamics processing */
  dynamics: {
    compressor: {
      enabled: boolean
      threshold: number // dB
      ratio: number
      attack: number // ms
      release: number // ms
      makeupGain: number // dB
    }
    limiter: {
      enabled: boolean
      threshold: number // dB
      release: number // ms
    }
  }

  /** Noise reduction */
  noiseReduction: {
    enabled: boolean
    reduction: number // dB
    sensitivity: number
  }

  /** De-essing */
  deEssing: {
    enabled: boolean
    frequency: number // Hz
    reduction: number // dB
  }
}

/**
 * EQ Band
 */
export interface EQBand {
  frequency: number // Hz
  gain: number // dB
  q: number // Quality factor
  type: "low_shelf" | "peak" | "high_shelf" | "low_pass" | "high_pass"
}

/**
 * Effect Instance
 */
export interface EffectInstance {
  id: string
  effectId: string
  enabled: boolean
  order: number
  parameters: Record<string, any>

  /** Effect keyframes */
  keyframes?: EffectKeyframe[]

  /** GPU acceleration */
  gpuAccelerated: boolean

  /** Render cache */
  cache?: {
    rendered: boolean
    lastRendered: Date
    renderHash: string
  }
}

/**
 * Effect Keyframe
 */
export interface EffectKeyframe {
  time: number
  parameters: Record<string, any>
  interpolation: "linear" | "bezier" | "hold"
}

/**
 * Timeline Keyframe (extended)
 */
export interface TimelineKeyframe {
  id: string
  time: number
  property: string
  value: any
  interpolation: "linear" | "bezier" | "ease_in" | "ease_out" | "step"
  bezierPoints?: { x1: number; y1: number; x2: number; y2: number }
}

/**
 * Masking and Rotoscoping Data
 */
export interface MaskingData {
  /** Mask shapes */
  masks: Mask[]

  /** Rotoscoping splines */
  splines: Spline[]

  /** Mattes */
  mattes: Matte[]

  /** Tracking data for motion */
  tracking?: {
    enabled: boolean
    points: TrackingPoint[]
    method: "manual" | "auto"
  }
}

/**
 * Mask Definition
 */
export interface Mask {
  id: string
  name: string
  type: "rectangle" | "ellipse" | "polygon" | "freeform"
  points: Point[]
  feather: number
  expansion: number
  inverted: boolean
  enabled: boolean
}

/**
 * Spline for Rotoscoping
 */
export interface Spline {
  id: string
  name: string
  points: SplinePoint[]
  closed: boolean
  feather: number
  enabled: boolean
}

/**
 * Spline Point
 */
export interface SplinePoint {
  position: Point
  inTangent?: Point
  outTangent?: Point
  weight?: number
}

/**
 * Matte Definition
 */
export interface Matte {
  id: string
  name: string
  type: "luma" | "chroma" | "difference"
  source: string // Clip ID or path
  threshold: number
  softness: number
  spillSuppression: number
}

/**
 * Tracking Point
 */
export interface TrackingPoint {
  id: string
  position: Point
  confidence: number
  keyframe: boolean
}

/**
 * Motion Tracking Data
 */
export interface MotionTrackingData {
  /** Trackers */
  trackers: Tracker[]

  /** Stabilization data */
  stabilization?: {
    enabled: boolean
    data: Float32Array
    confidence: number
  }

  /** Match moving data */
  matchMoving?: {
    cameraPath: CameraKeyframe[]
    solver: "planar" | "3d" | "hybrid"
  }
}

/**
 * Motion Tracker
 */
export interface Tracker {
  id: string
  name: string
  type: "point" | "plane" | "object"
  pattern: {
    center: Point
    size: { width: number; height: number }
    searchSize: { width: number; height: number }
  }
  path: TrackingKeyframe[]
  confidence: number
  enabled: boolean
}

/**
 * Tracking Keyframe
 */
export interface TrackingKeyframe {
  time: number
  position: Point
  scale?: number
  rotation?: number
  confidence: number
}

/**
 * Camera Keyframe for Match Moving
 */
export interface CameraKeyframe {
  time: number
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  focalLength: number
}

/**
 * Point Definition
 */
export interface Point {
  x: number
  y: number
}

/**
 * Utility Functions for Advanced Clips
 */
export const AdvancedClipUtils = {
  /**
   * Create a compound clip from multiple clips
   */
  createCompoundClip: (clips: TimelineClip[], name: string, timeline: TimelineProject): AdvancedClip => {
    const compoundId = crypto.randomUUID()

    // Calculate compound clip bounds
    const startTime = Math.min(...clips.map((c) => c.startTime))
    const endTime = Math.max(...clips.map((c) => c.startTime + c.duration))
    const duration = endTime - startTime

    // Create nested timeline
    const nestedTimeline: NestedTimeline = {
      id: crypto.randomUUID(),
      name: `${name} (Compound)`,
      parentTimelineId: timeline.id,
      clips: clips.map((c) => ({
        ...c,
        trackId: `compound_${compoundId}_track_${c.trackId}`,
        startTime: c.startTime - startTime, // Adjust to compound timeline
      })),
      tracks: [], // Will be populated from clip trackIds
      properties: {
        duration,
        fps: timeline.settings.fps,
        resolution: timeline.settings.resolution,
        colorSpace: "rec709", // Default
      },
    }

    // Extract unique tracks
    const trackIds = [...new Set(clips.map((c) => c.trackId))]
    nestedTimeline.tracks = trackIds.map((trackId) => {
      const trackClips = nestedTimeline.clips.filter((c) => c.trackId === `compound_${compoundId}_track_${trackId}`)
      const originalTrack = timeline.sections.flatMap((s) => s.tracks).find((t) => t.id === trackId)

      return {
        id: `compound_${compoundId}_track_${trackId}`,
        name: originalTrack?.name || `Track ${trackId}`,
        type: originalTrack?.type || "video",
        clips: trackClips,
        locked: false,
        muted: false,
        volume: 1,
        order: 0,
      }
    })

    const compoundClip: AdvancedClip = {
      id: compoundId,
      name,
      type: "video",
      clipType: "compound",
      trackId: clips[0].trackId, // Use first clip's track
      startTime,
      duration,
      mediaId: "", // Compound clips don't have single media
      mediaStartTime: 0,
      mediaEndTime: duration,
      offset: 0,
      volume: 1,
      speed: 1,
      opacity: 1,
      isSelected: false,
      isLocked: false,
      effects: [],
      filters: [],
      transitions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      nestedTimeline,
      compoundMetadata: {
        sourceClips: clips.map((c) => c.id),
        createdBy: "user",
        createdAt: new Date(),
        modifiedAt: new Date(),
        versions: [],
        usage: {
          usedInSequences: [],
          totalUsageCount: 0,
        },
      },
      advancedProperties: {
        speedRamping: undefined,
        retiming: undefined,
        stabilization: undefined,
        colorOverrides: undefined,
        audioProcessing: undefined,
        effectsStack: [],
        keyframes: [],
        masking: undefined,
        motionTracking: undefined,
      },
    }

    return compoundClip
  },

  /**
   * Create a multicam clip from multiple angles
   */
  createMulticamClip: (angles: MulticamAngle[], name: string, timeline: TimelineProject): AdvancedClip => {
    const multicamId = crypto.randomUUID()

    // Calculate multicam clip duration from angles
    const maxDuration = Math.max(...angles.map((a) => a.source.endTime - a.source.startTime))

    const multicamClip: AdvancedClip = {
      id: multicamId,
      name,
      type: "video",
      clipType: "multicam",
      trackId: "multicam", // Special track type
      startTime: 0,
      duration: maxDuration,
      mediaId: "", // Multicam clips don't have single media
      mediaStartTime: 0,
      mediaEndTime: maxDuration,
      offset: 0,
      volume: 1,
      speed: 1,
      opacity: 1,
      isSelected: false,
      isLocked: false,
      effects: [],
      filters: [],
      transitions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      multicamSource: {
        sequenceId: multicamId,
        angles,
        activeAngle: 0,
        switches: [],
        syncMethod: "manual",
      },
      advancedProperties: {
        speedRamping: undefined,
        retiming: undefined,
        stabilization: undefined,
        colorOverrides: undefined,
        audioProcessing: undefined,
        effectsStack: [],
        keyframes: [],
        masking: undefined,
        motionTracking: undefined,
      },
    }

    return multicamClip
  },

  /**
   * Validate compound clip structure
   */
  validateCompoundClip: (clip: AdvancedClip): boolean => {
    if (clip.clipType !== "compound" || !clip.nestedTimeline) {
      return false
    }

    // Check that all source clips exist
    const sourceClipIds = clip.compoundMetadata?.sourceClips || []
    // In a real implementation, you'd check against the project

    // Check nested timeline integrity
    const nestedClips = clip.nestedTimeline.clips
    const nestedTracks = clip.nestedTimeline.tracks

    // Validate track-clip relationships
    for (const track of nestedTracks) {
      const trackClips = nestedClips.filter((c) => c.trackId === track.id)
      if (trackClips.some((c) => c.trackId !== track.id)) {
        return false
      }
    }

    return true
  },

  /**
   * Get the effective duration of an advanced clip
   */
  getEffectiveDuration: (clip: AdvancedClip): number => {
    if (clip.clipType === "compound" && clip.nestedTimeline) {
      return clip.nestedTimeline.properties.duration
    }

    if (clip.clipType === "multicam" && clip.multicamSource) {
      return Math.max(...clip.multicamSource.angles.map((a) => a.source.endTime - a.source.startTime))
    }

    // For speed ramping
    if (clip.advancedProperties.speedRamping?.enabled) {
      // Calculate duration based on speed curve
      const speedCurve = clip.advancedProperties.speedRamping.curve
      if (speedCurve && speedCurve.length > 0) {
        // Simplified calculation - integrate speed over time
        let totalTime = 0
        for (let i = 1; i < speedCurve.length; i++) {
          const prev = speedCurve[i - 1]
          const curr = speedCurve[i]
          const segmentDuration = (curr.time - prev.time) / ((prev.speed + curr.speed) / 2)
          totalTime += segmentDuration
        }
        return totalTime * clip.duration
      }
    }

    return clip.duration
  },
}
