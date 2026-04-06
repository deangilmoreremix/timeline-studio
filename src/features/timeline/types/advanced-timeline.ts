/**
 * Advanced Timeline Data Models - Enhanced Project Structure
 *
 * Extends the existing timeline architecture with professional features
 * for compound clips, nested sequences, multicam support, and advanced caching
 */

import type { ProjectResources, TimelineClip, TimelineProject, TimelineTrack } from "./timeline"

/**
 * Advanced Project Structure with Enhanced Metadata and Caching
 */
export interface AdvancedTimelineProject extends TimelineProject {
  /** Enhanced resources with advanced caching */
  resources: AdvancedProjectResources

  /** Advanced project metadata */
  metadata: AdvancedProjectMetadata

  /** Performance and memory management settings */
  performance: ProjectPerformanceSettings

  /** Collaboration and versioning data */
  collaboration: CollaborationMetadata

  /** Advanced export and render settings */
  exportSettings: AdvancedExportSettings
}

/**
 * Enhanced Project Resources with Advanced Caching
 */
export interface AdvancedProjectResources extends ProjectResources {
  /** Advanced cache management */
  cache: AdvancedProjectCache

  /** Proxy and optimization management */
  proxies: ProxyManagement

  /** Performance optimization data */
  performance: ResourcePerformanceData
}

/**
 * Advanced Project Metadata
 */
export interface AdvancedProjectMetadata {
  id: string
  name: string
  description?: string
  author: string
  version: string
  createdAt: Date
  updatedAt: Date
  lastAccessedAt: Date

  /** Project complexity metrics */
  complexity: {
    totalClips: number
    totalTracks: number
    totalDuration: number
    estimatedRenderTime: number
    memoryFootprint: number
  }

  /** Performance metrics */
  performance: {
    loadTime: number
    renderTime: number
    memoryUsage: number
    cacheHitRate: number
  }

  /** Collaboration metadata */
  collaboration: {
    isShared: boolean
    collaborators: Collaborator[]
    lastSyncedAt?: Date
    syncStatus: "synced" | "pending" | "conflicted"
  }

  /** Project health indicators */
  health: {
    missingMedia: string[]
    corruptedClips: string[]
    offlineAssets: string[]
    warnings: ProjectWarning[]
  }
}

/**
 * Advanced Project Cache with Intelligent Management
 */
export interface AdvancedProjectCache {
  /** Timeline data cache */
  timeline: {
    clips: Map<string, CachedClipData>
    tracks: Map<string, CachedTrackData>
    sequences: Map<string, CachedSequenceData>
  }

  /** Media cache */
  media: {
    thumbnails: Map<string, CachedThumbnail>
    waveforms: Map<string, CachedWaveform>
    proxies: Map<string, CachedProxy>
    analysis: Map<string, CachedAnalysis>
  }

  /** Render cache */
  render: {
    previews: Map<string, CachedPreview>
    exports: Map<string, CachedExport>
    effects: Map<string, CachedEffect>
  }

  /** Cache management */
  management: {
    totalSize: number
    lastCleanup: Date
    cleanupPolicy: CacheCleanupPolicy
    priorityLevels: CachePriority[]
  }
}

/**
 * Cached Clip Data with Performance Optimizations
 */
export interface CachedClipData {
  id: string
  lastAccessed: Date
  accessCount: number
  size: number
  priority: CachePriorityLevel
  data: Partial<TimelineClip>
  compressedData?: string // Compressed JSON for memory efficiency
}

/**
 * Cached Track Data
 */
export interface CachedTrackData {
  id: string
  lastAccessed: Date
  size: number
  priority: CachePriorityLevel
  data: Partial<TimelineTrack>
}

/**
 * Cached Sequence Data for Nested Sequences
 */
export interface CachedSequenceData {
  id: string
  parentId?: string
  hierarchy: string[] // Path in sequence tree
  lastAccessed: Date
  size: number
  data: any
}

/**
 * Cached Media Assets
 */
export interface CachedThumbnail {
  path: string
  timestamp: number
  resolution: "low" | "medium" | "high"
  generated: Date
  size: number
  accessCount: number
}

export interface CachedWaveform {
  data: Float32Array
  resolution: number
  generated: Date
  size: number
  accessCount: number
}

export interface CachedProxy {
  path: string
  resolution: string
  codec: string
  generated: Date
  size: number
  accessCount: number
}

export interface CachedAnalysis {
  type: "scene" | "motion" | "audio" | "content"
  data: any
  generated: Date
  size: number
  confidence: number
}

/**
 * Cached Render Data
 */
export interface CachedPreview {
  timeRange: { start: number; end: number }
  resolution: string
  quality: "draft" | "preview" | "final"
  generated: Date
  size: number
  accessCount: number
}

export interface CachedExport {
  settings: any
  path: string
  generated: Date
  size: number
  accessCount: number
}

export interface CachedEffect {
  effectId: string
  parameters: any
  renderedData: any
  generated: Date
  size: number
}

