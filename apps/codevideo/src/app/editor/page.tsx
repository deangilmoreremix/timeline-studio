'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Play, Square, RotateCcw, Code, Eye, Settings, Zap, Brain } from 'lucide-react'

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
                      onClick={handleRender}
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
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Zap className="w-3 h-3 mr-1" />
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
              <div className="text-center py-12">
                <Eye className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Video Preview
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Render your code to see the video preview here
                </p>
                {!isRendering && renderProgress === 0 && (
                  <Button onClick={handleRender} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Render Preview
                  </Button>
                )}
                {renderProgress === 100 && (
                  <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
                    <div className="text-green-800 dark:text-green-200">
                      ✅ Video rendered successfully!
                    </div>
                    <div className="mt-2 text-sm text-green-600 dark:text-green-300">
                      Download link and preview would appear here
                    </div>
                  </div>
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