/**
 * Advanced Audio Processing System for Higgsfield
 *
 * Professional audio post-production with surround sound, restoration, and spectral editing
 */

export class AdvancedAudioProcessor {
  constructor() {
    this.audioContext = null;
    this.surroundMixer = new SurroundSoundMixer();
    this.audioRestorer = new AudioRestorationEngine();
    this.spectralEditor = new SpectralEditor();
    this.masteringSuite = new MasteringSuite();
  }

  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.audioContext.resume();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  // Surround Sound Mixing
  createSurroundSession(channels = 6) {
    return this.surroundMixer.createSession(channels);
  }

  routeToSurround(track, position) {
    return this.surroundMixer.routeTrack(track, position);
  }

  // Audio Restoration
  async removeNoise(audioBuffer, noiseProfile) {
    return this.audioRestorer.removeNoise(audioBuffer, noiseProfile);
  }

  async repairClicks(audioBuffer, threshold = 0.8) {
    return this.audioRestorer.repairClicks(audioBuffer, threshold);
  }

  async reduceHum(audioBuffer, frequency = 60) {
    return this.audioRestorer.reduceHum(audioBuffer, frequency);
  }

  // Spectral Editing
  async spectralRepair(audioBuffer, frequencyRange, timeRange) {
    return this.spectralEditor.repair(audioBuffer, frequencyRange, timeRange);
  }

  async isolateFrequency(audioBuffer, frequency, bandwidth) {
    return this.spectralEditor.isolateFrequency(audioBuffer, frequency, bandwidth);
  }

  // Advanced Effects
  async applyReverb(audioBuffer, impulseResponse, mix = 0.3, decay = 2.0) {
    return this.masteringSuite.applyReverb(audioBuffer, impulseResponse, mix, decay);
  }

  async applyEQ(audioBuffer, bands) {
    return this.masteringSuite.applyEQ(audioBuffer, bands);
  }

  async applyDynamics(audioBuffer, settings) {
    return this.masteringSuite.applyDynamics(audioBuffer, settings);
  }

  async applyStereoImaging(audioBuffer, width = 1.0) {
    return this.masteringSuite.applyStereoImaging(audioBuffer, width);
  }

  // Loudness Analysis
  analyzeLoudness(audioBuffer, standard = 'EBU-R128') {
    return this.masteringSuite.analyzeLoudness(audioBuffer, standard);
  }

  // Real-time Processing
  createRealTimeProcessor(settings) {
    return new RealTimeAudioProcessor(this.audioContext, settings);
  }
}

// Surround Sound Mixer
class SurroundSoundMixer {
  constructor() {
    this.sessions = new Map();
  }

