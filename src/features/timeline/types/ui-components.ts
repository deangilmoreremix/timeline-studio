import { ReactNode } from "react"

// Base component props
export interface BaseTimelineComponentProps {
  className?: string
  "data-testid"?: string
}

// FormInputGroup types
export interface FormInputGroupProps extends BaseTimelineComponentProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  children: ReactNode
  validation?: {
    rule: (value: any) => boolean
    message: string
  }
  timelineContext?: {
    trackId?: string
    clipId?: string
    projectId?: string
  }
}

export interface FormInputGroupState {
  isValid: boolean
  hasError: boolean
  errorMessage?: string
}

// Tabs types
export interface TabItem {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface TabsProps extends BaseTimelineComponentProps {
  tabs: TabItem[]
  defaultActiveTab?: string
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: "default" | "pills" | "underline"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  timelineContext?: {
    panelType?: "effects" | "color-grading" | "audio" | "transitions" | "settings"
  }
}

// HorizontalStepper types
export interface StepItem {
  id: string
  title: string
  description?: string
  content: ReactNode
  completed?: boolean
  error?: string
  disabled?: boolean
}

export interface HorizontalStepperProps extends BaseTimelineComponentProps {
  steps: StepItem[]
  currentStep?: number
  onStepChange?: (stepId: string, stepIndex: number) => void
  allowSkip?: boolean
  showProgress?: boolean
  timelineContext?: {
    workflowType?: "color-correction" | "audio-mixing" | "export" | "batch-processing"
  }
}

// Toggler types
export interface TogglerOption {
  value: string | number | boolean
  label: string
  disabled?: boolean
  icon?: ReactNode
}

export interface TogglerProps extends BaseTimelineComponentProps {
  options: TogglerOption[]
  value?: string | number | boolean
  defaultValue?: string | number | boolean
  onChange?: (value: string | number | boolean) => void
  variant?: "buttons" | "switch" | "radio"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  timelineContext?: {
    settingType?: "mute" | "solo" | "visibility" | "lock" | "automation"
    trackId?: string
    clipId?: string
  }
}

// AudioPreview types
export interface AudioPreviewProps extends BaseTimelineComponentProps {
  audioUrl?: string
  waveformData?: number[]
  duration?: number
  currentTime?: number
  onTimeChange?: (time: number) => void
  showWaveform?: boolean
  showTimeLabels?: boolean
  height?: number
  timelineContext?: {
    trackId: string
    clipId?: string
    startTime?: number
    endTime?: number
  }
}

// AudioControls types
export interface AudioControlsProps extends BaseTimelineComponentProps {
  isPlaying?: boolean
  isPaused?: boolean
  isMuted?: boolean
  volume?: number
  playbackRate?: number
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  onVolumeChange?: (volume: number) => void
  onPlaybackRateChange?: (rate: number) => void
  onLoopToggle?: (loop: boolean) => void
  onMuteToggle?: (muted: boolean) => void
  showVolume?: boolean
  showPlaybackRate?: boolean
  showLoop?: boolean
  timelineContext?: {
    trackId?: string
    globalControls?: boolean
  }
}

// ProviderList types
export interface AIProvider {
  id: string
  name: string
  description?: string
  icon?: ReactNode
  status: "available" | "unavailable" | "error"
  priority?: number
  capabilities?: string[]
}

export interface ProviderListProps extends BaseTimelineComponentProps {
  providers: AIProvider[]
  selectedProvider?: string
  onProviderSelect?: (providerId: string) => void
  showStatus?: boolean
  showCapabilities?: boolean
  filterByCapability?: string
  timelineContext?: {
    operationType?: "text-to-video" | "image-to-video" | "audio-generation" | "analysis"
  }
}

// LibraryCTA types
export interface LibraryCTAProps extends BaseTimelineComponentProps {
  title: string
  description?: string
  actionLabel: string
  onAction: () => void
  icon?: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  timelineContext?: {
    libraryType?: "media" | "effects" | "templates" | "presets"
    projectId?: string
  }
}

// Hook return types
export interface UseFormInputGroupReturn {
  validate: (value: any) => boolean
  getErrorMessage: () => string | undefined
  clearError: () => void
  state: FormInputGroupState
}

export interface UseTimelineTabsReturn {
  activeTab: string
  setActiveTab: (tabId: string) => void
  tabHistory: string[]
  goToPreviousTab: () => void
}

export interface UseAudioPreviewReturn {
  isLoading: boolean
  error: string | null
  waveformData: number[]
  loadAudio: (url: string) => Promise<void>
  seekToTime: (time: number) => void
}

export interface UseProviderListReturn {
  availableProviders: AIProvider[]
  selectedProvider: AIProvider | null
  selectProvider: (providerId: string) => void
  filterProviders: (capability: string) => AIProvider[]
  refreshProviders: () => Promise<void>
}
