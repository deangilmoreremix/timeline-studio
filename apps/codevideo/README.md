# CodeVideo

**Write Code, Create Videos** - A revolutionary code-first video editor with AI assistance.

## 🚀 What is CodeVideo?

CodeVideo is a complete departure from traditional video editors. Instead of dragging clips in a timeline GUI, you write **React code** to create videos. Every video is a pure function of time, making it:

- **AI-editable**: LLMs can read, write, and modify your videos
- **Version controllable**: Git-friendly `.tsx` files
- **Deterministic**: Same code = same video, always
- **Programmable**: Mathematical precision in animations and timing

## 🎬 How It Works

### 1. Write Code
```tsx
// Your video as React code
export const MyVideo = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const bounce = spring({ frame, fps: 30, config: { damping: 12 } });

  return (
    <Fill style={{ background: '#0f0f0f' }}>
      <h1 style={{
        opacity,
        transform: `translateY(${200 - bounce * 150}px)`,
        color: 'white'
      }}>
        Hello, CodeVideo!
      </h1>
    </Fill>
  );
};
```

### 2. AI Enhancement (Optional)
- Claude AI helps perfect your code
- Suggests complex animations and effects
- Optimizes performance and timing

### 3. Render Video
- Headless browser captures frames
- FFmpeg stitches into MP4/WebM/GIF
- Instant professional results

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui, Radix UI
- **Code Editor**: Monaco Editor (VS Code engine)
- **AI**: Claude API integration
- **Rendering**: Playwright + FFmpeg
- **Architecture**: Feature-based, component-driven

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Claude API key (optional, for AI features)

### Installation
```bash
# Clone and install
git clone https://github.com/yourorg/codevideo.git
cd codevideo
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### First Video
1. Open the app
2. See the code editor with starter template
3. Modify the React code
4. Click "Render" to create your video
5. Download MP4 or integrate into projects

## 📁 Project Structure

```
codevideo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── editor/            # Editor route
│   ├── components/            # Shared UI components
│   │   └── ui/               # Shadcn/ui components
│   ├── features/             # Feature modules
│   │   ├── editor/           # Code editor
│   │   ├── renderer/         # Video rendering
│   │   ├── ai-assistant/     # Claude integration
│   │   └── project/          # Project management
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── docs/                     # Documentation
└── package.json
```

## 🎯 Key Features

### Code-First Editing
- Monaco editor with syntax highlighting
- React/TypeScript with full IntelliSense
- Hot reload for instant preview

### AI-Powered Assistance
- Claude integration for code suggestions
- Automatic animation optimization
- Complex effect generation

### Professional Rendering
- Headless browser frame capture
- Parallel processing (up to 16 tabs)
- Multiple output formats (MP4, WebM, GIF)
- High-quality encoding

### Developer Experience
- Version control friendly
- Component reusability
- Type-safe development
- Modern React patterns

## 🤖 AI Integration

### Claude Code Assistant
- **Natural language to code**: Describe effects, get implementations
- **Code optimization**: Improve performance and readability
- **Animation generation**: Create complex motion graphics
- **Debugging help**: Identify and fix issues

### Example AI Workflow
```
You: "Add a particle explosion effect"
AI: Generates spring physics + particle system code
You: "Make it more colorful"
AI: Updates with color interpolation
Result: Professional particle effect in minutes
```

## 🎬 Video Capabilities

### Animation Primitives
- `useFrame()` - Current frame number
- `interpolate()` - Linear value mapping
- `spring()` - Physics-based motion
- `blendColors()` - Color transitions

### Timing Control
- `<Sequence>` - Time-based content blocks
- `<Series>` - Chain sequences
- `<Loop>` - Repeat content
- Frame-accurate control

### Media Support
- Video embedding with sync
- Audio with programmatic volume
- Image loading and optimization
- SVG shapes and animations

## 🚀 Advanced Usage

### Custom Components
```tsx
// Reusable video components
export const LogoReveal = ({ color = '#ff6b6b' }) => {
  const frame = useFrame();
  const scale = spring({ frame, config: { damping: 15 } });

  return (
    <div style={{
      transform: `scale(${scale})`,
      color
    }}>
      Your Logo
    </div>
  );
};
```

### Data-Driven Videos
```tsx
// Videos that respond to real data
export const SalesChart = () => {
  const frame = useFrame();
  const salesData = useLiveData(); // Real-time API

  return (
    <Chart
      data={salesData}
      animate={true}
      style={{
        opacity: interpolate(frame, [0, 30], [0, 1])
      }}
    />
  );
};
```

## 🔧 API Integration

### Claude AI Setup
```bash
# Get API key from Anthropic
export CLAUDE_API_KEY=your_key_here
```

### Rendering Configuration
```typescript
const renderConfig = {
  concurrency: 8,        // Parallel frame capture
  quality: 'high',       // Rendering quality
  format: 'mp4',         // Output format
  resolution: '1080p'    // Video resolution
};
```

## 📈 Performance

- **Frame Capture**: Up to 16 concurrent browser tabs
- **Encoding**: Hardware-accelerated FFmpeg
- **Streaming**: Real-time progress updates
- **Optimization**: Smart frame skipping and caching

## 🌐 Deployment

### Development
```bash
npm run dev          # Hot reload development
npm run build        # Production build
npm run start        # Production server
```

### Docker
```dockerfile
FROM node:18-alpine
COPY . /app
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Platforms
- **Vercel**: Automatic deployments
- **Netlify**: CDN distribution
- **Railway**: Full-stack hosting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Write tests and code
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

Inspired by the innovative approach of [Rendiv](https://github.com/thecodacus/rendiv), pushing the boundaries of video creation through code.

---

**Ready to code your videos?** 🚀

Visit [codevideo.dev](https://codevideo.dev) to get started!