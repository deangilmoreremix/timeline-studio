/**
 * Asset Output Node - CineGen Spaces
 *
 * Output node for generated content and assets
 * Handles final output formatting and delivery
 */

import { Handle, NodeProps, Position } from "@xyflow/react"
import { AlertCircle, CheckCircle, Clock, Download, Eye, Share2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AssetOutputNodeData {
  label: string
  outputFormat: string
  quality: string
  destination: string
  status: "waiting" | "processing" | "completed" | "error"
  outputPath?: string
  fileSize?: number
}

const OUTPUT_FORMATS = [
  { value: "mp4", label: "MP4 Video", type: "video" },
  { value: "webm", label: "WebM Video", type: "video" },
  { value: "gif", label: "Animated GIF", type: "video" },
  { value: "png", label: "PNG Image", type: "image" },
  { value: "jpg", label: "JPEG Image", type: "image" },
  { value: "webp", label: "WebP Image", type: "image" },
  { value: "wav", label: "WAV Audio", type: "audio" },
  { value: "mp3", label: "MP3 Audio", type: "audio" },
]

const DESTINATIONS = [
  { value: "timeline", label: "Add to Timeline" },
  { value: "library", label: "Save to Library" },
  { value: "export", label: "Export File" },
  { value: "share", label: "Share Link" },
]

export function AssetOutputNode({ data, selected }: NodeProps<AssetOutputNodeData>) {
  const [outputFormat, setOutputFormat] = useState(data.outputFormat || "mp4")
  const [quality, setQuality] = useState(data.quality || "High")
  const [destination, setDestination] = useState(data.destination || "timeline")
  const [status, setStatus] = useState(data.status || "waiting")
  const [outputPath, setOutputPath] = useState(data.outputPath || "")
  const [fileSize, setFileSize] = useState(data.fileSize || 0)

  const handleProcessOutput = () => {
    setStatus("processing")
    // Simulate processing
    setTimeout(() => {
      setStatus("completed")
      setOutputPath(`/outputs/generated_${Date.now()}.${outputFormat}`)
      setFileSize(Math.floor(Math.random() * 50000000) + 1000000) // 1-51MB
    }, 2000)
  }

  const getStatusIcon = () => {
    switch (status) {
      case "waiting":
        return <Clock className="w-4 h-4 text-gray-500" />
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "waiting":
        return "ring-gray-500"
      case "processing":
        return "ring-yellow-500"
      case "completed":
        return "ring-green-500"
      case "error":
        return "ring-red-500"
      default:
        return "ring-gray-500"
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / 1024 ** i) * 100) / 100 + " " + sizes[i]
  }

  const selectedFormat = OUTPUT_FORMATS.find((f) => f.value === outputFormat)

  return (
    <Card className={`w-80 ${selected ? `ring-2 ${getStatusColor()}` : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {data.label}
          </div>
          <Badge variant={status === "completed" ? "default" : "secondary"}>{status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Output Format */}
        <div className="space-y-2">
          <Label className="text-xs">Output Format</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OUTPUT_FORMATS.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{format.label}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {format.type}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quality and Destination */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">Quality</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger className="text-sm">
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

          <div className="space-y-2">
            <Label className="text-xs">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map((dest) => (
                  <SelectItem key={dest.value} value={dest.value}>
                    {dest.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Output Preview */}
        {status === "completed" && outputPath && (
          <div className="space-y-2">
            <Label className="text-xs">Output Details</Label>
            <div className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">File:</span>
                <span className="text-xs text-muted-foreground truncate max-w-32">{outputPath.split("/").pop()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Size:</span>
                <span className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Format:</span>
                <Badge variant="outline" className="text-xs">
                  {outputFormat.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t">
          <Button onClick={handleProcessOutput} disabled={status === "processing"} className="w-full" size="sm">
            {status === "processing" ? "Processing..." : "Generate Output"}
          </Button>

          {status === "completed" && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Share2 className="w-3 h-3 mr-1" />
                Share
              </Button>
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className="text-xs text-center text-muted-foreground">
          {status === "waiting" && "Ready to process output"}
          {status === "processing" && "Generating output..."}
          {status === "completed" && `Output ready • ${formatFileSize(fileSize)}`}
          {status === "error" && "Error generating output"}
        </div>
      </CardContent>

      {/* React Flow Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-500" />
    </Card>
  )
}
