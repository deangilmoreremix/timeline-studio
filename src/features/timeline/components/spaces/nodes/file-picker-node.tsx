/**
 * File Picker Node - CineGen Spaces
 *
 * Input node for selecting files and assets
 * Supports images, videos, audio files, and project assets
 */

import { Handle, NodeProps, Position } from "@xyflow/react"
import { File, FileAudio, FileImage, FileVideo, FolderOpen, Upload, X } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilePickerNodeData {
  label: string
  fileType: string
  files: Array<{
    id: string
    name: string
    path: string
    size: number
    type: string
  }>
}

const FILE_TYPES = [
  { value: "image", label: "Images", extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
  { value: "video", label: "Videos", extensions: [".mp4", ".mov", ".avi", ".webm"] },
  { value: "audio", label: "Audio", extensions: [".mp3", ".wav", ".aac", ".flac"] },
  { value: "all", label: "All Files", extensions: [] },
]

export function FilePickerNode({ data, selected }: NodeProps<FilePickerNodeData>) {
  const [fileType, setFileType] = useState(data.fileType || "image")
  const [files, setFiles] = useState(data.files || [])

  const handleFileSelect = () => {
    // In a real implementation, this would open a file dialog
    // For now, we'll simulate adding a file
    const mockFile = {
      id: Date.now().toString(),
      name: `sample-${fileType}.${getExtension(fileType)}`,
      path: `/mock/path/sample-${fileType}.${getExtension(fileType)}`,
      size: Math.floor(Math.random() * 10000000), // Random size up to 10MB
      type: fileType,
    }
    setFiles([...files, mockFile])
  }

  const getExtension = (type: string) => {
    const typeMap: Record<string, string> = {
      image: "jpg",
      video: "mp4",
      audio: "mp3",
      all: "file",
    }
    return typeMap[type] || "file"
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <FileImage className="w-4 h-4" />
      case "video":
        return <FileVideo className="w-4 h-4" />
      case "audio":
        return <FileAudio className="w-4 h-4" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / 1024 ** i) * 100) / 100 + " " + sizes[i]
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const selectedFileType = FILE_TYPES.find((ft) => ft.value === fileType)

  return (
    <Card className={`w-80 ${selected ? "ring-2 ring-cyan-500" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-cyan-500" />
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Type Selection */}
        <div className="space-y-2">
          <Label className="text-xs">File Type</Label>
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFileType && selectedFileType.extensions.length > 0 && (
            <div className="text-xs text-muted-foreground">Extensions: {selectedFileType.extensions.join(", ")}</div>
          )}
        </div>

        {/* Add File Button */}
        <Button onClick={handleFileSelect} className="w-full" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Select {selectedFileType?.label || "Files"}
        </Button>

        {/* File List */}
        <div className="space-y-2">
          <Label className="text-xs">Selected Files ({files.length})</Label>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {files.map((file) => (
              <div key={file.id} className="border rounded p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground truncate">{file.path}</div>
                <Badge variant="outline" className="text-xs">
                  {file.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Drag and Drop Area */}
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center">
          <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
          <div className="text-xs text-muted-foreground">Drag and drop files here</div>
          <div className="text-xs text-muted-foreground mt-1">or click "Select Files" above</div>
        </div>

        {/* File Stats */}
        {files.length > 0 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            {files.length} file{files.length !== 1 ? "s" : ""} •{" "}
            {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))} total
          </div>
        )}
      </CardContent>

      {/* React Flow Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-cyan-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-cyan-500" />
    </Card>
  )
}
