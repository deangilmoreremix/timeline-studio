"use client"

import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Square, Volume2, VolumeX } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { AudioControlsProps } from "../types/ui-components"

const AudioControls = React.forwardRef<HTMLDivElement, AudioControlsProps>(
  (
    {
      className,
      isPlaying = false,
      isPaused = false,
      isMuted = false,
      volume = 1,
      playbackRate = 1,
      loop = false,
      onPlay,
      onPause,
      onStop,
      onVolumeChange,
      onPlaybackRateChange,
      onLoopToggle,
      onMuteToggle,
      showVolume = true,
      showPlaybackRate = false,
      showLoop = true,
      timelineContext,
      ...props
    },
    ref,
  ) => {
    const [internalVolume, setInternalVolume] = React.useState(volume)
    const [internalPlaybackRate, setInternalPlaybackRate] = React.useState(playbackRate)
    const [internalLoop, setInternalLoop] = React.useState(loop)

    const currentVolume = volume !== undefined ? volume : internalVolume
    const currentPlaybackRate = playbackRate !== undefined ? playbackRate : internalPlaybackRate
    const currentLoop = loop !== undefined ? loop : internalLoop

    const handleVolumeChange = (values: number[]) => {
      const newVolume = values[0]
      setInternalVolume(newVolume)
      onVolumeChange?.(newVolume)
    }

    const handlePlaybackRateChange = (values: number[]) => {
      const newRate = values[0]
      setInternalPlaybackRate(newRate)
      onPlaybackRateChange?.(newRate)
    }

    const handleLoopToggle = () => {
      const newLoop = !currentLoop
      setInternalLoop(newLoop)
      onLoopToggle?.(newLoop)
    }

    const playbackRateOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 p-2 border rounded-lg bg-card", className)}
        data-timeline-track-id={timelineContext?.trackId}
        data-timeline-global-controls={timelineContext?.globalControls}
        {...props}
      >
        {/* Transport Controls */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onStop} className="p-1" title="Stop">
            <Square className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={onPause} disabled={!isPlaying} className="p-1" title="Pause">
            <Pause className="w-4 h-4" />
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={isPlaying ? onPause : onPlay}
            className="p-1"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>

        {/* Loop Control */}
        {showLoop && (
          <Button
            variant={currentLoop ? "default" : "ghost"}
            size="sm"
            onClick={handleLoopToggle}
            className="p-1"
            title="Loop"
          >
            <Repeat className={cn("w-4 h-4", currentLoop && "text-primary-foreground")} />
          </Button>
        )}

        {/* Volume Control */}
        {showVolume && (
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMuteToggle?.(!isMuted)}
              className="p-1"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : currentVolume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
              disabled={isMuted}
            />
            <span className="text-xs text-muted-foreground min-w-8">
              {Math.round((isMuted ? 0 : currentVolume) * 100)}%
            </span>
          </div>
        )}

        {/* Playback Rate Control */}
        {showPlaybackRate && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-xs text-muted-foreground">Speed:</span>
            <select
              value={currentPlaybackRate}
              onChange={(e) => handlePlaybackRateChange([Number.parseFloat(e.target.value)])}
              className="text-xs bg-transparent border-none outline-none"
            >
              {playbackRateOptions.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}x
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timeline Context Info */}
        {timelineContext?.trackId && (
          <div className="ml-auto text-xs text-muted-foreground">Track: {timelineContext.trackId}</div>
        )}
      </div>
    )
  },
)

AudioControls.displayName = "AudioControls"

export type { AudioControlsProps }
export { AudioControls }