/**
 * Cache Management Policies
 */
export interface CacheCleanupPolicy {
  maxSize: number // Maximum cache size in bytes
  cleanupInterval: number // Hours between cleanup
  priorityRetention: {
    high: number // Days to keep high priority items
    medium: number // Days to keep medium priority items
    low: number // Days to keep low priority items
  }
  autoCleanup: boolean
  cleanupOnLowMemory: boolean
}

export type CachePriorityLevel = "critical" | "high" | "medium" | "low"

export interface CachePriority {
  level: CachePriorityLevel
  retentionDays: number
  maxItems: number
}

/**
 * Proxy and Optimization Management
 */
export interface ProxyManagement {
  /** Active proxy settings */
  settings: ProxySettings[]

  /** Proxy generation queue */
  queue: ProxyJob[]

  /** Proxy usage statistics */
  stats: {
    totalProxies: number
    totalSize: number
    generationTime: number
    hitRate: number
  }
}

export interface ProxySettings {
  id: string
  name: string
  resolution: { width: number; height: number }
  codec: string
  quality: "low" | "medium" | "high"
  format: string
  conditions: ProxyCondition[]
}

export interface ProxyCondition {
  type: "resolution" | "codec" | "performance" | "storage"
  operator: "gt" | "lt" | "eq" | "contains"
  value: any
}

export interface ProxyJob {
  id: string
  mediaId: string
  settingsId: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  startedAt?: Date
  completedAt?: Date
  error?: string
}

/**
 * Resource Performance Data
 */
export interface ResourcePerformanceData {
  /** Load times for different resource types */
  loadTimes: Map<string, number>

  /** Memory usage by resource type */
  memoryUsage: Map<string, number>

  /** Access patterns */
  accessPatterns: {
    frequentAccess: string[]
    rareAccess: string[]
    sequentialAccess: string[][]
  }

  /** Optimization suggestions */
  suggestions: ResourceOptimizationSuggestion[]
}

export interface ResourceOptimizationSuggestion {
  type: "preload" | "cache" | "unload" | "compress"
  resourceId: string
  priority: "high" | "medium" | "low"
  estimatedBenefit: number
  description: string
}

/**
 * Project Performance Settings
 */
export interface ProjectPerformanceSettings {
  /** Memory management */
  memory: {
    maxMemoryUsage: number // MB
    preloadStrategy: "aggressive" | "conservative" | "adaptive"
    garbageCollectionInterval: number // Minutes
    memoryWarningThreshold: number // Percentage
  }

  /** Rendering optimization */
  rendering: {
    maxConcurrentRenders: number
    renderQuality: "draft" | "preview" | "final"
    gpuAcceleration: boolean
    backgroundRendering: boolean
  }

  /** Cache settings */
  cache: {
    enabled: boolean
    location: "memory" | "disk" | "hybrid"
    maxCacheSize: number // MB
    compression: boolean
  }

  /** UI responsiveness */
  ui: {
    maxUIThreadBlock: number // Milliseconds
    virtualScrolling: boolean
    progressiveLoading: boolean
    lazyImageLoading: boolean
  }
}

/**
 * Collaboration Metadata
 */
export interface CollaborationMetadata {
  /** Project sharing settings */
  sharing: {
    isEnabled: boolean
    shareId?: string
    permissions: CollaborationPermissions
    expiresAt?: Date
  }

  /** Version control */
  versioning: {
    enabled: boolean
    currentVersion: string
    versions: ProjectVersion[]
    autoSaveInterval: number
  }

  /** Conflict resolution */
  conflicts: ProjectConflict[]

  /** Activity log */
  activity: CollaborationActivity[]
}

export interface Collaborator {
  id: string
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
  permissions: string[]
  color: string
  lastActive: Date
  avatar?: string
}

export interface CollaborationPermissions {
  allowEdit: boolean
  allowExport: boolean
  allowShare: boolean
  allowDelete: boolean
  restrictedAssets?: string[]
}

export interface ProjectVersion {
  id: string
  name: string
  createdAt: Date
  createdBy: string
  size: number
  changes: VersionChange[]
  isCurrent: boolean
}

export interface VersionChange {
  type: "clip_added" | "clip_modified" | "clip_deleted" | "track_added" | "track_modified" | "track_deleted"
  entityId: string
  description: string
  data: any
}

export interface ProjectConflict {
  id: string
  entityId: string
  type: "merge" | "overwrite" | "duplicate"
  description: string
  localVersion: any
  remoteVersion: any
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
}

export interface CollaborationActivity {
  id: string
  userId: string
  action: string
  entityId?: string
  timestamp: Date
  details: any
}

/**
 * Advanced Export Settings
 */
export interface AdvancedExportSettings {
  /** Preset management */
  presets: ExportPreset[]

  /** Batch export settings */
  batch: {
    enabled: boolean
    queue: ExportJob[]
    concurrentJobs: number
    retryFailed: boolean
  }

  /** Platform optimization */
  platforms: PlatformOptimizationSettings[]

