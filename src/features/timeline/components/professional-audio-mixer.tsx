/**
 * Professional Audio Mixer Component
 *
 * Advanced multi-track audio mixing interface with real-time processing
 */

import { Mic, MicOff, Play, Square, Volume2, VolumeX } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { type AudioSession, type AudioTrack, audioProcessingEngine } from "../services/audio-processing-engine"

interface ProfessionalAudioMixerProps {
  sessionId?: string
  className?: string
}

export function ProfessionalAudioMixer({ sessionId, className }: ProfessionalAudioMixerProps) {
  const [session, setSession] = useState<AudioSession | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null)
  const [levels, setLevels] = useState<Map<string, { peak: number; rms: number }>>(new Map())

  // Load session
  useEffect(() => {
    const activeSession = sessionId
      ? audioProcessingEngine.getSession(sessionId)
      : audioProcessingEngine.getActiveSession()

    setSession(activeSession)
  }, [sessionId])

  // Update levels periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation, this would get levels from the audio engine
      const newLevels = new Map<string, { peak: number; rms: number }>()

      session?.tracks.forEach((track) => {
        newLevels.set(track.id, {
          peak: -Math.random() * 20 - 10, // Simulated levels
          rms: -Math.random() * 30 - 15,
        })
      })

      setLevels(newLevels)
    }, 100)

    return () => clearInterval(interval)
  }, [session])

  const updateTrack = useCallback(
    (trackId: string, updates: Partial<AudioTrack>) => {
      if (!sessionId) return

      audioProcessingEngine.updateTrack(sessionId, trackId, updates)
      setSession(audioProcessingEngine.getSession(sessionId))
    },
    [sessionId],
  )

  const createTrack = useCallback(() => {
    if (!sessionId) return

    const trackName = `Track ${session?.tracks.length || 0 + 1}`
    audioProcessingEngine.createTrack(sessionId, trackName)
    setSession(audioProcessingEngine.getSession(sessionId))
  }, [sessionId, session])

  const deleteTrack = useCallback(
    (trackId: string) => {
      if (!sessionId) return

      audioProcessingEngine.deleteTrack(sessionId, trackId)
      setSession(audioProcessingEngine.getSession(sessionId))
      if (selectedTrack?.id === trackId) {
        setSelectedTrack(null)
      }
    },
    [sessionId, selectedTrack],
  )

  const togglePlayback = useCallback(() => {
    if (!session) return

    if (session.playback) {
      audioProcessingEngine.stopPlayback()
    } else {
      audioProcessingEngine.startPlayback()
    }

    setSession(sessionId ? audioProcessingEngine.getSession(sessionId) : audioProcessingEngine.getActiveSession())
  }, [session, sessionId])

  const toggleRecording = useCallback(
    async (trackId: string) => {
      if (!session) return

      const track = session.tracks.find((t) => t.id === trackId)
      if (!track) return

      if (track.recordArmed) {
        audioProcessingEngine.stopRecording()
      } else {
        await audioProcessingEngine.startRecording(trackId)
      }

      setSession(sessionId ? audioProcessingEngine.getSession(sessionId) : audioProcessingEngine.getActiveSession())
    },
    [session, sessionId],
  )

  if (!session) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No audio session active</p>
          <Button onClick={() => audioProcessingEngine.createSession("New Session")} className="mt-4">
            Create Session
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`professional-audio-mixer flex flex-col h-full bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Professional Audio Mixer</h2>
          <Badge variant="secondary">{session.name}</Badge>
          <Badge variant="outline">{session.tracks.length} tracks</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={createTrack}>
            Add Track
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline" size="sm" onClick={togglePlayback}>
            {session.playback ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {session.recording && (
            <Badge variant="destructive" className="animate-pulse">
              REC
            </Badge>
          )}
        </div>
      </div>

      {/* Mixer Strips */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-2 p-4 min-w-max">
          {/* Individual Track Strips */}
          {session.tracks.map((track) => (
            <TrackStrip
              key={track.id}
              track={track}
              levels={levels.get(track.id)}
              onUpdate={(updates) => updateTrack(track.id, updates)}
              onDelete={() => deleteTrack(track.id)}
              onSelect={() => setSelectedTrack(track)}
              onToggleRecording={() => toggleRecording(track.id)}
              isSelected={selectedTrack?.id === track.id}
            />
          ))}

          {/* Master Bus */}
          <MasterStrip
            masterBus={session.masterBus}
            onUpdate={(updates) => {
              // Update master bus in session
              if (sessionId) {
                const updatedSession = { ...session, masterBus: { ...session.masterBus, ...updates } }
                // In a real implementation, this would update the audio engine
                setSession(updatedSession)
              }
            }}
          />
        </div>
      </div>

      {/* Selected Track Details */}
      {selectedTrack && (
        <div className="border-t border-border p-4">
          <TrackDetails track={selectedTrack} onUpdate={(updates) => updateTrack(selectedTrack.id, updates)} />
        </div>
      )}
    </div>
  )
}

// Track Strip Component
interface TrackStripProps {
  track: AudioTrack
  levels?: { peak: number; rms: number }
  onUpdate: (updates: Partial<AudioTrack>) => void
  onDelete: () => void
  onSelect: () => void
  onToggleRecording: () => void
  isSelected: boolean
}

function TrackStrip({ track, levels, onUpdate, onDelete, onSelect, onToggleRecording, isSelected }: TrackStripProps) {
  const volumeDb = 20 * Math.log10(Math.max(track.volume, 0.001))

  return (
    <Card
      className={`w-20 cursor-pointer transition-colors ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onSelect}
    >
      <CardHeader className="p-2 pb-1">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onToggleRecording}>
            {track.recordArmed ? <Mic className="w-3 h-3 text-red-500" /> : <MicOff className="w-3 h-3" />}
          </Button>

          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700" onClick={onDelete}>
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-2 pt-0 space-y-2">
        {/* Track Name */}
        <div className="text-xs font-medium text-center truncate" title={track.name}>
          {track.name}
        </div>

        {/* Level Meter */}
        <div className="h-20 bg-muted rounded flex flex-col justify-end relative">
          {levels && (
            <>
              <div
                className="bg-green-500 w-full transition-all duration-75"
                style={{ height: `${Math.max(0, Math.min(100, (levels.rms + 60) * 2))}%` }}
              />
              <div
                className={`w-full h-0.5 ${levels.peak > -6 ? "bg-yellow-500" : levels.peak > -12 ? "bg-green-500" : "bg-red-500"}`}
                style={{ bottom: `${Math.max(0, Math.min(100, (levels.peak + 60) * 2))}%` }}
              />
            </>
          )}
        </div>

        {/* Volume Fader */}
        <div className="space-y-1">
          <Slider
            value={[track.volume]}
            onValueChange={([value]) => onUpdate({ volume: value })}
            max={2}
            min={0}
            step={0.01}
            className="h-16"
            orientation="vertical"
          />
          <div className="text-xs text-center text-muted-foreground">{volumeDb.toFixed(1)}dB</div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onUpdate({ mute: !track.mute })}>
            {track.mute ? <VolumeX className="w-3 h-3 text-red-500" /> : <Volume2 className="w-3 h-3" />}
          </Button>

          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onUpdate({ solo: !track.solo })}>
            S
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Master Strip Component
interface MasterStripProps {
  masterBus: any
  onUpdate: (updates: any) => void
}

