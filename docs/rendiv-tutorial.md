## 🎬 **Complete Rendiv Video Creation Tutorial**

Let's create a professional animated logo video from scratch using Rendiv's code-first approach.

---

## 📋 **Step 1: Project Setup**

```bash
# Create new Rendiv project
npx create-rendiv rendiv-tutorial
cd rendiv-tutorial
npm install
```

Your project structure:
```
rendiv-tutorial/
├── src/
│   ├── index.tsx
│   └── compositions/
├── package.json
└── vite.config.ts
```

---

## 🎨 **Step 2: Create Video Composition**

Create `src/compositions/AnimatedLogoVideo.tsx`:

```tsx
import { useFrame, Fill, interpolate, spring, blendColors } from '@rendiv/core';

export const AnimatedLogoVideo = () => {
  const frame = useFrame();

  // 1. Logo entrance with spring physics (frames 0-60)
  const logoScale = spring({
    frame: Math.max(0, frame - 15), // Delayed start
    fps: 30,
    config: { damping: 12, mass: 0.8, stiffness: 180 }
  });

  const logoOpacity = interpolate(frame, [0, 15, 30], [0, 0, 1]);

  // 2. Color transition (frames 60-120)
  const colorProgress = interpolate(frame, [60, 120], [0, 1]);
  const logoColor = blendColors(colorProgress, ['#ff6b6b', '#4ecdc4', '#45b7d1']);

  // 3. Particle explosion (frames 120-180)
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const distance = interpolate(frame, [120, 180], [0, 200]);
    const particleFrame = Math.max(0, frame - 120 - i * 2);

    return {
      x: Math.cos(angle) * distance * spring({
        frame: particleFrame,
        fps: 30,
        config: { damping: 8, stiffness: 100 }
      }),
      y: Math.sin(angle) * distance * spring({
        frame: particleFrame,
        fps: 30,
        config: { damping: 8, stiffness: 100 }
      }),
      opacity: interpolate(particleFrame, [0, 30], [1, 0])
    };
  });

  return (
    <Fill style={{
      background: 'linear-gradient(45deg, #0f0f0f, #1a1a2e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Main Logo */}
      <div style={{
        fontSize: 120,
        fontWeight: 'bold',
        color: logoColor,
        opacity: logoOpacity,
        transform: `scale(${0.5 + logoScale * 0.5})`,
        textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        RENDIV
      </div>

      {/* Animated Particles */}
      {particles.map((particle, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 8,
          height: 8,
          background: logoColor,
          borderRadius: '50%',
          transform: `translate(${particle.x - 4}px, ${particle.y - 4}px)`,
          opacity: particle.opacity,
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
        }} />
      ))}

      {/* Subtitle */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.7)',
        opacity: interpolate(frame, [30, 60], [0, 1]),
        textAlign: 'center'
      }}>
        The Video Editor Built for AI
      </div>
    </Fill>
  );
};
```

---

## ⚙️ **Step 3: Register Composition**

Update `src/index.tsx`:

```tsx
import { setRootComponent, Composition } from '@rendiv/core';
import { AnimatedLogoVideo } from './compositions/AnimatedLogoVideo';

setRootComponent(() => (
  <Composition
    id="AnimatedLogoVideo"
    component={AnimatedLogoVideo}
    durationInFrames={180}  // 6 seconds at 30fps
    fps={30}
    width={1920}
    height={1080}
  />
));
```

---

## 🎯 **Step 4: Development & Testing**

### **Launch Studio**
```bash
npx rendiv studio src/index.tsx
```

**What you'll see:**
- **Live Preview**: Real-time video playback in browser
- **Timeline Editor**: Drag sequences, adjust timing visually
- **Frame Scrubber**: Click anywhere to jump to that frame
- **Hot Reload**: Changes appear instantly
- **Props Editor**: Modify composition parameters
- **Render Queue**: Background rendering with progress