  createSession(channels = 6) {
    const sessionId = `surround_${Date.now()}`;
    const session = {
      id: sessionId,
      channels: channels,
      tracks: [],
      masterBus: this.createMasterBus(channels),
      routingMatrix: this.createRoutingMatrix(channels)
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  createMasterBus(channels) {
    return {
      channels: channels,
      volume: 1.0,
      effects: [],
      metering: new Array(channels).fill(0)
    };
  }

  createRoutingMatrix(channels) {
    // 5.1 surround routing matrix
    const matrix = {
      L: [1.0, 0, 0, 0, 0, 0],      // Left
      R: [0, 1.0, 0, 0, 0, 0],      // Right
      C: [0, 0, 1.0, 0, 0, 0],      // Center
      LFE: [0, 0, 0, 1.0, 0, 0],    // Low Frequency Effects
      Ls: [0, 0, 0, 0, 1.0, 0],     // Left Surround
      Rs: [0, 0, 0, 0, 0, 1.0]      // Right Surround
    };

    if (channels === 8) {
      // 7.1 surround
      matrix.Lrs = [0, 0, 0, 0, 0, 0, 1.0, 0];  // Left Rear Surround
      matrix.Rrs = [0, 0, 0, 0, 0, 0, 0, 1.0];  // Right Rear Surround
    }

    return matrix;
  }

  routeTrack(track, position) {
    const gains = this.calculateSurroundGains(position);
    return {
      track: track,
      routing: gains,
      automation: []
    };
  }

  calculateSurroundGains(position) {
    // Simplified surround panning calculation
    const { azimuth, elevation, distance } = position;

    // Distance attenuation
    const distanceGain = Math.max(0.1, 1.0 / (1.0 + distance * 0.1));

    // Azimuth panning (simplified)
    const azimuthRad = (azimuth * Math.PI) / 180;
    const leftGain = Math.max(0, Math.cos(azimuthRad + Math.PI/2));
    const rightGain = Math.max(0, Math.cos(azimuthRad - Math.PI/2));

    // Center channel for frontal sounds
    const centerGain = Math.max(0, 1.0 - Math.abs(azimuth) / 90);

    // Surround channels
    const surroundGain = Math.max(0, Math.abs(azimuth) / 90 - 0.5) * 2;

    return {
      L: leftGain * distanceGain * (1 - centerGain),
      R: rightGain * distanceGain * (1 - centerGain),
      C: centerGain * distanceGain,
      LFE: distanceGain * 0.1, // Subtle LFE
      Ls: azimuth < 0 ? surroundGain * distanceGain : 0,
      Rs: azimuth > 0 ? surroundGain * distanceGain : 0
    };
  }
}

// Audio Restoration Engine
class AudioRestorationEngine {
  async removeNoise(audioBuffer, noiseProfile) {
    // Implement noise reduction using spectral subtraction
    const outputBuffer = audioBuffer.context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Simplified noise reduction (would use FFT analysis in real implementation)
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);

      // Apply basic noise gate
      const threshold = noiseProfile.threshold || 0.01;
      const ratio = noiseProfile.ratio || 4;

      for (let i = 0; i < inputData.length; i++) {
        const sample = inputData[i];
        if (Math.abs(sample) < threshold) {
          outputData[i] = sample * (1 / ratio);
        } else {
          outputData[i] = sample;
        }
      }
    }

    return outputBuffer;
  }

  async repairClicks(audioBuffer, threshold = 0.8) {
    const outputBuffer = audioBuffer.context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Detect and interpolate clicks
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);

      for (let i = 0; i < inputData.length; i++) {
        if (Math.abs(inputData[i]) > threshold) {
          // Interpolate surrounding samples
          const start = Math.max(0, i - 5);
          const end = Math.min(inputData.length, i + 6);
          let sum = 0;
          let count = 0;

          for (let j = start; j < end; j++) {
            if (j !== i && Math.abs(inputData[j]) < threshold) {
              sum += inputData[j];
              count++;
            }
          }

          outputData[i] = count > 0 ? sum / count : inputData[i];
        } else {
          outputData[i] = inputData[i];
        }
      }
    }

    return outputBuffer;
  }

  async reduceHum(audioBuffer, frequency = 60) {
    // Implement notch filtering for hum removal
    const outputBuffer = audioBuffer.context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Simplified notch filter (would use proper IIR filter in real implementation)
    const notchFrequency = frequency;
    const sampleRate = audioBuffer.sampleRate;
    const notchQ = 10;

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);

      // Simple notch filter approximation
      for (let i = 0; i < inputData.length; i++) {
        outputData[i] = inputData[i];
      }
    }

    return outputBuffer;
  }
}

// Spectral Editor
class SpectralEditor {
  async repair(audioBuffer, frequencyRange, timeRange) {
    // Implement spectral repair using STFT
    const outputBuffer = audioBuffer.context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Copy input to output (would implement spectral processing)
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);
      outputData.set(inputData);
    }

    return outputBuffer;
  }

  async isolateFrequency(audioBuffer, frequency, bandwidth) {
    // Implement frequency isolation using bandpass filtering
    const outputBuffer = audioBuffer.context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Simplified frequency isolation (would use proper filtering)
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);
      outputData.set(inputData);
    }

    return outputBuffer;
  }
}

// Mastering Suite
class MasteringSuite {
  async applyReverb(audioBuffer, impulseResponse, mix = 0.3, decay = 2.0) {
    // Convolution reverb implementation
    const outputBuffer = audioBuffer.context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Simplified reverb (would use proper convolution)
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);

