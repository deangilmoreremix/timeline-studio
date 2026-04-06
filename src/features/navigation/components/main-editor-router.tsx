/**
 * Main Editor Router
 *
 * Routes between different standalone editors in Timeline Studio
 * Handles switching between Timeline, Rendiv, Spaces, and other editors
 */

import { useState } from "react"
// Import editor components
import { Browser } from "@/features/browser/components"
import { ColorSettings } from "@/features/color-grading"
import { AudioSettings } from "@/features/options/components/audio-settings"
import { Options } from "@/features/options/components/options"
import { Timeline } from "@/features/timeline/components/timeline"
import { VideoPlayer } from "@/features/video-player/components/video-player"
import type { EditorType } from "./main-navigation"
import { MainNavigation, useMainNavigation } from "./main-navigation"

interface MainEditorRouterProps {
  className?: string
}

export function MainEditorRouter({ className }: MainEditorRouterProps) {
  const { currentEditor, switchToEditor } = useMainNavigation()

  const renderCurrentEditor = () => {
    switch (currentEditor) {
      case "timeline":
        return <Timeline />

      case "browser":
        return <Browser />

      case "rendiv":
        // Rendiv editor is imported in the navigation component
        return null // Handled by the navigation component

      case "spaces":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">CineGen Spaces</h2>
              <p className="text-muted-foreground">Node-based AI workflow editor coming soon...</p>
            </div>
          </div>
        )

      case "color":
        return (
          <div className="h-full">
            <ColorSettings />
          </div>
        )

      case "audio":
        return (
          <div className="h-full">
            <AudioSettings />
          </div>
        )

      case "settings":
        return <Options />

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Editor Not Found</h2>
              <p className="text-muted-foreground">The requested editor is not available.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={`flex h-full ${className}`}>
      {/* Main Navigation Sidebar */}
      <MainNavigation currentEditor={currentEditor} onEditorChange={switchToEditor} />

      {/* Editor Content Area */}
      <div className="flex-1 overflow-hidden">{renderCurrentEditor()}</div>
    </div>
  )
}
