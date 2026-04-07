/**
 * Track Lane Component for Higgsfield
 *
 * Visual representation of a single track with clips
 */

import React, { useCallback, useRef } from 'react'

export function TrackLane({ track, zoom, currentTime, onClipSelect, onClipMove }) {
  const laneRef = useRef(null)

  // Convert time to pixels
  const timeToPixels = useCallback(
    (time) => {
      return time * zoom * 10 // 10 pixels per second at zoom 1
    },
    [zoom],
  )

  // Convert pixels to time
  const pixelsToTime = useCallback(
    (pixels) => {
      return pixels / (zoom * 10)
    },
    [zoom],
  )

  // Handle clip drag
  const handleClipDrag = useCallback(
    (clip, deltaX) => {
      const newStartTime = Math.max(0, clip.startTime + pixelsToTime(deltaX))
      onClipMove(clip.id, track.id, newStartTime)
    },
    [track.id, pixelsToTime, onClipMove],
  )

  const trackType = getTrackTypeInfo(track.type)

  return (
    <div
      ref={laneRef}
      className="relative border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
      style={{ height: track.height || 60 }}
    >
      {/* Track background with type-specific styling */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundColor: trackType.color }}
      />

      {/* Track info */}
      <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-600 bg-gray-800/50 flex items-center justify-center">
        <span className="text-xs font-medium text-gray-300 transform -rotate-90 whitespace-nowrap">
          {track.name}
        </span>
      </div>

      {/* Clips */}
      <div className="absolute left-16 right-0 top-0 bottom-0">
        {track.clips && track.clips.map((clip) => (
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
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none opacity-75"
        style={{
          left: `${16 + timeToPixels(currentTime)}px`,
        }}
      />
    </div>
  )
}

// Clip Item Component
function ClipItem({ clip, timeToPixels, onSelect, onDrag }) {
  const clipRef = useRef(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const dragStartX = useRef(0)

  const left = timeToPixels(clip.startTime)
  const width = timeToPixels(clip.duration)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    e.preventDefault()
  }

  const handleMouseMove = React.useCallback((e) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStartX.current
    onDrag(deltaX)
  }, [isDragging, onDrag])

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const clipType = getClipTypeInfo(clip.type)

  return (
    <div
      ref={clipRef}
      className={`absolute top-1 bottom-1 rounded cursor-move border shadow-sm hover:shadow-md transition-shadow ${clipType.borderColor} ${clipType.bgColor}`}
      style={{
        left: `${left}px`,
        width: `${Math.max(60, width)}px`, // Minimum width for usability
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Clip content */}
      <div className="h-full flex items-center px-2 overflow-hidden">
        <span className="text-xs text-white font-medium truncate flex items-center gap-1">
          <span>{clipType.icon}</span>
          {clip.name}
        </span>
      </div>

      {/* Clip thumbnail or preview */}
      {clip.thumbnail && (
        <img
          src={clip.thumbnail}
          alt={clip.name}
          className="absolute inset-0 w-full h-full object-cover rounded opacity-30"
        />
      )}

      {/* Duration indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b ${clipType.durationBar}`} />

      {/* Transitions */}
      {clip.transitions?.in && (
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500 rounded-l opacity-75" />
      )}
      {clip.transitions?.out && (
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-500 rounded-r opacity-75" />
      )}
    </div>
  )
}

// Helper functions
function getTrackTypeInfo(type) {
  const types = {
    video: { color: '#3b82f6', icon: '🎬' },
    audio: { color: '#10b981', icon: '🎵' },
    text: { color: '#f59e0b', icon: '📝' },
    effect: { color: '#8b5cf6', icon: '⚡' },
    adjustment: { color: '#ef4444', icon: '🎨' },
    subtitle: { color: '#6b7280', icon: '💬' },
  }
  return types[type] || types.video
}

function getClipTypeInfo(type) {
  const types = {
    video: {
      icon: '🎬',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      durationBar: 'bg-blue-300'
    },
    audio: {
      icon: '🎵',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-600 hover:bg-green-700',
      durationBar: 'bg-green-300'
    },
    text: {
      icon: '📝',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-600 hover:bg-yellow-700',
      durationBar: 'bg-yellow-300'
    },
    broll: {
      icon: '🎞️',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-600 hover:bg-purple-700',
      durationBar: 'bg-purple-300'
    },
  }
  return types[type] || types.video
}