/**
 * Multi-Camera Editing System for Higgsfield
 *
 * Professional multi-camera workflow with angle management, switching, and sync
 */

export class MultiCameraEditor {
  constructor() {
    this.cameras = [];
    this.syncPoints = [];
    this.currentAngle = 0;
    this.isRecording = false;
  }

  // Camera Management
  addCamera(name, source, position = null) {
    const camera = {
      id: `camera_${Date.now()}`,
      name: name || `Camera ${this.cameras.length + 1}`,
      source: source,
      position: position || { x: 0, y: 0 },
      angle: this.cameras.length,
      enabled: true,
      audioLevel: 1.0,
      zoom: 1.0,
      focus: 'auto'
    };

    this.cameras.push(camera);
    return camera;
  }

  removeCamera(cameraId) {
    const index = this.cameras.findIndex(c => c.id === cameraId);
    if (index > -1) {
      this.cameras.splice(index, 1);
      this.updateCameraAngles();
    }
  }

  updateCamera(cameraId, updates) {
    const camera = this.cameras.find(c => c.id === cameraId);
    if (camera) {
      Object.assign(camera, updates);
    }
  }

  updateCameraAngles() {
    this.cameras.forEach((camera, index) => {
      camera.angle = index;
    });
  }

  // Sync Points Management
  addSyncPoint(time, type = 'manual', metadata = {}) {
    const syncPoint = {
      id: `sync_${Date.now()}`,
      time: time,
      type: type, // 'manual', 'clapboard', 'audio', 'visual'
      metadata: metadata,
      confidence: type === 'manual' ? 1.0 : 0.8
    };

    this.syncPoints.push(syncPoint);
    this.syncPoints.sort((a, b) => a.time - b.time);
    return syncPoint;
  }

  removeSyncPoint(syncPointId) {
    const index = this.syncPoints.findIndex(s => s.id === syncPointId);
    if (index > -1) {
      this.syncPoints.splice(index, 1);
    }
  }

  // Auto-sync detection
  async detectSyncPoints() {
    // Simulate auto-detection of sync points
    const detectedPoints = [];

    // Audio-based sync (clapboard detection)
    detectedPoints.push({
      time: 12.5,
      type: 'audio',
      confidence: 0.95,
      metadata: { pattern: 'clapboard' }
    });

    // Visual sync points
    detectedPoints.push({
      time: 45.2,
      type: 'visual',
      confidence: 0.87,
      metadata: { pattern: 'motion' }
    });

    detectedPoints.forEach(point => {
      this.addSyncPoint(point.time, point.type, point.metadata);
    });

    return detectedPoints;
  }

  // Angle Switching
  switchToAngle(angleIndex, time) {
    if (angleIndex >= 0 && angleIndex < this.cameras.length) {
      this.currentAngle = angleIndex;

      // Record the switch for editing
      return {
        time: time,
        fromAngle: this.currentAngle,
        toAngle: angleIndex,
        type: 'manual'
      };
    }
    return null;
  }

  // Cut Detection
  async detectCuts() {
    const cuts = [];

    // Analyze each camera for potential cut points
    for (const camera of this.cameras) {
      // Simulate cut detection algorithm
      const cameraCuts = [
        { time: 15.3, confidence: 0.92, reason: 'motion change' },
        { time: 28.7, confidence: 0.88, reason: 'focus shift' },
        { time: 42.1, confidence: 0.95, reason: 'scene change' }
      ];

      cameraCuts.forEach(cut => {
        cuts.push({
          cameraId: camera.id,
          cameraName: camera.name,
          ...cut
        });
      });
    }

    return cuts.sort((a, b) => a.time - b.time);
  }

  // Export multi-camera timeline
  exportMultiCameraTimeline() {
    return {
      cameras: this.cameras.map(camera => ({ ...camera })),
      syncPoints: this.syncPoints.map(sync => ({ ...sync })),
      cuts: [], // Would be populated from detectCuts()
      metadata: {
        totalCameras: this.cameras.length,
        duration: Math.max(...this.cameras.map(c => c.duration || 0)),
        syncAccuracy: this.calculateSyncAccuracy()
      }
    };
  }

  calculateSyncAccuracy() {
    if (this.syncPoints.length < 2) return 1.0;

    // Calculate average confidence of sync points
    const totalConfidence = this.syncPoints.reduce((sum, point) => sum + point.confidence, 0);
    return totalConfidence / this.syncPoints.length;
  }
}

