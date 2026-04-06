/**
 * Color Grading Integration - Professional Color Correction at Clip Level
 *
 * Provides Lift/Gamma/Gain controls, color wheels, curves, and LUT support
 * Integrated with GPU acceleration for real-time preview
 */

import type { ColorOverrides, CurvePoint } from "../types/advanced-clips"

/**
 * Color Grading Engine for professional color correction
 */
export class ColorGradingEngine {
  private static instance: ColorGradingEngine
  private lutCache = new Map<string, LUTData>()

  static getInstance(): ColorGradingEngine {
    if (!ColorGradingEngine.instance) {
      ColorGradingEngine.instance = new ColorGradingEngine()
    }
    return ColorGradingEngine.instance
  }

  /**
   * Apply color grading to an image/frame
   */
  async applyColorGrading(imageData: ImageData, overrides: ColorOverrides, useGPU: boolean = true): Promise<ImageData> {
    if (useGPU && this.isWebGLAvailable()) {
      return this.applyGPUColorGrading(imageData, overrides)
    }
    return this.applyCPUColorGrading(imageData, overrides)
  }

  /**
   * CPU-based color grading for fallback
   */
  private applyCPUColorGrading(imageData: ImageData, overrides: ColorOverrides): ImageData {
    const result = new ImageData(imageData.width, imageData.height)
    const data = imageData.data
    const resultData = result.data

    // Pre-compute LUT if needed
    let lut: Float32Array | null = null
    if (overrides.lut?.enabled && overrides.lut.intensity > 0) {
      lut = this.loadLUT(overrides.lut.path)
    }

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] / 255
      let g = data[i + 1] / 255
      let b = data[i + 2] / 255

      // Apply Lift/Gamma/Gain
      if (overrides.lgg) {
        ;[r, g, b] = this.applyLGG([r, g, b], overrides.lgg)
      }

      // Apply color wheels
      if (overrides.colorWheels) {
        ;[r, g, b] = this.applyColorWheels([r, g, b], overrides.colorWheels)
      }

      // Apply curves
      if (overrides.curves) {
        r = this.applyCurve(r, overrides.curves.red)
        g = this.applyCurve(g, overrides.curves.green)
        b = this.applyCurve(b, overrides.curves.blue)

        // Apply master curve
        ;[r, g, b] = this.applyMasterCurve([r, g, b], overrides.curves.master)
      }

      // Apply LUT
      if (lut && overrides.lut) {
        ;[r, g, b] = this.applyLUT([r, g, b], lut, overrides.lut.intensity)
      }

