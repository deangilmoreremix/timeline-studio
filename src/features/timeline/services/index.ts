/**
 * Timeline Services - Advanced Timeline Engines
 *
 * Export all advanced timeline services for production use
 */

// Magnetic timeline services
export {
  AdvancedSnapDetector,
  advancedSnapDetector,
  MagneticTimelineEngine,
  MagneticTimelineInteraction,
  magneticTimelineEngine,
  magneticTimelineInteraction,
} from "../hooks/use-magnetic-timeline"
// Audio processing services
export {
  type AudioAutomation,
  type AudioBus,
  type AudioEffect,
  type AudioSend,
  type AudioSession,
  type AudioTrack,
  audioProcessingEngine,
  type ProcessingResult,
} from "./audio-processing-engine"
// Collaboration services
export {
  type CollaborationEvent,
  type CollaborationSession,
  type Conflict,
  collaborationEngine,
  type Operation,
  type OperationType,
  type User,
  type UserPermission,
} from "./collaboration-engine"
// Color grading services
export {
  ColorGradingEngine,
  colorGradingEngine,
  colorGradingShaderManager,
} from "./color-grading-integration"
// Plugin system services
export {
  type PluginContext,
  type PluginInstance,
  type PluginManifest,
  type PluginPermission,
  type PluginType,
  pluginSystem,
} from "./plugin-system"
// Precision trimming services
export {
  PrecisionTrimmingEngine,
  precisionTrimmingEngine,
  TrimHandleManager,
  trimHandleManager,
} from "./precision-trimming"
// Progressive loading services
export {
  LazyClipLoader,
  lazyClipLoader,
  ProgressiveDataStreamer,
  ProgressiveTimelineLoader,
  progressiveDataStreamer,
  progressiveTimelineLoader,
} from "./progressive-loader"
// Repository integration services (CineGen, LTX-Desktop, Rendiv)
export {
  AIContentGenerationEngine,
  AIGenerationModel,
  aiContentGenerationEngine,
  GPURenderingEngine,
  gpuRenderingEngine,
  MultiCameraEditingEngine,
  multiCameraEditingEngine,
  UnifiedProjectFormat,
  unifiedProjectFormat,
} from "./repository-integration-engine"
// Speed ramping services
export {
  audioStretchingProcessor,
  opticalFlowProcessor,
  SpeedRampingEngine,
  speedRampingCache,
  speedRampingEngine,
} from "./speed-ramping-engine"
// Virtualized rendering services
export {
  GPUClipRenderer,
  gpuClipRenderer,
  VirtualizedTimelineRenderer,
  VirtualScrollingManager,
  virtualizedTimelineRenderer,
  virtualScrollingManager,
} from "./virtualized-renderer"
