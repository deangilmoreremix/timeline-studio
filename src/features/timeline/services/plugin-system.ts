/**
 * Plugin System Architecture
 *
 * Extensible plugin framework for third-party integrations with security sandboxing
 */

export interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  license: string
  type: PluginType
  entryPoint: string
  permissions: PluginPermission[]
  dependencies?: string[]
  metadata: {
    tags: string[]
    category: string
    minHostVersion: string
    maxHostVersion?: string
    homepage?: string
    repository?: string
  }
}

export type PluginType =
  | "effect" // Video/audio effects
  | "exporter" // Export formats
  | "importer" // Import formats
  | "tool" // Editing tools
  | "theme" // UI themes
  | "extension" // General extensions

export type PluginPermission =
  | "read-filesystem" // Read access to project files
  | "write-filesystem" // Write access to project files
  | "network-access" // HTTP requests
  | "system-info" // Access to system information
  | "audio-device" // Access to audio devices
  | "video-device" // Access to video devices
  | "gpu-access" // GPU acceleration
  | "plugin-storage" // Persistent storage for plugin data

export interface PluginContext {
  // Host application APIs
  timeline: TimelineAPI
  project: ProjectAPI
  rendering: RenderingAPI
  audio: AudioAPI
  ui: UIAPI

  // Plugin-specific APIs
  storage: StorageAPI
  network: NetworkAPI
  filesystem: FilesystemAPI

  // Plugin metadata
  manifest: PluginManifest
  config: any
}

export interface TimelineAPI {
  getCurrentTime(): number
  setCurrentTime(time: number): void
  getSelectedClips(): any[]
  addClip(clip: any): void
  removeClip(clipId: string): void
  updateClip(clipId: string, updates: any): void
  getTracks(): any[]
  createTrack(type: string, name: string): any
}

export interface ProjectAPI {
  getProjectData(): any
  saveProject(): Promise<void>
  exportProject(format: string, options: any): Promise<string>
  importProject(data: any): Promise<void>
  getSettings(): any
  updateSettings(settings: any): void
}

export interface RenderingAPI {
  renderFrame(time: number, width: number, height: number): Promise<ImageData>
  renderSequence(startTime: number, endTime: number, options: any): Promise<string>
  getRenderProgress(): { completed: number; total: number }
  cancelRender(): void
}

export interface AudioAPI {
  getAudioBuffer(trackId: string, startTime: number, duration: number): Promise<AudioBuffer>
  processAudio(buffer: AudioBuffer, effects: any[]): Promise<AudioBuffer>
  playAudio(buffer: AudioBuffer): void
  stopAudio(): void
}

export interface UIAPI {
  showDialog(title: string, content: any, options?: any): Promise<any>
  showToast(message: string, type?: "info" | "success" | "warning" | "error"): void
  addMenuItem(menuId: string, item: any): void
  removeMenuItem(menuId: string, itemId: string): void
  registerShortcut(shortcut: string, callback: () => void): void
}

export interface StorageAPI {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

export interface NetworkAPI {
  fetch(url: string, options?: any): Promise<any>
  upload(url: string, data: any, options?: any): Promise<any>
  download(url: string, options?: any): Promise<Blob>
}

export interface FilesystemAPI {
  readFile(path: string): Promise<string | ArrayBuffer>
  writeFile(path: string, data: string | ArrayBuffer): Promise<void>
  listDirectory(path: string): Promise<string[]>
  createDirectory(path: string): Promise<void>
  delete(path: string): Promise<void>
  exists(path: string): Promise<boolean>
}

export interface PluginInstance {
  id: string
  manifest: PluginManifest
  context: PluginContext
  isLoaded: boolean
  isEnabled: boolean
  instance: any // The actual plugin object
  sandbox?: PluginSandbox
}

export interface PluginSandbox {
  execute(code: string, context: any): Promise<any>
  destroy(): void
  memoryUsage(): number
  isSecure(): boolean
}

class PluginSystem {
  private plugins = new Map<string, PluginInstance>()
  private pluginDirectory = "/plugins"
  private sandboxFactory: SandboxFactory
  private securityManager: SecurityManager

  constructor() {
    this.sandboxFactory = new SandboxFactory()
    this.securityManager = new SecurityManager()
  }

