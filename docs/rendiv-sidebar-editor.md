# 🎬 Rendiv Standalone Editor

The **Rendiv Editor** is now integrated as a standalone editor accessible from the **Options sidebar** in Timeline Studio. This provides a complete code-first video creation environment within the main application.

## 🚀 How to Access

1. **Open Timeline Studio**
2. **Look at the right sidebar** (Options panel)
3. **Click the "Rendiv" tab** (Code icon)
4. **Start creating videos with code!**

## 🎯 Three Editor Modes

### **1. Code Mode** (Primary)
- **React code editor** for writing video compositions
- **Real-time syntax highlighting**
- **Claude AI integration** (optional)
- **Render controls** with progress tracking
- **Configuration options** (duration, quality, resolution)

### **2. Spaces Mode**
- **Node-based workflow editor**
- **Connect AI models, prompts, and outputs**
- **Visual pipeline creation**
- **CineGen Spaces integration**

### **3. Preview Mode**
- **View render jobs** and their status
- **Monitor AI elements** created by CineGen
- **Track rendering progress**
- **Access generated content**

## 📝 Quick Start Guide

### **Step 1: Write Your First Video**
```tsx
// The code editor comes pre-loaded with a starter template
export const MyVideo = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });

  return (
    <Fill style={{ background: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{
        opacity,
        transform: `scale(${scale})`,
        color: 'white',
        fontSize: 80
      }}>
        Hello, Rendiv! 👋
      </h1>
    </Fill>
  );
};
```

### **Step 2: Configure Settings**
- **Duration**: 3-15 seconds
- **Quality**: Fast, Standard, High, Ultra
- **Claude AI**: Enable for code enhancement (optional)
- **API Key**: Your Anthropic Claude key for AI assistance

### **Step 3: Render**
- Click the **green "Render" button**
- Watch the **progress bar** in real-time
- Get your **MP4 video** when complete

### **Step 4: Use in Timeline**
- **Rendered videos** automatically become available
- **Drag them** into your Timeline Studio timeline
- **Edit further** with traditional tools

## 🤖 AI Enhancement (Optional)

### **Enable Claude Integration**
1. Get your **Anthropic Claude API key**
2. **Toggle "Claude AI"** in the editor
3. **Enter your API key**
4. Now AI can **enhance your code** and **help write compositions**

### **Example AI Prompt → Video**
```
User: "Create a video with text that fades in, bounces, and changes colors"

AI generates:
- Spring physics for bouncing
- Color interpolation for transitions
- Proper timing and easing
- Production-ready React code
```

## 🔧 Technical Features

### **Real-time Code Editing**
- **Hot reload**: Changes appear instantly
- **Error checking**: Syntax validation
- **TypeScript support**: Full IntelliSense
- **Import helpers**: Auto-complete Rendiv functions

### **Advanced Rendering**
- **Parallel processing**: Up to 16 concurrent frames
- **Multiple formats**: MP4, WebM, GIF, PNG sequences
- **Quality options**: From draft to ultra-high quality
- **Progress tracking**: Real-time render status

### **Integration with Timeline Studio**
- **Unified project**: Rendiv compositions in your .uproject files
- **Shared assets**: Elements and renders accessible everywhere
- **Workflow continuity**: Code → Render → Timeline → Final video

## 🎨 Rendiv Functions Available

### **Core Animation**
- `useFrame()` - Current frame number
- `interpolate(frame, [start, end], [from, to])` - Linear interpolation
- `spring({ frame, fps, config })` - Physics-based animation

### **Timing & Sequencing**
- `<Sequence>` - Show content for specific frame ranges
- `<Series>` - Chain sequences automatically
- `<Loop>` - Repeat content N times

### **Visual Effects**
- `<Fill>` - Full-screen background
- Color blending and gradients
- Transform operations (scale, rotate, translate)

### **Advanced Features**
- Perlin noise generation
- Particle systems
- Audio synchronization
- Interactive elements

## 🚀 Workflow Examples

### **Social Media Video**
```tsx
export const InstagramReel = () => {
  const frame = useFrame();
  const textOpacity = interpolate(frame, [0, 15], [0, 1]);
  const logoScale = spring({ frame: frame - 30, fps: 30 });

  return (
    <Fill style={{ background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' }}>
      <h1 style={{ opacity: textOpacity, color: 'white', fontSize: 60 }}>
        My Product Launch! 🚀
      </h1>
      {/* Logo animation starts at frame 30 */}
      <div style={{ transform: `scale(${logoScale})` }}>
        <LogoIcon />
      </div>
    </Fill>
  );
};
```

### **Corporate Explainer**
```tsx
export const ExplainerVideo = () => {
  const frame = useFrame();

  return (
    <Series>
      <Sequence durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence durationInFrames={120}>
        <MainExplanation />
      </Sequence>
      <Sequence durationInFrames={60}>
        <CallToAction />
      </Sequence>
    </Series>
  );
};
```

## 🎯 Why This Matters

**Rendiv Editor in the sidebar means:**
- ✅ **Zero context switching** - Code videos in the same app as timeline editing
- ✅ **Unified workflow** - From code to final cut in one place
- ✅ **AI assistance** - Claude integration for coding help
- ✅ **Professional results** - Combine code precision with timeline flexibility

**The future of video editing is here: Code + AI + Timeline = Perfect videos!** 🎬✨

## 📚 Next Steps

1. **Try the editor** - Click the "Rendiv" tab in Options
2. **Write some code** - Modify the starter template
3. **Enable Claude** - Add AI assistance (optional)
4. **Render a video** - Click the green button
5. **Use in timeline** - Drag rendered video into your project

**Welcome to the future of video creation!** 🚀