/**
 * Rendiv Editor - Standalone Code-First Video Editor
 *
 * Integrated into the Timeline Studio sidebar as a dedicated editor
 * Provides the full Rendiv experience: code editing, live preview, AI assistance
 */

import { Code, Eye, Play, RotateCcw, Settings, Square, Zap } from "lucide-react"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Import our Rendiv components
import { Spaces } from "@/features/timeline/components/spaces/spaces-canvas"
import { cineGenElementsEngine } from "@/features/timeline/services/cinegen-elements-engine"
import { ltxDesktopCUDAEngine } from "@/features/timeline/services/ltx-desktop-cuda-engine"
import { rendivVideoSystem } from "@/features/timeline/services/rendiv-video-system"

interface RendivEditorProps {
  className?: string
}

export function RendivEditor({ className }: RendivEditorProps) {
  const { t } = useTranslation()
  const [activeMode, setActiveMode] = useState<"code" | "spaces" | "preview">("code")
  const [compositionCode, setCompositionCode] = useState(`// Welcome to Rendiv!
// This is where you write React code for video creation

import { useFrame, Fill, interpolate, spring } from '@rendiv/core';

export const MyVideo = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });

  return (
    <Fill style={{ background: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{
        opacity,
        transform: \`scale(\${scale})\`,
        color: 'white',
        fontSize: 80,
        textAlign: 'center'
      }}>
        Hello, Rendiv! 👋
      </h1>
    </Fill>
  );
};`)

  const [isPlaying, setIsPlaying] = useState(false)
  const [renderProgress, setRenderProgress] = useState(0)
  const [useClaude, setUseClaude] = useState(false)
  const [claudeApiKey, setClaudeApiKey] = useState("")
  const [muapiConfig, setMuapiConfig] = useState({
    duration: 5,
    resolution: "1080p",
    quality: "high",
    model: "muapi-v1",
  })

  // Handle code execution/rendering
  const handleRender = useCallback(async () => {
    setIsPlaying(true)
    setRenderProgress(0)

    try {
      // Simulate rendering progress
      const progressInterval = setInterval(() => {
        setRenderProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setIsPlaying(false)
            return 100
          }
          return prev + 10
        })
      }, 200)

      // If using Claude, enhance the code first
      const finalCode = compositionCode
      if (useClaude && claudeApiKey) {
        // Call Claude to enhance/improve the code
        // This would use the Tauri command we created
        console.log("Enhancing code with Claude...")
      }

      // Create a Rendiv component from the code
      const componentId = await rendivVideoSystem.createRendivComponent("custom", "UserComposition", {
        code: finalCode,
      })

      // Queue for rendering
      const jobId = await rendivVideoSystem.queueRendivRender(componentId, "normal")

      console.log("Render job queued:", jobId)
    } catch (error) {
      console.error("Render failed:", error)
      setIsPlaying(false)
    }
  }, [compositionCode, useClaude, claudeApiKey])

  const handleStop = useCallback(() => {
    setIsPlaying(false)
    setRenderProgress(0)
  }, [])

  const handleReset = useCallback(() => {
    setCompositionCode(`// Reset to starter template

import { useFrame, Fill, interpolate, spring } from '@rendiv/core';

export const MyVideo = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });

  return (
    <Fill style={{ background: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{
        opacity,
        transform: \`scale(\${scale})\`,
        color: 'white',
        fontSize: 80,
        textAlign: 'center'
      }}>
        Hello, Rendiv! 👋
      </h1>
    </Fill>
  );
};`)
  }, [])

  return (
    <div className={`rendiv-editor h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-sm">Rendiv Editor</h3>
            <Badge variant="secondary" className="text-xs">
              AI-Powered
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={activeMode === "code" ? "default" : "outline"}
              onClick={() => setActiveMode("code")}
            >
              <Code className="w-4 h-4 mr-1" />
              Code
            </Button>
            <Button
              size="sm"
              variant={activeMode === "spaces" ? "default" : "outline"}
              onClick={() => setActiveMode("spaces")}
            >
              <Zap className="w-4 h-4 mr-1" />
              Spaces
            </Button>
            <Button
              size="sm"
              variant={activeMode === "preview" ? "default" : "outline"}
              onClick={() => setActiveMode("preview")}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeMode === "code" && (
          <div className="h-full flex flex-col">
            {/* Controls */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleRender}
                    disabled={isPlaying}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-4 h-4 mr-1" />
                        Rendering...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Render
                      </>
                    )}
                  </Button>

                  {isPlaying && (
                    <Button size="sm" variant="outline" onClick={handleStop}>
                      <Square className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                  )}

                  <Button size="sm" variant="outline" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="claude-mode" checked={useClaude} onCheckedChange={setUseClaude} />
                    <Label htmlFor="claude-mode" className="text-xs">
                      Claude AI
                    </Label>
                  </div>
                </div>
              </div>

              {/* Claude API Key Input */}
              {useClaude && (
                <div className="mt-3 space-y-2">
                  <Label className="text-xs">Claude API Key</Label>
                  <Input
                    type="password"
                    value={claudeApiKey}
                    onChange={(e) => setClaudeApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="text-xs h-7"
                  />
                </div>
              )}

              {/* Render Config */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Duration</Label>
                  <Select
                    value={muapiConfig.duration.toString()}
                    onValueChange={(value) => setMuapiConfig((prev) => ({ ...prev, duration: Number.parseInt(value) }))}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 seconds</SelectItem>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="15">15 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Quality</Label>
                  <Select
                    value={muapiConfig.quality}
                    onValueChange={(value) => setMuapiConfig((prev) => ({ ...prev, quality: value }))}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Progress Bar */}
              {isPlaying && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center mt-1">{renderProgress}% complete</p>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-3">
              <Textarea
                value={compositionCode}
                onChange={(e) => setCompositionCode(e.target.value)}
                className="h-full font-mono text-sm resize-none"
                placeholder="Write your Rendiv composition here..."
              />
            </div>
          </div>
        )}

        {activeMode === "spaces" && (
          <div className="h-full">
            <Spaces
              className="h-full"
              onWorkflowExecute={(nodes, edges) => {
                console.log("Spaces workflow executed:", { nodes, edges })
              }}
            />
          </div>
        )}

        {activeMode === "preview" && (
          <div className="h-full p-4 space-y-4">
            {/* Render Jobs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Render Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rendivVideoSystem.getRenderJobs().map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{job.component.name}</p>
                        <p className="text-xs text-muted-foreground">{job.status}</p>
                      </div>
                      <Badge variant={job.status === "completed" ? "default" : "secondary"}>{job.status}</Badge>
                    </div>
                  ))}

                  {rendivVideoSystem.getRenderJobs().length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No render jobs yet. Write code and click Render!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CineGen Elements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  AI Elements ({cineGenElementsEngine.getAllElements().length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cineGenElementsEngine.getAllElements().map((element) => (
                    <div key={element.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{element.name}</p>
                        <p className="text-xs text-muted-foreground">{element.element_type}</p>
                      </div>
                      <Badge variant="outline">{element.element_type}</Badge>
                    </div>
                  ))}

                  {cineGenElementsEngine.getAllElements().length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No AI elements created yet. Use Spaces to generate content!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            LTX CUDA: {ltxDesktopCUDAEngine.getDevices().length} GPU
            {ltxDesktopCUDAEngine.getDevices().length !== 1 ? "s" : ""}
          </span>
          <span>Elements: {cineGenElementsEngine.getAllElements().length}</span>
          <span>Renders: {rendivVideoSystem.getRenderJobs().length}</span>
        </div>
      </div>
    </div>
  )
}
