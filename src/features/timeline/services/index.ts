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

// Color grading services
export {
  ColorGradingEngine,
  colorGradingEngine,
  colorGradingShaderManager,
} from "./color-grading-integration"
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
