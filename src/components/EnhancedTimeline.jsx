/**
 * Enhanced Timeline Component for Higgsfield
 *
 * React-based enhanced timeline with multi-track support, audio processing, and collaboration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Lock, Plus, Settings, Unlock, Volume2, VolumeX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { multiTrackTimelineEngine, type BlendMode, type EnhancedClip, type EnhancedTrack, type TrackType } from './multi-track-timeline-engine'
import { ClipEditor } from './clip-editor'
import { CompositingPreview } from './compositing-preview'
import { TimelineRuler } from './timeline-ruler'
import { TrackLane } from './track-lane'

const TRACK_TYPES = [
  { value: "video", label: "Video Track", color: "#3b82f6", icon: "🎬" },
  { value: "audio", label: "Audio Track", color: "#10b981", icon: "🎵" },
  { value: "text", label: "Text Track", color: "#f59e0b", icon: "📝" },
  { value: "effect", label: "Effect Track", color: "#8b5cf6", icon: "⚡" },
  { value: "adjustment", label: "Adjustment Track", color: "#ef4444", icon: "🎨" },
  { value: "subtitle", label: "Subtitle Track", color: "#6b7280", icon: "💬" },
]

const BLEND_MODES = [
  "normal", "multiply", "screen", "overlay", "soft-light", "hard-light",
  "color-dodge", "color-burn", "difference", "exclusion", "hue",
  "saturation", "color", "luminosity"
]

export function EnhancedTimeline({ className = "" }) {
  const [tracks, setTracks] = useState([])
  const [selectedClip, setSelectedClip] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [showPreview, setShowPreview] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  // Load tracks on mount
  useEffect(() => {
    setTracks(multiTrackTimelineEngine.getTracks())
  }, [])

  // Update tracks when they change
  const refreshTracks = useCallback(() => {
    setTracks(multiTrackTimelineEngine.getTracks())
  }, [])

  // Create new track
  const createTrack = useCallback((type) => {
    const track = multiTrackTimelineEngine.createTrack(type)
    refreshTracks()
    return track
  }, [refreshTracks])

  // Add clip to track
  const addClipToTrack = useCallback((trackId, startTime) => {
    const clip = multiTrackTimelineEngine.addClipToTrack(trackId, {
      startTime,
      endTime: startTime + 5,
      duration: 5,
      name: `Clip ${Date.now()}`,
    })
    refreshTracks()
    return clip
  }, [refreshTracks])

  // Move clip
  const moveClip = useCallback((clipId, newTrackId, newStartTime) => {
    multiTrackTimelineEngine.moveClip(clipId, newTrackId, newStartTime)
    refreshTracks()
  }, [refreshTracks])

  // Update track properties
  const updateTrack = useCallback((trackId, updates) => {
    const track = multiTrackTimelineEngine.getTrack(trackId)
    if (track) {
      Object.assign(track, updates)
      refreshTracks()
    }
  }, [refreshTracks])

  // Playback controls
  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying)
    // Here you would integrate with audio processing engine
  }, [isPlaying])

  return (
    <div className={`enhanced-timeline flex flex-col h-full bg-gray-900 text-white ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Multi-Track Timeline</h2>
          <Badge variant="secondary" className="bg-blue-600">Professional</Badge>
          <Badge variant="secondary" className="bg-green-600">GPU Accelerated</Badge>
        </div>

        <div className="flex items-center gap-3">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={togglePlayback} className="border-gray-600">
              {isPlaying ? '⏸️' : '▶️'}
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600">
              ⏹️
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 bg-gray-600" />

          {/* Add Track Dropdown */}
          <Select onValueChange={createTrack}>
            <SelectTrigger className="w-44 bg-gray-700 border-gray-600">
              <Plus className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Add Track" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {TRACK_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preview Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="border-gray-600"
          >
            {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showPreview ? "Hide" : "Show"} Preview
          </Button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
              className="border-gray-600"
            >
              -
            </Button>
            <span className="text-sm min-w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(5, zoom + 0.1))}
              className="border-gray-600"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track List Sidebar */}
        <div className="w-72 border-r border-gray-700 bg-gray-800/30 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-medium text-sm text-gray-300">Tracks ({tracks.length})</h3>
          </div>

          <div className="p-4 space-y-3">
            {tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                onUpdate={updateTrack}
                onDelete={(trackId) => {
                  // Implementation would remove track from engine
                  refreshTracks()
                }}
                onAddClip={(startTime) => addClipToTrack(track.id, startTime)}
              />
            ))}

            {tracks.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">No tracks yet</p>
                <p className="text-xs mt-2">Add a track to get started</p>
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
          <div className="flex-1 overflow-y-auto bg-gray-900">
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
              left: `${72 + currentTime * zoom * 10}px`,
            }}
          />
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <>
            <Separator orientation="vertical" className="bg-gray-600" />
            <div className="w-80 border-l border-gray-700 bg-gray-800/30">
              <CompositingPreview
                tracks={tracks}
                currentTime={currentTime}
                onTimeUpdate={setCurrentTime}
                onPlayPause={togglePlayback}
                isPlaying={isPlaying}
              />
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
function TrackItem({ track, onUpdate, onDelete, onAddClip }) {
  const trackType = TRACK_TYPES.find(t => t.value === track.type) || TRACK_TYPES[0]

  return (
    <div className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{trackType.icon}</span>
          <span className="font-medium text-sm text-white">{track.name}</span>
          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
            {track.type}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdate(track.id, { muted: !track.muted })}
            className="h-7 w-7 p-0 hover:bg-gray-600"
          >
            {track.muted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdate(track.id, { locked: !track.locked })}
            className="h-7 w-7 p-0 hover:bg-gray-600"
          >
            {track.locked ? <Lock className="w-3 h-3 text-yellow-400" /> : <Unlock className="w-3 h-3" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(track.id)}
            className="h-7 w-7 p-0 hover:bg-red-600 text-red-400"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Track Controls */}
      <div className="space-y-3">
        {track.type === "video" && (
          <>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={track.opacity}
                onChange={(e) => onUpdate(track.id, { opacity: Number.parseFloat(e.target.value) })}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-400 mt-1">{Math.round(track.opacity * 100)}%</div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Blend Mode</label>
              <Select
                value={track.blendMode}
                onValueChange={(value) => onUpdate(track.id, { blendMode: value })}
              >
                <SelectTrigger className="h-8 text-xs bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {BLEND_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode} className="text-white hover:bg-gray-700">
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
            <label className="text-xs text-gray-400 mb-1 block">Volume</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={track.volume}
              onChange={(e) => onUpdate(track.id, { volume: Number.parseFloat(e.target.value) })}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-400 mt-1">{track.volume.toFixed(1)}x</div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs border-gray-600 hover:bg-gray-700"
          onClick={() => onAddClip(0)}
        >
          Add Clip
        </Button>
      </div>
    </div>
  )
}