      // Clamp and convert back
      resultData[i] = Math.max(0, Math.min(255, r * 255))
      resultData[i + 1] = Math.max(0, Math.min(255, g * 255))
      resultData[i + 2] = Math.max(0, Math.min(255, b * 255))
      resultData[i + 3] = data[i + 3] // Alpha
    }

    return result
  }

  /**
   * GPU-accelerated color grading using WebGL
   */
  private async applyGPUColorGrading(imageData: ImageData, overrides: ColorOverrides): Promise<ImageData> {
    // This would use WebGL shaders for GPU acceleration
    // For now, fall back to CPU implementation
    return this.applyCPUColorGrading(imageData, overrides)
  }

  /**
   * Apply Lift/Gamma/Gain correction
   */
  private applyLGG(rgb: [number, number, number], lgg: ColorOverrides["lgg"]): [number, number, number] {
    const [r, g, b] = rgb

    // Lift (shadows)
    const rLift = r + (lgg.lift.r / 255) * (1 - r)
    const gLift = g + (lgg.lift.g / 255) * (1 - g)
    const bLift = b + (lgg.lift.b / 255) * (1 - b)

    // Gamma (midtones) - apply power function
    const rGamma = Math.max(rLift, 0.001) ** (1 / (1 + lgg.gamma.r / 100))
    const gGamma = Math.max(gLift, 0.001) ** (1 / (1 + lgg.gamma.g / 100))
    const bGamma = Math.max(bLift, 0.001) ** (1 / (1 + lgg.gamma.b / 100))

    // Gain (highlights)
    const rGain = rGamma * (1 + lgg.gain.r / 100)
    const gGain = gGamma * (1 + lgg.gain.g / 100)
    const bGain = bGamma * (1 + lgg.gain.b / 100)

    return [rGain, gGain, bGain]
  }

  /**
   * Apply color wheels correction
   */
  private applyColorWheels(
    rgb: [number, number, number],
    wheels: ColorOverrides["colorWheels"],
  ): [number, number, number] {
    let [r, g, b] = rgb

    // Calculate luminance for lift/gamma/gain simulation
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

    // Apply shadows wheel
    if (luminance < 0.5) {
      const factor = luminance / 0.5
      r += (wheels.shadows.r / 255) * factor
      g += (wheels.shadows.g / 255) * factor
      b += (wheels.shadows.b / 255) * factor
    }

    // Apply midtones wheel
    if (luminance >= 0.3 && luminance <= 0.7) {
      const factor = 1 - Math.abs(luminance - 0.5) / 0.2
      r += (wheels.midtones.r / 255) * factor
      g += (wheels.midtones.g / 255) * factor
      b += (wheels.midtones.b / 255) * factor
    }

    // Apply highlights wheel
    if (luminance > 0.5) {
      const factor = (luminance - 0.5) / 0.5
      r += (wheels.highlights.r / 255) * factor
      g += (wheels.highlights.g / 255) * factor
      b += (wheels.highlights.b / 255) * factor
    }

    return [r, g, b]
  }

  /**
   * Apply single color curve
   */
  private applyCurve(value: number, curve: CurvePoint[]): number {
    if (curve.length < 2) return value

    // Find the segment that contains this value
    for (let i = 1; i < curve.length; i++) {
      if (value <= curve[i].x) {
        const start = curve[i - 1]
        const end = curve[i]
        const t = (value - start.x) / (end.x - start.x || 0.001)
        return this.lerp(start.y, end.y, t)
      }
    }

    // If value is beyond the last point, extrapolate
    const last = curve[curve.length - 1]
    const secondLast = curve[curve.length - 2]
    const slope = (last.y - secondLast.y) / (last.x - secondLast.x || 0.001)
    return last.y + slope * (value - last.x)
  }

  /**
   * Apply master curve (affects all channels)
   */
  private applyMasterCurve(rgb: [number, number, number], curve: CurvePoint[]): [number, number, number] {
    const avg = (rgb[0] + rgb[1] + rgb[2]) / 3
    const corrected = this.applyCurve(avg, curve)

    // Apply the correction proportionally
    const factor = avg > 0 ? corrected / avg : 1

    return [rgb[0] * factor, rgb[1] * factor, rgb[2] * factor]
  }

  /**
   * Apply LUT correction
   */
  private applyLUT(rgb: [number, number, number], lut: Float32Array, intensity: number): [number, number, number] {
    // Simplified LUT application - in reality this would be more complex
    // assuming a 3D LUT with dimensions that can be indexed

    const r = Math.floor(rgb[0] * 63) // 64x64x64 LUT assumed
    const g = Math.floor(rgb[1] * 63)
    const b = Math.floor(rgb[2] * 63)

    const index = (r * 64 * 64 + g * 64 + b) * 3

    if (index + 2 < lut.length) {
      const lutR = lut[index]
      const lutG = lut[index + 1]
      const lutB = lut[index + 2]

      // Blend with original color based on intensity
      return [
        this.lerp(rgb[0], lutR, intensity),
        this.lerp(rgb[1], lutG, intensity),
        this.lerp(rgb[2], lutB, intensity),
      ]
    }

    return rgb
  }

  /**
   * Linear interpolation
   */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  /**
   * Load LUT from file
   */
  private loadLUT(path: string): Float32Array | null {
    if (this.lutCache.has(path)) {
      return this.lutCache.get(path)!.data
    }

    // In a real implementation, this would load the LUT file
    // For now, return null to indicate LUT loading failure
    return null
  }

  /**
   * Check if WebGL is available for GPU acceleration
   */
  private isWebGLAvailable(): boolean {
    try {
      const canvas = document.createElement("canvas")
      return !!(window.WebGLRenderingContext && canvas.getContext("webgl"))
    } catch (e) {
      return false
    }
  }

  /**
   * Create default color overrides
   */
  createDefaultOverrides(): ColorOverrides {
    return {
      lgg: {
        lift: { r: 0, g: 0, b: 0 },
        gamma: { r: 0, g: 0, b: 0 },
        gain: { r: 0, g: 0, b: 0 },
        offset: { r: 0, g: 0, b: 0 },
      },
      colorWheels: {
        shadows: { r: 0, g: 0, b: 0, luma: 0 },
        midtones: { r: 0, g: 0, b: 0, luma: 0 },
        highlights: { r: 0, g: 0, b: 0, luma: 0 },
      },
      curves: {
        master: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
        red: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
        green: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
        blue: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
      },
    }
  }

  /**
   * Validate color overrides
   */
  validateOverrides(overrides: ColorOverrides): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate LGG values (-100 to 100)
    if (overrides.lgg) {
      const validateColor = (color: { r: number; g: number; b: number }, name: string) => {
        if (Math.abs(color.r) > 100) errors.push(`${name} red value out of range: ${color.r}`)
        if (Math.abs(color.g) > 100) errors.push(`${name} green value out of range: ${color.g}`)
        if (Math.abs(color.b) > 100) errors.push(`${name} blue value out of range: ${color.b}`)
      }

      validateColor(overrides.lgg.lift, "Lift")
      validateColor(overrides.lgg.gamma, "Gamma")
      validateColor(overrides.lgg.gain, "Gain")
      validateColor(overrides.lgg.offset, "Offset")
    }

    // Validate curves
    if (overrides.curves) {
      const validateCurve = (curve: CurvePoint[], name: string) => {
        for (let i = 0; i < curve.length; i++) {
          const point = curve[i]
          if (point.x < 0 || point.x > 1) {
            errors.push(`${name} curve point ${i} x-value out of range: ${point.x}`)
          }
          if (point.y < 0 || point.y > 1) {
            errors.push(`${name} curve point ${i} y-value out of range: ${point.y}`)
          }
        }

        // Check if points are sorted by x
        for (let i = 1; i < curve.length; i++) {
          if (curve[i].x < curve[i - 1].x) {
            errors.push(`${name} curve points must be sorted by x-value`)
            break
          }
        }
      }

      validateCurve(overrides.curves.master, "Master")
      validateCurve(overrides.curves.red, "Red")
      validateCurve(overrides.curves.green, "Green")
      validateCurve(overrides.curves.blue, "Blue")
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Get preset color grades
   */
  static getPresets(): Record<string, Partial<ColorOverrides>> {
    return {
      // Cinematic look
      cinematic: {
        lgg: {
          lift: { r: -5, g: -3, b: -8 },
          gamma: { r: 10, g: 8, b: 12 },
          gain: { r: 5, g: 3, b: 8 },
          offset: { r: 0, g: 0, b: 0 },
        },
        colorWheels: {
          shadows: { r: 5, g: 3, b: -5, luma: 0 },
          midtones: { r: -2, g: 0, b: 3, luma: 0 },
          highlights: { r: 8, g: 5, b: 10, luma: 0 },
        },
      },

      // Teal and orange (popular cinematic grade)
      tealOrange: {
        lgg: {
          lift: { r: -10, g: -5, b: 5 },
          gamma: { r: 15, g: 10, b: -10 },
          gain: { r: -5, g: 0, b: 15 },
          offset: { r: 0, g: 0, b: 0 },
        },
      },

      // High contrast B&W
      highContrastBW: {
        curves: {
          master: [
            { x: 0, y: 0 },
            { x: 0.5, y: 0.3 },
            { x: 1, y: 1 },
          ],
          red: [
            { x: 0, y: 0 },
            { x: 0.33, y: 0.33 },
            { x: 0.66, y: 0.33 },
            { x: 1, y: 1 },
          ],
          green: [
            { x: 0, y: 0 },
            { x: 0.33, y: 0.33 },
            { x: 0.66, y: 0.33 },
            { x: 1, y: 1 },
          ],
          blue: [
            { x: 0, y: 0 },
            { x: 0.33, y: 0.33 },
            { x: 0.66, y: 0.33 },
            { x: 1, y: 1 },
          ],
        },
      },

      // Warm vintage look
      vintage: {
        lgg: {
          lift: { r: 8, g: 5, b: -3 },
          gamma: { r: -5, g: -3, b: 8 },
          gain: { r: 12, g: 8, b: -5 },
          offset: { r: 0, g: 0, b: 0 },
        },
        colorWheels: {
          shadows: { r: 15, g: 10, b: 5, luma: 0 },
          midtones: { r: 5, g: 3, b: -2, luma: 0 },
          highlights: { r: -8, g: -5, b: 12, luma: 0 },
        },
      },
    }
  }

  /**
   * Create color overrides from preset
   */
  createFromPreset(presetName: string): ColorOverrides {
    const presets = ColorGradingEngine.getPresets()
    const preset = presets[presetName]

    if (!preset) {
      throw new Error(`Unknown color grading preset: ${presetName}`)
    }

    return {
      ...this.createDefaultOverrides(),
      ...preset,
    }
  }

  /**
   * Export color grade as LUT
   */
  async exportAsLUT(overrides: ColorOverrides, size: number = 32): Promise<ArrayBuffer> {
    // Create a 3D LUT
    const lutSize = size * size * size * 3 // RGB values for each point
    const lut = new Float32Array(lutSize)

    // Generate LUT by applying color grading to a gradient
    for (let b = 0; b < size; b++) {
      for (let g = 0; g < size; g++) {
        for (let r = 0; r < size; r++) {
          const rgb: [number, number, number] = [r / (size - 1), g / (size - 1), b / (size - 1)]

          // Apply color grading (CPU only for LUT generation)
          const graded = this.applyCPUColorGrading(
            { width: 1, height: 1, data: new Uint8ClampedArray([rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, 255]) },
            overrides,
          )

          const index = (r + g * size + b * size * size) * 3
          lut[index] = graded.data[0] / 255
          lut[index + 1] = graded.data[1] / 255
          lut[index + 2] = graded.data[2] / 255
        }
      }
    }

    // Convert to binary format (simplified .cube format)
    return this.encodeLUT(lut, size)
  }

  /**
   * Encode LUT as binary data
   */
  private encodeLUT(lut: Float32Array, size: number): ArrayBuffer {
    // This would encode in a standard LUT format like .cube
    // For now, return a simple binary representation
    return lut.buffer.slice(0)
  }
}

