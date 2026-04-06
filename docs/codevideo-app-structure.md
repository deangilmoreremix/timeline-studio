# 🏗️ **CodeVideo App Structure**

Matching the structure of your existing apps (Timeline Studio, etc.)

---

## 📁 **Complete App Structure**

```
codevideo/
├── 📁 src/
│   ├── 📁 app/                          # Next.js App Router
│   │   ├── 📄 layout.tsx               # Root layout with header
│   │   ├── 📄 page.tsx                 # Home/landing page
│   │   ├── 📄 globals.css              # Global styles
│   │   └── 📁 editor/                  # Editor page route
│   │       └── 📄 page.tsx
│   │
│   ├── 📁 components/                   # Shared UI Components
│   │   ├── 📁 ui/                      # Shadcn/ui components
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 textarea.tsx
│   │   │   └── 📄 tabs.tsx
│   │   └── 📁 layout/
│   │       ├── 📄 header.tsx           # Header with CodeVideo logo
│   │       └── 📄 sidebar.tsx
│   │
│   ├── 📁 features/                    # Feature-based Architecture
│   │   ├── 📁 editor/                  # Code Editor Feature
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📄 code-editor.tsx
│   │   │   │   ├── 📄 render-controls.tsx
│   │   │   │   └── 📄 ai-assistant.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   └── 📄 use-code-execution.ts
│   │   │   ├── 📁 services/
│   │   │   │   └── 📄 code-validation.ts
│   │   │   └── 📁 types/
│   │   │       └── 📄 editor.ts
│   │   │
│   │   ├── 📁 renderer/                # Video Rendering Feature
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📄 video-preview.tsx
│   │   │   │   └── 📄 render-queue.tsx
│   │   │   ├── 📁 services/
│   │   │   │   ├── 📄 render-engine.ts
│   │   │   │   └── 📄 video-encoding.ts
│   │   │   └── 📁 types/
│   │   │       └── 📄 render.ts
│   │   │
│   │   ├── 📁 ai-assistant/            # AI Code Help Feature
│   │   │   ├── 📁 components/
│   │   │   │   └── 📄 ai-chat.tsx
│   │   │   ├── 📁 services/
│   │   │   │   ├── 📄 claude-client.ts
│   │   │   │   └── 📄 code-suggestions.ts
│   │   │   └── 📁 types/
│   │   │       └── 📄 ai.ts
│   │   │
│   │   └── 📁 project/                 # Project Management
│   │       ├── 📁 components/
│   │       │   ├── 📄 project-list.tsx
│   │       │   └── 📄 save-dialog.tsx
│   │       ├── 📁 services/
│   │       │   └── 📄 project-storage.ts
│   │       └── 📁 types/
│   │           └── 📄 project.ts
│   │
│   ├── 📁 lib/                         # Utilities & Helpers
│   │   ├── 📄 utils.ts                 # General utilities
│   │   ├── 📄 api.ts                   # API client helpers
│   │   ├── 📄 validations.ts           # Form validation
│   │   ├── 📄 constants.ts             # App constants
│   │   └── 📄 logger.ts                # Logging utilities
│   │
│   └── 📁 types/                       # Global TypeScript Types
│       ├── 📄 index.ts
│       └── 📄 api.ts
│
├── 📁 public/                          # Static Assets
│   ├── 📄 favicon.ico
│   ├── 🖼️ codevideo-header.png        # Generated header image
│   └── 🖼️ icons/
│       ├── 📄 icon-192.png
│       ├── 📄 icon-512.png
│       └── 📄 apple-touch-icon.png
│
├── 📁 docs/                            # Documentation
│   ├── 📄 README.md
│   ├── 📄 getting-started.md
│   └── 📄 api-reference.md
│
├── 📄 package.json                     # Dependencies & Scripts
├── 📄 tsconfig.json                    # TypeScript Config
├── 📄 tailwind.config.js              # Tailwind CSS Config
├── 📄 next.config.js                  # Next.js Config
├── 📄 eslint.config.js                # ESLint Config
├── 📄 prettier.config.js              # Prettier Config
├── 📄 .env.example                    # Environment Variables Template
└── 📄 .gitignore                      # Git Ignore Rules
```

---

## 🎯 **Key Features Structure**

### **1. Editor Feature (`/src/features/editor/`)**
```
Responsible for: Code editing, syntax highlighting, AI suggestions
- Components: Code editor, render controls, AI assistant panel
- Services: Code validation, execution, formatting
- Types: Editor state, code snippets, validation results
```

### **2. Renderer Feature (`/src/features/renderer/`)**
```
Responsible for: Video rendering, encoding, preview
- Components: Video preview, render queue, progress indicators
- Services: Render engine, video encoding, FFmpeg integration
- Types: Render jobs, video formats, encoding options
```

### **3. AI Assistant Feature (`/src/features/ai-assistant/`)**
```
Responsible for: Claude integration, code suggestions, help
- Components: AI chat interface, suggestion panels
- Services: Claude API client, code analysis, suggestions
- Types: AI messages, suggestions, conversation state
```

### **4. Project Feature (`/src/features/project/`)**
```
Responsible for: Project management, saving/loading, export
- Components: Project list, save dialogs, export options
- Services: Local storage, cloud sync, file operations
- Types: Project structure, file formats, metadata
```

---

## 🔧 **Configuration Files**

### **package.json** (Matching your other apps)
```json
{
  "name": "codevideo",
  "version": "1.0.0",
  "description": "Code-first video editor with AI assistance",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@monaco-editor/react": "^4.6.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### **tsconfig.json** (Matching your other apps)
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🚀 **Next Steps**

1. **Create the app structure** following this layout
2. **Generate the header image** using the AI prompt
3. **Implement the core features** (editor, renderer, AI assistant)
4. **Set up the branding** with the generated assets

**Does this structure match your other apps? Should I proceed with creating the CodeVideo app using this structure?** 🏗️

The structure follows your existing patterns with:
- ✅ Feature-based architecture
- ✅ Shared UI components (Shadcn/ui)
- ✅ Consistent TypeScript setup
- ✅ Next.js app router
- ✅ Tailwind CSS styling
- ✅ Proper folder organization

**Ready to build CodeVideo?** 🚀