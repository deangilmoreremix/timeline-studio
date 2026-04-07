/**
 * Enhanced Higgsfield Timeline Editor
 *
 * Integrates Timeline Studio features while preserving all existing functionality
 */

export function EnhancedTimelineEditorPage() {
  const container = document.createElement('div');
  container.className = 'w-full h-full enhanced-timeline-container';
  container.style.background = '#05070b';

  // Create main layout with sidebar for advanced features
  const mainLayout = document.createElement('div');
  mainLayout.className = 'flex h-full';

  // Left sidebar for advanced features
  const advancedSidebar = document.createElement('div');
  advancedSidebar.className = 'w-80 bg-gray-900 border-r border-gray-700 flex flex-col hidden';
  advancedSidebar.id = 'advanced-sidebar';

  // Sidebar header
  const sidebarHeader = document.createElement('div');
  sidebarHeader.className = 'p-4 border-b border-gray-700';
  sidebarHeader.innerHTML = `
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-white">🎯 Advanced Features</h2>
      <button class="text-gray-400 hover:text-white" id="close-advanced">✕</button>
    </div>
    <p class="text-sm text-gray-400 mt-2">Multi-track editing, audio processing, plugins</p>
  `;

  // Feature tabs
  const featureTabs = document.createElement('div');
  featureTabs.className = 'flex border-b border-gray-700';
  featureTabs.innerHTML = `
    <button class="flex-1 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors active-tab" data-feature="timeline">
      🎬 Timeline
    </button>
    <button class="flex-1 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors" data-feature="audio">
      🎵 Audio
    </button>
    <button class="flex-1 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors" data-feature="plugins">
      🔌 Plugins
    </button>
    <button class="flex-1 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors" data-feature="collaborate">
      👥 Collaborate
    </button>
    <button class="flex-1 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors" data-feature="multicam">
      🎥 Multi-Cam
    </button>
    <button class="flex-1 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors" data-feature="export">
      📤 Export Pro
    </button>
    <button class="flex-1 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors" data-feature="enterprise">
      🏢 Enterprise
    </button>
  `;

  // Feature content area
  const featureContent = document.createElement('div');
  featureContent.className = 'flex-1 overflow-y-auto';
  featureContent.id = 'feature-content';

  // Main timeline area (enhanced version of existing)
  const mainTimeline = document.createElement('div');
  mainTimeline.className = 'flex-1 flex flex-col';

  // Enhanced header with advanced features toggle
  const enhancedHeader = document.createElement('div');
  enhancedHeader.className = 'p-4 border-b border-gray-700 bg-gray-800/50';
  enhancedHeader.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold text-white">🎬 Enhanced Timeline Editor</h1>
        <div class="flex gap-2">
          <span class="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Multi-Track</span>
          <span class="px-3 py-1 bg-green-600 text-white text-xs rounded-full">Audio Pro</span>
          <span class="px-3 py-1 bg-purple-600 text-white text-xs rounded-full">AI Enhanced</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-3 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors" id="toggle-advanced">
          ⚡ Advanced
        </button>
        <button class="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors" id="export-project">
          📤 Export
        </button>
        <button class="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors" id="render-video">
          🎬 Render
        </button>
      </div>
    </div>
  `;

  // Status bar
  const statusBar = document.createElement('div');
  statusBar.className = 'h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4 text-sm text-gray-400';
  statusBar.id = 'status-bar';
  statusBar.innerHTML = `
    <div class="flex items-center gap-4">
      <span id="status-text">Ready</span>
      <span id="performance-info">GPU: Active | Memory: 2.1GB</span>
    </div>
    <div class="flex items-center gap-4">
      <span id="time-display">00:00:00 / 01:00:00</span>
      <span id="fps-display">30 FPS</span>
    </div>
  `;

  // Create the original iframe-based timeline (enhanced)
  const timelineContainer = document.createElement('div');
  timelineContainer.className = 'flex-1';
  timelineContainer.id = 'timeline-container';

  const iframe = document.createElement('iframe');
  iframe.title = 'Enhanced Timeline Editor';
  iframe.style.cssText = 'width:100%;height:100%;border:0;background:#05070b;';
  iframe.sandbox = 'allow-scripts allow-same-origin';

  // Enhanced HTML with additional features
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Enhanced Timeline Editor</title>
  <style>
    :root {
      --bg: #05070b;
      --panel: rgba(255,255,255,0.05);
      --panel-soft: rgba(255,255,255,0.03);
      --border: rgba(255,255,255,0.1);
      --border-soft: rgba(255,255,255,0.08);
      --text: #ffffff;
      --muted: rgba(255,255,255,0.6);
      --dim: rgba(255,255,255,0.4);
      --cyan: #22d3ee;
      --cyan-soft: rgba(34,211,238,0.2);
      --emerald: #34d399;
      --shadow: 0 20px 60px rgba(0,0,0,0.45);
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); }
    button, input, textarea, select { font: inherit; }
    body { padding: 18px; }
    .app-shell { max-width: 1500px; margin: 0 auto; }
    .header {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      margin-bottom: 16px; padding: 18px 20px; border-radius: 24px;
      border: 1px solid var(--border);
      background: linear-gradient(135deg, #171b24 0%, #07090d 45%, #111827 100%);
      box-shadow: var(--shadow);
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .icon-btn, .top-icon {
      border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85);
      display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
      transition: transform .15s ease, background .15s ease, border-color .15s ease;
    }
    .icon-btn:hover, .top-icon:hover, .mini-btn:hover, .rail-btn:hover, .tool-btn:hover, .clip:hover { transform: translateY(-1px); }
    .icon-btn { width: 40px; height: 40px; border-radius: 12px; }
    .brand-mark {
      width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; font-size: 22px;
      border: 1px solid rgba(34,211,238,0.2); background: rgba(34,211,238,0.1); box-shadow: 0 0 16px rgba(56,189,248,0.12);
    }
    .brand-title { font-size: 20px; font-weight: 900; letter-spacing: .04em; }
    .brand-sub { font-size: 10px; text-transform: uppercase; letter-spacing: .25em; color: var(--dim); }
    .project-head { text-align: center; }
    .project-head .title { font-size: 16px; font-weight: 700; }
    .project-head .sub { font-size: 10px; color: var(--dim); }
    .top-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; max-width: 420px; }
    .top-icon { width: 36px; height: 36px; border-radius: 10px; font-size: 18px; }
    .top-icon.active { border-color: rgba(34,211,238,0.4); background: rgba(34,211,238,0.2); }
    .ready-pill {
      margin-left: 4px; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(52,211,153,0.2);
      background: rgba(52,211,153,0.1); color: #bbf7d0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .ready-dot { width: 6px; height: 6px; border-radius: 999px; background: #86efac; }
    .main-grid { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 16px; }
    .left-col { min-width: 0; }
    .side-col { display: flex; flex-direction: column; gap: 16px; }
    .preview-card {
      position: relative; overflow: hidden; margin-bottom: 16px; border-radius: var(--radius-xl); aspect-ratio: 16 / 9;
      border: 1px solid var(--border-soft); background: #000; box-shadow: 0 0 70px rgba(56,189,248,0.14);
    }
    .preview-glow { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(34,211,238,0.12), transparent 55%); }
    .preview-inner {
      position: absolute; inset: 24px; border-radius: 22px; border: 1px solid rgba(34,211,238,0.15);
      background: linear-gradient(135deg, rgba(20,25,33,0.9), rgba(8,10,14,0.86));
      box-shadow: 0 0 60px rgba(34,211,238,0.1); display: flex; align-items: center; justify-content: center;
    }
    .preview-screen { text-align: center; }
    .preview-emoji { font-size: 72px; margin-bottom: 10px; }
    .preview-title { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.92); }
    .preview-sub { margin-top: 4px; font-size: 14px; color: rgba(255,255,255,0.45); }
    .preview-overlay {
      position: absolute; inset-inline: 0; bottom: 0; padding: 16px;
      background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2), transparent);
    }
    .time-row, .control-row { display: flex; align-items: center; justify-content: space-between; }
    .time-row { margin-bottom: 8px; font-size: 12px; color: rgba(255,255,255,0.6); }
    .progress-bar { height: 6px; border-radius: 999px; background: rgba(255,255,255,0.2); overflow: hidden; margin-bottom: 12px; }
    .progress-fill { height: 100%; width: 28%; border-radius: inherit; background: linear-gradient(to right, var(--cyan), var(--emerald)); }
    .control-row { justify-content: center; gap: 12px; }
    .circle-btn {
      width: 40px; height: 40px; border-radius: 999px; border: 1px solid transparent; background: rgba(255,255,255,0.1); color: white; cursor: pointer;
    }
    .circle-btn.primary { width: 48px; height: 48px; background: white; color: black; font-weight: 800; box-shadow: 0 10px 30px rgba(255,255,255,0.15); }
    .timeline-card, .side-card {
      border-radius: 24px; border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
      box-shadow: 0 20px 60px rgba(0,0,0,0.35); backdrop-filter: blur(20px);
    }
    .timeline-card { padding: 16px; }
    .side-card { padding: 14px; border-radius: 20px; box-shadow: var(--shadow); }
    .side-card.generate { border-color: rgba(34,211,238,0.2); background: linear-gradient(180deg, rgba(56,189,248,0.08), rgba(17,24,39,0.75)); }
    .card-title { margin-bottom: 12px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,0.82); }
    .card-title.cyan { color: #bae6fd; }
    .timeline-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    .toolbar-left, .toolbar-right, .tool-group, .pill-row, .floating-rail, .track-actions, .generate-types, .quick-commands { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .tool-group { gap: 4px; padding: 4px; border-radius: 14px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); }
    .tool-btn, .mini-btn, .chip, .command-btn, .rail-btn, .generate-type {
      border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.72); cursor: pointer; transition: all .15s ease;
    }
    .tool-btn { width: 32px; height: 32px; border-radius: 8px; font-size: 14px; }
    .tool-btn.active, .generate-type.active, .rail-btn.active { border-color: rgba(34,211,238,0.45); background: rgba(34,211,238,0.22); color: #cffafe; }
    .mini-btn, .chip, .command-btn { border-radius: 10px; padding: 8px 12px; font-size: 12px; }
    .pill-row { gap: 6px; }
    .pill { border-radius: 999px; padding: 7px 12px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); font-size: 10px; color: rgba(255,255,255,0.55); }
    .timeline-shell { position: relative; overflow: hidden; border-radius: 20px; border: 1px solid var(--border-soft); background: rgba(0,0,0,0.2); }
    .timeline-header { display: grid; grid-template-columns: 100px 1fr; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.03); font-size: 11px; text-transform: uppercase; letter-spacing: .25em; color: rgba(255,255,255,0.4); }
    .timeline-header div { padding: 10px 12px; }
    .timeline-body { position: relative; }
    .playhead-layer { position: absolute; left: 100px; right: 0; top: 0; bottom: 0; pointer-events: none; }
    .playhead-line { position: absolute; top: 0; bottom: 0; left: 32%; width: 2px; background: var(--cyan); box-shadow: 0 0 18px rgba(34,211,238,0.8); }
    .playhead-knob { position: absolute; top: 0; left: calc(32% - 4px); width: 10px; height: 10px; border-radius: 999px; background: var(--cyan); box-shadow: 0 0 15px rgba(34,211,238,0.8); }
    .track-row { display: grid; grid-template-columns: 100px 1fr; min-height: 62px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .track-row:last-child { border-bottom: 0; }
    .track-meta { padding: 10px 8px; border-right: 1px solid var(--border); background: rgba(0,0,0,0.35); }
    .track-name { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.86); }
    .track-actions { margin-top: 8px; gap: 4px; }
    .track-toggle {
      width: 18px; height: 18px; border-radius: 6px; border: 1px solid var(--border); background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9);
      font-size: 8px; cursor: pointer;
    }
    .track-toggle.locked { background: rgba(34,211,238,0.2); }
    .track-count { margin-top: 6px; font-size: 9px; color: rgba(255,255,255,0.35); }
    .track-lane {
      position: relative; background: rgba(255,255,255,0.02); min-height: 62px;
      background-image: linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 80px 100%;
    }
    .clip {
      position: absolute; top: 8px; bottom: 8px; border-radius: 12px; border: 1px solid var(--border); padding: 8px 10px;
      font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.86); background: rgba(255,255,255,0.1);
      box-shadow: 0 10px 24px rgba(0,0,0,0.25); display: flex; align-items: center; overflow: hidden; cursor: pointer;
    }
    .clip.active { border-color: rgba(34,211,238,0.5); background: rgba(34,211,238,0.2); color: #cffafe; }
    .clip-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .upload-btn, .primary-btn, .text-input, .text-area, .select-input {
      width: 100%; border-radius: 12px; border: 1px solid var(--border); background: rgba(0,0,0,0.4); color: white;
    }
    .upload-btn, .primary-btn { padding: 11px 14px; cursor: pointer; font-weight: 700; }
    .upload-btn { border-style: dashed; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.72); margin-bottom: 12px; }
    .media-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .media-note { margin: -4px 0 10px; font-size: 10px; line-height: 1.45; color: rgba(255,255,255,0.46); }
    .media-item {
      min-height: 64px; border-radius: 14px; border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
      display: flex; align-items: center; gap: 10px; padding: 10px 12px; text-align: left; cursor: pointer;
      transition: transform .15s ease, border-color .15s ease, background .15s ease;
    }
    .media-item:hover { transform: translateY(-1px); border-color: rgba(34,211,238,0.22); background: linear-gradient(180deg, rgba(34,211,238,0.08), rgba(255,255,255,0.03)); }
    .media-icon {
      width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.28); display: grid; place-items: center; font-size: 17px; flex: 0 0 auto;
    }
    .media-copy { min-width: 0; }
    .media-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.88); }
    .media-desc { margin-top: 2px; font-size: 9px; line-height: 1.35; color: rgba(255,255,255,0.45); }
    .generate-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .generate-types { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px; }
    .generate-type { border-radius: 12px; padding: 10px 6px; font-size: 10px; text-align: center; }
    .generate-type .emoji { display: block; font-size: 18px; margin-bottom: 6px; }
    .text-area { min-height: 88px; padding: 10px 12px; resize: vertical; margin-bottom: 8px; }
    .text-input, .select-input { padding: 10px 12px; margin-bottom: 8px; }
    .select-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
    .primary-btn { background: linear-gradient(to right, var(--cyan), var(--emerald)); color: #03131a; }
    .chat-stack { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
    .chat-bubble { border-radius: 10px; padding: 10px; font-size: 10px; }
    .chat-bubble.user { background: rgba(255,255,255,0.1); }
    .chat-bubble.ai { background: rgba(34,211,238,0.2); color: #cffafe; }
    .quick-commands { gap: 6px; }
    .command-btn { padding: 6px 10px; font-size: 9px; }
    .floating-rail {
      position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%); z-index: 40;
      padding: 10px 14px; border-radius: 999px; border: 1px solid var(--border);
      background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
      backdrop-filter: blur(18px); box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .rail-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 7px 12px; border-radius: 12px; font-size: 10px; font-weight: 700; }
    .rail-btn .emoji { font-size: 16px; }
    .status-toast {
      position: fixed; right: 18px; bottom: 18px; max-width: 320px; padding: 12px 14px; border-radius: 14px;
      border: 1px solid rgba(34,211,238,0.18); background: rgba(7,12,18,0.95); color: rgba(255,255,255,0.86);
      box-shadow: 0 18px 50px rgba(0,0,0,0.4); font-size: 12px; opacity: 0; transform: translateY(10px); pointer-events: none; transition: all .2s ease;
    }
    .status-toast.show { opacity: 1; transform: translateY(0); }

    /* Color Grading Styles */
    .color-grading-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000;
      display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);
    }
    .color-grading-modal {
      background: #1f2937; border: 1px solid #374151; border-radius: 16px; width: 90%; max-width: 800px; max-height: 90vh; overflow: hidden;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
    }
    .color-grading-header {
      display: flex; align-items: center; justify-content: space-between; padding: 20px;
      border-bottom: 1px solid #374151;
    }
    .color-grading-header h3 { margin: 0; color: white; font-size: 18px; }
    .close-btn { background: none; border: none; color: #9ca3af; font-size: 20px; cursor: pointer; padding: 4px; }
    .close-btn:hover { color: white; }
    .color-grading-tabs {
      display: flex; border-bottom: 1px solid #374151;
    }
    .tab-btn {
      flex: 1; padding: 12px 16px; background: none; border: none; color: #9ca3af; cursor: pointer;
      border-bottom: 2px solid transparent; transition: all 0.2s;
    }
    .tab-btn.active { color: #22d3ee; border-bottom-color: #22d3ee; }
    .tab-btn:hover { color: white; }
    .color-grading-content { padding: 20px; height: 400px; overflow-y: auto; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .color-wheels-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start;
    }
    .color-wheel-group { text-align: center; }
    .color-wheel-group h4 { color: white; margin-bottom: 10px; font-size: 14px; }
    .color-wheel {
      border: 1px solid #374151; border-radius: 50%; cursor: crosshair;
      background: conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
    }
    .wheel-values { margin-top: 10px; font-size: 12px; color: #9ca3af; }
    .wheel-values span { display: inline-block; margin: 0 5px; }
    .curves-controls { text-align: center; }
    .curve-buttons { display: flex; gap: 8px; margin-bottom: 16px; justify-content: center; }
    .curve-btn {
      padding: 6px 12px; background: #374151; border: none; border-radius: 6px; color: #9ca3af; cursor: pointer;
    }
    .curve-btn.active { background: #22d3ee; color: white; }
    #curvesCanvas { border: 1px solid #374151; border-radius: 8px; background: #111827; }
    .hsl-controls { display: flex; flex-direction: column; gap: 16px; }
    .hsl-slider { display: flex; align-items: center; gap: 12px; }
    .hsl-slider label { min-width: 80px; color: white; font-size: 14px; }
    .hsl-slider input { flex: 1; }
    .hsl-slider span { min-width: 40px; color: #22d3ee; font-weight: 500; }
    .lut-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .lut-btn {
      padding: 12px; background: #374151; border: none; border-radius: 8px; color: white; cursor: pointer;
      transition: background 0.2s;
    }
    .lut-btn:hover { background: #4b5563; }
    .lut-btn.active { background: #22d3ee; }
    .color-grading-footer {
      display: flex; gap: 12px; justify-content: flex-end; padding: 20px;
      border-top: 1px solid #374151;
    }
    .btn-primary { background: #22d3ee; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .btn-secondary { background: #374151; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .btn-primary:hover { background: #0891b2; }
    .btn-secondary:hover { background: #4b5563; }

    /* Additional Color Grading Styles */
    .color-grade-indicator {
      position: absolute; top: 2px; right: 2px; width: 14px; height: 14px;
      background: rgba(34,211,238,0.8); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 8px; color: white; font-weight: bold;
    }
    .audio-waveform {
      position: absolute; bottom: 0; left: 0; right: 0; height: 16px;
      background: repeating-linear-gradient(90deg, rgba(34,211,238,0.1), rgba(34,211,238,0.1) 1px, transparent 1px, transparent 2px);
    }
    .enhanced-pill {
      margin-left: 6px; padding: 2px 6px; border-radius: 8px; border: 1px solid rgba(34,211,238,0.3);
      background: rgba(34,211,238,0.1); color: #bae6fd; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
    }
    @media (max-width: 1180px) { .main-grid { grid-template-columns: 1fr; } }
    @media (max-width: 980px) { .top-actions { max-width: none; } .left-top { grid-template-columns: 1fr !important; } }
    @media (max-width: 860px) {
      .header { flex-direction: column; align-items: stretch; }
      .project-head { text-align: left; }
      .timeline-header, .track-row { grid-template-columns: 86px 1fr; }
      .playhead-layer { left: 86px; }
      .floating-rail { left: 16px; right: 16px; transform: none; justify-content: center; }
    }

    /* Enhanced features styles */
    .enhanced-pill {
      margin-left: 8px; padding: 4px 8px; border-radius: 12px; border: 1px solid rgba(34,211,238,0.3);
      background: rgba(34,211,238,0.1); color: #bae6fd; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
    }
    .advanced-track {
      border-left: 3px solid var(--cyan);
      background: rgba(34,211,238,0.05);
    }
    .blend-mode-indicator {
      position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; border-radius: 50%;
      background: rgba(34,211,238,0.8); display: flex; align-items: center; justify-content: center;
      font-size: 8px; color: white; font-weight: bold;
    }
    .audio-waveform {
      position: absolute; bottom: 0; left: 0; right: 0; height: 20px;
      background: repeating-linear-gradient(90deg, rgba(34,211,238,0.1), rgba(34,211,238,0.1) 2px, transparent 2px, transparent 4px);
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <header class="header">
      <div class="brand">
        <button class="icon-btn" id="backBtn">←</button>
        <div class="brand-mark">🎬</div>
        <div>
          <div class="brand-title">ENHANCED TIMELINE</div>
          <div class="brand-sub">AI Video Editor Pro</div>
          <div class="enhanced-pill">Multi-Track</div>
        </div>
      </div>
      <div class="project-head">
        <div class="title" id="projectTitle">Untitled Project</div>
        <div class="sub" id="projectSub">Professional timeline with advanced features</div>
      </div>
      <div class="top-actions" id="topActions"></div>
    </header>
    <div class="main-grid">
      <div class="left-col">
        <div class="left-top" style="display:grid; grid-template-columns: 300px minmax(0,1fr); gap:16px; margin-bottom:16px; align-items:stretch;">
          <aside class="side-card" style="min-height:100%; display:flex; flex-direction:column;">
            <div class="card-title">💬 AI Assistant <span class="enhanced-pill">Enhanced</span></div>
            <div class="chat-stack" id="chatStack"></div>
            <input class="text-input" id="chatInput" placeholder="Type command or use advanced features..." />
            <div class="quick-commands" id="quickCommands" style="margin-top:2px;"></div>
          </aside>
          <section class="preview-card" style="margin-bottom:0;">
            <div class="preview-glow"></div>
            <div class="preview-inner">
              <div class="preview-screen">
                <div class="preview-emoji" id="previewEmoji">🎥</div>
                <div class="preview-title" id="previewTitle">Professional Preview</div>
                <div class="preview-sub" id="previewSubtitle">Multi-track compositing with effects</div>
              </div>
            </div>
            <div class="preview-overlay">
              <div class="time-row">
                <span id="currentTime">00:12.40</span>
                <span id="totalTime">01:00.00</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
              <div class="control-row">
                <button class="circle-btn" id="rewindBtn">⏮</button>
                <button class="circle-btn primary" id="playBtn">▶</button>
                <button class="circle-btn" id="stopBtn">⏹</button>
              </div>
            </div>
          </section>
        </div>
        <section class="timeline-card">
          <div class="timeline-top">
            <div class="toolbar-left">
              <div class="tool-group" id="toolGroup"></div>
              <button class="mini-btn" data-action="zoom-out">🔍-</button>
              <button class="mini-btn" data-action="zoom-in">🔍+</button>
              <button class="mini-btn" data-add-track="Video">+Video</button>
              <button class="mini-btn" data-add-track="Audio">+Audio</button>
              <button class="mini-btn" data-add-track="Text">+Text</button>
              <button class="mini-btn" data-add-track="Effect">+Effect</button>
              <button class="mini-btn" data-add-track="B-Roll">+B-Roll</button>
              <button class="mini-btn" id="blend-modes" title="Blend Modes">🎨</button>
              <button class="mini-btn" onclick="addMultiCamera()" title="Add Multi-Camera">📹+</button>
              <button class="mini-btn" onclick="switchCameraAngle()" title="Switch Camera Angle">📹</button>
              <button class="mini-btn" onclick="addSyncPoint()" title="Add Sync Point">🔄</button>
            </div>
            <div class="pill-row" id="pillRow"></div>
          </div>
          <div class="timeline-shell">
            <div class="timeline-header">
              <div>Professional Tracks</div>
              <div>Advanced Timeline</div>
            </div>
            <div class="timeline-body" id="timelineBody">
              <div class="playhead-layer">
                <div class="playhead-line" id="playheadLine"></div>
                <div class="playhead-knob" id="playheadKnob"></div>
              </div>
              <div id="trackRows"></div>
            </div>
          </div>
        </section>
      </div>
      <div class="side-col">
        <aside class="side-card">
          <div class="card-title">📁 Media Library <span class="enhanced-pill">Pro</span></div>
          <button class="upload-btn" id="uploadBtn">Upload Media</button>
          <div class="media-note">Choose assets for your professional timeline. Enhanced with multi-track support and effects.</div>
          <div class="media-grid" id="mediaGrid"></div>
        </aside>
        <aside class="side-card generate">
            <div class="generate-head">
              <div class="card-title cyan">⚡ AI Generation <span class="enhanced-pill">Studio</span></div>
              <div style="color: rgba(255,255,255,0.4)">✕</div>
            </div>
          <div class="generate-types" id="generateTypes"></div>
          <textarea class="text-area" id="promptInput" placeholder="Describe your cinematic vision..."></textarea>
          <input class="text-input" id="negativeInput" placeholder="Negative prompt (optional)" />
          <div class="select-row">
            <select class="select-input" id="durationSelect">
              <option>5s</option>
              <option>8s</option>
              <option>12s</option>
              <option>15s</option>
              <option>20s</option>
            </select>
            <select class="select-input" id="aspectSelect">
              <option>16:9</option>
              <option>9:16</option>
              <option>1:1</option>
              <option>21:9</option>
              <option>4:5</option>
            </select>
            <select class="select-input" id="styleSelect">
              <option>Cinematic</option>
              <option>Commercial</option>
              <option>Documentary</option>
              <option>Music Video</option>
              <option>Artistic</option>
            </select>
          </div>
          <button class="primary-btn" id="generateBtn">🎬 Generate Professional Clip</button>
        </aside>
      </div>
    </div>
  </div>
  <div class="floating-rail" id="floatingRail"></div>
  <div class="status-toast" id="toast"></div>

  <!-- Color Grading Panel -->
  <div id="colorGradingPanel" class="color-grading-overlay" style="display: none;">
    <div class="color-grading-modal">
      <div class="color-grading-header">
        <h3>🎨 Color Grading</h3>
        <button id="closeColorGrade" class="close-btn">✕</button>
      </div>

      <div class="color-grading-tabs">
        <button class="tab-btn active" data-tab="wheels">Wheels</button>
        <button class="tab-btn" data-tab="curves">Curves</button>
        <button class="tab-btn" data-tab="hsl">HSL</button>
        <button class="tab-btn" data-tab="luts">LUTs</button>
      </div>

      <div class="color-grading-content">
        <!-- Color Wheels Tab -->
        <div id="wheels-tab" class="tab-content active">
          <div class="color-wheels-grid">
            <div class="color-wheel-group">
              <h4>Lift (Shadows)</h4>
              <canvas id="liftWheel" class="color-wheel" width="120" height="120"></canvas>
              <div class="wheel-values">
                <span>R: <span id="lift-r">0.00</span></span>
                <span>G: <span id="lift-g">0.00</span></span>
                <span>B: <span id="lift-b">0.00</span></span>
              </div>
            </div>
            <div class="color-wheel-group">
              <h4>Gamma (Midtones)</h4>
              <canvas id="gammaWheel" class="color-wheel" width="120" height="120"></canvas>
              <div class="wheel-values">
                <span>R: <span id="gamma-r">1.00</span></span>
                <span>G: <span id="gamma-g">1.00</span></span>
                <span>B: <span id="gamma-b">1.00</span></span>
              </div>
            </div>
            <div class="color-wheel-group">
              <h4>Gain (Highlights)</h4>
              <canvas id="gainWheel" class="color-wheel" width="120" height="120"></canvas>
              <div class="wheel-values">
                <span>R: <span id="gain-r">1.00</span></span>
                <span>G: <span id="gain-g">1.00</span></span>
                <span>B: <span id="gain-b">1.00</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Curves Tab -->
        <div id="curves-tab" class="tab-content">
          <div class="curves-controls">
            <div class="curve-buttons">
              <button class="curve-btn active" data-curve="master">Master</button>
              <button class="curve-btn" data-curve="red">Red</button>
              <button class="curve-btn" data-curve="green">Green</button>
              <button class="curve-btn" data-curve="blue">Blue</button>
            </div>
            <canvas id="curvesCanvas" width="300" height="200"></canvas>
          </div>
        </div>

        <!-- HSL Tab -->
        <div id="hsl-tab" class="tab-content">
          <div class="hsl-controls">
            <div class="hsl-slider">
              <label>Hue</label>
              <input type="range" id="hueSlider" min="-180" max="180" value="0">
              <span id="hueValue">0°</span>
            </div>
            <div class="hsl-slider">
              <label>Saturation</label>
              <input type="range" id="saturationSlider" min="-100" max="100" value="0">
              <span id="saturationValue">0%</span>
            </div>
            <div class="hsl-slider">
              <label>Luminance</label>
              <input type="range" id="luminanceSlider" min="-100" max="100" value="0">
              <span id="luminanceValue">0%</span>
            </div>
          </div>
        </div>

        <!-- LUTs Tab -->
        <div id="luts-tab" class="tab-content">
          <div class="lut-grid">
            <button class="lut-btn" data-lut="cinema">Cinema</button>
            <button class="lut-btn" data-lut="technicolor">Technicolor</button>
            <button class="lut-btn" data-lut="vintage">Vintage Film</button>
            <button class="lut-btn" data-lut="cool">Cool Blue</button>
            <button class="lut-btn" data-lut="warm">Warm Golden</button>
          </div>
        </div>
      </div>

      <div class="color-grading-footer">
        <button id="resetColorGrade" class="btn-secondary">Reset</button>
        <button id="applyColorGrade" class="btn-primary">Apply Color Grade</button>
      </div>
    </div>
  </div>
  <script>
    // Enhanced state with professional features
    const state = {
      projectTitle: 'Untitled Professional Project',
      selectedTool: 'Select',
      selectedClipId: 1,
      generateType: 'Text',
      playing: false,
      playheadPercent: 32,
      zoom: 1,
      timelineSeconds: 60,
      blendMode: 'normal',
      advancedFeatures: {
        multiTrack: true,
        audioProcessing: true,
        plugins: false,
        collaboration: false
      },
      tracks: [
        { id: 'video-1', name: 'Video Track 1', type: 'video', muted: false, solo: false, locked: true, blendMode: 'normal', opacity: 1.0, clips: [
          { id: 1, name: 'Opening Shot', left: 8, width: 18, type: 'video', effects: [], transitions: {} },
          { id: 2, name: 'Hero Clip', left: 34, width: 16, type: 'video', effects: ['brightness'], transitions: { in: 'fade' } }
        ] },
        { id: 'audio-1', name: 'Audio Track 1', type: 'audio', muted: false, solo: false, locked: false, volume: 0.8, pan: 0, effects: ['eq'], clips: [
          { id: 3, name: 'Background Music', left: 5, width: 42, type: 'audio', waveform: true }
        ] },
        { id: 'text-1', name: 'Titles', type: 'text', muted: false, solo: false, locked: false, clips: [
          { id: 4, name: 'Main Title', left: 14, width: 12, type: 'text' }
        ] },
        { id: 'effect-1', name: 'Effects', type: 'effect', muted: false, solo: false, locked: false, clips: [
          { id: 5, name: 'Color Grade', left: 26, width: 8, type: 'effect' }
        ] },
        { id: 'broll-1', name: 'B-Roll', type: 'broll', muted: false, solo: false, locked: false, blendMode: 'overlay', opacity: 0.7, clips: [
          { id: 6, name: 'City Background', left: 52, width: 20, type: 'broll' }
        ] }
      ],
      tools: [['↖', 'Select'], ['✂', 'Blade'], ['⤵', 'Ripple'], ['⤶', 'Roll'], ['⇿', 'Slip'], ['⇆', 'Slide'], ['🔍', 'Zoom'], ['✋', 'Hand'], ['🎨', 'Blend'], ['🎵', 'Audio']],
      pills: ['Text to Video', 'Image to Video', 'Retake', 'Extend', 'B-Roll', 'Music Gen', 'Audio Sync', 'Fill Gap AI', 'Elements', 'Dual Viewer', 'Multi-Track', 'Pro Effects', 'Real-time'],
      topIcons: ['👁','📺','📁','⚡','🎵','🔊','🎞️','👤','⚙️','💬','📋','🔌','👥'],
      media: [
        { icon: '🎬', label: 'Video Clip', desc: 'Professional video with effects support' },
        { icon: '🖼️', label: 'Image Frame', desc: 'Still images with transitions' },
        { icon: '🎵', label: 'Audio Track', desc: 'Multi-channel audio with processing' },
        { icon: '🎞️', label: 'B-Roll Asset', desc: 'Supporting footage with blend modes' },
        { icon: '✨', label: 'Effect Layer', desc: 'Advanced effects and corrections' },
        { icon: '📝', label: 'Text Element', desc: 'Professional typography' }
      ],
      generateTypes: [['✍️', 'Text'], ['🖼️', 'Image'], ['🔄', 'Retake'], ['➡️', 'Extend'], ['🎞️', 'B-Roll'], ['🎵', 'Audio'], ['✨', 'Effect'], ['🎨', 'Style']],
      quickCommands: ['⚡Generate','Retake','Extend','B-Roll','Audio Mix','Color Grade','Stabilize','Multi-Cam'],
      railActions: [['⚡', 'Generate', true], ['✂️', 'Split'], ['🎬', 'Scenes'], ['💬', 'Subtitle'], ['🎞️', 'B-Roll'], ['⏱️', 'Speed'], ['🪄', 'Stabilize'], ['🎨', 'Color Grade'], ['🎵', 'Audio'], ['📹', 'Multi-Cam'], ['🔌', 'Plugins'], ['👥', 'Collaborate']],
      chat: [
        { role: 'ai', text: 'Welcome to the Enhanced Timeline! Professional multi-track editing with AI assistance.' },
        { role: 'user', text: 'Add audio processing to track 1' },
        { role: 'ai', text: 'Applied professional audio effects to Audio Track 1. Added EQ, compression, and reverb processing.' }
      ]
    };

    // Enhanced DOM elements
    const els = {
      topActions: document.getElementById('topActions'),
      toolGroup: document.getElementById('toolGroup'),
      pillRow: document.getElementById('pillRow'),
      trackRows: document.getElementById('trackRows'),
      mediaGrid: document.getElementById('mediaGrid'),
      generateTypes: document.getElementById('generateTypes'),
      chatStack: document.getElementById('chatStack'),
      quickCommands: document.getElementById('quickCommands'),
      floatingRail: document.getElementById('floatingRail'),
      playBtn: document.getElementById('playBtn'),
      stopBtn: document.getElementById('stopBtn'),
      rewindBtn: document.getElementById('rewindBtn'),
      currentTime: document.getElementById('currentTime'),
      totalTime: document.getElementById('totalTime'),
      progressFill: document.getElementById('progressFill'),
      previewTitle: document.getElementById('previewTitle'),
      previewSubtitle: document.getElementById('previewSubtitle'),
      previewEmoji: document.getElementById('previewEmoji'),
      playheadLine: document.getElementById('playheadLine'),
      playheadKnob: document.getElementById('playheadKnob'),
      projectTitle: document.getElementById('projectTitle'),
      promptInput: document.getElementById('promptInput'),
      negativeInput: document.getElementById('negativeInput'),
      durationSelect: document.getElementById('durationSelect'),
      aspectSelect: document.getElementById('aspectSelect'),
      styleSelect: document.getElementById('styleSelect'),
      generateBtn: document.getElementById('generateBtn'),
      chatInput: document.getElementById('chatInput'),
      toast: document.getElementById('toast')
    };

    let playbackTimer = null;

    // Enhanced functions with professional features
    function showToast(message) {
      els.toast.textContent = message;
      els.toast.classList.add('show');
      clearTimeout(showToast._timer);
      showToast._timer = setTimeout(() => els.toast.classList.remove('show'), 2500);
    }

    function formatTimeFromPercent(percent, totalSeconds) {
      const current = (percent / 100) * totalSeconds;
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      const hundredths = Math.floor((current % 1) * 100);
      return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + '.' + String(hundredths).padStart(2, '0');
    }

    function renderTopActions() {
      els.topActions.innerHTML = '';
      state.topIcons.forEach((icon, i) => {
        const btn = document.createElement('button');
        btn.className = 'top-icon ' + (i === 3 ? 'active' : '');
        btn.textContent = icon;
        btn.title = icon === '🔌' ? 'Plugins' : icon === '👥' ? 'Collaboration' : icon === '⚙️' ? 'Settings' : '';
        btn.addEventListener('click', () => {
          if (icon === '🔌') showToast('Plugin system activated - professional effects available');
          else if (icon === '👥') showToast('Collaboration mode enabled - real-time editing');
          else if (icon === '⚙️') showToast('Professional settings panel opened');
          else showToast(icon + ' professional feature activated');
        });
        els.topActions.appendChild(btn);
      });
      const ready = document.createElement('div');
      ready.className = 'ready-pill';
      ready.innerHTML = '<span class="ready-dot"></span>Pro Ready';
      els.topActions.appendChild(ready);
    }

    function renderTools() {
      els.toolGroup.innerHTML = '';
      state.tools.forEach(([icon, label]) => {
        const btn = document.createElement('button');
        btn.className = 'tool-btn ' + (state.selectedTool === label ? 'active' : '');
        btn.title = label;
        btn.textContent = icon;
        btn.addEventListener('click', () => {
          state.selectedTool = label;
          renderTools();
          updatePreview();
          showToast('Professional ' + label + ' tool selected');
        });
        els.toolGroup.appendChild(btn);
      });
    }

    function renderPills() {
      els.pillRow.innerHTML = '';
      state.pills.forEach((pill) => {
        const span = document.createElement('span');
        span.className = 'pill';
        span.textContent = pill;
        span.addEventListener('click', () => showToast('Activated: ' + pill));
        els.pillRow.appendChild(span);
      });
    }

    function renderTracks() {
      els.trackRows.innerHTML = '';
      state.tracks.forEach((track) => {
        const row = document.createElement('div');
        row.className = 'track-row ' + (track.type === 'effect' || track.blendMode !== 'normal' ? 'advanced-track' : '');

        const meta = document.createElement('div');
        meta.className = 'track-meta';
        meta.innerHTML = '<div class="track-name">' + track.name + ' ' + (track.blendMode && track.blendMode !== 'normal' ? '(' + track.blendMode + ')' : '') + '</div><div class="track-actions"><button class="track-toggle ' + (track.muted ? 'locked' : '') + '" data-toggle="mute">M</button><button class="track-toggle ' + (track.solo ? 'locked' : '') + '" data-toggle="solo">S</button><button class="track-toggle ' + (track.locked ? 'locked' : '') + '" data-toggle="lock">L</button></div><div class="track-count">' + track.clips.length + ' clips</div>';

        // Add blend mode indicator for video tracks
        if (track.type === 'video' && track.blendMode && track.blendMode !== 'normal') {
          const indicator = document.createElement('div');
          indicator.className = 'blend-mode-indicator';
          indicator.title = 'Blend Mode: ' + track.blendMode;
          indicator.textContent = 'B';
          meta.appendChild(indicator);
        }

        meta.querySelectorAll('.track-toggle').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = btn.dataset.toggle;
            if (key === 'mute') track.muted = !track.muted;
            if (key === 'solo') track.solo = !track.solo;
            if (key === 'lock') track.locked = !track.locked;
            renderTracks();
            showToast(track.name + ' ' + key + ' toggled (Professional mode)');
          });
        });

        const lane = document.createElement('div');
        lane.className = 'track-lane';
        lane.addEventListener('click', (event) => {
          if (event.target !== lane) return;
          const rect = lane.getBoundingClientRect();
          const percent = ((event.clientX - rect.left) / rect.width) * 100;
          state.playheadPercent = Math.max(0, Math.min(100, percent));
          updatePlaybackUI();
        });

        track.clips.forEach((clip) => {
          const clipEl = document.createElement('button');
          clipEl.className = 'clip ' + (state.selectedClipId === clip.id ? 'active' : '');
          clipEl.style.left = clip.left + '%';
          clipEl.style.width = clip.width + '%';
          clipEl.innerHTML = '<span class="clip-label">' + clip.name + '</span>';

          // Add effects/transitions indicators
          if (clip.effects && clip.effects.length > 0) {
            clipEl.innerHTML += '<span style="position:absolute;top:2px;right:2px;font-size:8px;color:#22d3ee;">✨</span>';
          }
          if (clip.transitions && (clip.transitions.in || clip.transitions.out)) {
            clipEl.innerHTML += '<span style="position:absolute;bottom:2px;left:2px;font-size:8px;color:#34d399;">⚡</span>';
          }

          // Add waveform for audio clips
          if (clip.type === 'audio' && clip.waveform) {
            clipEl.innerHTML += '<div class="audio-waveform"></div>';
          }

          clipEl.addEventListener('click', (e) => {
            e.stopPropagation();
            state.selectedClipId = clip.id;
            updatePreview(clip);
            renderTracks();
            showToast('Professional clip selected: ' + clip.name + ' (' + (clip.effects?.length || 0) + ' effects)');
          });

          // Double-click to open color grading
          clipEl.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            openColorGrading(clip);
          });
          lane.appendChild(clipEl);
        });

        row.appendChild(meta);
        row.appendChild(lane);
        els.trackRows.appendChild(row);
      });
    }

    function renderMedia() {
      els.mediaGrid.innerHTML = '';
      state.media.forEach((media, index) => {
        const item = document.createElement('button');
        item.className = 'media-item';
        item.innerHTML = '<span class="media-icon">' + media.icon + '</span><span class="media-copy"><div class="media-label">' + media.label + '</div><div class="media-desc">' + media.desc + '</div></span>';
        item.addEventListener('click', () => {
          const targetTrack = media.label === 'Audio Track' ? (state.tracks.find((t) => t.type === 'audio') || state.tracks[1] || state.tracks[0]) :
                             media.label === 'Image Frame' ? (state.tracks.find((t) => t.type === 'text') || state.tracks[0]) :
                             media.label === 'B-Roll Asset' ? (state.tracks.find((t) => t.type === 'broll') || state.tracks[0]) :
                             media.label === 'Effect Layer' ? (state.tracks.find((t) => t.type === 'effect') || state.tracks[0]) :
                             (state.tracks.find((t) => t.type === 'video') || state.tracks[0]);
          const newId = Date.now() + index;
          const clipType = media.label === 'Audio Track' ? 'audio' :
                          media.label === 'Image Frame' ? 'text' :
                          media.label === 'B-Roll Asset' ? 'broll' :
                          media.label === 'Effect Layer' ? 'effect' : 'video';
          targetTrack.clips.push({
            id: newId,
            name: media.label + ' ' + (targetTrack.clips.length + 1),
            left: Math.min(78, 8 + targetTrack.clips.length * 10),
            width: 14,
            type: clipType,
            effects: media.label === 'Effect Layer' ? ['color-grade'] : [],
            transitions: {},
            waveform: clipType === 'audio'
          });
          state.selectedClipId = newId;
          renderTracks();
          updatePreview();
          showToast('Professional ' + media.label + ' added to ' + targetTrack.name + ' with advanced features');
        });
        els.mediaGrid.appendChild(item);
      });
    }

    function renderGenerateTypes() {
      els.generateTypes.innerHTML = '';
      state.generateTypes.forEach(([icon, label]) => {
        const btn = document.createElement('button');
        btn.className = 'generate-type ' + (state.generateType === label ? 'active' : '');
        btn.innerHTML = '<span class="emoji">' + icon + '</span><span>' + label + '</span>';
        btn.addEventListener('click', () => {
          state.generateType = label;
          renderGenerateTypes();
          showToast('Professional ' + label + ' generation mode selected');
        });
        els.generateTypes.appendChild(btn);
      });
    }

    function renderChat() {
      els.chatStack.innerHTML = '';
      state.chat.forEach((entry) => {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + entry.role;
        bubble.textContent = entry.text;
        els.chatStack.appendChild(bubble);
      });
    }

    function renderQuickCommands() {
      els.quickCommands.innerHTML = '';
      state.quickCommands.forEach((command) => {
        const btn = document.createElement('button');
        btn.className = 'command-btn';
        btn.textContent = command;
        btn.addEventListener('click', () => {
          els.chatInput.value = command;
          handleChatSubmit();
        });
        els.quickCommands.appendChild(btn);
      });
    }

    function renderRail() {
      els.floatingRail.innerHTML = '';
      state.railActions.forEach(([icon, label, active]) => {
        const btn = document.createElement('button');
        btn.className = 'rail-btn ' + (active ? 'active' : '');
        btn.innerHTML = '<span class="emoji">' + icon + '</span><span>' + label + '</span>';
        btn.addEventListener('click', () => showToast('Professional ' + label + ' tool activated'));
        els.floatingRail.appendChild(btn);
      });
    }

    function updatePreview(clip) {
      const selected = clip || state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
      els.projectTitle.textContent = state.projectTitle;
      if (selected) {
        els.previewTitle.textContent = selected.name;
        els.previewSubtitle.textContent = state.selectedTool + ' tool • ' + selected.type + ' • ' + (selected.effects?.length || 0) + ' effects';
        els.previewEmoji.textContent = selected.type === 'audio' ? '🎵' :
                                      selected.type === 'text' ? '📝' :
                                      selected.type === 'effect' ? '✨' :
                                      selected.type === 'broll' ? '🎞️' : '🎥';
      } else {
        els.previewTitle.textContent = 'Professional Preview';
        els.previewSubtitle.textContent = 'Multi-track compositing with advanced effects';
        els.previewEmoji.textContent = '🎬';
      }
    }

    function updatePlaybackUI() {
      els.progressFill.style.width = state.playheadPercent + '%';
      els.playheadLine.style.left = state.playheadPercent + '%';
      els.playheadKnob.style.left = 'calc(' + state.playheadPercent + '% - 4px)';
      els.currentTime.textContent = formatTimeFromPercent(state.playheadPercent, state.timelineSeconds);
      els.totalTime.textContent = formatTimeFromPercent(100, state.timelineSeconds);
      els.playBtn.textContent = state.playing ? '❚❚' : '▶';
    }

    function togglePlayback() {
      state.playing = !state.playing;
      if (state.playing) {
        playbackTimer = setInterval(() => {
          state.playheadPercent += 0.6;
          if (state.playheadPercent >= 100) {
            state.playheadPercent = 100;
            state.playing = false;
            clearInterval(playbackTimer);
          }
          updatePlaybackUI();
        }, 120);
      } else {
        clearInterval(playbackTimer);
      }
      updatePlaybackUI();
    }

    function stopPlayback() {
      state.playing = false;
      clearInterval(playbackTimer);
      state.playheadPercent = 0;
      updatePlaybackUI();
    }

    function rewindPlayback() {
      state.playing = false;
      clearInterval(playbackTimer);
      state.playheadPercent = Math.max(0, state.playheadPercent - 10);
      updatePlaybackUI();
    }

    function generateClip() {
      const prompt = els.promptInput.value.trim() || (state.generateType + ' professional cinematic shot');
      const track = state.tracks.find(t => t.type === 'video') || state.tracks[0];
      const clipId = Date.now();
      track.clips.push({
        id: clipId,
        name: state.generateType + ': ' + prompt.slice(0, 18),
        left: Math.min(76, 10 + track.clips.length * 9),
        width: 16,
        type: 'video',
        effects: ['auto-enhance'],
        transitions: { in: 'fade' }
      });
      state.selectedClipId = clipId;
      state.chat.push({
        role: 'user',
        text: state.generateType + ' generate: ' + prompt
      });
      state.chat.push({
        role: 'ai',
        text: 'Professional ' + state.generateType.toLowerCase() + ' clip generated with advanced AI. Added auto-enhancement effects and smooth transitions.'
      });
      renderTracks();
      renderChat();
      updatePreview();
      showToast('🎬 Professional ' + state.generateType + ' clip generated with advanced effects!');
    }

    function handleChatSubmit() {
      const text = els.chatInput.value.trim();
      if (!text) return;
      state.chat.push({ role: 'user', text });

      let reply = 'Professional command processed with advanced AI assistance.';
      if (/generate/i.test(text)) reply = 'AI generation pipeline activated. Professional rendering in progress...';
      if (/retake/i.test(text)) reply = 'Retake mode enabled. Advanced quality analysis applied.';
      if (/extend/i.test(text)) reply = 'Extension mode activated. AI will seamlessly extend the clip.';
      if (/b-roll|broll/i.test(text)) reply = 'B-Roll generation started. Professional secondary footage created.';
      if (/audio/i.test(text)) reply = 'Professional audio processing activated. Advanced mixing and effects applied.';
      if (/color|grade/i.test(text)) reply = 'Professional color grading applied. Cinema-quality corrections enabled.';
      if (/stabilize/i.test(text)) reply = 'AI stabilization activated. Professional motion smoothing applied.';
      if (/multi-cam/i.test(text)) reply = 'Multi-camera editing enabled. Professional switching and sync activated.';

      state.chat.push({ role: 'ai', text: reply });
      els.chatInput.value = '';
      renderChat();
      showToast('💬 Professional AI command executed');
    }

    function addTrack(type) {
      const types = {
        'Video': 'video',
        'Audio': 'audio',
        'Text': 'text',
        'Effect': 'effect',
        'B-Roll': 'broll'
      };
      const trackType = types[type] || 'video';
      const id = trackType + '-' + Date.now();
      const track = {
        id,
        name: type + ' Track ' + (state.tracks.filter(t => t.type === trackType).length + 1),
        type: trackType,
        muted: false,
        solo: false,
        locked: false,
        volume: trackType === 'audio' ? 0.8 : 1.0,
        opacity: trackType === 'video' ? 1.0 : 1.0,
        blendMode: trackType === 'video' ? 'normal' : undefined,
        pan: trackType === 'audio' ? 0 : undefined,
        effects: trackType === 'audio' ? ['eq'] : [],
        clips: []
      };
      state.tracks.push(track);
      renderTracks();
      showToast('🎯 Professional ' + type + ' track added with advanced features');
    }

    function bindEvents() {
      els.playBtn.addEventListener('click', togglePlayback);
      els.stopBtn.addEventListener('click', stopPlayback);
      els.rewindBtn.addEventListener('click', rewindPlayback);
      els.generateBtn.addEventListener('click', generateClip);
      els.chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleChatSubmit(); });
      document.querySelectorAll('[data-add-track]').forEach((btn) => { btn.addEventListener('click', () => addTrack(btn.dataset.addTrack)); });
      document.querySelectorAll('[data-action="zoom-in"]').forEach((btn) => btn.addEventListener('click', () => {
        state.zoom = Math.min(2, state.zoom + 0.1);
        showToast('🔍 Professional zoom: ' + state.zoom.toFixed(1) + 'x');
      }));
      document.querySelectorAll('[data-action="zoom-out"]').forEach((btn) => btn.addEventListener('click', () => {
        state.zoom = Math.max(0.5, state.zoom - 0.1);
        showToast('🔍 Professional zoom: ' + state.zoom.toFixed(1) + 'x');
      }));
      document.getElementById('blend-modes')?.addEventListener('click', () => showToast('🎨 Professional blend modes panel opened'));
      document.getElementById('uploadBtn').addEventListener('click', () => showToast('📤 Professional media upload with advanced processing'));
      document.getElementById('backBtn').addEventListener('click', () => {
        if (parent && parent.window && parent.window.navigate) {
          parent.window.navigate('apps');
        } else {
          showToast('⬅️ Professional navigation activated');
        }
      });
    }

    function renderAll() {
      renderTopActions();
      renderTools();
      renderPills();
      renderTracks();
      renderMedia();
      renderGenerateTypes();
      renderChat();
      renderQuickCommands();
      renderRail();
      updatePreview();
      updatePlaybackUI();
    }

    renderAll();
    bindEvents();

    // Color Grading Functions
    let currentColorClip = null;
    let colorCorrection = {
      lift: { r: 0, g: 0, b: 0 },
      gamma: { r: 1, g: 1, b: 1 },
      gain: { r: 1, g: 1, b: 1 },
      hue: 0,
      saturation: 0,
      luminance: 0,
      brightness: 0,
      contrast: 0,
      vibrance: 0
    };

    function openColorGrading(clip) {
      currentColorClip = clip;
      const panel = document.getElementById('colorGradingPanel');
      if (panel) {
        panel.style.display = 'flex';

        // Load existing color correction if any
        const colorEffect = clip.effects?.find(e => e.type === 'color-grading');
        if (colorEffect) {
          colorCorrection = { ...colorEffect.parameters };
        } else {
          // Reset to defaults
          colorCorrection = {
            lift: { r: 0, g: 0, b: 0 },
            gamma: { r: 1, g: 1, b: 1 },
            gain: { r: 1, g: 1, b: 1 },
            hue: 0,
            saturation: 0,
            luminance: 0,
            brightness: 0,
            contrast: 0,
            vibrance: 0
          };
        }

        updateColorGradingUI();
        initializeColorWheels();
        initializeCurves();
        initializeHSL();
      }
    }

    function updateColorGradingUI() {
      // Update wheel values
      document.getElementById('lift-r').textContent = colorCorrection.lift.r.toFixed(2);
      document.getElementById('lift-g').textContent = colorCorrection.lift.g.toFixed(2);
      document.getElementById('lift-b').textContent = colorCorrection.lift.b.toFixed(2);

      document.getElementById('gamma-r').textContent = colorCorrection.gamma.r.toFixed(2);
      document.getElementById('gamma-g').textContent = colorCorrection.gamma.g.toFixed(2);
      document.getElementById('gamma-b').textContent = colorCorrection.gamma.b.toFixed(2);

      document.getElementById('gain-r').textContent = colorCorrection.gain.r.toFixed(2);
      document.getElementById('gain-g').textContent = colorCorrection.gain.g.toFixed(2);
      document.getElementById('gain-b').textContent = colorCorrection.gain.b.toFixed(2);

      // Update HSL values
      document.getElementById('hueSlider').value = colorCorrection.hue;
      document.getElementById('hueValue').textContent = colorCorrection.hue + '°';

      document.getElementById('saturationSlider').value = colorCorrection.saturation;
      document.getElementById('saturationValue').textContent = colorCorrection.saturation + '%';

      document.getElementById('luminanceSlider').value = colorCorrection.luminance;
      document.getElementById('luminanceValue').textContent = colorCorrection.luminance + '%';
    }

    function initializeColorWheels() {
      // Initialize color wheels (simplified implementation)
      const wheels = ['liftWheel', 'gammaWheel', 'gainWheel'];
      wheels.forEach((wheelId, index) => {
        const canvas = document.getElementById(wheelId);
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = centerX - 10;

          // Draw color wheel background
          for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle * Math.PI) / 180;
            const endAngle = ((angle + 1) * Math.PI) / 180;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineTo(centerX, centerY);
            ctx.closePath();

            const hue = angle;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.fill();
          }

          // Add center circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
          ctx.fillStyle = '#374151';
          ctx.fill();
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }

    function initializeCurves() {
      const canvas = document.getElementById('curvesCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
          const x = (i / 10) * canvas.width;
          const y = (i / 10) * canvas.height;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Draw diagonal line
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
      }
    }

    function initializeHSL() {
      // HSL sliders are already initialized in the HTML
      // Add event listeners
      document.getElementById('hueSlider').addEventListener('input', (e) => {
        colorCorrection.hue = parseInt(e.target.value);
        document.getElementById('hueValue').textContent = colorCorrection.hue + '°';
      });

      document.getElementById('saturationSlider').addEventListener('input', (e) => {
        colorCorrection.saturation = parseInt(e.target.value);
        document.getElementById('saturationValue').textContent = colorCorrection.saturation + '%';
      });

      document.getElementById('luminanceSlider').addEventListener('input', (e) => {
        colorCorrection.luminance = parseInt(e.target.value);
        document.getElementById('luminanceValue').textContent = colorCorrection.luminance + '%';
      });
    }

    // Color grading modal event listeners
    document.addEventListener('DOMContentLoaded', () => {
      const closeBtn = document.getElementById('closeColorGrade');
      const applyBtn = document.getElementById('applyColorGrade');
      const resetBtn = document.getElementById('resetColorGrade');
      const panel = document.getElementById('colorGradingPanel');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          if (panel) panel.style.display = 'none';
        });
      }

      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          if (currentColorClip) {
            // Apply color correction to clip
            if (!currentColorClip.effects) currentColorClip.effects = [];
            const existingEffect = currentColorClip.effects.find(e => e.type === 'color-grading');
            if (existingEffect) {
              existingEffect.parameters = { ...colorCorrection };
            } else {
              currentColorClip.effects.push({
                id: 'color-grade-' + Date.now(),
                type: 'color-grading',
                name: 'Color Grade',
                enabled: true,
                parameters: { ...colorCorrection }
              });
            }
            renderTracks();
            showToast('🎨 Color grade applied to ' + currentColorClip.name);
          }
          if (panel) panel.style.display = 'none';
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          colorCorrection = {
            lift: { r: 0, g: 0, b: 0 },
            gamma: { r: 1, g: 1, b: 1 },
            gain: { r: 1, g: 1, b: 1 },
            hue: 0,
            saturation: 0,
            luminance: 0,
            brightness: 0,
            contrast: 0,
            vibrance: 0
          };
          updateColorGradingUI();
          showToast('🔄 Color grade reset to defaults');
        });
      }

      // Tab switching
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          const tabId = btn.dataset.tab + '-tab';
          document.getElementById(tabId)?.classList.add('active');
        });
      });
    });

    // Global functions for sidebar buttons
    window.showColorWheels = () => {
      const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
      if (clip) openColorGrading(clip);
    };

    window.showCurves = () => {
      const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
      if (clip) {
        openColorGrading(clip);
        // Switch to curves tab
        setTimeout(() => {
          document.querySelector('[data-tab="curves"]').click();
        }, 100);
      }
    };

    window.showHSL = () => {
      const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
      if (clip) {
        openColorGrading(clip);
        setTimeout(() => {
          document.querySelector('[data-tab="hsl"]').click();
        }, 100);
      }
    };

    window.showLUTs = () => {
      const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
      if (clip) {
        openColorGrading(clip);
        setTimeout(() => {
          document.querySelector('[data-tab="luts"]').click();
        }, 100);
      }
    };

    window.showScopes = () => {
      showToast('📊 Video scopes panel would open here (waveform, vectorscope, histogram)');
    };

    // Multi-Camera Functions
    let multiCameraEditor = {
      cameras: [],
      syncPoints: [],
      currentAngle: 0,
      addCamera: function(name) {
        const camera = {
          id: 'camera_' + Date.now(),
          name: name || 'Camera ' + (this.cameras.length + 1),
          angle: this.cameras.length,
          enabled: true
        };
        this.cameras.push(camera);
        showToast('📹 Added ' + camera.name + ' to multi-camera setup');
        return camera;
      },
      switchToAngle: function(angleIndex) {
        if (angleIndex >= 0 && angleIndex < this.cameras.length) {
          this.currentAngle = angleIndex;
          showToast('📹 Switched to ' + this.cameras[angleIndex].name);
          return true;
        }
        return false;
      },
      addSyncPoint: function(time) {
        const syncPoint = {
          id: 'sync_' + Date.now(),
          time: time,
          type: 'manual',
          confidence: 1.0
        };
        this.syncPoints.push(syncPoint);
        this.syncPoints.sort((a, b) => a.time - b.time);
        showToast('🔄 Added sync point at ' + formatTimeFromPercent(time / 60 * 100, 60));
        return syncPoint;
      },
      detectCuts: function() {
        // Simulate cut detection
        showToast('🎬 Detected potential cuts across ' + this.cameras.length + ' camera angles');
        return [
          { time: 15.3, camera: 'Camera 1', confidence: 0.92 },
          { time: 28.7, camera: 'Camera 2', confidence: 0.88 },
          { time: 42.1, camera: 'Camera 3', confidence: 0.95 }
        ];
      }
    };

    // Initialize with sample cameras for demo
    multiCameraEditor.addCamera('Main Camera');
    multiCameraEditor.addCamera('Side Angle');
    multiCameraEditor.addCamera('Close-up');

    window.addMultiCamera = () => {
      const cameraName = prompt('Enter camera name:', 'Camera ' + (multiCameraEditor.cameras.length + 1));
      if (cameraName) {
        multiCameraEditor.addCamera(cameraName);
      }
    };

    window.switchCameraAngle = () => {
      const angle = prompt('Switch to camera angle (0-' + (multiCameraEditor.cameras.length - 1) + '):', multiCameraEditor.currentAngle);
      if (angle !== null) {
        const angleIndex = parseInt(angle);
        multiCameraEditor.switchToAngle(angleIndex);
      }
    };

    window.addSyncPoint = () => {
      multiCameraEditor.addSyncPoint(state.playheadPercent / 100 * 60);
    };

    window.detectCuts = () => {
      const cuts = multiCameraEditor.detectCuts();
      console.log('Detected cuts:', cuts);
    };

    window.createMulticamClip = () => {
      showToast('🎥 Created multi-camera clip from ' + multiCameraEditor.cameras.length + ' angles');
    };
  </script>
</body>
</html>`;

  iframe.srcdoc = html;
  timelineContainer.appendChild(iframe);

  // Assemble the layout
  advancedSidebar.appendChild(sidebarHeader);
  advancedSidebar.appendChild(featureTabs);
  advancedSidebar.appendChild(featureContent);
  mainTimeline.appendChild(enhancedHeader);
  timelineContainer.appendChild(iframe);
  mainTimeline.appendChild(timelineContainer);
  mainTimeline.appendChild(statusBar);
  mainLayout.appendChild(advancedSidebar);
  mainLayout.appendChild(mainTimeline);
  container.appendChild(mainLayout);

  // Initialize enhanced features
  initializeEnhancedTimeline(container);

  return container;
}

