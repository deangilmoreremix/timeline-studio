/**
 * Timeline Ruler Component for Higgsfield
 *
 * Time-based ruler showing seconds, frames, and time markers
 */

import React, { useCallback, useRef } from 'react'

export function TimelineRuler({ duration, currentTime, zoom, onTimeChange }) {
  const rulerRef = useRef(null)

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

  // Handle ruler click
  const handleRulerClick = useCallback(
    (e) => {
      if (!rulerRef.current) return

      const rect = rulerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const time = pixelsToTime(x)

      onTimeChange(Math.max(0, Math.min(duration, time)))
    },
    [pixelsToTime, onTimeChange, duration],
  )

  // Generate time markers
  const generateMarkers = useCallback(() => {
    const markers = []
    const interval = zoom > 2 ? 0.5 : zoom > 1 ? 1 : zoom > 0.5 ? 2 : 5 // seconds

    for (let time = 0; time <= duration; time += interval) {
      const position = timeToPixels(time)
      const isMajor = time % (interval * 5) === 0

      markers.push({
        time,
        position,
        isMajor,
        label: isMajor ? formatTime(time) : "",
      })
    }

    return markers
  }, [duration, timeToPixels, zoom])

  const markers = generateMarkers()

  return (
    <div className="timeline-ruler">
      <div
        ref={rulerRef}
        className="h-8 bg-gray-800 border-b border-gray-700 cursor-pointer relative flex items-center"
        onClick={handleRulerClick}
      >
        {/* Time markers */}
        {markers.map((marker, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center text-xs text-gray-400"
            style={{ left: `${marker.position}px` }}
          >
            {/* Marker line */}
            <div className={`border-l ${marker.isMajor ? "border-gray-400 h-6" : "border-gray-600 h-3"}`} />

            {/* Time label */}
            {marker.label && (
              <span className="mt-1 text-xs text-gray-300 whitespace-nowrap">
                {marker.label}
              </span>
            )}
          </div>
        ))}

        {/* Current time indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none shadow-sm"
          style={{ left: `${timeToPixels(currentTime)}px` }}
        >
          {/* Time tooltip */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-gray-600">
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Playhead triangle */}
        <div
          className="absolute top-0 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-red-500"
          style={{
            left: `${timeToPixels(currentTime) - 4}px`,
          }}
        />
      </div>
    </div>
  )
}

// Format time as MM:SS or HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}