/**
 * Shot Board Node - CineGen Spaces
 *
 * Camera angle planning and shot composition
 * Visual planning of camera movements and framing
 */

import { Handle, NodeProps, Position } from "@xyflow/react"
import { Camera, Eye, Move, RotateCw, ZoomIn } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ShotBoardNodeData {
  label: string
  shotTitle: string
  cameraAngle: string
  cameraMovement: string
  framing: string
  notes: string
  referenceImage?: string
}

const CAMERA_ANGLES = [
  "Eye Level",
  "High Angle",
  "Low Angle",
  "Bird's Eye",
  "Worm's Eye",
  "Dutch Angle",
  "Over Shoulder",
  "Point of View",
]

const CAMERA_MOVEMENTS = [
  "Static",
  "Pan Left",
  "Pan Right",
  "Tilt Up",
  "Tilt Down",
  "Tracking",
  "Dolly In",
  "Dolly Out",
  "Crane Up",
  "Crane Down",
  "Zoom In",
  "Zoom Out",
]

const FRAMING_TYPES = [
  "Close-up",
  "Medium Close-up",
  "Medium Shot",
  "Medium Long Shot",
  "Long Shot",
  "Extreme Long Shot",
  "Wide Shot",
  "Extreme Wide Shot",
]

export function ShotBoardNode({ data, selected }: NodeProps<ShotBoardNodeData>) {
  const [shotTitle, setShotTitle] = useState(data.shotTitle || "")
  const [cameraAngle, setCameraAngle] = useState(data.cameraAngle || "Eye Level")
  const [cameraMovement, setCameraMovement] = useState(data.cameraMovement || "Static")
  const [framing, setFraming] = useState(data.framing || "Medium Shot")
  const [notes, setNotes] = useState(data.notes || "")

  return (
    <Card className={`w-80 ${selected ? "ring-2 ring-green-500" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Camera className="w-4 h-4 text-green-500" />
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shot Title */}
        <div className="space-y-2">
          <Label htmlFor="shot-title" className="text-xs">
            Shot Title
          </Label>
          <Input
            id="shot-title"
            value={shotTitle}
            onChange={(e) => setShotTitle(e.target.value)}
            placeholder="Enter shot title..."
            className="text-sm"
          />
        </div>

        {/* Camera Angle */}
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Camera Angle
          </Label>
          <Select value={cameraAngle} onValueChange={setCameraAngle}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAMERA_ANGLES.map((angle) => (
                <SelectItem key={angle} value={angle}>
                  {angle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Camera Movement */}
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Move className="w-3 h-3" />
            Camera Movement
          </Label>
          <Select value={cameraMovement} onValueChange={setCameraMovement}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAMERA_MOVEMENTS.map((movement) => (
                <SelectItem key={movement} value={movement}>
                  {movement}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Framing */}
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <ZoomIn className="w-3 h-3" />
            Framing
          </Label>
          <Select value={framing} onValueChange={setFraming}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FRAMING_TYPES.map((frame) => (
                <SelectItem key={frame} value={frame}>
                  {frame}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Visual Preview */}
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
          <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <div className="text-xs text-muted-foreground">
            {cameraAngle} • {framing}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{cameraMovement}</div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="shot-notes" className="text-xs">
            Director Notes
          </Label>
          <Textarea
            id="shot-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about the shot..."
            className="text-sm min-h-16"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <RotateCw className="w-3 h-3 mr-1" />
            Preview
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            Save Shot
          </Button>
        </div>
      </CardContent>

      {/* React Flow Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500" />
    </Card>
  )
}
