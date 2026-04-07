/**
 * Plugin Manager Component
 *
 * UI for installing, managing, and configuring plugins
 */

import { Download, Play, Settings, Square, Trash2, Upload } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { type PluginInstance, type PluginManifest, pluginSystem } from "../services/plugin-system"

interface PluginManagerProps {
  className?: string
}

export function PluginManager({ className }: PluginManagerProps) {
  const [installedPlugins, setInstalledPlugins] = useState<PluginInstance[]>([])
  const [availablePlugins, setAvailablePlugins] = useState<PluginManifest[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<PluginInstance | null>(null)
  const [installProgress, setInstallProgress] = useState<{ pluginId: string; progress: number } | null>(null)

  // Load plugins on mount
  useEffect(() => {
    loadPlugins()
  }, [])

  const loadPlugins = useCallback(async () => {
    setLoading(true)
    try {
      const installed = pluginSystem.getAllPlugins()
      const available = await pluginSystem.discoverPlugins()

      setInstalledPlugins(installed)
      setAvailablePlugins(available)
    } catch (error) {
      console.error("Failed to load plugins:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInstallPlugin = useCallback(
    async (pluginUrl: string) => {
      setLoading(true)
      try {
        // Download plugin package
        const response = await fetch(pluginUrl)
        const pluginPackage = await response.blob()

        // Install plugin
        const pluginId = await pluginSystem.installPlugin(pluginPackage)

        // Reload plugins
        await loadPlugins()

        // Show success message
        console.log("Plugin installed successfully:", pluginId)
      } catch (error) {
        console.error("Failed to install plugin:", error)
      } finally {
        setLoading(false)
      }
    },
    [loadPlugins],
  )

  const handleUninstallPlugin = useCallback(
    async (pluginId: string) => {
      try {
        await pluginSystem.unloadPlugin(pluginId)
        await loadPlugins()
      } catch (error) {
        console.error("Failed to uninstall plugin:", error)
      }
    },
    [loadPlugins],
  )

  const handleTogglePlugin = useCallback(
    async (pluginId: string, enabled: boolean) => {
      try {
        if (enabled) {
          await pluginSystem.enablePlugin(pluginId)
        } else {
          await pluginSystem.disablePlugin(pluginId)
        }
        await loadPlugins()
      } catch (error) {
        console.error("Failed to toggle plugin:", error)
      }
    },
    [loadPlugins],
  )

  const getPluginIcon = (type: string) => {
    switch (type) {
      case "effect":
        return "🎨"
      case "exporter":
        return "📤"
      case "importer":
        return "📥"
      case "tool":
        return "🔧"
      case "theme":
        return "🎨"
      case "extension":
        return "⚡"
      default:
        return "📦"
    }
  }

  const getPluginStatusColor = (plugin: PluginInstance) => {
    if (!plugin.isLoaded) return "destructive"
    if (!plugin.isEnabled) return "secondary"
    return "default"
  }

  const getPluginStatusText = (plugin: PluginInstance) => {
    if (!plugin.isLoaded) return "Error"
    if (!plugin.isEnabled) return "Disabled"
    return "Active"
  }

  return (
    <div className={`plugin-manager h-full flex flex-col bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold">Plugin Manager</h2>
          <p className="text-sm text-muted-foreground">Manage third-party plugins and extensions</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadPlugins} disabled={loading}>
            Refresh
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Install Plugin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Install Plugin</DialogTitle>
                <DialogDescription>Install a plugin from URL or upload a plugin package</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="plugin-url">Plugin URL</Label>
                  <Input
                    id="plugin-url"
                    placeholder="https://example.com/plugin.zip"
                    onChange={(e) => {
                      // Handle URL input
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="plugin-file">Plugin Package</Label>
                  <Input
                    id="plugin-file"
                    type="file"
                    accept=".zip,.tar.gz"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        pluginSystem.installPlugin(file).then(() => loadPlugins())
                      }
                    }}
                  />
                </div>

                {installProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Installing {installProgress.pluginId}</span>
                      <span>{installProgress.progress}%</span>
                    </div>
                    <Progress value={installProgress.progress} />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="installed" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="installed">Installed ({installedPlugins.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availablePlugins.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="flex-1 p-4 pt-0">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {installedPlugins.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No plugins installed</p>
                    <p className="text-sm mt-2">Install plugins to extend Timeline Studio</p>
                  </CardContent>
                </Card>
              ) : (
                installedPlugins.map((plugin) => (
                  <Card key={plugin.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getPluginIcon(plugin.manifest.type)}</div>
                          <div>
                            <CardTitle className="text-base">{plugin.manifest.name}</CardTitle>
                            <CardDescription>{plugin.manifest.description}</CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={getPluginStatusColor(plugin)}>{getPluginStatusText(plugin)}</Badge>

                          <Switch
                            checked={plugin.isEnabled}
                            onCheckedChange={(enabled) => handleTogglePlugin(plugin.id, enabled)}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>v{plugin.manifest.version}</span>
                          <span>{plugin.manifest.author}</span>
                          <Badge variant="outline" className="capitalize">
                            {plugin.manifest.type}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPlugin(plugin)}>
                            <Settings className="w-4 h-4" />
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => handleUninstallPlugin(plugin.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="available" className="flex-1 p-4 pt-0">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {availablePlugins.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No plugins available</p>
                    <p className="text-sm mt-2">Check back later for new plugins</p>
                  </CardContent>
                </Card>
              ) : (
                availablePlugins.map((plugin) => (
                  <Card key={plugin.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getPluginIcon(plugin.type)}</div>
                          <div>
                            <CardTitle className="text-base">{plugin.name}</CardTitle>
                            <CardDescription>{plugin.description}</CardDescription>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleInstallPlugin(plugin.metadata.homepage || "")}
                          disabled={loading}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Install
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>v{plugin.version}</span>
                          <span>{plugin.author}</span>
                          <Badge variant="outline" className="capitalize">
                            {plugin.type}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {plugin.metadata.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Plugin Settings Dialog */}
      {selectedPlugin && (
        <Dialog open={!!selectedPlugin} onOpenChange={() => setSelectedPlugin(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedPlugin.manifest.name} Settings</DialogTitle>
              <DialogDescription>Configure plugin settings and permissions</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Plugin Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Version</Label>
                  <p className="text-sm text-muted-foreground">{selectedPlugin.manifest.version}</p>
                </div>
                <div>
                  <Label>Author</Label>
                  <p className="text-sm text-muted-foreground">{selectedPlugin.manifest.author}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedPlugin.manifest.type}</p>
                </div>
                <div>
                  <Label>License</Label>
                  <p className="text-sm text-muted-foreground">{selectedPlugin.manifest.license}</p>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <Label className="text-base">Permissions</Label>
                <div className="mt-2 space-y-2">
                  {selectedPlugin.manifest.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {permission.replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                  {selectedPlugin.manifest.permissions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No special permissions required</p>
                  )}
                </div>
              </div>

              {/* Dependencies */}
              {selectedPlugin.manifest.dependencies && selectedPlugin.manifest.dependencies.length > 0 && (
                <div>
                  <Label className="text-base">Dependencies</Label>
                  <div className="mt-2 space-y-2">
                    {selectedPlugin.manifest.dependencies.map((dep) => (
                      <Badge key={dep} variant="secondary" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Plugin-specific Settings */}
              <div>
                <Label className="text-base">Plugin Configuration</Label>
                <div className="mt-2 space-y-4">
                  {/* Placeholder for plugin-specific settings */}
                  <p className="text-sm text-muted-foreground">
                    Plugin-specific settings would be rendered here based on the plugin's configuration schema.
                  </p>
                </div>
              </div>

              {/* Sandbox Info */}
              {selectedPlugin.sandbox && (
                <div>
                  <Label className="text-base">Security</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>Sandboxed Execution</span>
                      <Badge variant={selectedPlugin.sandbox.isSecure() ? "default" : "destructive"}>
                        {selectedPlugin.sandbox.isSecure() ? "Secure" : "Insecure"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Memory usage: {(selectedPlugin.sandbox.memoryUsage() / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setSelectedPlugin(null)}>
                Close
              </Button>
              <Button onClick={() => setSelectedPlugin(null)}>Save Settings</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
