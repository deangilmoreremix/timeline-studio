/**
 * AI Model Node - CineGen Spaces
 *
 * 50+ AI models for video generation, image processing, and creative workflows
 * Supports text-to-video, image-to-video, video-to-video, and specialized models
 */

import { Handle, NodeProps, Position } from "@xyflow/react"
import { Clock, Play, Settings, Sparkles } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface AIModelNodeData {
  model: string
  label: string
  modelType: string
  quality: string
  duration: number
  resolution: string
  guidance: number
  seed?: number
  status: "idle" | "generating" | "completed" | "error"
}

const AI_MODELS = [
  // Text-to-Video Models
  { id: "kling-3.0", name: "Kling 3.0", type: "text-to-video", provider: "Kuaishou", quality: "High" },
  { id: "ltx-2.3", name: "LTX 2.3", type: "text-to-video", provider: "Lightricks", quality: "High" },
  { id: "sora-2", name: "Sora 2", type: "text-to-video", provider: "OpenAI", quality: "Ultra" },
  { id: "runway-gen-4", name: "Runway Gen-4", type: "text-to-video", provider: "Runway", quality: "High" },
  { id: "veo-3.1", name: "Veo 3.1", type: "text-to-video", provider: "Google", quality: "High" },
  { id: "luma-dream-machine", name: "Luma Dream Machine", type: "text-to-video", provider: "Luma AI", quality: "High" },

  // Image-to-Video Models
  { id: "pika-2", name: "Pika 2", type: "image-to-video", provider: "Pika Labs", quality: "High" },
  {
    id: "stable-video-diffusion",
    name: "Stable Video Diffusion",
    type: "image-to-video",
    provider: "Stability AI",
    quality: "Medium",
  },

  // Video-to-Video Models
  { id: "runway-image-to-video", name: "Runway I2V", type: "video-to-video", provider: "Runway", quality: "High" },

  // Image Generation Models
  { id: "flux-dev", name: "FLUX Dev", type: "text-to-image", provider: "Black Forest Labs", quality: "Ultra" },
  { id: "flux-schnell", name: "FLUX Schnell", type: "text-to-image", provider: "Black Forest Labs", quality: "High" },
  { id: "midjourney-6", name: "Midjourney 6", type: "text-to-image", provider: "Midjourney", quality: "Ultra" },
  { id: "dall-e-3", name: "DALL-E 3", type: "text-to-image", provider: "OpenAI", quality: "High" },
  {
    id: "stable-diffusion-3",
    name: "Stable Diffusion 3",
    type: "text-to-image",
    provider: "Stability AI",
    quality: "High",
  },

  // Specialized Models
  { id: "sam-2", name: "SAM 2", type: "segmentation", provider: "Meta", quality: "High" },
  {
    id: "depth-anything",
    name: "Depth Anything",
    type: "depth-estimation",
    provider: "Open Source",
    quality: "Medium",
  },
  { id: "musicgen", name: "MusicGen", type: "music-generation", provider: "Meta", quality: "Medium" },
  { id: "audiogen", name: "AudioGen", type: "audio-generation", provider: "Meta", quality: "Medium" },
]

const MODEL_TYPES = [
  "text-to-video",
  "image-to-video",
  "video-to-video",
  "text-to-image",
  "segmentation",
  "depth-estimation",
  "music-generation",
  "audio-generation",
]

const RESOLUTIONS = ["480p", "720p", "1080p", "1440p", "4K", "8K"]

export function AIModelNode({ data, selected }: NodeProps<AIModelNodeData>) {
  const [model, setModel] = useState(data.model || "kling-3.0")
  const [modelType, setModelType] = useState(data.modelType || "text-to-video")
  const [quality, setQuality] = useState(data.quality || "High")
  const [duration, setDuration] = useState(data.duration || 5)
  const [resolution, setResolution] = useState(data.resolution || "1080p")
  const [guidance, setGuidance] = useState(data.guidance || 7.5)
  const [seed, setSeed] = useState(data.seed?.toString() || "")
  const [status, setStatus] = useState(data.status || "idle")

  const selectedModelData = AI_MODELS.find((m) => m.id === model)
  const filteredModels = AI_MODELS.filter((m) => m.type === modelType)

  const handleGenerate = () => {
    setStatus("generating")
    // Simulate generation process
    setTimeout(() => setStatus("completed"), 3000)
  }

  const getStatusColor = () => {
    switch (status) {
      case "generating":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className={`w-80 ${selected ? "ring-2 ring-orange-500" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            {data.label}
          </div>
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Type */}
        <div className="space-y-2">
          <Label className="text-xs">Model Type</Label>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODEL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI Model Selection */}
        <div className="space-y-2">
          <Label className="text-xs">AI Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filteredModels.map((modelOption) => (
                <SelectItem key={modelOption.id} value={modelOption.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{modelOption.name}</span>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {modelOption.quality}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedModelData && (
            <div className="text-xs text-muted-foreground">Provider: {selectedModelData.provider}</div>
          )}
        </div>

        {/* Model Settings */}
        <div className="space-y-3">
          <Label className="text-xs flex items-center gap-1">
            <Settings className="w-3 h-3" />
            Model Settings
          </Label>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="text-xs h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger className="text-xs h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOLUTIONS.map((res) => (
                    <SelectItem key={res} value={res}>
                      {res}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(modelType.includes("video") || modelType.includes("music") || modelType.includes("audio")) && (
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duration: {duration}s
              </Label>
              <Slider
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                min={1}
                max={30}
                step={1}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs">Guidance Scale: {guidance}</Label>
            <Slider
              value={[guidance]}
              onValueChange={(value) => setGuidance(value[0])}
              min={1}
              max={20}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="seed" className="text-xs">
              Seed (Optional)
            </Label>
            <Input
              id="seed"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Random"
              className="text-xs h-7"
              type="number"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 border-t">
          <Button onClick={handleGenerate} disabled={status === "generating"} className="w-full" size="sm">
            <Play className="w-4 h-4 mr-2" />
            {status === "generating" ? "Generating..." : "Generate"}
          </Button>
        </div>

        {/* Status */}
        {status !== "idle" && (
          <div className="text-xs text-center">
            <Badge variant={status === "completed" ? "default" : "secondary"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        )}
      </CardContent>

      {/* React Flow Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-orange-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-orange-500" />
    </Card>
  )
}