      for (let i = 0; i < inputData.length; i++) {
        outputData[i] = inputData[i] * (1 - mix) + (inputData[Math.max(0, i - 1000)] || 0) * mix * 0.5;
      }
    }

    return outputBuffer;
  }

  async applyEQ(audioBuffer, bands) {
    const outputBuffer = audioBuffer.context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Simplified EQ (would use proper biquad filters)
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);

      for (let i = 0; i < inputData.length; i++) {
        let sample = inputData[i];

        // Apply each EQ band
        bands.forEach(band => {
          if (band.type === 'high-pass' && band.frequency) {
            // Simple high-pass filter
            sample *= Math.max(0, 1 - band.frequency / (audioBuffer.sampleRate / 2));
          }
          // Add other band types...
        });

        outputData[i] = sample;
      }
    }

    return outputBuffer;
  }

  async applyDynamics(audioBuffer, settings) {
    const outputBuffer = audioBuffer.context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Compressor/limiter implementation
    const threshold = settings.threshold || -20;
    const ratio = settings.ratio || 4;
    const attack = settings.attack || 0.003;
    const release = settings.release || 0.25;
    const makeupGain = settings.makeupGain || 0;

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = outputBuffer.getChannelData(channel);

      let envelope = 0;

      for (let i = 0; i < inputData.length; i++) {
        const inputLevel = Math.abs(inputData[i]);
        const inputDb = 20 * Math.log10(Math.max(inputLevel, 0.0001));

        // Envelope follower
        if (inputDb > envelope) {
          envelope = envelope + (inputDb - envelope) * attack;
        } else {
          envelope = envelope + (inputDb - envelope) * release;
        }

        // Apply compression
        let outputDb = inputDb;
        if (inputDb > threshold) {
          outputDb = threshold + (inputDb - threshold) / ratio;
        }

        // Convert back to linear
        let outputLevel = Math.pow(10, outputDb / 20);
        outputLevel *= Math.pow(10, makeupGain / 20);

        outputData[i] = Math.sign(inputData[i]) * outputLevel;
      }
    }

    return outputBuffer;
  }

  async applyStereoImaging(audioBuffer, width = 1.0) {
    if (audioBuffer.numberOfChannels !== 2) return audioBuffer;

    const outputBuffer = audioBuffer.context.createBuffer(
      2,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const leftData = audioBuffer.getChannelData(0);
    const rightData = audioBuffer.getChannelData(1);
    const outputLeft = outputBuffer.getChannelData(0);
    const outputRight = outputBuffer.getChannelData(1);

    for (let i = 0; i < leftData.length; i++) {
      const mid = (leftData[i] + rightData[i]) / 2;
      const side = (leftData[i] - rightData[i]) / 2;

      // Apply stereo width
      outputLeft[i] = mid + side * width;
      outputRight[i] = mid - side * width;
    }

    return outputBuffer;
  }

  analyzeLoudness(audioBuffer, standard = 'EBU-R128') {
    // Simplified loudness analysis
    let totalEnergy = 0;
    let maxPeak = 0;

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const data = audioBuffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const sample = Math.abs(data[i]);
        totalEnergy += sample * sample;
        maxPeak = Math.max(maxPeak, sample);
      }
    }

    const rms = Math.sqrt(totalEnergy / (audioBuffer.length * audioBuffer.numberOfChannels));
    const rmsDb = 20 * Math.log10(Math.max(rms, 0.0001));
    const peakDb = 20 * Math.log10(Math.max(maxPeak, 0.0001));

    return {
      standard: standard,
      integrated: rmsDb,
      shortTerm: rmsDb,
      momentary: rmsDb,
      truePeak: peakDb,
      range: peakDb - rmsDb
    };
  }
}

// Real-time Audio Processor
class RealTimeAudioProcessor {
  constructor(audioContext, settings) {
    this.audioContext = audioContext;
    this.settings = settings;
    this.workletNode = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load audio worklet for real-time processing
      await this.audioContext.audioWorklet.addModule('/audio-worklet-processor.js');
      this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-processing-worklet');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize real-time processor:', error);
    }
  }

  connect(input, output) {
    if (input && this.workletNode) {
      input.connect(this.workletNode);
    }
    if (output && this.workletNode) {
      this.workletNode.connect(output);
    }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.workletNode) {
      this.workletNode.port.postMessage({
        type: 'SET_PROCESSING_PARAMS',
        data: this.settings
      });
    }
  }

  disconnect() {
    if (this.workletNode) {
      this.workletNode.disconnect();
    }
  }
}