### **Interactive Timeline**
```tsx
// In Studio, you can override timeline like this:
const timelineOverrides = {
  AnimatedLogoVideo: [
    {
      type: 'sequence',
      from: 0,
      duration: 60,
      props: { logoColor: '#ff0000' }
    },
    {
      type: 'sequence', 
      from: 60,
      duration: 60,
      props: { logoColor: '#00ff00' }
    },
    {
      type: 'sequence',
      from: 120,
      duration: 60,
      props: { logoColor: '#0000ff' }
    }
  ]
};
```

---

## 🤖 **Step 5: AI Agent Enhancement**

### **Ask AI to Improve the Video**
```bash
# Tell Claude what you want
"I want to add a glowing effect to the logo and make the particles trail behind with motion blur"

# AI modifies the composition:
```

```tsx
// AI-enhanced version
export const AnimatedLogoVideo = () => {
  const frame = useFrame();

  // ... existing code ...

  return (
    <Fill style={{
      background: 'linear-gradient(45deg, #0f0f0f, #1a1a2e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Glowing Logo */}
      <div style={{
        fontSize: 120,
        fontWeight: 'bold',
        color: logoColor,
        opacity: logoOpacity,
        transform: `scale(${0.5 + logoScale * 0.5})`,
        textShadow: `
          0 0 30px rgba(255, 255, 255, 0.3),
          0 0 60px ${logoColor}40,
          0 0 90px ${logoColor}20
        `,
        filter: `blur(${interpolate(frame, [0, 30], [2, 0])}px)`,
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        RENDIV
      </div>

      {/* Motion Blur Particles */}
      {particles.map((particle, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 8,
          height: 8,
          background: logoColor,
          borderRadius: '50%',
          transform: `translate(${particle.x - 4}px, ${particle.y - 4}px)`,
          opacity: particle.opacity,
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
          filter: `blur(${particle.opacity * 2}px)`
        }} />
      ))}

      {/* ... subtitle ... */}
    </Fill>
  );
};
```

---

## 🎬 **Step 6: Rendering the Video**

### **Option A: Studio GUI**
1. Click "Render" button in Studio
2. Select "AnimatedLogoVideo" from dropdown
3. Choose MP4 format, High quality
4. Set concurrency to 4-8
5. Click "Start Render"
6. Monitor progress in real-time

### **Option B: CLI Rendering**
```bash
# Basic render
npx rendiv render src/index.tsx AnimatedLogoVideo output/logo-video.mp4

# High quality render with 8 parallel processes
npx rendiv render src/index.tsx AnimatedLogoVideo output/logo-video.mp4 \
  --concurrency 8 \
  --quality high \
  --width 1920 \
  --height 1080

# Render as GIF for social media
npx rendiv render src/index.tsx AnimatedLogoVideo output/logo.gif \
  --format gif \
  --fps 15

# Export single frame as PNG
npx rendiv still src/index.tsx AnimatedLogoVideo output/frame-90.png \
  --frame 90
```

### **Option C: Programmatic Rendering**
```typescript
// render.js
import { renderMedia, bundle } from '@rendiv/renderer';

async function renderVideo() {
  const bundled = await bundle({ entryPoint: 'src/index.tsx' });

  await renderMedia({
    serveUrl: bundled,
    compositionId: 'AnimatedLogoVideo',
    codec: 'mp4',
    outputLocation: './output/logo-video.mp4',
    concurrency: 4,
    onProgress: ({ progress }) => {
      console.log(`Rendering: ${Math.round(progress * 100)}% complete`);
    }
  });

  console.log('Video rendered successfully!');
}

renderVideo();
```

---

## 🔍 **Step 7: Understanding the Code**

### **Frame-Based Animation**
```tsx
const frame = useFrame(); // Current frame: 0, 1, 2, 3, ...
// Every render, frame increments by 1
// At 30fps, frame 90 = 3 seconds in
```

