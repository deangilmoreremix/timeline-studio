# How Users Create Videos with Rendiv

## 🎬 Rendiv Video Creation Workflow

### **1. Installation & Setup**
```bash
# Install Rendiv CLI and create project
npm install -g @rendiv/cli
npx create-rendiv my-video-project
cd my-video-project

# Install dependencies
npm install
```

### **2. Project Structure**
```
my-video-project/
├── src/
│   ├── index.tsx          # Root component registry
│   ├── HelloWorld.tsx     # First video composition
│   └── MyVideo.tsx        # Custom compositions
├── package.json
├── vite.config.ts         # Bundler config
└── tsconfig.json
```

### **3. Creating Your First Video Composition**

#### **Basic Video Component**
```tsx
// src/MyFirstVideo.tsx
import { useFrame, Fill, interpolate } from '@rendiv/core';

export const MyFirstVideo = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = interpolate(frame, [0, 60], [0.5, 1.2]);

  return (
    <Fill style={{ background: '#0f0f0f' }}>
      <h1 style={{
        opacity,
        transform: `scale(${scale})`,
        color: 'white',
        fontSize: 80,
        textAlign: 'center'
      }}>
        Hello, Rendiv! 👋
      </h1>
    </Fill>
  );
};
```

#### **Register Composition**
```tsx
// src/index.tsx
import { setRootComponent, Composition } from '@rendiv/core';
import { MyFirstVideo } from './MyFirstVideo';

setRootComponent(() => (
  <Composition
    id="MyFirstVideo"
    component={MyFirstVideo}
    durationInFrames={90}  // 3 seconds at 30fps
    fps={30}
    width={1920}
    height={1080}
  />
));
```

### **4. Development Workflow**

#### **Option A: Studio Development Environment**
```bash
# Start the Studio (development server)
npx rendiv studio src/index.tsx

# Opens browser at http://localhost:3000 with:
# - Live preview of all compositions
# - Interactive timeline editor
# - Frame-by-frame scrubbing
# - Hot reload on file changes
# - Props editor for dynamic content
# - One-click render trigger
```

#### **Option B: AI Agent Integration**
```bash
# Launch with Claude Code agent terminal
npx rendiv studio --agent claude src/index.tsx

# AI agent can now:
# - Read your existing compositions
# - Write new React components
# - Modify animations and effects
# - Debug and iterate on videos
```

### **5. Advanced Video Techniques**

#### **Sequence & Timing Control**
```tsx
import { Sequence, Series, Loop } from '@rendiv/core';

export const AdvancedVideo = () => {
  return (
    <Series>
      {/* Scene 1: 0-60 frames */}
      <Sequence durationInFrames={60}>
        <Scene1 />
      </Sequence>

      {/* Transition: 60-75 frames */}
      <Sequence durationInFrames={15}>
        <Transition />
      </Sequence>

      {/* Scene 2: 75-135 frames */}
      <Sequence durationInFrames={60}>
        <Scene2 />
      </Sequence>
    </Series>
  );
};
```

#### **Spring Physics Animation**
```tsx
import { useFrame, spring } from '@rendiv/core';

export const PhysicsVideo = () => {
  const frame = useFrame();

  const bounceY = spring({
    frame: frame - 30,  // Start after 30 frames
    fps: 30,
    config: { damping: 12, mass: 1, stiffness: 100 }
  });

  return (
    <Fill>
      <div style={{
        transform: `translateY(${200 - bounceY * 150}px)`,
        width: 100,
        height: 100,
        background: 'red',
        borderRadius: '50%'
      }} />
    </Fill>
  );
};
```

#### **Interactive Video with AI**
```tsx
import { useFrame, useCompositionConfig } from '@rendiv/core';

export const InteractiveVideo = () => {
  const frame = useFrame();
  const { totalFrames } = useCompositionConfig();

  // AI agent can modify these values dynamically
  const [userChoice, setUserChoice] = useState('option1');

  return (
    <Fill>
      {frame < totalFrames * 0.5 ? (
        <ChoiceScreen onSelect={setUserChoice} />
      ) : (
        <OutcomeScreen choice={userChoice} />
      )}
    </Fill>
  );
};
```

### **6. Rendering Videos**

#### **Studio GUI Rendering**
```bash
# In Studio, click "Render" button
# Choose composition from dropdown
# Select output format (MP4/WebM/GIF)
# Set quality and concurrency
# Monitor progress in real-time
```