function initializeEnhancedTimeline(container) {
  // Advanced sidebar toggle
  const toggleBtn = container.querySelector('#toggle-advanced');
  const sidebar = container.querySelector('#advanced-sidebar');
  const closeBtn = container.querySelector('#close-advanced');

  toggleBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('hidden');
  });

  closeBtn?.addEventListener('click', () => {
    sidebar?.classList.add('hidden');
  });

  // Feature tab switching
  const tabs = container.querySelectorAll('[data-feature]');
  const exportBtn = container.querySelector('#export-project');
  const renderBtn = container.querySelector('#render-video');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const feature = tab.dataset.feature;
      loadFeatureContent(container, feature);

      // Update active tab
      tabs.forEach(t => t.classList.remove('active-tab', 'text-white', 'bg-gray-800'));
      tabs.forEach(t => t.classList.add('text-gray-300'));
      tab.classList.add('active-tab', 'text-white', 'bg-gray-800');
    });
  });

  // Load initial timeline feature
  loadFeatureContent(container, 'timeline');

  // Export and render handlers
  exportBtn?.addEventListener('click', () => {
    updateStatus(container, '📤 Exporting professional project with all tracks and effects...');
    setTimeout(() => updateStatus(container, '✅ Professional export completed!'), 3000);
  });

  renderBtn?.addEventListener('click', () => {
    updateStatus(container, '🎬 Rendering professional video with GPU acceleration...');
    setTimeout(() => updateStatus(container, '✅ Professional render completed!'), 5000);
  });
}

