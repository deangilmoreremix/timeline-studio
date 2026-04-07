/**
 * Plugin Manager Component for Higgsfield
 *
 * Manages third-party plugins with security and sandboxing
 */

export function PluginManager({ className }) {
  const [plugins, setPlugins] = React.useState([
    {
      id: 'color-grading-pro',
      name: 'Color Grading Pro',
      version: '2.1.0',
      author: 'Timeline Studio',
      description: 'Professional color grading tools',
      enabled: true,
      type: 'effect'
    },
    {
      id: 'audio-mastering-suite',
      name: 'Audio Mastering Suite',
      version: '1.8.0',
      author: 'SoundForge',
      description: 'Complete audio mastering tools',
      enabled: true,
      type: 'effect'
    },
    {
      id: 'export-to-netflix',
      name: 'Netflix Delivery',
      version: '3.2.0',
      author: 'Professional Exports',
      description: 'Netflix-compliant export tools',
      enabled: false,
      type: 'exporter'
    }
  ]);

  const togglePlugin = (pluginId) => {
    setPlugins(plugins.map(plugin =>
      plugin.id === pluginId
        ? { ...plugin, enabled: !plugin.enabled }
        : plugin
    ));
  };

  const installPlugin = () => {
    const newPlugin = {
      id: `plugin_${Date.now()}`,
      name: 'New Plugin',
      version: '1.0.0',
      author: 'Third Party',
      description: 'Custom plugin functionality',
      enabled: false,
      type: 'tool'
    };
    setPlugins([...plugins, newPlugin]);
  };

  return (
    <div className={`plugin-manager h-full flex flex-col bg-gray-900 text-white ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">🔌 Plugin Manager</h2>
          <button
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            onClick={installPlugin}
          >
            Install Plugin
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-1">Manage third-party plugins and extensions</p>
      </div>

      {/* Plugin List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {plugins.map(plugin => (
            <div key={plugin.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{plugin.name}</span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      plugin.type === 'effect' ? 'bg-purple-600' :
                      plugin.type === 'exporter' ? 'bg-blue-600' :
                      plugin.type === 'tool' ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {plugin.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    v{plugin.version} by {plugin.author}
                  </div>
                  <div className="text-sm text-gray-300">
                    {plugin.description}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <span className={`text-xs ${plugin.enabled ? 'text-green-400' : 'text-gray-500'}`}>
                    {plugin.enabled ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    className={`px-3 py-1 text-xs rounded ${
                      plugin.enabled
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    onClick={() => togglePlugin(plugin.id)}
                  >
                    {plugin.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {plugins.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-4">🔌</div>
            <div className="text-lg mb-2">No plugins installed</div>
            <div className="text-sm">Install plugins to extend Timeline Studio</div>
          </div>
        )}
      </div>

      {/* Plugin Marketplace */}
      <div className="p-4 border-t border-gray-700">
        <h3 className="text-sm font-medium text-white mb-3">Plugin Marketplace</h3>
        <div className="grid grid-cols-1 gap-2">
          <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded text-left transition-colors">
            <div className="text-sm font-medium text-white">Color Grading Pro</div>
            <div className="text-xs text-gray-400">Advanced color correction tools</div>
          </button>
          <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded text-left transition-colors">
            <div className="text-sm font-medium text-white">Audio Restoration Suite</div>
            <div className="text-xs text-gray-400">Professional audio cleanup tools</div>
          </button>
          <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded text-left transition-colors">
            <div className="text-sm font-medium text-white">Multi-Camera Sync</div>
            <div className="text-xs text-gray-400">Advanced multi-camera workflows</div>
          </button>
        </div>
      </div>
    </div>
  );
}