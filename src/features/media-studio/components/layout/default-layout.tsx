import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { AiChat } from "@/features/ai-chat/components/ai-chat"
import { Browser } from "@/features/browser/components"
import { MainEditorRouter } from "@/features/navigation/components/main-editor-router"
import { Options, Options } from "@/features/options"
import { RendivEditor } from "@/features/options/components/rendiv-editor"
import { Timeline, Timeline } from "@/features/timeline/components/timeline"
import { useUserSettings, useUserSettings } from "@/features/user-settings"
import { VideoPlayer, VideoPlayer } from "@/features/video-player/components/video-player"

interface TopDefaultLayoutProps {
  isOptionsVisible: boolean
  isTimelineVisible: boolean
  isBrowserVisible: boolean
}

function TopDefaultLayout({ isOptionsVisible, isTimelineVisible: _, isBrowserVisible }: TopDefaultLayoutProps) {
  // Случай: только VideoPlayer (все панели скрыты)
  if (!isOptionsVisible && !isBrowserVisible) {
    return (
      <div className="h-full flex-1">
        <VideoPlayer />
      </div>
    )
  }

  // Случай: Browser + VideoPlayer (Options скрыт)
  if (isBrowserVisible && !isOptionsVisible) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-grow" autoSaveId="default-layout-1">
        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className="h-full flex-1">
            <Browser />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className="h-full flex-1">
            <VideoPlayer />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  // Случай: VideoPlayer + Options (Browser скрыт)
  if (!isBrowserVisible && isOptionsVisible) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-grow" autoSaveId="default-layout-2">
        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className="h-full flex-1">
            <VideoPlayer />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className="h-full flex-1">
            <Options />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  // Случай: Browser + VideoPlayer + Options (все видимы)
  if (isBrowserVisible && isOptionsVisible) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-grow" autoSaveId="default-layout-3">
        <ResizablePanel defaultSize={50} minSize={20} maxSize={70}>
          <div className="h-full flex-1">
            <Browser />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20} maxSize={70}>
          <div className="h-full flex-1">
            <VideoPlayer />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20} maxSize={70}>
          <div className="h-full flex-1">
            <Options />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  // Fallback: только VideoPlayer
  return (
    <div className="h-full flex-1">
      <VideoPlayer />
    </div>
  )
}

export function DefaultLayout() {
  const { isOptionsVisible } = useUserSettings()
  const { isBrowserVisible } = useUserSettings()
  const { isRendivVisible } = useUserSettings()
  const { layoutMode } = useUserSettings()

  // Editor mode - use main navigation with editor router
  if (layoutMode === "editor") {
    return (
      <div className="h-full">
        <MainEditorRouter />
      </div>
    )
  }

  // All panels hidden - show only VideoPlayer
  if (!isOptionsVisible && !isBrowserVisible && !isRendivVisible) {
    return (
      <div className="h-full flex-1">
        <VideoPlayer />
      </div>
    )
  }

  // Handle different panel combinations
  // For simplicity, show Rendiv as a right panel when visible
  if (isRendivVisible) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-grow">
        <ResizablePanel defaultSize={70} minSize={50} maxSize={90}>
          <div className="h-full flex-1">
            <VideoPlayer />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <div className="h-full">
            <RendivEditor />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  // Browser + VideoPlayer (Options hidden)
  if (isBrowserVisible && !isOptionsVisible) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-grow" autoSaveId="default-layout-1">
        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className="h-full flex-1">
            <Browser />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className="h-full flex-1">
            <VideoPlayer />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  // VideoPlayer + Options (Browser hidden)
  if (!isBrowserVisible && isOptionsVisible) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-grow" autoSaveId="default-layout-2">
        <ResizablePanel defaultSize={70} minSize={50} maxSize={90}>
          <div className="h-full flex-1">
            <VideoPlayer />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <div className="h-full">
            <Options />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  // Browser + VideoPlayer + Options (all visible)
  if (isBrowserVisible && isOptionsVisible) {
    return (
      <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-grow" autoSaveId="default-layout-3">
        <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
          <div className="h-full flex-1">
            <Browser />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={55} minSize={40} maxSize={70}>
          <div className="h-full flex-1">
            <VideoPlayer />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
          <div className="h-full">
            <Options />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  // Fallback - just show VideoPlayer
  return (
    <div className="h-full flex-1">
      <VideoPlayer />
    </div>
  )