  // Plugin Management
  async loadPlugin(manifestPath: string): Promise<string> {
    try {
      // Load and validate manifest
      const manifest = await this.loadManifest(manifestPath)

      // Check permissions and security
      await this.securityManager.validatePermissions(manifest.permissions)

      // Create plugin context
      const context = await this.createPluginContext(manifest)

      // Load plugin code
      const pluginCode = await this.loadPluginCode(manifest.entryPoint)

      // Create sandbox if needed
      const sandbox = manifest.permissions.length > 0 ? this.sandboxFactory.createSandbox() : undefined

      // Execute plugin code
      const pluginInstance = sandbox
        ? await sandbox.execute(pluginCode, context)
        : await this.executeUnsafe(pluginCode, context)

      // Create plugin instance
      const instance: PluginInstance = {
        id: manifest.id,
        manifest,
        context,
        isLoaded: true,
        isEnabled: true,
        instance: pluginInstance,
        sandbox,
      }

      this.plugins.set(manifest.id, instance)

      // Initialize plugin if it has an init method
      if (typeof pluginInstance.init === "function") {
        await pluginInstance.init(context)
      }

      return manifest.id
    } catch (error) {
      console.error("Failed to load plugin:", error)
      throw error
    }
  }

  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return

    try {
      // Call cleanup method if available
      if (plugin.instance && typeof plugin.instance.cleanup === "function") {
        await plugin.instance.cleanup()
      }

      // Destroy sandbox
      if (plugin.sandbox) {
        plugin.sandbox.destroy()
      }

      this.plugins.delete(pluginId)
    } catch (error) {
      console.error("Error unloading plugin:", error)
    }
  }

  async enablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) throw new Error("Plugin not found")

    plugin.isEnabled = true

    if (plugin.instance && typeof plugin.instance.onEnable === "function") {
      await plugin.instance.onEnable()
    }
  }

  async disablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) throw new Error("Plugin not found")

    plugin.isEnabled = false

    if (plugin.instance && typeof plugin.instance.onDisable === "function") {
      await plugin.instance.onDisable()
    }
  }

  // Plugin Discovery and Installation
  async discoverPlugins(): Promise<PluginManifest[]> {
    const manifests: PluginManifest[] = []

    try {
      // Scan plugin directory for manifest files
      const entries = await this.listPluginDirectory()

      for (const entry of entries) {
        if (entry.endsWith("plugin.json")) {
          try {
            const manifest = await this.loadManifest(`${this.pluginDirectory}/${entry}`)
            manifests.push(manifest)
          } catch (error) {
            console.warn("Failed to load plugin manifest:", entry, error)
          }
        }
      }
    } catch (error) {
      console.error("Failed to discover plugins:", error)
    }

    return manifests
  }

  async installPlugin(pluginPackage: File | string): Promise<string> {
    // Extract plugin package
    const pluginDir = await this.extractPluginPackage(pluginPackage)

    // Load manifest
    const manifestPath = `${pluginDir}/plugin.json`
    const manifest = await this.loadManifest(manifestPath)

    // Validate plugin
    await this.validatePlugin(manifest, pluginDir)

    // Move to plugin directory
    const finalPath = `${this.pluginDirectory}/${manifest.id}`
    await this.moveDirectory(pluginDir, finalPath)

    return manifest.id
  }

  // Plugin Communication
  async sendMessage(pluginId: string, message: any): Promise<any> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin || !plugin.isEnabled) {
      throw new Error("Plugin not found or disabled")
    }

    if (plugin.instance && typeof plugin.instance.onMessage === "function") {
      return await plugin.instance.onMessage(message)
    }
  }

  async broadcastMessage(message: any, pluginType?: PluginType): Promise<void> {
    const promises: Promise<any>[] = []

    for (const plugin of this.plugins.values()) {
      if (plugin.isEnabled && (!pluginType || plugin.manifest.type === pluginType)) {
        if (plugin.instance && typeof plugin.instance.onMessage === "function") {
          promises.push(plugin.instance.onMessage(message))
        }
      }
    }

    await Promise.allSettled(promises)
  }

  // Plugin Registry
  getPlugin(pluginId: string): PluginInstance | null {
    return this.plugins.get(pluginId) || null
  }

  getPluginsByType(type: PluginType): PluginInstance[] {
    return Array.from(this.plugins.values()).filter((p) => p.manifest.type === type)
  }

  getAllPlugins(): PluginInstance[] {
    return Array.from(this.plugins.values())
  }

  // Private Methods
  private async loadManifest(manifestPath: string): Promise<PluginManifest> {
    const response = await fetch(manifestPath)
    const manifest = await response.json()

    // Validate manifest structure
    this.validateManifest(manifest)

    return manifest
  }

  private validateManifest(manifest: any): asserts manifest is PluginManifest {
    if (!manifest.id || !manifest.name || !manifest.version) {
      throw new Error("Invalid plugin manifest: missing required fields")
    }

    if (!["effect", "exporter", "importer", "tool", "theme", "extension"].includes(manifest.type)) {
      throw new Error("Invalid plugin type")
    }
  }

  private async loadPluginCode(entryPoint: string): Promise<string> {
    const response = await fetch(`${this.pluginDirectory}/${entryPoint}`)
    return await response.text()
  }

  private async createPluginContext(manifest: PluginManifest): Promise<PluginContext> {
    return {
      timeline: new TimelineAPIImpl(),
      project: new ProjectAPIImpl(),
      rendering: new RenderingAPIImpl(),
      audio: new AudioAPIImpl(),
      ui: new UIAPIImpl(),
      storage: new StorageAPIImpl(manifest.id),
      network: new NetworkAPIImpl(),
      filesystem: new FilesystemAPIImpl(manifest.permissions),
      manifest,
      config: {},
    }
  }

  private async executeUnsafe(code: string, context: PluginContext): Promise<any> {
    // Create a function with the plugin code
    const pluginFunction = new Function("context", `return (${code})(context)`)

    return pluginFunction(context)
  }

  private async listPluginDirectory(): Promise<string[]> {
    // Implementation would list files in plugin directory
    return []
  }

  private async extractPluginPackage(pluginPackage: File | string): Promise<string> {
    // Implementation would extract ZIP or other package formats
    return ""
  }

  private async validatePlugin(manifest: PluginManifest, pluginDir: string): Promise<void> {
    // Check dependencies, version compatibility, etc.
  }

  private async moveDirectory(from: string, to: string): Promise<void> {
    // Implementation would move directory
  }
}

