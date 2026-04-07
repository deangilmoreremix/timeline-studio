/**
 * Professional Export System for Higgsfield
 *
 * Industry-standard export formats with ProRes, DNxHD, CineForm, and broadcast codecs
 */

export class ProfessionalExporter {
  constructor() {
    this.exportPresets = this.initializePresets();
    this.currentJob = null;
    this.exportQueue = [];
  }

  initializePresets() {
    return {
      // ProRes Family
      'prores-422': {
        name: 'ProRes 422',
        codec: 'prores',
        profile: '422',
        bitrate: 'variable',
        quality: 'professional',
        colorSpace: '4:2:2',
        bitDepth: 10,
        category: 'professional',
        description: 'Apple ProRes 422 - Professional editing codec'
      },
      'prores-422-hq': {
        name: 'ProRes 422 HQ',
        codec: 'prores',
        profile: '422-hq',
        bitrate: 'variable',
        quality: 'high',
        colorSpace: '4:2:2',
        bitDepth: 10,
        category: 'professional',
        description: 'Apple ProRes 422 HQ - Higher quality for grading'
      },
      'prores-4444': {
        name: 'ProRes 4444',
        codec: 'prores',
        profile: '4444',
        bitrate: 'variable',
        quality: 'professional',
        colorSpace: '4:4:4',
        bitDepth: 12,
        category: 'professional',
        description: 'Apple ProRes 4444 - Alpha channel support'
      },
      'prores-4444-xq': {
        name: 'ProRes 4444 XQ',
        codec: 'prores',
        profile: '4444-xq',
        bitrate: 'variable',
        quality: 'ultra',
        colorSpace: '4:4:4',
        bitDepth: 12,
        category: 'professional',
        description: 'Apple ProRes 4444 XQ - Maximum quality'
      },

      // Avid DNxHD
      'dnxhd-1080p-36': {
        name: 'DNxHD 1080p/36',
        codec: 'dnxhd',
        resolution: '1920x1080',
        bitrate: '36Mbps',
        quality: 'professional',
        colorSpace: '4:2:2',
        bitDepth: 10,
        category: 'professional',
        description: 'Avid DNxHD - Professional post-production'
      },
      'dnxhd-1080p-175': {
        name: 'DNxHD 1080p/175',
        codec: 'dnxhd',
        resolution: '1920x1080',
        bitrate: '175Mbps',
        quality: 'high',
        colorSpace: '4:2:2',
        bitDepth: 10,
        category: 'professional',
        description: 'Avid DNxHD HQ - High quality for finishing'
      },
      'dnxhd-4k-60': {
        name: 'DNxHD 4K/60',
        codec: 'dnxhd',
        resolution: '3840x2160',
        bitrate: '60Mbps',
        quality: 'professional',
        colorSpace: '4:2:2',
        bitDepth: 10,
        category: 'professional',
        description: 'Avid DNxHD 4K - Ultra HD production'
      },

      // CineForm
      'cineform-filmscan1': {
        name: 'CineForm Film Scan 1',
        codec: 'cineform',
        profile: 'filmscan1',
        bitrate: 'variable',
        quality: 'high',
        colorSpace: '4:4:4',
        bitDepth: 12,
        category: 'film',
        description: 'CineForm - Film scanning and digital cinema'
      },
      'cineform-422': {
        name: 'CineForm 422',
        codec: 'cineform',
        profile: '422',
        bitrate: 'variable',
        quality: 'professional',
        colorSpace: '4:2:2',
        bitDepth: 10,
        category: 'professional',
        description: 'CineForm 422 - Professional editing'
      },

      // Broadcast Codecs
      'avc-intra-100': {
        name: 'AVC-Intra 100',
        codec: 'avc-intra',
        profile: '100',
        bitrate: '100Mbps',
        quality: 'broadcast',
        colorSpace: '4:2:2',
        bitDepth: 10,
        category: 'broadcast',
        description: 'Panasonic AVC-Intra - Broadcast HD'
      },
      'xavc-4k': {
        name: 'XAVC 4K',
        codec: 'xavc',
        resolution: '3840x2160',
        bitrate: '600Mbps',
        quality: 'broadcast',
        colorSpace: '4:2:2',
        bitDepth: 10,
        category: 'broadcast',
        description: 'Sony XAVC - 4K broadcast production'
      },

      // Web & Social Media
      'h264-youtube': {
        name: 'H.264 YouTube',
        codec: 'h264',
        profile: 'high',
        bitrate: 'variable',
        quality: 'web',
        colorSpace: '4:2:0',
        bitDepth: 8,
        category: 'web',
        description: 'Optimized for YouTube upload'
      },
      'h265-instagram': {
        name: 'H.265 Instagram',
        codec: 'h265',
        profile: 'main',
        bitrate: 'variable',
        quality: 'web',
        colorSpace: '4:2:0',
        bitDepth: 8,
        category: 'social',
        description: 'Optimized for Instagram Reels'
      }
    };
  }