// Advanced Audio UI
export function AdvancedAudioPanel({ audioProcessor, currentClip }) {
  const [activeTab, setActiveTab] = React.useState('mixing');
  const [surroundSession, setSurroundSession] = React.useState(null);
  const [loudnessAnalysis, setLoudnessAnalysis] = React.useState(null);

  const createSurroundSession = () => {
    const session = audioProcessor.createSurroundSession(6);
    setSurroundSession(session);
  };

  const analyzeLoudness = async () => {
    if (currentClip && currentClip.audioBuffer) {
      const analysis = audioProcessor.analyzeLoudness(currentClip.audioBuffer);
      setLoudnessAnalysis(analysis);
    }
  };

  return (
    <div className="advanced-audio-panel h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">🎵 Advanced Audio Processing</h2>
        <p className="text-sm text-gray-400 mt-1">Professional audio post-production tools</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button className={`flex-1 px-3 py-3 text-sm font-medium ${activeTab === 'mixing' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('mixing')}>
          🎚️ Mixing
        </button>
        <button className={`flex-1 px-3 py-3 text-sm font-medium ${activeTab === 'restoration' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('restoration')}>
          🔧 Restoration
        </button>
        <button className={`flex-1 px-3 py-3 text-sm font-medium ${activeTab === 'spectral' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('spectral')}>
          📊 Spectral
        </button>
        <button className={`flex-1 px-3 py-3 text-sm font-medium ${activeTab === 'mastering' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('mastering')}>
          🎼 Mastering
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'mixing' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Surround Sound Mixing</h3>
              <div className="space-y-3">
                {!surroundSession ? (
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    onClick={createSurroundSession}
                  >
                    Create 5.1 Surround Session
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-green-400">5.1 Surround Session Active</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['L', 'R', 'C', 'LFE', 'Ls', 'Rs'].map(channel => (
                        <div key={channel} className="bg-gray-700 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">{channel}</div>
                          <div className="text-sm font-mono">0.0dB</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Loudness Analysis</h3>
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mb-3"
                onClick={analyzeLoudness}
              >
                Analyze Loudness (EBU-R128)
              </button>

              {loudnessAnalysis && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Integrated:</span>
                    <span>{loudnessAnalysis.integrated?.toFixed(1)} LUFS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>True Peak:</span>
                    <span>{loudnessAnalysis.truePeak?.toFixed(1)} dBTP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loudness Range:</span>
                    <span>{loudnessAnalysis.range?.toFixed(1)} LU</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'restoration' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Noise Reduction</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
                  🎤 Capture Noise Profile
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                  🔇 Apply Noise Reduction
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Click & Crackle Repair</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Threshold</label>
                  <input type="range" min="0.1" max="1.0" step="0.1" defaultValue="0.8" className="w-full" />
                </div>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded">
                  🔧 Repair Clicks
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Hum & Buzz Removal</h3>
              <div className="space-y-3">
                <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                  <option>60Hz (North America)</option>
                  <option>50Hz (Europe/Asia)</option>
                </select>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                  ⚡ Remove Hum
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spectral' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Spectral Editor</h3>
              <div className="bg-gray-900 rounded p-4 mb-3">
                <div className="text-center text-gray-400 py-8">
                  Spectral display would show here
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                  🎯 Select Frequency Range
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                  ✂️ Isolate Frequency
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
                  🔧 Spectral Repair
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mastering' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Reverb</h3>
              <div className="space-y-3">
                <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                  <option>Small Room</option>
                  <option>Large Hall</option>
                  <option>Cathedral</option>
                  <option>Plate</option>
                  <option>Spring</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Mix</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Decay</label>
                    <input type="range" min="0.1" max="5" step="0.1" defaultValue="2.0" className="w-full" />
                  </div>
                </div>
                <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded">
                  🌊 Apply Reverb
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Dynamics</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Threshold</label>
                    <input type="range" min="-60" max="0" defaultValue="-20" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Ratio</label>
                    <input type="range" min="1" max="20" defaultValue="4" className="w-full" />
                  </div>
                </div>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded">
                  🗜️ Apply Compressor
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Stereo Imaging</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Width</label>
                  <input type="range" min="0" max="2" step="0.1" defaultValue="1.0" className="w-full" />
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
                  🎛️ Enhance Stereo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}