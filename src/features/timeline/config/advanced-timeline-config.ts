/**
 * Advanced Timeline Configuration
 *
 * Production-ready configuration system for advanced timeline features
 * Provides type-safe settings with validation and performance optimization
 */

import React from "react"

import { createLogger } from "@/lib/tauri-logger"

const logger = createLogger("AdvancedTimelineConfig")

/**
 * Advanced Timeline Feature Flags
 */
export interface AdvancedTimelineFeatures {
  /** Speed ramping with bezier curves */
  speedRamping: boolean

  /** Color grading with Lift/Gamma/Gain */
  colorGrading: boolean

  /** Magnetic snapping with visual feedback */
  magneticSnapping: boolean

  /** Precision trimming (ripple, roll, slip, slide) */
  precisionTrimming: boolean

  /** Virtualized rendering for large projects */
  virtualizedRendering: boolean

  /** Progressive loading with lazy clip loading */
  progressiveLoading: boolean

  /** GPU acceleration for rendering */
  gpuAcceleration: boolean

  /** Advanced audio processing */
  advancedAudio: boolean
}

/**
 * Performance Configuration
 */
export interface AdvancedTimelinePerformance {
  /** Memory management */
  memory: {
    maxCacheSize: number // MB
    cleanupInterval: number // minutes
    memoryWarningThreshold: number // 0-1
  }

  /** Rendering optimization */
  rendering: {
    maxConcurrentRenders: number
    renderQuality: "draft" | "standard" | "high"
    fps: number
    viewportBuffer: number // extra items to render outside viewport
  }

  /** Loading optimization */
  loading: {
    preloadDistance: number // seconds ahead/behind to preload
    maxConcurrentLoads: number
    loadingTimeout: number // milliseconds
  }

  /** GPU settings */
  gpu: {
    enabled: boolean
    maxTextureSize: number
    shaderPrecision: "low" | "medium" | "high"
  }
}

/**
 * User Experience Configuration
 */
export interface AdvancedTimelineUX {
  /** Visual feedback */
  visual: {
    showSnapLines: boolean
    snapIndicatorOpacity: number
    showPerformanceStats: boolean
    theme: "light" | "dark" | "auto"
  }

  /** Interaction settings */
  interaction: {
    snapThreshold: number // pixels
    doubleClickThreshold: number // milliseconds
    dragThreshold: number // pixels
    keyboardShortcuts: boolean
  }

  /** Accessibility */
  accessibility: {
    highContrast: boolean
    reducedMotion: boolean
    screenReaderSupport: boolean
    keyboardNavigation: boolean
  }
}

/**
 * Complete Advanced Timeline Configuration
 */
export interface AdvancedTimelineConfig {
  /** Feature flags */
  features: AdvancedTimelineFeatures

  /** Performance settings */
  performance: AdvancedTimelinePerformance

  /** User experience settings */
  ux: AdvancedTimelineUX

  /** Debug and development settings */
  debug: {
    enabled: boolean
    logLevel: "error" | "warn" | "info" | "debug"
    performanceMonitoring: boolean
    errorReporting: boolean
  }
}

/**
 * Default configuration for advanced timeline features
 */
export const DEFAULT_ADVANCED_TIMELINE_CONFIG: AdvancedTimelineConfig = {
  features: {
    speedRamping: true,
    colorGrading: true,
    magneticSnapping: true,
    precisionTrimming: true,
    virtualizedRendering: true,
    progressiveLoading: true,
    gpuAcceleration: true,
    advancedAudio: false, // Disabled by default due to complexity
  },

  performance: {
    memory: {
      maxCacheSize: 200, // 200MB
      cleanupInterval: 5, // 5 minutes
      memoryWarningThreshold: 0.8, // 80%
    },

    rendering: {
      maxConcurrentRenders: 3,
      renderQuality: "standard",
      fps: 60,
      viewportBuffer: 2,
    },

    loading: {
      preloadDistance: 60, // 1 minute
      maxConcurrentLoads: 3,
      loadingTimeout: 10000, // 10 seconds
    },

    gpu: {
      enabled: true,
      maxTextureSize: 4096,
      shaderPrecision: "medium",
    },
  },

  ux: {
    visual: {
      showSnapLines: true,
      snapIndicatorOpacity: 0.7,
      showPerformanceStats: false,
      theme: "auto",
    },

    interaction: {
      snapThreshold: 5, // 5 pixels
      doubleClickThreshold: 300,
      dragThreshold: 3,
      keyboardShortcuts: true,
    },

    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReaderSupport: true,
      keyboardNavigation: true,
    },
  },

  debug: {
    enabled: process.env.NODE_ENV === "development",
    logLevel: "info",
    performanceMonitoring: false,
    errorReporting: true,
  },
}