  // Export Job Management
  async startExport(project, presetId, options = {}) {
    const preset = this.exportPresets[presetId];
    if (!preset) {
      throw new Error(`Unknown export preset: ${presetId}`);
    }

    const job = {
      id: `export_${Date.now()}`,
      project: project,
      preset: preset,
      options: {
        resolution: options.resolution || '1920x1080',
        frameRate: options.frameRate || 30,
        duration: options.duration || project.duration,
        includeAudio: options.includeAudio !== false,
        colorSpace: options.colorSpace || preset.colorSpace,
        ...options
      },
      status: 'queued',
      progress: 0,
      startTime: Date.now(),
      estimatedTime: this.estimateExportTime(project, preset)
    };

    this.currentJob = job;
    this.exportQueue.push(job);

    // Start export process
    this.processExport(job);

    return job;
  }

  async processExport(job) {
    job.status = 'exporting';

    try {
      // Simulate export process
      const steps = ['Analyzing project', 'Encoding video', 'Processing audio', 'Finalizing'];

      for (let i = 0; i < steps.length; i++) {
        job.progress = (i / steps.length) * 100;
        job.currentStep = steps[i];

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check for cancellation
        if (job.status === 'cancelled') {
          throw new Error('Export cancelled');
        }
      }

      job.status = 'completed';
      job.progress = 100;
      job.endTime = Date.now();

    } catch (error) {
      job.status = 'failed';
      job.error = error.message;
      throw error;
    }
  }

  cancelExport(jobId) {
    const job = this.exportQueue.find(j => j.id === jobId);
    if (job && job.status === 'exporting') {
      job.status = 'cancelled';
      return true;
    }
    return false;
  }

  // Preset Management
  getPresets(category = null) {
    if (!category) return this.exportPresets;

    return Object.fromEntries(
      Object.entries(this.exportPresets).filter(([_, preset]) => preset.category === category)
    );
  }

  createCustomPreset(name, config) {
    const presetId = `custom_${Date.now()}`;
    this.exportPresets[presetId] = {
      name: name,
      ...config,
      category: 'custom',
      description: 'Custom export preset'
    };
    return presetId;
  }

  // Quality Control
  validateExport(project, preset) {
    const issues = [];

    // Check resolution compatibility
    if (preset.resolution && project.resolution) {
      const [exportW, exportH] = preset.resolution.split('x').map(Number);
      const [projectW, projectH] = project.resolution.split('x').map(Number);

      if (exportW > projectW || exportH > projectH) {
        issues.push('Export resolution higher than project resolution');
      }
    }

    // Check codec compatibility
    if (preset.codec === 'prores' && !this.isApplePlatform()) {
      issues.push('ProRes codec works best on Apple platforms');
    }

    // Check color space compatibility
    if (preset.colorSpace === '4:4:4' && preset.category === 'web') {
      issues.push('4:4:4 color space not recommended for web delivery');
    }

    return issues;
  }

