/**
 * Prompt Node - CineGen Spaces
 *
 * Text input node for AI generation prompts
 * Supports advanced prompt engineering features
 */

import { Handle, NodeProps, Position } from "@xyflow/react"
import { Copy, FileText, Sparkles, Wand2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface PromptNodeData {
  label: string
  prompt: string
  style: string
  tone: string
  length: string
  tags: string[]
}

const PROMPT_STYLES = [
  "Cinematic",
  "Documentary",
  "Artistic",
  "Commercial",
  "Minimalist",
  "Vibrant",
  "Moody",
  "Bright",
  "Natural",
  "Surreal",
]

const PROMPT_TONES = [
  "Professional",
  "Casual",
  "Dramatic",
  "Humorous",
  "Serious",
  "Inspirational",
  "Mysterious",
  "Energetic",
  "Calm",
  "Intense",
]

const PROMPT_LENGTHS = ["Short", "Medium", "Long", "Very Long"]

export function PromptNode({ data, selected }: NodeProps<PromptNodeData>) {
  const [prompt, setPrompt] = useState(data.prompt || "")
  const [style, setStyle] = useState(data.style || "Cinematic")
  const [tone, setTone] = useState(data.tone || "Professional")
  const [length, setLength] = useState(data.length || "Medium")
  const [tags, setTags] = useState(data.tags || [])
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const enhancePrompt = () => {
    // Simple prompt enhancement - in real implementation this would use AI
    const enhanced = `${prompt}, ${style.toLowerCase()} style, ${tone.toLowerCase()} tone`
    setPrompt(enhanced)
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
  }

  const promptStats = {
    words: prompt.split(/\s+/).filter((word) => word.length > 0).length,
    characters: prompt.length,
  }

  return (
    <Card className={`w-80 ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Prompt */}
        <div className="space-y-2">
          <Label htmlFor="main-prompt" className="text-xs">
            Prompt Text
          </Label>
          <Textarea
            id="main-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="text-sm min-h-24"
          />
        </div>

        {/* Prompt Stats */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{promptStats.words} words</span>
          <span>{promptStats.characters} characters</span>
        </div>

        {/* Style and Tone */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMPT_STYLES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMPT_TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Length */}
        <div className="space-y-2">
          <Label className="text-xs">Length</Label>
          <Select value={length} onValueChange={setLength}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROMPT_LENGTHS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-xs">Tags</Label>
          <div className="flex gap-1">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTag()}
              placeholder="Add tag..."
              className="text-xs h-7 flex-1"
            />
            <Button onClick={addTag} size="sm" variant="outline" className="h-7 px-2">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button onClick={enhancePrompt} size="sm" variant="outline" className="flex-1">
            <Wand2 className="w-3 h-3 mr-1" />
            Enhance
          </Button>
          <Button onClick={copyPrompt} size="sm" variant="outline" className="flex-1">
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>

        {/* Enhanced Preview */}
        {prompt && (
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-xs text-muted-foreground">Enhanced Prompt Preview</Label>
            <div className="text-xs bg-muted p-2 rounded text-muted-foreground">
              {prompt}, {style.toLowerCase()} style, {tone.toLowerCase()} tone
            </div>
          </div>
        )}
      </CardContent>

      {/* React Flow Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </Card>
  )
}