/**
 * Advanced Timeline Configuration Manager
 */
export class AdvancedTimelineConfigManager {
  private static instance: AdvancedTimelineConfigManager
  private config: AdvancedTimelineConfig = { ...DEFAULT_ADVANCED_TIMELINE_CONFIG }
  private listeners: Array<(config: AdvancedTimelineConfig) => void> = []

  static getInstance(): AdvancedTimelineConfigManager {
    if (!AdvancedTimelineConfigManager.instance) {
      AdvancedTimelineConfigManager.instance = new AdvancedTimelineConfigManager()
    }
    return AdvancedTimelineConfigManager.instance
  }

  /**
   * Get current configuration
   */
  getConfig(): AdvancedTimelineConfig {
    return { ...this.config }
  }

  /**
   * Update configuration with validation
   */
  updateConfig(updates: Partial<AdvancedTimelineConfig>): boolean {
    try {
      const newConfig = this.deepMerge(this.config, updates)
      const validation = this.validateConfig(newConfig)

      if (!validation.valid) {
        logger.error("Invalid configuration:", validation.errors)
        return false
      }

      this.config = newConfig
      this.notifyListeners()
      this.persistConfig()

      logger.info("Configuration updated successfully")
      return true
    } catch (error) {
      logger.error("Failed to update configuration:", error)
      return false
    }
  }

  /**
   * Update specific feature flags
   */
  updateFeatures(features: Partial<AdvancedTimelineFeatures>): boolean {
    return this.updateConfig({ features: { ...this.config.features, ...features } })
  }

  /**
   * Update performance settings
   */
  updatePerformance(performance: Partial<AdvancedTimelinePerformance>): boolean {
    return this.updateConfig({ performance: this.deepMerge(this.config.performance, performance) })
  }

  /**
   * Reset to default configuration
   */
  resetToDefaults(): void {
    this.config = { ...DEFAULT_ADVANCED_TIMELINE_CONFIG }
    this.notifyListeners()
    this.persistConfig()
    logger.info("Configuration reset to defaults")
  }

  /**
   * Load configuration from storage
   */
  async loadFromStorage(): Promise<void> {
    try {
      if (typeof window === "undefined") return

      const stored = localStorage.getItem("timeline-studio-advanced-config")
      if (stored) {
        const parsedConfig = JSON.parse(stored)
        const mergedConfig = this.deepMerge(DEFAULT_ADVANCED_TIMELINE_CONFIG, parsedConfig)

        if (this.validateConfig(mergedConfig).valid) {
          this.config = mergedConfig
          this.notifyListeners()
          logger.info("Configuration loaded from storage")
        } else {
          logger.warn("Invalid stored configuration, using defaults")
        }
      }
    } catch (error) {
      logger.error("Failed to load configuration from storage:", error)
    }
  }

