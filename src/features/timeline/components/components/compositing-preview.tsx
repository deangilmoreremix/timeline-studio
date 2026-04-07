/**
 * Compositing Preview Component
 *
 * Real-time preview of multi-track compositing with blend modes
 */

import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type CompositingResult, multiTrackTimelineEngine } from "../../services/multi-track-timeline-engine"

interface CompositingPreviewProps {
  tracks: any[]
  currentTime: number
  onTimeUpdate: (time: number) => void
}

export function CompositingPreview({ tracks, currentTime, onTimeUpdate }: CompositingPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [previewResult, setPreviewResult] = useState<CompositingResult | null>(null)
  const animationFrameRef = useRef<number>()

  const CANVAS_WIDTH = 320
  const CANVAS_HEIGHT = 180

  // Composite and render current frame
  const renderFrame = useCallback(async () => {
    if (!canvasRef.current) return

    try {
      const result = await multiTrackTimelineEngine.compositeFrameAtTime(currentTime, CANVAS_WIDTH, CANVAS_HEIGHT)

      setPreviewResult(result)

      // Draw to canvas
      const ctx = canvasRef.current.getContext("2d")
      if (ctx && result.frame) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.drawImage(result.frame, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      }
    } catch (error) {
      console.error("Preview render failed:", error)
    }
  }, [currentTime])

  // Update preview when time changes
  useEffect(() => {
    renderFrame()
  }, [renderFrame])

  // Playback animation
  useEffect(() => {
    if (!isPlaying) return

    const animate = () => {
      onTimeUpdate(currentTime + 1 / 30) // 30 fps
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, currentTime, onTimeUpdate])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSkipBack = () => {
    onTimeUpdate(Math.max(0, currentTime - 5))
  }

  const handleSkipForward = () => {
    const maxTime = multiTrackTimelineEngine.getProjectDuration()
    onTimeUpdate(Math.min(maxTime, currentTime + 5))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="compositing-preview h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <h3 className="font-medium text-sm">Compositing Preview</h3>
        <p className="text-xs text-muted-foreground">Real-time multi-track compositing</p>
      </div>

      {/* Preview Canvas */}
      <div className="p-4">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-auto block"
            style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
          />

          {/* No content overlay */}
          {tracks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-sm">No tracks to preview</p>
                <p className="text-xs opacity-75">Add tracks and clips to see the preview</p>
              </div>
            </div>
          )}

          {/* Time overlay */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleSkipBack}>
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={handleSkipForward}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Time scrubber */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={multiTrackTimelineEngine.getProjectDuration()}
            step="0.1"
            value={currentTime}
            onChange={(e) => onTimeUpdate(Number.parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Compositing Info */}
      {previewResult && (
        <div className="px-4 pb-4 border-t border-border">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Render Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tracks:</span>
                <Badge variant="secondary">{previewResult.metadata.trackCount}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Effects:</span>
                <Badge variant="secondary">{previewResult.metadata.effectCount}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Render Time:</span>
                <Badge variant="outline">{previewResult.metadata.renderTime.toFixed(1)}ms</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Track Summary */}
      <div className="px-4 pb-4 flex-1 overflow-y-auto">
        <h4 className="text-sm font-medium mb-2">Active Tracks</h4>
        <div className="space-y-1">
          {tracks.map((track: any) => (
            <div key={track.id} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: track.color }} />
              <span className="flex-1 truncate">{track.name}</span>
              <Badge variant="outline" className="text-xs">
                {track.clips.length}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
