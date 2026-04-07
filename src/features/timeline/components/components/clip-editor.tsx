/**
 * Clip Editor Component
 *
 * Modal editor for individual clips with properties and effects
 */

import { X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type EnhancedClip } from "../../services/multi-track-timeline-engine"

interface ClipEditorProps {
  clip: EnhancedClip
  onClose: () => void
  onUpdate: (updates: Partial<EnhancedClip>) => void
}

const TRANSITIONS = [
  { value: "fade", label: "Fade" },
  { value: "wipe", label: "Wipe" },
  { value: "slide", label: "Slide" },
  { value: "scale", label: "Scale" },
  { value: "rotate", label: "Rotate" },
]

const EFFECTS = [
  { value: "blur", label: "Blur" },
  { value: "brightness", label: "Brightness" },
  { value: "contrast", label: "Contrast" },
  { value: "saturation", label: "Saturation" },
  { value: "hue", label: "Hue" },
]

export function ClipEditor({ clip, onClose, onUpdate }: ClipEditorProps) {
  const [name, setName] = useState(clip.name)
  const [startTime, setStartTime] = useState(clip.startTime.toString())
  const [duration, setDuration] = useState(clip.duration.toString())
  const [inTransition, setInTransition] = useState(clip.transitions.in || "")
  const [outTransition, setOutTransition] = useState(clip.transitions.out || "")
  const [effects, setEffects] = useState(clip.effects || [])

  const handleSave = () => {
    onUpdate({
      name,
      startTime: Number.parseFloat(startTime),
      duration: Number.parseFloat(duration),
      transitions: {
        in: inTransition,
        out: outTransition,
      },
      effects,
    })
    onClose()
  }

  const addEffect = (effectType: string) => {
    const newEffect = {
      id: `effect_${Date.now()}`,
      type: effectType,
      params: { value: 0.5 }, // Default value
    }
    setEffects([...effects, newEffect])
  }

  const updateEffect = (effectId: string, value: number) => {
    setEffects(
      effects.map((effect) => (effect.id === effectId ? { ...effect, params: { ...effect.params, value } } : effect)),
    )
  }

  const removeEffect = (effectId: string) => {
    setEffects(effects.filter((effect) => effect.id !== effectId))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Clip: {clip.name}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="transitions">Transitions</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Clip Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter clip name" />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time (seconds)</Label>
                <Input
                  id="startTime"
                  type="number"
                  step="0.1"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            {clip.thumbnail && (
              <div>
                <Label>Thumbnail</Label>
                <div className="mt-2 border border-border rounded-lg overflow-hidden">
                  <img src={clip.thumbnail} alt={clip.name} className="w-full h-32 object-cover" />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transitions" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>In Transition</Label>
                <Select value={inTransition} onValueChange={setInTransition}>
                  <SelectTrigger>
                    <SelectValue placeholder="No transition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {TRANSITIONS.map((transition) => (
                      <SelectItem key={transition.value} value={transition.value}>
                        {transition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Out Transition</Label>
                <Select value={outTransition} onValueChange={setOutTransition}>
                  <SelectTrigger>
                    <SelectValue placeholder="No transition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {TRANSITIONS.map((transition) => (
                      <SelectItem key={transition.value} value={transition.value}>
                        {transition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div>
              <Label>Add Effect</Label>
              <Select onValueChange={addEffect}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select an effect" />
                </SelectTrigger>
                <SelectContent>
                  {EFFECTS.map((effect) => (
                    <SelectItem key={effect.value} value={effect.value}>
                      {effect.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {effects.map((effect) => (
                <div key={effect.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="capitalize">{effect.type}</Label>
                    <Button variant="outline" size="sm" onClick={() => removeEffect(effect.id)}>
                      Remove
                    </Button>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={effect.params.value}
                    onChange={(e) => updateEffect(effect.id, Number.parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Value: {(effect.params.value * 100).toFixed(0)}%
                  </div>
                </div>
              ))}

              {effects.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p>No effects added yet</p>
                  <p className="text-sm">Add effects above to enhance your clip</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
