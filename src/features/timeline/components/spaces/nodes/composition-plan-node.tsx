/**
 * Composition Plan Node - CineGen Spaces
 *
 * Music scoring workflow and audio composition planning
 * Coordinates music generation with visual timing
 */

import { Handle, NodeProps, Position } from "@xyflow/react"
import { Clock, Music, Plus, Trash2, Volume2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

interface CompositionPlanNodeData {
  label: string
  title: string
  genre: string
  mood: string
  tempo: number
  key: string
  duration: number
  cues: Array<{
    id: string
    name: string
    startTime: number
    endTime: number
    intensity: number
    notes: string
  }>
}

const MUSIC_GENRES = [
  "Cinematic",
  "Electronic",
  "Orchestral",
  "Ambient",
  "Rock",
  "Jazz",
  "Classical",
  "World",
  "Experimental",
]

const MUSIC_MOODS = [
  "Epic",
  "Tense",
  "Romantic",
  "Mysterious",
  "Uplifting",
  "Dark",
  "Joyful",
  "Melancholic",
  "Action",
  "Peaceful",
]

const MUSICAL_KEYS = [
  "C Major",
  "C Minor",
  "D Major",
  "D Minor",
  "E Major",
  "E Minor",
  "F Major",
  "F Minor",
  "G Major",
  "G Minor",
  "A Major",
  "A Minor",
  "B Major",
  "B Minor",
]

export function CompositionPlanNode({ data, selected }: NodeProps<CompositionPlanNodeData>) {
  const [title, setTitle] = useState(data.title || "")
  const [genre, setGenre] = useState(data.genre || "Cinematic")
  const [mood, setMood] = useState(data.mood || "Epic")
  const [tempo, setTempo] = useState(data.tempo || 120)
  const [key, setKey] = useState(data.key || "C Major")
  const [duration, setDuration] = useState(data.duration || 60)
  const [cues, setCues] = useState(data.cues || [])

  const addCue = () => {
    const newCue = {
      id: Date.now().toString(),
      name: `Cue ${cues.length + 1}`,
      startTime: 0,
      endTime: 10,
      intensity: 50,
      notes: "",
    }
    setCues([...cues, newCue])
  }

  const updateCue = (id: string, field: string, value: any) => {
    setCues(cues.map((cue) => (cue.id === id ? { ...cue, [field]: value } : cue)))
  }

  const removeCue = (id: string) => {
    setCues(cues.filter((cue) => cue.id !== id))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className={`w-80 ${selected ? "ring-2 ring-purple-500" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Music className="w-4 h-4 text-purple-500" />
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Composition Title */}
        <div className="space-y-2">
          <Label htmlFor="comp-title" className="text-xs">
            Composition Title
          </Label>
          <Input
            id="comp-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter composition title..."
            className="text-sm"
          />
        </div>

        {/* Genre and Mood */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MUSIC_GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MUSIC_MOODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tempo and Key */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">Tempo: {tempo} BPM</Label>
            <Slider
              value={[tempo]}
              onValueChange={(value) => setTempo(value[0])}
              min={60}
              max={200}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Key</Label>
            <Select value={key} onValueChange={setKey}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MUSICAL_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Duration: {formatTime(duration)}
          </Label>
          <Slider
            value={[duration]}
            onValueChange={(value) => setDuration(value[0])}
            min={10}
            max={300}
            step={5}
            className="w-full"
          />
        </div>

        {/* Musical Cues */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Musical Cues ({cues.length})</Label>
            <Button onClick={addCue} size="sm" variant="outline" className="h-6 px-2">
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2">
            {cues.map((cue) => (
              <div key={cue.id} className="border rounded p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={cue.name}
                    onChange={(e) => updateCue(cue.id, "name", e.target.value)}
                    className="text-xs h-6 flex-1 mr-2"
                    placeholder="Cue name"
                  />
                  <Button
                    onClick={() => removeCue(cue.id)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Start: {formatTime(cue.startTime)}</Label>
                    <Slider
                      value={[cue.startTime]}
                      onValueChange={(value) => updateCue(cue.id, "startTime", value[0])}
                      min={0}
                      max={duration}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End: {formatTime(cue.endTime)}</Label>
                    <Slider
                      value={[cue.endTime]}
                      onValueChange={(value) => updateCue(cue.id, "endTime", value[0])}
                      min={cue.startTime}
                      max={duration}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    Intensity: {cue.intensity}%
                  </Label>
                  <Slider
                    value={[cue.intensity]}
                    onValueChange={(value) => updateCue(cue.id, "intensity", value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Textarea
                  value={cue.notes}
                  onChange={(e) => updateCue(cue.id, "notes", e.target.value)}
                  placeholder="Musical notes..."
                  className="text-xs min-h-12"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 border-t">
          <Button className="w-full" size="sm">
            <Music className="w-4 h-4 mr-2" />
            Generate Composition
          </Button>
        </div>
      </CardContent>

      {/* React Flow Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500" />
    </Card>
  )
}
