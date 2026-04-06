/**
 * Rendiv Standalone Application
 *
 * Full implementation of Rendiv as a separate, code-first video editor
 * Designed for AI agents, LLM pipelines, and programmatic video creation
 */

// Core Rendiv imports
import { Composition, setRootComponent } from "@rendiv/core"
import { Player } from "@rendiv/player"
import { Studio } from "@rendiv/studio"
import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AIGeneratedVideo } from "./compositions/AIGeneratedVideo"
// Custom video compositions
import { HelloWorldVideo } from "./compositions/HelloWorldVideo"
import { InteractiveVideo } from "./compositions/InteractiveVideo"

// Rendiv Studio entry point
export function RendivApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RendivStudio />} />
        <Route path="/preview/:id" element={<VideoPreview />} />
        <Route path="/interactive/:id" element={<InteractivePlayer />} />
      </Routes>
    </BrowserRouter>
  )
}

// Studio interface with timeline editor
function RendivStudio() {
  return (
    <Studio
      compositions={{
        HelloWorld: HelloWorldVideo,
        AIGenerated: AIGeneratedVideo,
        Interactive: InteractiveVideo,
      }}
      onRender={(compositionId, outputPath) => {
        console.log(`Rendered ${compositionId} to ${outputPath}`)
      }}
      enableAgentTerminal={true}
      enableTimelineEditor={true}
      enableWorkspaceMode={true}
    />
  )
}

// Video preview component
function VideoPreview() {
  return (
    <div className="preview-container">
      <Player
        component={HelloWorldVideo}
        totalFrames={150}
        fps={30}
        compositionWidth={1920}
        compositionHeight={1080}
        controls={true}
        loop={true}
        autoPlay={true}
      />
    </div>
  )
}

// Interactive video player
function InteractivePlayer() {
  return (
    <Player
      component={InteractiveVideo}
      totalFrames={300}
      fps={30}
      compositionWidth={1920}
      compositionHeight={1080}
      controls={false}
      interactive={true}
    />
  )
}

// Root component registration for CLI rendering
setRootComponent(() => (
  <Composition
    id="RendivStandalone"
    component={HelloWorldVideo}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
  />
))

// Mount the app
const container = document.getElementById("root")
if (container) {
  const root = createRoot(container)
  root.render(<RendivApp />)
}
