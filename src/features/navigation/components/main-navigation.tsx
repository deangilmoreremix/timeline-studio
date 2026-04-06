/**
 * Main Navigation Sidebar
 *
 * Provides navigation between different editors and views in Timeline Studio
 * Standalone editors like Rendiv are accessible from here
 */

import { Code, Eye, Film, type LucideIcon, MonitorSpeaker, Palette, Play, Settings, Zap } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
// Import editor components
import { RendivEditor } from "@/features/options/components/rendiv-editor"
import { cn } from "@/lib/utils"

export type EditorType = "timeline" | "browser" | "rendiv" | "spaces" | "color" | "audio" | "settings"

interface EditorOption {
  id: EditorType
  name: string
  icon: LucideIcon
  description: string
  component?: React.ComponentType
}

interface MainNavigationProps {
  currentEditor: EditorType
  onEditorChange: (editor: EditorType) => void
  className?: string
}

const EDITOR_OPTIONS: EditorOption[] = [
  {
    id: "timeline",
    name: "Timeline Editor",
    icon: Film,
    description: "Professional timeline editing with tracks and clips",
  },
  {
    id: "browser",
    name: "Media Browser",
    icon: MonitorSpeaker,
    description: "Browse and import media files",
  },
  {
    id: "rendiv",
    name: "Rendiv Editor",
    icon: Code,
    description: "Code-first video creation with AI assistance",
    component: RendivEditor,
  },
  {
    id: "spaces",
    name: "CineGen Spaces",
    icon: Zap,
    description: "Node-based AI workflow editor",
  },
  {
    id: "color",
    name: "Color Grading",
    icon: Palette,
    description: "Professional color correction tools",
  },
  {
    id: "audio",
    name: "Audio Mixing",
    icon: Play,
    description: "Advanced audio editing and mixing",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    description: "Application preferences and configuration",
  },
]

export function MainNavigation({ currentEditor, onEditorChange, className }: MainNavigationProps) {
  const { t } = useTranslation()

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", className)}>
      {/* Header */}
      <div className="flex items-center justify-center border-b p-4">
        <h2 className="text-lg font-semibold">Timeline Studio</h2>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {EDITOR_OPTIONS.map((editor) => {
            const Icon = editor.icon
            const isActive = currentEditor === editor.id

            return (
              <Button
                key={editor.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3 py-3 h-auto",
                  isActive && "bg-accent text-accent-foreground",
                )}
                onClick={() => onEditorChange(editor.id)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{editor.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-2">{editor.description}</span>
                </div>
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <div className="text-xs text-muted-foreground text-center">Select an editor to get started</div>
      </div>
    </div>
  )
}

// Hook for managing current editor state
export function useMainNavigation() {
  const [currentEditor, setCurrentEditor] = useState<EditorType>("timeline")

  const switchToEditor = (editor: EditorType) => {
    setCurrentEditor(editor)
  }

  return {
    currentEditor,
    switchToEditor,
  }
}
