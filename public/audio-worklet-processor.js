/**
 * Audio Worklet Processor for Real-time Audio Processing
 *
 * Handles low-latency audio processing in a separate thread
 */

class AudioProcessingWorklet extends AudioWorkletProcessor {
  private bufferSize: number = 128
  private inputBuffer: Float32Array[] = []
  private outputBuffer: Float32Array[] = []

  constructor() {
    super()

    // Initialize buffers
    for (let i = 0; i < 2; i++) {
      this.inputBuffer[i] = new Float32Array(this.bufferSize)
      this.outputBuffer[i] = new Float32Array(this.bufferSize)
    }

    // Listen for parameter changes from main thread
    this.port.onmessage = (event) => {
      const { type, data } = event.data

      switch (type) {
        case 'SET_EFFECTS_CHAIN':
          this.setEffectsChain(data)
          break
        case 'SET_PROCESSING_PARAMS':
          this.setProcessingParams(data)
          break
        case 'RESET':
          this.reset()
          break
      }
    }
  }

  private effectsChain: any[] = []
  private processingParams: any = {}

  setEffectsChain(chain: any[]) {
    this.effectsChain = chain
  }

  setProcessingParams(params: any) {
    this.processingParams = params
  }

  reset() {
    this.effectsChain = []
    this.processingParams = {}
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: any) {
    const input = inputs[0]
    const output = outputs[0]

    if (!input || !output) return true

    // Process each channel
    for (let channel = 0; channel < Math.min(input.length, output.length); channel++) {
      const inputChannel = input[channel]
      const outputChannel = output[channel]

      if (!inputChannel || !outputChannel) continue

      // Copy input to output (passthrough by default)
      outputChannel.set(inputChannel)

      // Apply effects chain
      for (const effect of this.effectsChain) {
        if (effect.enabled) {
          this.applyEffect(outputChannel, effect, parameters)
        }
      }
    }

    return true
  }

  private applyEffect(buffer: Float32Array, effect: any, parameters: any) {
    switch (effect.type) {
      case 'volume':
        this.applyVolume(buffer, effect.parameters.volume || 1.0)
        break
      case 'pan':
        // Pan would need stereo processing
        break
      case 'eq':
        this.applyEQ(buffer, effect.parameters)
        break
      case 'compressor':
        this.applyCompressor(buffer, effect.parameters)
        break
      case 'delay':
        this.applyDelay(buffer, effect.parameters)
        break
      case 'reverb':
        // Convolution reverb would be implemented here
        break
    }
  }

  private applyVolume(buffer: Float32Array, volume: number) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] *= volume
    }
  }

  private applyEQ(buffer: Float32Array, params: any) {
    // Simple biquad filter coefficients would be calculated here
    // This is a simplified implementation
    const lowGain = params.lowGain || 0
    const highGain = params.highGain || 0
    const midGain = params.midGain || 0

    for (let i = 0; i < buffer.length; i++) {
      let sample = buffer[i]

      // Very basic frequency-specific gain
      if (lowGain !== 0) sample *= Math.pow(10, lowGain / 20)
      if (highGain !== 0) sample *= Math.pow(10, highGain / 20)
      if (midGain !== 0) sample *= Math.pow(10, midGain / 20)

      buffer[i] = sample
    }
  }

  private applyCompressor(buffer: Float32Array, params: any) {
    const threshold = params.threshold || -20
    const ratio = params.ratio || 4
    const attack = params.attack || 0.003
    const release = params.release || 0.25

    let envelope = 0

    for (let i = 0; i < buffer.length; i++) {
      const inputLevel = Math.abs(buffer[i])

      // Simple envelope follower
      if (inputLevel > envelope) {
        envelope = envelope + (inputLevel - envelope) * attack
      } else {
        envelope = envelope + (inputLevel - envelope) * release
      }

      // Apply compression
      const inputDb = 20 * Math.log10(Math.max(inputLevel, 0.0001))
      let outputDb = inputDb

      if (inputDb > threshold) {
        outputDb = threshold + (inputDb - threshold) / ratio
      }

      const outputLevel = Math.pow(10, outputDb / 20)
      buffer[i] = Math.sign(buffer[i]) * outputLevel
    }
  }

  private applyDelay(buffer: Float32Array, params: any) {
    const delayTime = params.delayTime || 0.3
    const feedback = params.feedback || 0.3
    const mix = params.mix || 0.5

    // Simple delay implementation
    const delaySamples = Math.floor(delayTime * sampleRate)
    const delayBuffer = new Float32Array(delaySamples)
    let delayIndex = 0

    for (let i = 0; i < buffer.length; i++) {
      const inputSample = buffer[i]
      const delayedSample = delayBuffer[delayIndex]

      const outputSample = inputSample * (1 - mix) + delayedSample * mix
      buffer[i] = outputSample

      delayBuffer[delayIndex] = inputSample + delayedSample * feedback
      delayIndex = (delayIndex + 1) % delaySamples
    }
  }
}

registerProcessor('audio-processing-worklet', AudioProcessingWorklet)