// API Implementations
class TimelineAPIImpl implements TimelineAPI {
  getCurrentTime(): number {
    return 0
  }
  setCurrentTime(time: number): void {}
  getSelectedClips(): any[] {
    return []
  }
  addClip(clip: any): void {}
  removeClip(clipId: string): void {}
  updateClip(clipId: string, updates: any): void {}
  getTracks(): any[] {
    return []
  }
  createTrack(type: string, name: string): any {
    return {}
  }
}

class ProjectAPIImpl implements ProjectAPI {
  getProjectData(): any {
    return {}
  }
  async saveProject(): Promise<void> {}
  async exportProject(format: string, options: any): Promise<string> {
    return ""
  }
  async importProject(data: any): Promise<void> {}
  getSettings(): any {
    return {}
  }
  updateSettings(settings: any): void {}
}

class RenderingAPIImpl implements RenderingAPI {
  async renderFrame(time: number, width: number, height: number): Promise<ImageData> {
    return new ImageData(width, height)
  }
  async renderSequence(startTime: number, endTime: number, options: any): Promise<string> {
    return ""
  }
  getRenderProgress(): { completed: number; total: number } {
    return { completed: 0, total: 0 }
  }
  cancelRender(): void {}
}

class AudioAPIImpl implements AudioAPI {
  async getAudioBuffer(trackId: string, startTime: number, duration: number): Promise<AudioBuffer> {
    return new AudioBuffer({ length: 0, sampleRate: 44100 })
  }
  async processAudio(buffer: AudioBuffer, effects: any[]): Promise<AudioBuffer> {
    return buffer
  }
  playAudio(buffer: AudioBuffer): void {}
  stopAudio(): void {}
}

class UIAPIImpl implements UIAPI {
  async showDialog(title: string, content: any, options?: any): Promise<any> {
    return null
  }
  showToast(message: string, type?: "info" | "success" | "warning" | "error"): void {}
  addMenuItem(menuId: string, item: any): void {}
  removeMenuItem(menuId: string, itemId: string): void {}
  registerShortcut(shortcut: string, callback: () => void): void {}
}