  // Utility Methods
  estimateExportTime(project, preset) {
    const baseTime = project.duration * 0.1; // 10% of duration as base
    const qualityMultiplier = {
      'web': 0.5,
      'broadcast': 1.0,
      'professional': 1.5,
      'high': 2.0,
      'ultra': 3.0,
      'film': 4.0
    }[preset.quality] || 1.0;

    return baseTime * qualityMultiplier;
  }

  isApplePlatform() {
    return navigator.platform.toLowerCase().includes('mac');
  }

  // Batch Export
  async batchExport(projects, presetId, options = {}) {
    const results = [];

    for (const project of projects) {
      try {
        const job = await this.startExport(project, presetId, options);
        results.push({ project: project.id, job, success: true });
      } catch (error) {
        results.push({ project: project.id, error: error.message, success: false });
      }
    }

    return results;
  }

  // Export Templates
  getDeliveryTemplates() {
    return {
      'youtube-1080p': {
        preset: 'h264-youtube',
        resolution: '1920x1080',
        frameRate: 30,
        audioBitrate: '128k',
        description: 'YouTube optimized 1080p'
      },
      'netflix-4k': {
        preset: 'dnxhd-4k-60',
        resolution: '3840x2160',
        frameRate: 24,
        audioBitrate: '256k',
        description: 'Netflix 4K delivery spec'
      },
      'broadcast-hd': {
        preset: 'avc-intra-100',
        resolution: '1920x1080',
        frameRate: 29.97,
        audioBitrate: '256k',
        description: 'Broadcast HD delivery'
      },
      'film-delivery': {
        preset: 'cineform-filmscan1',
        resolution: '2048x1080',
        frameRate: 24,
        audioBitrate: '192k',
        description: 'Digital cinema delivery'
      }
    };
  }
}

