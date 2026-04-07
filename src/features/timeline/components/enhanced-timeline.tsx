/**
 * Enhanced Timeline Component with Multi-Track Support
 *
 * Professional multi-track timeline with advanced compositing,
 * blend modes, and cross-track effects
 */

import { Eye, EyeOff, Lock, Plus, Settings, Unlock, Volume2, VolumeX } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import {
  type BlendMode,
  type EnhancedClip,
  type EnhancedTrack,
  multiTrackTimelineEngine,
  type TrackType,
} from "../services/multi-track-timeline-engine"
import { ClipEditor } from "./components/clip-editor"
import { CompositingPreview } from "./components/compositing-preview"
import { TimelineRuler } from "./components/timeline-ruler"
import { TrackLane } from "./components/track-lane"

interface EnhancedTimelineProps {
  className?: string
}

const TRACK_TYPES: { value: TrackType; label: string; color: string }[] = [
  { value: "video", label: "Video Track", color: "#3b82f6" },
  { value: "audio", label: "Audio Track", color: "#10b981" },
  { value: "text", label: "Text Track", color: "#f59e0b" },
  { value: "effect", label: "Effect Track", color: "#8b5cf6" },
  { value: "adjustment", label: "Adjustment Track", color: "#ef4444" },
  { value: "subtitle", label: "Subtitle Track", color: "#6b7280" },
]

const BLEND_MODES: BlendMode[] = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "soft-light",
  "hard-light",
  "color-dodge",
  "color-burn",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
]

export function EnhancedTimeline({ className }: EnhancedTimelineProps) {
  const { t } = useTranslation()
  const [tracks, setTracks] = useState<EnhancedTrack[]>([])
  const [selectedClip, setSelectedClip] = useState<EnhancedClip | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [showPreview, setShowPreview] = useState(true)

  // Load tracks on mount
  useEffect(() => {
    setTracks(multiTrackTimelineEngine.getTracks())
  }, [])

  // Update tracks when they change
  const refreshTracks = useCallback(() => {
    setTracks(multiTrackTimelineEngine.getTracks())
  }, [])

  // Create new track
  const createTrack = useCallback(
    (type: TrackType) => {
      const track = multiTrackTimelineEngine.createTrack(type)
      refreshTracks()
      return track
    },
    [refreshTracks],
  )

  // Add clip to track
  const addClipToTrack = useCallback(
    (trackId: string, startTime: number) => {
      const clip = multiTrackTimelineEngine.addClipToTrack(trackId, {
        startTime,
        endTime: startTime + 5,
        duration: 5,
        name: `Clip ${Date.now()}`,
      })
      refreshTracks()
      return clip
    },
    [refreshTracks],
  )

  // Move clip
  const moveClip = useCallback(
    (clipId: string, newTrackId: string, newStartTime: number) => {
      multiTrackTimelineEngine.moveClip(clipId, newTrackId, newStartTime)
      refreshTracks()
    },
    [refreshTracks],
  )

  // Update track properties
  const updateTrack = useCallback(
    (trackId: string, updates: Partial<EnhancedTrack>) => {
      const track = multiTrackTimelineEngine.getTrack(trackId)
      if (track) {
        Object.assign(track, updates)
        refreshTracks()
      }
    },
    [refreshTracks],
  )

  // Delete track
  const deleteTrack = useCallback(
    (trackId: string) => {
      // Implementation would remove track from engine
      refreshTracks()
    },
    [refreshTracks],
  )

  return (
    <div className={`enhanced-timeline flex flex-col h-full bg-background ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Multi-Track Timeline</h2>
          <Badge variant="secondary">Professional</Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Track Dropdown */}
          <Select onValueChange={(value) => createTrack(value as TrackType)}>
            <SelectTrigger className="w-40">
              <Plus className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Add Track" />
            </SelectTrigger>
            <SelectContent>
              {TRACK_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preview Toggle */}
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showPreview ? "Hide" : "Show"} Preview
          </Button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}>
              -
            </Button>
            <span className="text-sm min-w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(5, zoom + 0.1))}>
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track List Sidebar */}
        <div className="w-64 border-r border-border bg-muted/10">
          <div className="p-3 border-b border-border">
            <h3 className="font-medium text-sm">Tracks ({tracks.length})</h3>
          </div>

          <div className="overflow-y-auto">
            {tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                onUpdate={updateTrack}
                onDelete={deleteTrack}
                onAddClip={(startTime) => addClipToTrack(track.id, startTime)}
              />
            ))}

            {tracks.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No tracks yet</p>
                <p className="text-xs">Add a track to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Area */}
        <div className="flex-1 flex flex-col">
          {/* Timeline Ruler */}
          <TimelineRuler
            duration={multiTrackTimelineEngine.getProjectDuration()}
            currentTime={currentTime}
            zoom={zoom}
            onTimeChange={setCurrentTime}
          />

          {/* Tracks */}
          <div className="flex-1 overflow-y-auto">
            {tracks.map((track) => (
              <TrackLane
                key={track.id}
                track={track}
                zoom={zoom}
                currentTime={currentTime}
                onClipSelect={setSelectedClip}
                onClipMove={moveClip}
              />
            ))}
          </div>

          {/* Time Indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
            style={{
              left: `${64 + currentTime * zoom * 10}px`, // Adjust based on ruler width
            }}
          />
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <>
            <Separator orientation="vertical" />
            <div className="w-80 border-l border-border bg-muted/10">
              <CompositingPreview tracks={tracks} currentTime={currentTime} onTimeUpdate={setCurrentTime} />
            </div>
          </>
        )}
      </div>

      {/* Clip Editor Modal */}
      {selectedClip && (
        <ClipEditor
          clip={selectedClip}
          onClose={() => setSelectedClip(null)}
          onUpdate={(updates) => {
            Object.assign(selectedClip, updates)
            refreshTracks()
          }}
        />
      )}
    </div>
  )
}

// Track Item Component
interface TrackItemProps {
  track: EnhancedTrack
  onUpdate: (trackId: string, updates: Partial<EnhancedTrack>) => void
  onDelete: (trackId: string) => void
  onAddClip: (startTime: number) => void
}

function TrackItem({ track, onUpdate, onDelete, onAddClip }: TrackItemProps) {
  return (
    <div className="p-3 border-b border-border hover:bg-muted/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: track.color }} />
          <span className="font-medium text-sm">{track.name}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onUpdate(track.id, { muted: !track.muted })}>
            {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => onUpdate(track.id, { locked: !track.locked })}>
            {track.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => onDelete(track.id)}>
            ×
          </Button>
        </div>
      </div>

      {/* Track Controls */}
      <div className="space-y-2">
        {track.type === "video" && (
          <>
            <div>
              <label className="text-xs text-muted-foreground">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={track.opacity}
                onChange={(e) => onUpdate(track.id, { opacity: Number.parseFloat(e.target.value) })}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Blend Mode</label>
              <Select
                value={track.blendMode}
                onValueChange={(value) => onUpdate(track.id, { blendMode: value as BlendMode })}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLEND_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {track.type === "audio" && (
          <div>
            <label className="text-xs text-muted-foreground">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.volume}
              onChange={(e) => onUpdate(track.id, { volume: Number.parseFloat(e.target.value) })}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onAddClip(0)}>
          Add Clip
        </Button>
      </div>
    </div>
  )
}
