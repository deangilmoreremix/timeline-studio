/**
 * Compositing Preview Component for Higgsfield
 *
 * Real-time preview of multi-track compositing with blend modes
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"

export function CompositingPreview({ tracks, currentTime, onTimeUpdate, onPlayPause, isPlaying }) {
  const canvasRef = useRef(null)
  const [previewResult, setPreviewResult] = useState(null)
  const animationFrameRef = useRef(null)

  const CANVAS_WIDTH = 320
  const CANVAS_HEIGHT = 180

  // Composite and render current frame
  const renderFrame = useCallback(async () => {
    if (!canvasRef.current) return

    try {
      // Simulate compositing result
      const result = {
        frame: null, // Would be actual composited frame
        metadata: {
          trackCount: tracks.length,
          effectCount: tracks.reduce((sum, track) => sum + (track.effects?.length || 0), 0),
          renderTime: Math.random() * 50 + 10, // Simulated render time
        }
      }

      setPreviewResult(result)

      // Create a simple gradient background for demo
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        gradient.addColorStop(0, '#1f2937')
        gradient.addColorStop(1, '#374151')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        // Add some demo clips visualization
        tracks.forEach((track, index) => {
          if (track.clips && track.clips.length > 0) {
            ctx.fillStyle = getTrackColor(track.type)
            ctx.globalAlpha = 0.7
            ctx.fillRect(10 + index * 20, 10 + index * 15, 60, 30)
            ctx.globalAlpha = 1

            ctx.fillStyle = 'white'
            ctx.font = '10px Arial'
            ctx.fillText(track.clips.length + ' clips', 15 + index * 20, 25 + index * 15)
          }
        })
      }
    } catch (error) {
      console.error("Preview render failed:", error)
    }
  }, [tracks])

  // Update preview when time changes
  useEffect(() => {
    renderFrame()
  }, [renderFrame, currentTime])

  const handlePlayPause = () => {
    onPlayPause()
  }

  const handleSkipBack = () => {
    onTimeUpdate(Math.max(0, currentTime - 5))
  }

  const handleSkipForward = () => {
    // Assume 60 seconds total for demo
    onTimeUpdate(Math.min(60, currentTime + 5))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTrackColor = (type) => {
    const colors = {
      video: '#3b82f6',
      audio: '#10b981',
      text: '#f59e0b',
      effect: '#8b5cf6',
      adjustment: '#ef4444',
      subtitle: '#6b7280',
    }
    return colors[type] || '#6b7280'
  }

  return (
    <div className="compositing-preview h-full flex flex-col bg-gray-800 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-medium text-sm text-gray-300">Compositing Preview</h3>
        <p className="text-xs text-gray-500">Real-time multi-track compositing</p>
      </div>

      {/* Preview Canvas */}
      <div className="p-4">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-lg border border-gray-600">
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

          {/* Playing indicator */}
          {isPlaying && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded animate-pulse">
              REC
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            onClick={handleSkipBack}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            onClick={handleSkipForward}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Time scrubber */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="60" // Assume 60 seconds for demo
            step="0.1"
            value={currentTime}
            onChange={(e) => onTimeUpdate(Number.parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0:00</span>
            <span>{formatTime(currentTime)}</span>
            <span>1:00</span>
          </div>
        </div>
      </div>

      {/* Compositing Info */}
      {previewResult && (
        <div className="px-4 pb-4 border-t border-gray-700">
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Render Stats</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Tracks:</span>
                <span className="text-white">{previewResult.metadata.trackCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Effects:</span>
                <span className="text-white">{previewResult.metadata.effectCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Render Time:</span>
                <span className="text-green-400">{previewResult.metadata.renderTime.toFixed(1)}ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track Summary */}
      <div className="px-4 pb-4 flex-1 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Active Tracks</h4>
        <div className="space-y-2">
          {tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getTrackColor(track.type) }}
              />
              <span className="flex-1 truncate text-gray-300">{track.name}</span>
              <span className="text-gray-500">
                {track.clips?.length || 0} clips
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}