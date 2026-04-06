# 🎬 Rendiv Standalone Editor - Complete Setup Guide

## 🚀 How to Access Rendiv as a Standalone Editor

### **Step 1: Switch to Editor Layout Mode**
1. Look at the **top bar** of Timeline Studio
2. Click the **"Layout" button** (grid icon)
3. Select **"Editor Mode"** from the layout options
4. The interface will switch to show the **main navigation sidebar**

### **Step 2: Access Rendiv from the Sidebar**
1. In the **left sidebar**, you'll see editor options:
   - Timeline Editor
   - Media Browser
   - **Rendiv Editor** (Code icon 🛠️)
   - CineGen Spaces
   - Color Grading
   - Audio Mixing
   - Settings
2. **Click "Rendiv Editor"** to open the standalone Rendiv environment

---

## 🎯 What You Get: Complete Rendiv Experience

### **Three Editor Modes:**
1. **Code Mode** - Write React/TypeScript video code
2. **Spaces Mode** - Node-based AI workflow editor
3. **Preview Mode** - Monitor renders and AI elements

### **Full Rendiv Features:**
- ✅ **React video programming** - Videos as functions of time
- ✅ **AI code assistance** - Claude integration for help
- ✅ **Real-time rendering** - See changes instantly
- ✅ **Professional controls** - Duration, quality, format options
- ✅ **Integration** - Renders become Timeline Studio clips

---

## 📝 Quick Start Tutorial

### **1. Open Rendiv Editor**
- Switch to "Editor Mode" layout
- Click "Rendiv Editor" in the sidebar

### **2. Write Your First Video**
```tsx
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

### **3. Configure & Render**
- Set **duration**: 5 seconds
- Choose **quality**: High
- Enable **Claude AI** (optional) for code help
- Click **"Render"** button
- Watch **progress bar** and get MP4

### **4. Use in Timeline**
- Rendered video appears in your project
- **Drag into timeline** for professional editing
- **Combine code precision** with timeline flexibility

---

## 🤖 AI Integration

### **Claude Code Assistant**
1. **Add Claude API key** in the editor settings
2. **Toggle "Claude AI"** to enable
3. **Get intelligent code suggestions**:
   - "Make the animation smoother"
   - "Add particle effects"
   - "Change the color scheme"

### **Example AI Workflow:**
```
You: "Create a video with bouncing text and background music sync"
AI: Generates spring animations, music timing, proper React structure
You: "Make the bounce more realistic"
AI: Adjusts physics parameters for better motion
Result: Professional animation in minutes, not hours
```

---

## 🔧 Technical Architecture

### **Standalone Editor Benefits:**
- **Dedicated interface** - No tab switching in Options panel
- **Full-screen experience** - Immersive video creation environment
- **Main navigation** - Easy switching between different editors
- **Integrated workflow** - Seamless connection to Timeline Studio

### **How It Works:**
1. **Main Navigation Sidebar** - Switch between editors
2. **Rendiv Editor** - Code-first video creation
3. **Backend Integration** - Tauri commands for rendering
4. **Timeline Integration** - Rendered videos become timeline clips

---

## 🎨 Available Rendiv Features

### **Core Animation:**
- `useFrame()` - Current frame number
- `interpolate(from, to, values)` - Linear interpolation
- `spring(config)` - Physics-based animations
- `blendColors(progress, colors)` - Color transitions

### **Timing & Sequencing:**
- `<Sequence>` - Show content for specific time ranges
- `<Series>` - Chain sequences automatically
- `<Loop>` - Repeat content N times

### **Advanced Effects:**
- Perlin noise for organic motion
- Particle systems
- Audio synchronization
- Interactive elements

---

## 🚀 Advanced Usage

### **Multi-Scene Videos:**
```tsx
export const ComplexVideo = () => {
  return (
    <Series>
      <Sequence durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence durationInFrames={120}>
        <MainContent />
      </Sequence>
      <Sequence durationInFrames={60}>
        <CallToAction />
      </Sequence>
    </Series>
  );
};
```

### **AI-Enhanced Workflows:**
```bash
# AI generates complete video structures
# You refine parameters and styling
# Result: Professional videos with AI assistance
```

---

## 🔄 Workflow Integration

### **Rendiv → Timeline Studio:**
1. **Create video** in Rendiv with precise code control
2. **Render** to get perfect MP4
3. **Switch to Timeline Editor** 
4. **Import rendered video** as timeline clip
5. **Add professional effects**, color grading, audio mixing

### **Best of Both Worlds:**
- **Rendiv**: Code precision, AI assistance, mathematical accuracy
- **Timeline Studio**: Professional editing, effects, final polish

---

## 🎯 When to Use Rendiv Standalone

### **Use Rendiv When You Need:**
- **Mathematical precision** in animations
- **AI-assisted coding** for complex effects
- **Version-controlled** video code
- **Reusable components** across projects
- **Interactive elements** in videos

### **Use Timeline Studio When You Need:**
- **Traditional editing** (cut, trim, splice)
- **Multi-track compositing**
- **Color grading** and effects
- **Audio mixing**
- **Final output** rendering

---

## 🎬 Getting Started Checklist

- ✅ **Switch to Editor Mode** (Layout button → Editor Mode)
- ✅ **Click "Rendiv Editor"** in left sidebar
- ✅ **Write some code** in the editor
- ✅ **Set duration & quality**
- ✅ **Enable Claude AI** (optional, needs API key)
- ✅ **Click Render** and wait for MP4
- ✅ **Switch back to Timeline** to use the rendered video

**Welcome to the future of video creation!** 🚀✨

**Questions?** The Rendiv editor is now a first-class citizen in Timeline Studio's main navigation!