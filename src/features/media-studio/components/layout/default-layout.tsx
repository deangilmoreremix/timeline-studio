import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { AiChat } from "@/features/ai-chat/components/ai-chat"
import { Browser } from "@/features/browser/components"
import { MainEditorRouter } from "@/features/navigation/components/main-editor-router"
import { Options } from "@/features/options"
import { Timeline } from "@/features/timeline/components/timeline"
import { useUserSettings } from "@/features/user-settings"
import { VideoPlayer } from "@/features/video-player/components/video-player"

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
  if (!isOptionsVisible && !isBrowserVisible) {
    return (
      <div className="h-full flex-1">
        <VideoPlayer />
      </div>
    )
  }
