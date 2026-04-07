/**
 * Track Lane Component
 *
 * Visual representation of a single track with clips
 */

import React, { useCallback, useRef } from "react"
import { type EnhancedClip, type EnhancedTrack } from "../services/multi-track-timeline-engine"

interface TrackLaneProps {
  track: EnhancedTrack
  zoom: number
  currentTime: number
  onClipSelect: (clip: EnhancedClip) => void
  onClipMove: (clipId: string, newTrackId: string, newStartTime: number) => void
}

export function TrackLane({ track, zoom, currentTime, onClipSelect, onClipMove }: TrackLaneProps) {
  const laneRef = useRef<HTMLDivElement>(null)

  // Convert time to pixels
  const timeToPixels = useCallback(
    (time: number) => {
      return time * zoom * 10 // 10 pixels per second at zoom 1
    },
    [zoom],
  )

  // Convert pixels to time
  const pixelsToTime = useCallback(
    (pixels: number) => {
      return pixels / (zoom * 10)
    },
    [zoom],
  )

  // Handle clip drag
  const handleClipDrag = useCallback(
    (clip: EnhancedClip, deltaX: number) => {
      const newStartTime = Math.max(0, clip.startTime + pixelsToTime(deltaX))
      onClipMove(clip.id, track.id, newStartTime)
    },
    [track.id, pixelsToTime, onClipMove],
  )

  return (
    <div
      ref={laneRef}
      className="relative border-b border-border bg-background hover:bg-muted/20"
      style={{ height: track.height }}
    >
      {/* Track background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: track.color }} />

      {/* Track info */}
      <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-border bg-muted/30 flex items-center justify-center">
        <span className="text-xs font-medium text-muted-foreground transform -rotate-90 whitespace-nowrap">
          {track.name}
        </span>
      </div>

      {/* Clips */}
      <div className="absolute left-16 right-0 top-0 bottom-0">
        {track.clips.map((clip) => (
          <ClipItem
            key={clip.id}
            clip={clip}
            timeToPixels={timeToPixels}
            onSelect={() => onClipSelect(clip)}
            onDrag={(deltaX) => handleClipDrag(clip, deltaX)}
          />
        ))}
      </div>

      {/* Current time indicator */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
        style={{
          left: `${16 + timeToPixels(currentTime)}px`,
        }}
      />
    </div>
  )
}

// Clip Item Component
interface ClipItemProps {
  clip: EnhancedClip
  timeToPixels: (time: number) => number
  onSelect: () => void
  onDrag: (deltaX: number) => void
}

function ClipItem({ clip, timeToPixels, onSelect, onDrag }: ClipItemProps) {
  const clipRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)

  const left = timeToPixels(clip.startTime)
  const width = timeToPixels(clip.duration)

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    dragStartX.current = e.clientX
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return

    const deltaX = e.clientX - dragStartX.current
    onDrag(deltaX)
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging.current) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging.current])

  return (
    <div
      ref={clipRef}
      className="absolute top-1 bottom-1 bg-blue-500 hover:bg-blue-600 rounded cursor-move border border-blue-400 shadow-sm"
      style={{
        left: `${left}px`,
        width: `${Math.max(40, width)}px`, // Minimum width for usability
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Clip content */}
      <div className="h-full flex items-center px-2 overflow-hidden">
        <span className="text-xs text-white font-medium truncate">{clip.name}</span>
      </div>

      {/* Clip thumbnail or preview */}
      {clip.thumbnail && (
        <img
          src={clip.thumbnail}
          alt={clip.name}
          className="absolute inset-0 w-full h-full object-cover rounded opacity-50"
        />
      )}

      {/* Duration indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-300 rounded-b opacity-50" />

      {/* Transitions */}
      {clip.transitions.in && <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500 rounded-l opacity-75" />}
      {clip.transitions.out && <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-500 rounded-r opacity-75" />}
    </div>
  )
}