class StorageAPIImpl implements StorageAPI {
  constructor(private pluginId: string) {}

  async get(key: string): Promise<any> {
    const data = localStorage.getItem(`plugin_${this.pluginId}_${key}`)
    return data ? JSON.parse(data) : null
  }

  async set(key: string, value: any): Promise<void> {
    localStorage.setItem(`plugin_${this.pluginId}_${key}`, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(`plugin_${this.pluginId}_${key}`)
  }

  async clear(): Promise<void> {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(`plugin_${this.pluginId}_`))
    keys.forEach((key) => localStorage.removeItem(key))
  }
}

class NetworkAPIImpl implements NetworkAPI {
  async fetch(url: string, options?: any): Promise<any> {
    return await fetch(url, options)
  }

  async upload(url: string, data: any, options?: any): Promise<any> {
    const formData = new FormData()
    formData.append("file", data)
    return await fetch(url, { method: "POST", body: formData, ...options })
  }

  async download(url: string, options?: any): Promise<Blob> {
    const response = await fetch(url, options)
    return await response.blob()
  }
}

class FilesystemAPIImpl implements FilesystemAPI {
  constructor(private permissions: PluginPermission[]) {}

  private checkPermission(permission: PluginPermission): void {
    if (!this.permissions.includes(permission)) {
      throw new Error(`Permission denied: ${permission}`)
    }
  }

  async readFile(path: string): Promise<string | ArrayBuffer> {
    this.checkPermission("read-filesystem")
    // Implementation would read file securely
    return ""
  }

  async writeFile(path: string, data: string | ArrayBuffer): Promise<void> {
    this.checkPermission("write-filesystem")
    // Implementation would write file securely
  }

  async listDirectory(path: string): Promise<string[]> {
    this.checkPermission("read-filesystem")
    return []
  }

  async createDirectory(path: string): Promise<void> {
    this.checkPermission("write-filesystem")
  }

  async delete(path: string): Promise<void> {
    this.checkPermission("write-filesystem")
  }

  async exists(path: string): Promise<boolean> {
    this.checkPermission("read-filesystem")
    return false
  }
}

// Sandbox and Security
class SandboxFactory {
  createSandbox(): PluginSandbox {
    return new PluginSandboxImpl()
  }
}

class PluginSandboxImpl implements PluginSandbox {
  private iframe: HTMLIFrameElement | null = null

  constructor() {
    this.initializeSandbox()
  }

  private initializeSandbox(): void {
    this.iframe = document.createElement("iframe")
    this.iframe.style.display = "none"
    this.iframe.sandbox = "allow-scripts"
    document.body.appendChild(this.iframe)
  }

  async execute(code: string, context: any): Promise<any> {
    if (!this.iframe?.contentWindow) {
      throw new Error("Sandbox not initialized")
    }

    return new Promise((resolve, reject) => {
      const messageHandler = (event: MessageEvent) => {
        if (event.source === this.iframe?.contentWindow) {
          window.removeEventListener("message", messageHandler)
          if (event.data.error) {
            reject(new Error(event.data.error))
          } else {
            resolve(event.data.result)
          }
        }
      }

      window.addEventListener("message", messageHandler)

      this.iframe.contentWindow!.postMessage(
        {
          code,
          context,
        },
        "*",
      )

      // Timeout after 30 seconds
      setTimeout(() => {
        window.removeEventListener("message", messageHandler)
        reject(new Error("Plugin execution timeout"))
      }, 30000)
    })
  }

  destroy(): void {
    if (this.iframe) {
      document.body.removeChild(this.iframe)
      this.iframe = null
    }
  }

  memoryUsage(): number {
    // Estimate memory usage
    return 0
  }

  isSecure(): boolean {
    return !!this.iframe
  }
}

class SecurityManager {
  async validatePermissions(permissions: PluginPermission[]): Promise<void> {
    // Check if permissions are allowed based on security policy
    const dangerousPermissions: PluginPermission[] = ["write-filesystem", "network-access", "system-info"]

    for (const permission of permissions) {
      if (dangerousPermissions.includes(permission)) {
        // Could show user dialog to approve dangerous permissions
        console.warn(`Plugin requests dangerous permission: ${permission}`)
      }
    }
  }
}

// Singleton instance
export const pluginSystem = new PluginSystem()