// Multi-Camera UI Components
export function MultiCameraPanel({ multiCameraEditor, onAngleSwitch, onSyncPointAdd }) {
  const [cameras, setCameras] = React.useState(multiCameraEditor.cameras);
  const [syncPoints, setSyncPoints] = React.useState(multiCameraEditor.syncPoints);
  const [currentAngle, setCurrentAngle] = React.useState(multiCameraEditor.currentAngle);
  const [detectedCuts, setDetectedCuts] = React.useState([]);

  React.useEffect(() => {
    setCameras(multiCameraEditor.cameras);
    setSyncPoints(multiCameraEditor.syncPoints);
  }, [multiCameraEditor]);

  const handleAngleSwitch = (angleIndex) => {
    multiCameraEditor.switchToAngle(angleIndex, Date.now() / 1000);
    setCurrentAngle(angleIndex);
    onAngleSwitch(angleIndex);
  };

  const handleSyncPointAdd = (time) => {
    multiCameraEditor.addSyncPoint(time);
    setSyncPoints([...multiCameraEditor.syncPoints]);
    onSyncPointAdd(time);
  };

  const handleDetectCuts = async () => {
    const cuts = await multiCameraEditor.detectCuts();
    setDetectedCuts(cuts);
  };

  return (
    <div className="multi-camera-panel h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">🎥 Multi-Camera Editing</h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
              {cameras.length} Cameras
            </span>
            <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
              {syncPoints.length} Sync Points
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1">Professional multi-camera workflow</p>
      </div>

      {/* Camera Grid */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {cameras.map((camera, index) => (
            <div
              key={camera.id}
              className={`camera-preview border-2 rounded-lg p-3 cursor-pointer transition-all ${
                index === currentAngle ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => handleAngleSwitch(index)}
            >
              <div className="aspect-video bg-gray-800 rounded mb-2 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">📹</div>
                  <div className="text-xs text-gray-400">Camera {index + 1}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-white">{camera.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {camera.enabled ? 'Active' : 'Disabled'}
              </div>
            </div>
          ))}
        </div>

        {/* Sync Points */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Sync Points</h3>
            <button
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              onClick={() => handleSyncPointAdd(Date.now() / 1000)}
            >
              Add Sync Point
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {syncPoints.map((sync, index) => (
              <div key={sync.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    sync.type === 'manual' ? 'bg-blue-500' :
                    sync.type === 'audio' ? 'bg-green-500' :
                    sync.type === 'visual' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm text-white">Sync {index + 1}</span>
                  <span className="text-xs text-gray-400 capitalize">({sync.type})</span>
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(sync.confidence * 100)}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cut Detection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Cut Detection</h3>
            <button
              className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
              onClick={handleDetectCuts}
            >
              Detect Cuts
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {detectedCuts.map((cut, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-white">{cut.cameraName}</span>
                  <span className="text-xs text-gray-400">({cut.reason})</span>
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(cut.confidence * 100)}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Camera Tools */}
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium">
            🎬 Create Multicam Clip
          </button>
          <button className="p-3 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium">
            🔄 Auto-Sync Cameras
          </button>
          <button className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium">
            📊 Angle Viewer
          </button>
          <button className="p-3 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium">
            🎯 Smart Cuts
          </button>
        </div>
      </div>
    </div>
  );
}

// Multi-Camera Timeline Integration
export function MultiCameraTimeline({ multiCameraEditor, currentTime, onTimeUpdate }) {
  const [angleSwitches, setAngleSwitches] = React.useState([]);

  const handleAngleSwitch = (angleIndex, time) => {
    const switchEvent = multiCameraEditor.switchToAngle(angleIndex, time);
    if (switchEvent) {
      setAngleSwitches([...angleSwitches, switchEvent]);
    }
  };

  return (
    <div className="multi-camera-timeline bg-gray-800 border-t border-gray-700 p-4">
      <div className="flex items-center gap-4 mb-3">
        <h3 className="text-sm font-medium text-white">Multi-Camera Timeline</h3>
        <div className="flex gap-2">
          {multiCameraEditor.cameras.map((camera, index) => (
            <button
              key={camera.id}
              className={`px-3 py-1 text-xs rounded ${
                index === multiCameraEditor.currentAngle
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => handleAngleSwitch(index, currentTime)}
            >
              Cam {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="bg-gray-900 rounded h-20 relative overflow-hidden">
        {/* Time ruler */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 border-b border-gray-700">
          {/* Time markers would go here */}
        </div>

        {/* Angle switches */}
        <div className="absolute top-6 left-0 right-0 bottom-0">
          {angleSwitches.map((switch_, index) => (
            <div
              key={index}
              className="absolute top-2 w-1 h-6 bg-blue-500"
              style={{ left: `${(switch_.time / 60) * 100}%` }}
              title={`Switch to Camera ${switch_.toAngle + 1}`}
            />
          ))}
        </div>

        {/* Camera tracks */}
        {multiCameraEditor.cameras.map((camera, index) => (
          <div
            key={camera.id}
            className={`absolute border-r border-gray-600 ${
              index === multiCameraEditor.currentAngle ? 'bg-blue-900/30' : 'bg-gray-800/50'
            }`}
            style={{
              left: `${(index / multiCameraEditor.cameras.length) * 100}%`,
              top: '6px',
              width: `${100 / multiCameraEditor.cameras.length}%`,
              bottom: '0'
            }}
          >
            <div className="p-2 text-xs text-white text-center">
              {camera.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}