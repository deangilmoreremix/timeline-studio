'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Play, Square, RotateCcw, Code, Eye, Settings, Zap, Brain, Wand2, Lightbulb } from 'lucide-react'

// Import our services
import { videoRenderer, type RenderConfig, type RenderProgress } from '@/features/renderer/services/video-renderer'
import { aiAssistant, type AIRequest } from '@/features/ai-assistant/services/ai-assistant'

export default function EditorPage() {
  const [code, setCode] = useState(`// Welcome to CodeVideo!
// Write React code to create your video

import { useFrame, Fill, interpolate, spring } from '@rendiv/core';

export const MyVideo = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });

  return (
    <Fill style={{ background: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{
        opacity,
        transform: \`scale(\${scale})\`,
        color: 'white',
        fontSize: 80,
        textAlign: 'center'
      }}>
        Hello, CodeVideo! 👋
      </h1>
    </Fill>
  );
};`)

  const [isRendering, setIsRendering] = useState(false)
  const [renderProgress, setRenderProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('code')

  // AI functionality state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [renderResult, setRenderResult] = useState<any>(null)

  const handleRender = () => {
    setIsRendering(true)
    setRenderProgress(0)

    // Simulate rendering progress
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRendering(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleStop = () => {
    setIsRendering(false)
    setRenderProgress(0)
  }

  const handleEnhanceWithAI = async () => {
    if (!claudeApiKey) {
      alert('Please set your Claude API key in Settings')
      return
    }

    setIsAiLoading(true)
    aiAssistant.setApiKey(claudeApiKey)

    try {
      const enhancement = await aiAssistant.enhanceCode(
        code,
        'Add more visual effects and improve the animation'
      )
      setCode(enhancement.enhancedCode)
      alert(`Code enhanced! ${enhancement.explanation}`)
    } catch (error) {
      alert('AI enhancement failed: ' + (error as Error).message)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleGetSuggestions = async () => {
    if (!claudeApiKey) {
      alert('Please set your Claude API key in Settings')
      return
    }

    setIsAiLoading(true)
    aiAssistant.setApiKey(claudeApiKey)

    try {
      const suggestions = await aiAssistant.getSuggestions(code)
      setAiSuggestions(suggestions)
    } catch (error) {
      alert('Failed to get suggestions: ' + (error as Error).message)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleRealRender = async () => {
    setIsRendering(true)
    setRenderProgress(0)
    setRenderResult(null)

    try {
      const config: RenderConfig = {
        code,
        duration: muapiConfig.duration,
        resolution: muapiConfig.resolution,
        quality: muapiConfig.quality,
        format: 'mp4',
        apiKey: 'demo-api-key', // In real app, get from settings
        endpoint: 'https://api.muapi.com' // In real app, get from settings
      }

      const renderId = `render_${Date.now()}`

      // Set up progress monitoring
      videoRenderer.onProgress(renderId, (progress: RenderProgress) => {
        setRenderProgress(progress.progress)
      })

      const result = await videoRenderer.renderVideo(config)
      setRenderResult(result)

      if (result.success) {
        alert(`Video rendered successfully! URL: ${result.videoUrl}`)
      } else {
        alert(`Render failed: ${result.error}`)
      }

    } catch (error) {
      alert('Render failed: ' + (error as Error).message)
      setRenderResult({ success: false, error: (error as Error).message })
    } finally {
      setIsRendering(false)
      setRenderProgress(0)
    }
  }

  const handleReset = () => {
    setCode(`// Reset to starter template

import { useFrame, Fill, interpolate, spring } from '@rendiv/core';

export const MyVideo = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });

  return (
    <Fill style={{ background: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{
        opacity,
        transform: \`scale(\${scale})\`,
        color: 'white',
        fontSize: 80,
        textAlign: 'center'
      }}>
        Hello, CodeVideo! 👋
      </h1>
    </Fill>
  );
};`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Code className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                CodeVideo Editor
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Brain className="w-3 h-3 mr-1" />
                AI Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Code Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Code Editor Tab */}
            <TabsContent value="code" className="p-6">
              <div className="space-y-4">
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleRealRender}
                      disabled={isRendering}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isRendering ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Rendering...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Render Video
                        </>
                      )}
                    </Button>

                    {isRendering && (
                      <Button variant="outline" onClick={handleStop}>
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    )}

                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEnhanceWithAI}
                      disabled={isAiLoading}
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      Enhance
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGetSuggestions}
                      disabled={isAiLoading}
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      Suggestions
                    </Button>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Brain className="w-3 h-3 mr-1" />
                      Claude AI
                    </Badge>
                  </div>
                </div>

                {/* Render Progress */}
                {isRendering && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Rendering Video...</span>
                      <span className="text-sm text-gray-500">{renderProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${renderProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      AI Suggestions:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Editor */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      MyVideo.tsx
                    </span>
                  </div>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[400px] font-mono text-sm border-0 resize-none focus-visible:ring-0"
                    placeholder="Write your React video code here..."
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Tips:</span> Use <code>useFrame()</code> for animation,
                    <code>interpolate()</code> for transitions, <code>spring()</code> for physics
                  </div>
                  <div>
                    {code.split('\n').length} lines • {code.length} characters
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Video Preview & Results
                  </h3>
                </div>

                {/* Render Results */}
                {renderResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {renderResult.success ? (
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                        Render Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderResult.success ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Video Details:</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Duration:</span>
                                <span className="ml-2 font-medium">{renderResult.duration}s</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Resolution:</span>
                                <span className="ml-2 font-medium">{renderResult.resolution}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">File Size:</span>
                                <span className="ml-2 font-medium">
                                  {renderResult.fileSize ?
                                    `${(renderResult.fileSize / 1024 / 1024).toFixed(1)} MB` :
                                    'N/A'
                                  }
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Video URL:</span>
                                <a
                                  href={renderResult.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-blue-600 hover:underline"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>

                          {renderResult.thumbnailUrl && (
                            <div>
                              <h4 className="font-medium mb-2">Thumbnail:</h4>
                              <img
                                src={renderResult.thumbnailUrl}
                                alt="Video thumbnail"
                                className="max-w-xs rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                            Render Failed
                          </h4>
                          <p className="text-red-700 dark:text-red-300">
                            {renderResult.error || 'Unknown error occurred'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* No Results State */}
                {!renderResult && !isRendering && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No renders yet. Write code and click "Render Video" to create your first video!
                    </p>
                  </div>
                )}

                {/* Rendering State */}
                {isRendering && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                          <Play className="w-8 h-8 text-blue-600 animate-pulse" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Rendering Video...</h3>
                        <p className="text-gray-500 mb-4">This may take a few minutes</p>

                        <div className="max-w-xs mx-auto">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${renderProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500">{renderProgress}% complete</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Claude API Key
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        placeholder="sk-ant-..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Get your key from{' '}
                        <a
                          href="https://console.anthropic.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Anthropic Console
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Render Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Duration (seconds)
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                          <option value="3">3 seconds</option>
                          <option value="5">5 seconds</option>
                          <option value="10">10 seconds</option>
                          <option value="15">15 seconds</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Quality
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                          <option value="fast">Fast</option>
                          <option value="standard">Standard</option>
                          <option value="high">High</option>
                          <option value="ultra">Ultra</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}