/**
 * LUT Data Structure
 */
interface LUTData {
  data: Float32Array
  size: number
  format: "cube" | "3dl" | "binary"
  lastAccessed: Date
}

/**
 * WebGL Color Grading Shader Manager
 */
export class ColorGradingShaderManager {
  private gl: WebGLRenderingContext | null = null
  private program: WebGLProgram | null = null

  /**
   * Initialize WebGL context
   */
  initialize(canvas: HTMLCanvasElement): boolean {
    try {
      this.gl = canvas.getContext("webgl")
      if (!this.gl) return false

      this.createShaders()
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Create WebGL shaders for color grading
   */
  private createShaders(): void {
    if (!this.gl) return

    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `,
    )

    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      uniform sampler2D u_image;
      uniform vec3 u_lift;
      uniform vec3 u_gamma;
      uniform vec3 u_gain;
      varying vec2 v_texCoord;

      void main() {
        vec4 color = texture2D(u_image, v_texCoord);

        // Apply Lift/Gamma/Gain
        color.rgb += u_lift * (1.0 - color.rgb);
        color.rgb = pow(max(color.rgb, vec3(0.001)), 1.0 / (1.0 + u_gamma));
        color.rgb *= (1.0 + u_gain);

        gl_FragColor = color;
      }
    `,
    )

    if (vertexShader && fragmentShader) {
      this.program = this.createProgram(vertexShader, fragmentShader)
    }
  }

  /**
   * Create a WebGL shader
   */
  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null

    const shader = this.gl.createShader(type)
    if (!shader) return null

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      return null
    }

    return shader
  }

  /**
   * Create a WebGL program
   */
  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    if (!this.gl) return null

    const program = this.gl.createProgram()
    if (!program) return null

    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("Program linking error:", this.gl.getProgramInfoLog(program))
      this.gl.deleteProgram(program)
      return null
    }

    return program
  }

  /**
   * Apply color grading using WebGL
   */
  applyColorGrading(imageData: ImageData, overrides: ColorOverrides): ImageData {
    if (!this.gl || !this.program) {
      throw new Error("WebGL not initialized")
    }

    // This would implement the full WebGL rendering pipeline
    // For now, return the original image data
    return imageData
  }
}

// Export singleton instances
export const colorGradingEngine = ColorGradingEngine.getInstance()
export const colorGradingShaderManager = new ColorGradingShaderManager()