// Professional Export UI
export function ProfessionalExportPanel({ exporter, onExportStart, onExportCancel }) {
  const [selectedPreset, setSelectedPreset] = React.useState('prores-422');
  const [customOptions, setCustomOptions] = React.useState({
    resolution: '1920x1080',
    frameRate: 30,
    includeAudio: true,
    colorSpace: '4:2:2'
  });
  const [currentJob, setCurrentJob] = React.useState(null);
  const [exportHistory, setExportHistory] = React.useState([]);

  React.useEffect(() => {
    // Update options when preset changes
    const preset = exporter.exportPresets[selectedPreset];
    if (preset) {
      setCustomOptions({
        ...customOptions,
        colorSpace: preset.colorSpace,
        resolution: preset.resolution || customOptions.resolution
      });
    }
  }, [selectedPreset]);

  const handleExport = async () => {
    const job = await exporter.startExport(
      { id: 'current-project', duration: 60, resolution: '1920x1080' },
      selectedPreset,
      customOptions
    );

    setCurrentJob(job);
    onExportStart(job);

    // Monitor progress
    const progressInterval = setInterval(() => {
      if (job.status === 'completed' || job.status === 'failed') {
        clearInterval(progressInterval);
        setExportHistory(prev => [...prev, job]);
        setCurrentJob(null);
      }
    }, 500);
  };

  const presets = exporter.getPresets();
  const categories = ['professional', 'broadcast', 'film', 'web', 'social', 'custom'];

  return (
    <div className="professional-export-panel h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">🎬 Professional Export</h2>
          <div className="flex items-center gap-2">
            {currentJob && (
              <span className={`px-3 py-1 text-xs rounded ${
                currentJob.status === 'exporting' ? 'bg-blue-600' :
                currentJob.status === 'completed' ? 'bg-green-600' :
                currentJob.status === 'failed' ? 'bg-red-600' : 'bg-gray-600'
              }`}>
                {currentJob.status}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1">Industry-standard export formats</p>
      </div>

      {/* Current Export Progress */}
      {currentJob && (
        <div className="p-4 border-b border-gray-700">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Exporting...</span>
              <span className="text-sm text-gray-400">{Math.round(currentJob.progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentJob.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {currentJob.currentStep} • Est. {Math.round(currentJob.estimatedTime)}s remaining
            </div>
            <button
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              onClick={() => {
                exporter.cancelExport(currentJob.id);
                setCurrentJob(null);
                onExportCancel(currentJob.id);
              }}
            >
              Cancel Export
            </button>
          </div>
        </div>
      )}

      {/* Export Configuration */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Preset Categories */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Export Presets</h3>
            <div className="space-y-4">
              {categories.map(category => {
                const categoryPresets = Object.entries(presets).filter(([_, preset]) => preset.category === category);
                if (categoryPresets.length === 0) return null;

                return (
                  <div key={category}>
                    <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">{category}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {categoryPresets.map(([id, preset]) => (
                        <button
                          key={id}
                          className={`p-3 rounded-lg border text-left hover:bg-gray-700 transition-colors ${
                            selectedPreset === id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600'
                          }`}
                          onClick={() => setSelectedPreset(id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-white">{preset.name}</div>
                              <div className="text-xs text-gray-400">{preset.description}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {preset.bitrate || preset.quality}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Options */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Export Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Resolution</label>
                <select
                  value={customOptions.resolution}
                  onChange={(e) => setCustomOptions({...customOptions, resolution: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="1920x1080">1920x1080 (Full HD)</option>
                  <option value="3840x2160">3840x2160 (4K UHD)</option>
                  <option value="2048x1080">2048x1080 (2K DCI)</option>
                  <option value="4096x2160">4096x2160 (4K DCI)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Frame Rate</label>
                <select
                  value={customOptions.frameRate}
                  onChange={(e) => setCustomOptions({...customOptions, frameRate: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="23.976">23.976 fps (Film)</option>
                  <option value="24">24 fps (Cinema)</option>
                  <option value="25">25 fps (PAL)</option>
                  <option value="29.97">29.97 fps (NTSC)</option>
                  <option value="30">30 fps (HD)</option>
                  <option value="60">60 fps (Slow Motion)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeAudio"
                  checked={customOptions.includeAudio}
                  onChange={(e) => setCustomOptions({...customOptions, includeAudio: e.target.checked})}
                  className="rounded border-gray-600"
                />
                <label htmlFor="includeAudio" className="text-sm text-gray-300">Include Audio</label>
              </div>
            </div>
          </div>

          {/* Delivery Templates */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Delivery Templates</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(exporter.getDeliveryTemplates()).map(([id, template]) => (
                <button
                  key={id}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"
                  onClick={() => {
                    setSelectedPreset(template.preset);
                    setCustomOptions({
                      ...customOptions,
                      resolution: template.resolution || customOptions.resolution,
                      frameRate: template.frameRate || customOptions.frameRate
                    });
                  }}
                >
                  <div className="text-sm font-medium text-white capitalize">{id.replace('-', ' ')}</div>
                  <div className="text-xs text-gray-400">{template.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-3">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded transition-colors font-medium"
            onClick={handleExport}
            disabled={!!currentJob}
          >
            🎬 Start Export
          </button>
          <button
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            onClick={() => setSelectedPreset('')}
          >
            ⚙️ Custom
          </button>
        </div>
      </div>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <div className="p-4 border-t border-gray-700 max-h-40 overflow-y-auto">
          <h4 className="text-sm font-medium text-white mb-2">Recent Exports</h4>
          <div className="space-y-2">
            {exportHistory.slice(-3).map((job, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs">
                <div>
                  <div className="text-white">{job.preset.name}</div>
                  <div className="text-gray-400">{job.options.resolution} • {job.options.frameRate}fps</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  job.status === 'completed' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {job.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}