import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code, Play, Zap, Film, React, Cpu, Brain } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header Section with AI-Generated Image */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* AI-Generated Header Image Placeholder */}
            <div className="mb-8 relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Code className="w-12 h-12 text-white" />
                  <h1 className="text-6xl font-bold text-white tracking-tight">
                    CodeVideo
                  </h1>
                  <Film className="w-12 h-12 text-white" />
                </div>
                <p className="text-xl text-blue-100 mb-6">
                  Write Code, Create Videos
                </p>
                <p className="text-lg text-blue-50 max-w-2xl mx-auto">
                  A revolutionary code-first video editor where you write React code to create videos with AI assistance.
                </p>

                {/* Feature Icons */}
                <div className="flex justify-center space-x-8 mt-8">
                  <div className="flex flex-col items-center">
                    <React className="w-8 h-8 text-white mb-2" />
                    <span className="text-sm text-blue-100">React</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Film className="w-8 h-8 text-white mb-2" />
                    <span className="text-sm text-blue-100">Video</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Brain className="w-8 h-8 text-white mb-2" />
                    <span className="text-sm text-blue-100">AI</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Cpu className="w-8 h-8 text-white mb-2" />
                    <span className="text-sm text-blue-100">Code</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Try CodeVideo
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                <Code className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why CodeVideo?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Traditional video editors are GUI-based and impossible for AI to operate.
              CodeVideo flips this: videos as pure functions, editable by both humans and AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-6 h-6 text-blue-600" />
                  Code-First Creation
                </CardTitle>
                <CardDescription>
                  Write React code to create videos. Every frame is a function of time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-100 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  AI-Assisted Development
                </CardTitle>
                <CardDescription>
                  Claude AI helps write complex animations and suggests improvements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-green-600" />
                  Instant Rendering
                </CardTitle>
                <CardDescription>
                  Headless browser rendering with FFmpeg. Get MP4 videos instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-orange-100 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="w-6 h-6 text-orange-600" />
                  Version Control
                </CardTitle>
                <CardDescription>
                  Git-friendly .tsx files. Track video changes like software code.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-red-100 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <React className="w-6 h-6 text-red-600" />
                  React Ecosystem
                </CardTitle>
                <CardDescription>
                  Use any React library, hooks, and components in your videos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-indigo-100 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-indigo-600" />
                  Programmatic Control
                </CardTitle>
                <CardDescription>
                  Mathematical precision in timing, physics, and animations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From idea to video in minutes, not hours
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Write Code</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Describe your video or write React code directly in the editor.
              </p>
              <div className="bg-gray-800 text-green-400 p-4 rounded-lg text-left font-mono text-sm">
                {`const video = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <Fill>
      <h1 style={{ opacity }}>
        Hello, CodeVideo!
      </h1>
    </Fill>
  );
};`}
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Enhancement</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Claude AI helps perfect your code, adds effects, and optimizes animations.
              </p>
              <div className="bg-purple-900 text-purple-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5" />
                  <span className="font-semibold">Claude AI</span>
                </div>
                <p className="text-sm">
                  "I added spring physics and color interpolation to make your animation more dynamic!"
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Render Video</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Headless browser captures frames, FFmpeg creates your MP4 video.
              </p>
              <div className="bg-green-900 text-green-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-5 h-5" />
                  <span className="font-semibold">Rendering...</span>
                </div>
                <div className="w-full bg-green-800 rounded-full h-2 mb-2">
                  <div className="bg-green-400 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-sm">75% complete • 2.3 MB • MP4</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Code Your Videos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the future of video creation. Write code, create videos, unleash your creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3">
              Start Coding Videos
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">CodeVideo</span>
              </div>
              <p className="text-gray-400">
                Write code, create videos. The future of video editing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Tutorials</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CodeVideo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}