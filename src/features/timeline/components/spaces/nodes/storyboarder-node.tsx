/**
 * Storyboarder Node - CineGen Spaces
 *
 * Breaks scenes into individual shots with timing and transitions
 * Core component for visual storytelling workflow
 */

import { Handle, NodeProps, Position } from "@xyflow/react"
import { Clock, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface StoryboarderNodeData {
  label: string
  sceneTitle: string
  sceneDescription: string
  shots: Array<{
    id: string
    title: string
    description: string
    duration: number
    transition: string
  }>
}

export function StoryboarderNode({ data, selected }: NodeProps<StoryboarderNodeData>) {
  const [sceneTitle, setSceneTitle] = useState(data.sceneTitle || "")
  const [sceneDescription, setSceneDescription] = useState(data.sceneDescription || "")
  const [shots, setShots] = useState(data.shots || [])

  const addShot = () => {
    const newShot = {
      id: Date.now().toString(),
      title: `Shot ${shots.length + 1}`,
      description: "",
      duration: 5,
      transition: "cut",
    }
    setShots([...shots, newShot])
  }

  const updateShot = (id: string, field: string, value: any) => {
    setShots(shots.map((shot) => (shot.id === id ? { ...shot, [field]: value } : shot)))
  }

  const removeShot = (id: string) => {
    setShots(shots.filter((shot) => shot.id !== id))
  }

  const totalDuration = shots.reduce((sum, shot) => sum + shot.duration, 0)

  return (
    <Card className={`w-80 ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scene Info */}
        <div className="space-y-2">
          <Label htmlFor="scene-title" className="text-xs">
            Scene Title
          </Label>
          <Input
            id="scene-title"
            value={sceneTitle}
            onChange={(e) => setSceneTitle(e.target.value)}
            placeholder="Enter scene title..."
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scene-description" className="text-xs">
            Scene Description
          </Label>
          <Textarea
            id="scene-description"
            value={sceneDescription}
            onChange={(e) => setSceneDescription(e.target.value)}
            placeholder="Describe the scene..."
            className="text-sm min-h-20"
          />
        </div>

        {/* Shots List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Shots ({shots.length})</Label>
            <Button onClick={addShot} size="sm" variant="outline" className="h-6 px-2">
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2">
            {shots.map((shot) => (
              <div key={shot.id} className="border rounded p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={shot.title}
                    onChange={(e) => updateShot(shot.id, "title", e.target.value)}
                    className="text-xs h-6"
                    placeholder="Shot title"
                  />
                  <Button
                    onClick={() => removeShot(shot.id)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <Textarea
                  value={shot.description}
                  onChange={(e) => updateShot(shot.id, "description", e.target.value)}
                  placeholder="Shot description..."
                  className="text-xs min-h-16"
                />

                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <Input
                    type="number"
                    value={shot.duration}
                    onChange={(e) => updateShot(shot.id, "duration", Number.parseFloat(e.target.value) || 0)}
                    className="text-xs h-6 w-16"
                    min="0.1"
                    step="0.1"
                  />
                  <span className="text-xs text-muted-foreground">sec</span>

                  <select
                    value={shot.transition}
                    onChange={(e) => updateShot(shot.id, "transition", e.target.value)}
                    className="text-xs border rounded px-1 py-0.5 h-6"
                  >
                    <option value="cut">Cut</option>
                    <option value="fade">Fade</option>
                    <option value="dissolve">Dissolve</option>
                    <option value="wipe">Wipe</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Duration */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Total Duration: {totalDuration.toFixed(1)}s
        </div>
      </CardContent>

      {/* React Flow Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </Card>
  )
}
