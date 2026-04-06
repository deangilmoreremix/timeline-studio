// Components
export * from "./components"
// Configuration
export * from "./config/advanced-timeline-config"
// Hooks
export type {
  UseClipsReturn,
  UseTimelineSelectionReturn,
  UseTracksReturn,
} from "./hooks"
export {
  useAdvancedTimeline,
  useClips,
  useTimeline,
  useTimelineSelection,
  useTimelineTransitions,
  useTracks,
} from "./hooks"
// Services
export * from "./services"
// Types
// Type Track is aliased as TimelineTrack to avoid conflict with Track component
export type {
  AppliedEffect,
  AppliedFilter,
  AppliedTransition,
  Section,
  TimelineClip,
  TimelineKeyframe,
  TimelineProject,
  TimelineSection,
  TimelineTrack,
  TimelineTransition,
  Track as TimelineTrackType,
  TrackType,
} from "./types"
// Functions from types
export { isMusicClip, isSubtitleClip } from "./types"
export type {
  CompoundMetadata,
  CompoundVersion,
  MulticamAngle,
  MulticamSource,
  MulticamSwitch,
} from "./types/advanced-clips"
export { AdvancedClipUtils } from "./types/advanced-clips"
// Advanced types
export type {
  AdvancedClip,
  AdvancedClipProperties,
  AdvancedProjectCache,
  AdvancedProjectMetadata,
  AdvancedProjectResources,
  AdvancedTimelineProject,
  ColorOverrides,
  SpeedKeyframe,
  SpeedRampingConfig,
} from "./types/advanced-timeline"

// Factories
export * from "./types/factories"
// Timeline transition types
export * from "./types/timeline-transition"