function MasterStrip({ masterBus, onUpdate }: MasterStripProps) {
  const volumeDb = 20 * Math.log10(Math.max(masterBus.volume, 0.001))

  return (
    <Card className="w-24 border-l-4 border-l-primary">
      <CardHeader className="p-2 pb-1">
        <CardTitle className="text-sm text-center">Master</CardTitle>
      </CardHeader>

      <CardContent className="p-2 pt-0 space-y-2">
        {/* Level Meter */}
        <div className="h-20 bg-muted rounded flex flex-col justify-end">
          <div className="bg-green-500 w-full h-3/4" />
          <div className="bg-green-500 w-full h-0.5" />
        </div>

        {/* Volume Fader */}
        <div className="space-y-1">
          <Slider
            value={[masterBus.volume]}
            onValueChange={([value]) => onUpdate({ volume: value })}
            max={2}
            min={0}
            step={0.01}
            className="h-16"
            orientation="vertical"
          />
          <div className="text-xs text-center text-muted-foreground">{volumeDb.toFixed(1)}dB</div>
        </div>

        {/* Mute Button */}
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onUpdate({ mute: !masterBus.mute })}>
            {masterBus.mute ? <VolumeX className="w-3 h-3 text-red-500" /> : <Volume2 className="w-3 h-3" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Track Details Component
interface TrackDetailsProps {
  track: AudioTrack
  onUpdate: (updates: Partial<AudioTrack>) => void
}

function TrackDetails({ track, onUpdate }: TrackDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="font-medium">{track.name}</h3>
        <Badge variant="outline">{track.type.toUpperCase()}</Badge>
        <Badge variant="outline">{track.channels}ch</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Basic Controls */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Volume</label>
          <Slider
            value={[track.volume]}
            onValueChange={([value]) => onUpdate({ volume: value })}
            max={2}
            min={0}
            step={0.01}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Pan</label>
          <Slider
            value={[track.pan]}
            onValueChange={([value]) => onUpdate({ pan: value })}
            max={1}
            min={-1}
            step={0.01}
          />
        </div>
      </div>

      {/* Effects */}
      <div>
        <label className="text-sm font-medium">Effects ({track.effects.length})</label>
        <div className="mt-2 space-y-2">
          {track.effects.map((effect) => (
            <div key={effect.id} className="flex items-center justify-between p-2 border border-border rounded">
              <div>
                <div className="font-medium text-sm">{effect.name}</div>
                <div className="text-xs text-muted-foreground">{effect.type}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Toggle effect enabled/disabled
                  const updatedEffects = track.effects.map((e) =>
                    e.id === effect.id ? { ...e, enabled: !e.enabled } : e,
                  )
                  onUpdate({ effects: updatedEffects })
                }}
              >
                {effect.enabled ? "On" : "Off"}
              </Button>
            </div>
          ))}

          {track.effects.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No effects added yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
