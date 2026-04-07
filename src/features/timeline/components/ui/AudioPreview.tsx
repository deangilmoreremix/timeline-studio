"use client"

import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { AudioPreviewProps, UseAudioPreviewReturn } from "../types/ui-components"

function useAudioPreview(props: AudioPreviewProps): UseAudioPreviewReturn {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [waveformData, setWaveformData] = React.useState<number[]>([])
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const loadAudio = React.useCallback(async (url: string) => {
    if (!url) return

    setIsLoading(true)
    setError(null)

    try {
      // For demo purposes, generate mock waveform data
      // In a real implementation, this would analyze the actual audio file
      const mockWaveform = Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2)
      setWaveformData(mockWaveform)

      // Load audio for playback
      if (audioRef.current) {
        audioRef.current.src = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audio")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const seekToTime = React.useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time
        props.onTimeChange?.(time)
      }
    },
    [props],
  )

  // Load audio when URL changes
  React.useEffect(() => {
    if (props.audioUrl) {
      loadAudio(props.audioUrl)
    }
  }, [props.audioUrl, loadAudio])

  // Draw waveform on canvas
  React.useEffect(() => {
    if (!canvasRef.current || !waveformData.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barWidth = width / waveformData.length

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "rgb(59, 130, 246)" // blue-500

    waveformData.forEach((amplitude, index) => {
      const barHeight = amplitude * height
      const x = index * barWidth
      const y = (height - barHeight) / 2

      ctx.fillRect(x, y, barWidth - 1, barHeight)
    })
  }, [waveformData])

  return {
    isLoading,
    error,
    waveformData,
    loadAudio,
    seekToTime,
  }
}

const AudioPreview = React.forwardRef<HTMLDivElement, AudioPreviewProps>(
  (
    {
      className,
      audioUrl,
      waveformData: externalWaveformData,
      duration,
      currentTime,
      onTimeChange,
      showWaveform = true,
      showTimeLabels = true,
      height = 80,
      timelineContext,
      ...props
    },
    ref,
  ) => {
    const { isLoading, error, waveformData, seekToTime } = useAudioPreview({
      audioUrl,
      waveformData: externalWaveformData,
      duration,
      currentTime,
      onTimeChange,
    })

    const [isPlaying, setIsPlaying] = React.useState(false)
    const [volume, setVolume] = React.useState(1)
    const [isMuted, setIsMuted] = React.useState(false)
    const audioRef = React.useRef<HTMLAudioElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handlePlayPause = () => {
      if (!audioRef.current) return

      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }

    const handleTimeChange = (values: number[]) => {
      const newTime = values[0]
      seekToTime(newTime)
    }

    const handleVolumeChange = (values: number[]) => {
      const newVolume = values[0]
      setVolume(newVolume)
      if (audioRef.current) {
        audioRef.current.volume = newVolume
      }
    }

    const handleMuteToggle = () => {
      setIsMuted(!isMuted)
      if (audioRef.current) {
        audioRef.current.muted = !isMuted
      }
    }

    const displayWaveformData = externalWaveformData || waveformData

    return (
      <div
        ref={ref}
        className={cn("space-y-3 p-4 border rounded-lg bg-card", className)}
        data-timeline-track-id={timelineContext?.trackId}
        data-timeline-clip-id={timelineContext?.clipId}
        {...props}
      >
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onTimeUpdate={(e) => onTimeChange?.(e.currentTarget.currentTime)}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />

        {/* Waveform visualization */}
        {showWaveform && displayWaveformData.length > 0 && (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={height}
              className="w-full border rounded bg-muted"
              style={{ height: `${height}px` }}
            />
            {currentTime !== undefined && duration && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            )}
          </div>
        )}

        {/* Time display */}
        {showTimeLabels && duration && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            disabled={!audioUrl || isLoading}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>

          {/* Time scrubber */}
          {duration && (
            <div className="flex-1 mx-4">
              <Slider
                value={[currentTime || 0]}
                max={duration}
                step={0.1}
                onValueChange={handleTimeChange}
                className="w-full"
              />
            </div>
          )}

          {/* Volume controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleMuteToggle} className="p-1">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
              disabled={isMuted}
            />
          </div>
        </div>

        {/* Error display */}
        {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</div>}

        {/* Loading state */}
        {isLoading && <div className="text-sm text-muted-foreground">Loading audio...</div>}
      </div>
    )
  },
)

AudioPreview.displayName = "AudioPreview"

export type { AudioPreviewProps }
export { AudioPreview, useAudioPreview }