  /**
   * Subscribe to configuration changes
   */
  subscribe(listener: (config: AdvancedTimelineConfig) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Get optimized config for current hardware
   */
  getOptimizedConfig(): AdvancedTimelineConfig {
    const hardware = this.detectHardwareCapabilities()
    const optimized = { ...this.config }

    // Adjust settings based on hardware
    if (hardware.memory < 4) {
      // Less than 4GB RAM
      optimized.performance.memory.maxCacheSize = Math.min(optimized.performance.memory.maxCacheSize, 50)
      optimized.features.virtualizedRendering = true
      optimized.features.progressiveLoading = true
    }

    if (!hardware.webgl) {
      optimized.features.gpuAcceleration = false
      optimized.performance.gpu.enabled = false
    }

    if (hardware.cores < 4) {
      optimized.performance.rendering.maxConcurrentRenders = 1
      optimized.performance.loading.maxConcurrentLoads = 1
    }

    return optimized
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: AdvancedTimelineConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate memory settings
    if (config.performance.memory.maxCacheSize < 10 || config.performance.memory.maxCacheSize > 2000) {
      errors.push("Memory cache size must be between 10MB and 2000MB")
    }

    // Validate rendering settings
    if (
      config.performance.rendering.maxConcurrentRenders < 1 ||
      config.performance.rendering.maxConcurrentRenders > 10
    ) {
      errors.push("Max concurrent renders must be between 1 and 10")
    }

    // Validate loading settings
    if (config.performance.loading.maxConcurrentLoads < 1 || config.performance.loading.maxConcurrentLoads > 10) {
      errors.push("Max concurrent loads must be between 1 and 10")
    }

    // Validate UX settings
    if (config.ux.visual.snapIndicatorOpacity < 0 || config.ux.visual.snapIndicatorOpacity > 1) {
      errors.push("Snap indicator opacity must be between 0 and 1")
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Deep merge two objects
   */
  private deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target }

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key]
        const targetValue = result[key]

        if (this.isObject(sourceValue) && this.isObject(targetValue)) {
          result[key] = this.deepMerge(targetValue, sourceValue)
        } else {
          result[key] = sourceValue as T[Extract<keyof T, string>]
        }
      }
    }

    return result
  }

  /**
   * Check if value is an object
   */
  private isObject(item: any): item is Record<string, any> {
    return item && typeof item === "object" && !Array.isArray(item)
  }

  /**
   * Detect hardware capabilities
   */
  private detectHardwareCapabilities(): {
    memory: number // GB
    cores: number
    webgl: boolean
    gpuMemory: number // MB
  } {
    const hardware = {
      memory: 8, // Default assumption
      cores: navigator.hardwareConcurrency || 4,
      webgl: false,
      gpuMemory: 512,
    }

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      hardware.webgl = !!gl
    } catch (e) {
      hardware.webgl = false
    }

    // Estimate memory (rough approximation)
    if ("memory" in performance) {
      hardware.memory = (performance as any).memory.jsHeapSizeLimit / (1024 * 1024 * 1024)
    }

    return hardware
  }

  /**
   * Persist configuration to storage
   */
  private persistConfig(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("timeline-studio-advanced-config", JSON.stringify(this.config))
      }
    } catch (error) {
      logger.error("Failed to persist configuration:", error)
    }
  }

  /**
   * Notify listeners of configuration changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.config)
      } catch (error) {
        logger.error("Error in configuration listener:", error)
      }
    })
  }
}

/**
 * React hook for using advanced timeline configuration
 */
export function useAdvancedTimelineConfig() {
  const [config, setConfig] = React.useState<AdvancedTimelineConfig>(DEFAULT_ADVANCED_TIMELINE_CONFIG)
  const configManager = AdvancedTimelineConfigManager.getInstance()

  React.useEffect(() => {
    // Load initial config
    setConfig(configManager.getConfig())

    // Subscribe to changes
    const unsubscribe = configManager.subscribe(setConfig)

    // Load from storage
    configManager.loadFromStorage()

    return unsubscribe
  }, [])

  return {
    config,
    updateConfig: (updates: Partial<AdvancedTimelineConfig>) => configManager.updateConfig(updates),
    updateFeatures: (features: Partial<AdvancedTimelineFeatures>) => configManager.updateFeatures(features),
    updatePerformance: (performance: Partial<AdvancedTimelinePerformance>) =>
      configManager.updatePerformance(performance),
    resetToDefaults: () => configManager.resetToDefaults(),
    getOptimizedConfig: () => configManager.getOptimizedConfig(),
  }
}

// Export singleton instance
export const advancedTimelineConfig = AdvancedTimelineConfigManager.getInstance()