  /** Quality control */
  quality: {
    automatedQC: boolean
    qcChecks: QualityCheck[]
    compliance: ComplianceSettings
  }

  /** Delivery management */
  delivery: {
    destinations: DeliveryDestination[]
    notifications: NotificationSettings
    archiving: ArchivingSettings
  }
}

export interface ExportPreset {
  id: string
  name: string
  description?: string
  category: "web" | "broadcast" | "cinema" | "social" | "archive"
  format: ExportFormat
  settings: ExportSettings
  platforms?: string[] // Associated platforms
  isDefault?: boolean
  createdAt: Date
  usageCount: number
}

export interface ExportFormat {
  container: "mp4" | "mov" | "mxf" | "webm" | "prores" | "dnxhd" | "custom"
  videoCodec: string
  audioCodec: string
  customSettings?: any
}

export interface ExportSettings {
  video: {
    resolution: { width: number; height: number }
    frameRate: number
    bitrate: number
    quality: "low" | "medium" | "high" | "lossless"
    colorSpace: string
    colorDepth: 8 | 10 | 12
  }
  audio: {
    channels: 1 | 2 | 6 | 8
    sampleRate: number
    bitrate: number
    format: string
  }
  advanced: {
    twoPassEncoding: boolean
    keyframeInterval: number
    bFrames: number
    preset: "ultrafast" | "fast" | "medium" | "slow"
    tune: string
  }
}

export interface ExportJob {
  id: string
  presetId: string
  sequenceId: string
  timeRange?: { start: number; end: number }
  status: "queued" | "processing" | "completed" | "failed" | "cancelled"
  progress: number
  startedAt?: Date
  completedAt?: Date
  outputPath?: string
  error?: string
  size?: number
}

export interface PlatformOptimizationSettings {
  platform: "youtube" | "tiktok" | "instagram" | "twitter" | "facebook" | "vimeo" | "custom"
  presets: string[] // Preset IDs
  autoOptimization: boolean
  maxDuration?: number
  recommendedResolutions: { width: number; height: number }[]
  recommendedFormats: string[]
  metadata: {
    titleTemplate?: string
    descriptionTemplate?: string
    tags?: string[]
    thumbnailOptimization: boolean
  }
}

export interface QualityCheck {
  type: "audio_levels" | "video_quality" | "compliance" | "metadata" | "artifacts"
  enabled: boolean
  severity: "warning" | "error"
  parameters: any
  description: string
}

export interface ComplianceSettings {
  broadcast: {
    enabled: boolean
    standard: "ebu_r128" | "atsc_a85" | "custom"
    parameters: any
  }
  web: {
    enabled: boolean
    maxBitrate: number
    minBitrate: number
  }
}

export interface DeliveryDestination {
  id: string
  name: string
  type: "local" | "ftp" | "s3" | "youtube" | "vimeo"
  settings: any
  enabled: boolean
}

export interface NotificationSettings {
  onComplete: boolean
  onFailure: boolean
  recipients: string[]
  methods: ("email" | "slack" | "webhook")[]
}

export interface ArchivingSettings {
  enabled: boolean
  location: string
  retention: number // Days
  compression: boolean
}

/**
 * Project Health and Warnings
 */
export interface ProjectWarning {
  id: string
  type: "missing_media" | "corrupted_clip" | "offline_asset" | "performance" | "compatibility"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  affectedEntities: string[]
  suggestedAction?: string
  createdAt: Date
}

/**
 * Utility Functions for Advanced Timeline
 */
export const AdvancedTimelineUtils = {
  /**
   * Calculate project complexity metrics
   */
  calculateComplexity: (project: AdvancedTimelineProject) => {
    const clips = project.sections.flatMap((s) => s.tracks.flatMap((t) => t.clips))
    const tracks = project.sections.flatMap((s) => s.tracks)

    return {
      totalClips: clips.length,
      totalTracks: tracks.length,
      totalDuration: Math.max(...project.sections.map((s) => s.endTime)),
      estimatedRenderTime: clips.length * 0.1, // Rough estimate
      memoryFootprint: clips.length * 1024 * 1024, // Rough estimate in bytes
    }
  },

  /**
   * Optimize cache based on usage patterns
   */
  optimizeCache: (cache: AdvancedProjectCache) => {
    // Implementation for cache optimization
  },

  /**
   * Validate project health
   */
  validateProjectHealth: (project: AdvancedTimelineProject): ProjectWarning[] => {
    const warnings: ProjectWarning[] = []

    // Check for missing media
    const missingMedia = project.resources.media.filter((m) => !m.source?.path)
    if (missingMedia.length > 0) {
      warnings.push({
        id: crypto.randomUUID(),
        type: "missing_media",
        severity: "high",
        message: `Missing ${missingMedia.length} media files`,
        affectedEntities: missingMedia.map((m) => m.id),
        suggestedAction: "Relink missing media files",
        createdAt: new Date(),
      })
    }

    return warnings
  },
}