#### **CLI Rendering**
```bash
# Render specific composition
npx rendiv render src/index.tsx MyFirstVideo output/video.mp4

# Render with custom settings
npx rendiv render src/index.tsx MyFirstVideo output/video.mp4 \
  --concurrency 8 \
  --quality high \
  --format webm

# Render single frame
npx rendiv still src/index.tsx MyFirstVideo output/frame.png --frame 45
```

#### **Programmatic Rendering (Node.js)**
```typescript
import { renderMedia, bundle } from '@rendiv/renderer';

const bundled = await bundle({ entryPoint: 'src/index.tsx' });

await renderMedia({
  serveUrl: bundled,
  compositionId: 'MyFirstVideo',
  codec: 'mp4',
  outputLocation: 'output/video.mp4',
  concurrency: 4,
  onProgress: ({ progress }) => console.log(`${progress}% complete`)
});
```

### **7. AI Agent Workflow**

#### **Natural Language to Video**
```bash
# Tell AI agent what you want
echo "Create a video with a bouncing ball that changes colors" | claude code

# AI agent writes this code:
import { useFrame, interpolate, spring, Fill } from '@rendiv/core';

export const BouncingBallVideo = () => {
  const frame = useFrame();

  const bounce = spring({
    frame,
    fps: 30,
    config: { damping: 8, stiffness: 150 }
  });

  const hue = interpolate(frame, [0, 300], [0, 360]);
  const color = `hsl(${hue}, 80%, 60%)`;

  return (
    <Fill>
      <div style={{
        width: 100,
        height: 100,
        background: color,
        borderRadius: '50%',
        transform: `translateY(${200 - bounce * 150}px)`
      }} />
    </Fill>
  );
};
```

### **8. Advanced Features**

#### **Audio Integration**
```tsx
import { Audio, Video } from '@rendiv/core';

export const VideoWithAudio = () => {
  return (
    <Fill>
      <Video src="background.mp4" startFrom={0} />
      <Audio
        src="music.mp3"
        volume={interpolate(useFrame(), [0, 30], [0, 0.8])}
      />
    </Fill>
  );
};
```

#### **SVG Shapes & Paths**
```tsx
import { shapeCircle, pathLength } from '@rendiv/shapes';

export const ShapeAnimation = () => {
  const frame = useFrame();
  const progress = frame / 300;

  return (
    <Fill>
      <shapeCircle
        cx={960}
        cy={540}
        r={interpolate(frame, [0, 150], [0, 200])}
        fill="blue"
        opacity={progress}
      />
    </Fill>
  );
};
```

#### **Perlin Noise**
```tsx
import { noise2D } from '@rendiv/noise';

export const OrganicAnimation = () => {
  const frame = useFrame();
  const x = noise2D(frame * 0.02, 0) * 1920;
  const y = noise2D(0, frame * 0.02) * 1080;

  return (
    <Fill>
      <div style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 50,
        height: 50,
        background: 'red'
      }} />
    </Fill>
  );
};
```

### **9. Deployment & Integration**

#### **Embed in React Apps**
```tsx
import { Player } from '@rendiv/player';
import { MyVideo } from './rendiv-compositions';

function MyApp() {
  return (
    <Player
      component={MyVideo}
      totalFrames={150}
      fps={30}
      controls
      loop
      width={800}
      height={450}
    />
  );
}
```

#### **Docker Deployment**
```dockerfile
FROM ghcr.io/thecodacus/rendiv-studio:latest

# Copy your compositions
COPY src/ /workspace/src/

# Set environment variables for AI agents
ENV ANTHROPIC_API_KEY=your_key_here

EXPOSE 3000
CMD ["rendiv", "studio", "src/index.tsx"]
```

### **10. Workflow Summary**

1. **Design**: Sketch video concept or write natural language description
2. **AI Generation**: Use AI agents to write React components
3. **Studio Preview**: Launch studio for live preview and timeline editing
4. **Iterate**: Modify code, see changes instantly with hot reload
5. **Render**: Export to MP4/WebM/GIF with headless browser rendering
6. **Deploy**: Embed in web apps or distribute as video files

**Rendiv makes video creation feel like coding**: deterministic, versionable, AI-assisted, and infinitely flexible! 🎬✨