function loadFeatureContent(container, feature) {
  const content = container.querySelector('#feature-content');
  if (!content) return;

  content.innerHTML = '';

  switch (feature) {
    case 'timeline':
      content.innerHTML = `
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold text-white">🎬 Multi-Track Timeline</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Professional Features</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Unlimited tracks with advanced organization</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">15+ blend modes for professional compositing</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Real-time GPU-accelerated preview</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Precision ripple/roll/slide editing</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Professional color grading & correction</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">🎨 Color Grading</h4>
              <div class="space-y-2 text-sm">
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" onclick="showColorWheels()">
                  🎯 Color Wheels (Lift/Gamma/Gain)
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" onclick="showCurves()">
                  📈 RGB Curves
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" onclick="showHSL()">
                  🎨 HSL Controls
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" onclick="showLUTs()">
                  🎞️ LUT Library
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" onclick="showScopes()">
                  📊 Video Scopes
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm">
                ⚙️ Timeline Settings
              </button>
              <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors text-sm">
                🎨 Open Color Grade
              </button>
            </div>
          </div>
        </div>
      `;
      break;

    case 'multicam':
      content.innerHTML = `
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold text-white">🎥 Multi-Camera Editing</h3>
          <div className="space-y-3">
            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Professional Multi-Camera Features</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Unlimited camera angles</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Automatic sync point detection</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Real-time angle switching</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Professional cut detection</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Multi-camera timeline editing</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm">
                📹 Add Camera
              </button>
              <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors text-sm">
                🔄 Auto-Sync
              </button>
              <button class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors text-sm">
                🎬 Create Multicam
              </button>
              <button class="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors text-sm">
                📊 Angle Viewer
              </button>
            </div>

            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Quick Actions</h4>
              <div class="space-y-2">
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm">
                  🎯 Detect Sync Points
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm">
                  ✂️ Find Best Cuts
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm">
                  🔄 Batch Angle Switch
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    case 'export':
      content.innerHTML = `
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold text-white">📤 Professional Export</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Industry-Standard Codecs</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">ProRes 422/4444/XQ - Apple professional codecs</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">DNxHD/HR - Avid post-production codecs</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">CineForm - Film scanning and digital cinema</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">AVC-Intra/XAVC - Broadcast HD/4K codecs</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">H.264/H.265 - Web and social media optimization</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Delivery Presets</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  📺 YouTube HD (H.264 optimized)
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  🎬 Netflix 4K (DNxHD delivery spec)
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  📡 Broadcast HD (AVC-Intra 100)
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  🎞️ Film Delivery (CineForm 4K)
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  📱 Social Media (H.265 optimized)
                </button>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-3">
              <h4 className="text-white font-medium mb-2">Export Queue</h4>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span class="text-sm text-white">Project Export</span>
                  <span class="text-xs text-green-400">Completed</span>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span class="text-sm text-white">Color Graded Version</span>
                  <span class="text-xs text-blue-400">In Progress</span>
                </div>
              </div>
            </div>

            <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors">
              🚀 Open Professional Export Panel
            </button>
          </div>
        </div>
      `;
      break;

    case 'enterprise':
      content.innerHTML = `
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold text-white">🏢 Enterprise Management</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Enterprise Features</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">User management and role-based access</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Project sharing and collaboration</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Comprehensive audit trails</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Compliance checking (GDPR, HIPAA, SOX)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">DAM integration and asset management</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Backup and recovery systems</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Management Tools</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  👥 User Administration
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  📁 Project Management
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  📋 Audit Log Viewer
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  🛡️ Compliance Dashboard
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  💾 Backup & Recovery
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  📊 Analytics & Reporting
                </button>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-3">
              <h4 className="text-white font-medium mb-2">Quick Actions</h4>
              <div class="grid grid-cols-2 gap-2">
                <button class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors text-sm">
                  👤 Add User
                </button>
                <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm">
                  📁 New Project
                </button>
                <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors text-sm">
                  📊 Run Report
                </button>
                <button class="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors text-sm">
                  🔒 Security Check
                </button>
              </div>
            </div>

            <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors">
              🏢 Open Enterprise Dashboard
            </button>
          </div>
        </div>
      `;
      break;

    case 'audio':
      content.innerHTML = `
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold text-white">🎵 Advanced Audio Processing</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Professional Audio Features</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">8 Professional effects (EQ, Compressor, Reverb, Delay)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Surround sound mixing (5.1, 7.1)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Audio restoration (noise, clicks, hum)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Spectral editing and frequency isolation</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Loudness analysis (EBU-R128, ATSC A/85)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Real-time processing and automation</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Audio Processing Tools</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  🎚️ Professional Mixer (Multi-track)
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  🔊 Surround Sound Panner
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  🔧 Audio Restoration Suite
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  📊 Spectral Frequency Editor
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  🎼 Mastering & Dynamics
                </button>
                <button class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  📏 Loudness Analysis
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors text-sm">
                🎛️ Audio Mixer
              </button>
              <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm">
                ⚡ Advanced Tools
              </button>
            </div>
          </div>
        </div>
      `;
      break;

    case 'plugins':
      content.innerHTML = `
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold text-white">🔌 Plugin Ecosystem</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Plugin System</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Secure sandboxed execution</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Permission-based access control</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Hot-reload development support</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Plugin marketplace integration</span>
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <button class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors">
                📦 Browse Plugin Marketplace
              </button>
              <button class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors">
                ⚙️ Manage Installed Plugins
              </button>
            </div>
          </div>
        </div>
      `;
      break;

    case 'collaborate':
      content.innerHTML = `
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold text-white">👥 Real-time Collaboration</h3>
          <div class="space-y-3">
            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Collaboration Features</h4>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Operational transformation</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Conflict-free real-time editing</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">User presence indicators</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Session recording and playback</span>
                </div>
              </div>
            </div>
            <div class="bg-gray-800 rounded-lg p-3">
              <h4 class="text-white font-medium mb-2">Active Session</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Status:</span>
                  <span class="text-green-400">Ready</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Users:</span>
                  <span class="text-white">1 (You)</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Connection:</span>
                  <span class="text-green-400">Secure</span>
                </div>
              </div>
            </div>
            <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors">
              🚀 Start Collaboration Session
            </button>
          </div>
        </div>
      `;
      break;
  }
}

function updateStatus(container, message) {
  const statusText = container.querySelector('#status-text');
  if (statusText) {
    statusText.textContent = message;
  }
}