### **Interpolation**
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1]);
// frame 0-30: opacity goes from 0 to 1
// frame 30+: opacity stays at 1
```

### **Spring Physics**
```tsx
const scale = spring({
  frame,           // Current frame
  fps: 30,         // Frame rate for physics calculation
  config: {        // Spring parameters
    damping: 12,   // How quickly it settles
    mass: 0.8,     // Object mass
    stiffness: 180 // Spring strength
  }
});
```

### **Color Blending**
```tsx
const color = blendColors(progress, ['#ff6b6b', '#4ecdc4', '#45b7d1']);
// Smoothly transitions between colors based on progress (0-1)
```

---

## 🌐 **Step 8: Integration & Deployment**

### **Embed in Web App**
```tsx
import { Player } from '@rendiv/player';
import { AnimatedLogoVideo } from './rendiv-compositions';

function MyWebsite() {
  return (
    <div>
      <h1>My Logo Animation</h1>
      <Player
        component={AnimatedLogoVideo}
        totalFrames={180}
        fps={30}
        controls={true}
        loop={true}
        width={800}
        height={450}
      />
    </div>
  );
}
```

### **Docker Production**
```dockerfile
FROM ghcr.io/thecodacus/rendiv-studio:latest

# Copy your compositions
COPY src/ /workspace/src/

# Environment for AI agents
ENV ANTHROPIC_API_KEY=your_key_here

EXPOSE 3000
CMD ["rendiv", "studio", "src/index.tsx"]
```

---

## 🎯 **Key Rendiv Concepts**

### **Everything is a Function of Time**
```tsx
// Traditional: Manual keyframes
// Rendiv: Mathematical functions
const x = Math.sin(frame * 0.1) * 100;        // Sine wave movement
const opacity = frame > 60 ? 1 : frame / 60;   // Fade in
const scale = 1 + Math.sin(frame * 0.05) * 0.2; // Pulsing
```

### **Deterministic & Reproducible**
```tsx
// Same code = Same video, always
// No "randomness" or "manual adjustments"
// Perfect for version control and automation
```

### **AI-First Architecture**
```tsx
// AI agents can:
// - Read the code and understand what it does
// - Modify parameters, add effects, change animations
// - Write entirely new compositions
// - Debug and optimize performance
```

### **React Ecosystem Integration**
```tsx
// Use any React pattern:
// - Hooks for state management
// - Context for global data
// - Components for reusable elements
// - TypeScript for type safety
```

---

## 🚀 **Advanced Techniques**

### **Sequence Composition**
```tsx
import { Sequence, Series } from '@rendiv/core';

export const MultiSceneVideo = () => {
  return (
    <Series>
      <Sequence durationInFrames={60}>
        <IntroScene />
      </Sequence>
      <Sequence durationInFrames={120}>
        <MainAnimation />
      </Sequence>
      <Sequence durationInFrames={30}>
        <OutroScene />
      </Sequence>
    </Series>
  );
};
```

### **Audio Synchronization**
```tsx
import { Audio, Video } from '@rendiv/core';

export const SyncedVideo = () => {
  const frame = useFrame();
  const volume = interpolate(frame, [0, 30, 150, 180], [0, 1, 1, 0]);

  return (
    <Fill>
      <Video src="background.mp4" />
      <Audio src="music.mp3" volume={volume} />
    </Fill>
  );
};
```

---

## 🎬 **Result**

You now have:
- ✅ **Animated logo video** with spring physics, color transitions, and particle effects
- ✅ **AI-enhanced code** that any LLM can modify and improve
- ✅ **Version-controlled video** as `.tsx` files in git
- ✅ **Multiple output formats** (MP4, WebM, GIF, PNG)
- ✅ **Web-embeddable player** for any React app
- ✅ **Production-ready rendering** with parallel processing

**Rendiv turns video creation into software development**: write code, get videos, iterate with AI! 🚀✨

Try creating your own composition or ask an AI agent to generate one for you!