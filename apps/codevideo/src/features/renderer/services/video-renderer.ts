/**
 * CodeVideo Video Rendering Engine
 *
 * Connects to MUAPI for actual video generation from React code
 * Handles the full pipeline: code → rendering → video output
 */

import { createLogger } from "@/lib/logger"

const logger = createLogger("VideoRenderer")

export interface RenderConfig {
  code: string
  duration: number
  resolution: string
  quality: string
  format: string
  apiKey: string
  endpoint: string
}

export interface RenderProgress {
  stage: 'uploading' | 'rendering' | 'encoding' | 'complete'
  progress: number
  message: string
  estimatedTimeRemaining?: number
}

export interface RenderResult {
  success: boolean
  videoUrl?: string
  thumbnailUrl?: string
  duration: number
  resolution: string
  fileSize?: number
  error?: string
}

export class VideoRenderer {
  private renderCallbacks: Map<string, (progress: RenderProgress) => void> = new Map()
  private activeRenders: Map<string, AbortController> = new Map()

  /**
   * Render video from React code using MUAPI
   */
  async renderVideo(config: RenderConfig): Promise<RenderResult> {
    const renderId = crypto.randomUUID()
    const abortController = new AbortController()
    this.activeRenders.set(renderId, abortController)

    try {
      logger.info("Starting video render", { renderId, config: { ...config, apiKey: '[REDACTED]' } })

      // Step 1: Validate and prepare the code
      const preparedCode = await this.prepareCode(config.code)

      // Step 2: Upload code to MUAPI
      const uploadResult = await this.uploadToMUAPI(preparedCode, config, (progress) => {
        this.emitProgress(renderId, { stage: 'uploading', progress, message: 'Uploading code...' })
      })

      if (!uploadResult.success) {
        throw new Error(`Upload failed: ${uploadResult.error}`)
      }

      // Step 3: Start rendering
      const renderJob = await this.startRenderJob(uploadResult.jobId, config)

      // Step 4: Monitor progress
      const result = await this.monitorRenderProgress(renderJob.jobId, renderId, config)

      logger.info("Video render completed", { renderId, result: { ...result, videoUrl: result.videoUrl?.slice(0, 50) + '...' } })

      return result

    } catch (error) {
      logger.error("Video render failed", { renderId, error: error instanceof Error ? error.message : 'Unknown error' })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown render error',
        duration: config.duration,
        resolution: config.resolution
      }
    } finally {
      this.activeRenders.delete(renderId)
    }
  }

  /**
   * Cancel an active render
   */
  cancelRender(renderId: string): boolean {
    const controller = this.activeRenders.get(renderId)
    if (controller) {
      controller.abort()
      this.activeRenders.delete(renderId)
      logger.info("Render cancelled", { renderId })
      return true
    }
    return false
  }

  /**
   * Set progress callback for a render
   */
  onProgress(renderId: string, callback: (progress: RenderProgress) => void): void {
    this.renderCallbacks.set(renderId, callback)
  }

  /**
   * Remove progress callback
   */
  removeProgressCallback(renderId: string): void {
    this.renderCallbacks.delete(renderId)
  }

  // Private methods

  private async prepareCode(code: string): Promise<string> {
    // Validate the code has required exports
    if (!code.includes('export const') && !code.includes('export function')) {
      throw new Error('Code must export a React component')
    }

    // Wrap in proper module structure
    const wrappedCode = `
// Auto-generated wrapper for CodeVideo render
${code}

// Export default for rendering
export default MyVideo;
`

    return wrappedCode
  }

  private async uploadToMUAPI(
    code: string,
    config: RenderConfig,
    onProgress: (progress: number) => void
  ): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
      onProgress(10)

      const response = await fetch(`${config.endpoint}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          code,
          duration: config.duration,
          resolution: config.resolution,
          quality: config.quality,
          format: config.format
        })
      })

      onProgress(50)

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error: `Upload failed: ${response.status} ${error}` }
      }

      const result = await response.json()
      onProgress(100)

      return { success: true, jobId: result.jobId }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload network error'
      }
    }
  }

  private async startRenderJob(
    uploadJobId: string,
    config: RenderConfig
  ): Promise<{ jobId: string }> {
    const response = await fetch(`${config.endpoint}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        uploadJobId,
        duration: config.duration,
        resolution: config.resolution,
        quality: config.quality,
        format: config.format
      })
    })

    if (!response.ok) {
      throw new Error(`Render start failed: ${response.status}`)
    }

    const result = await response.json()
    return { jobId: result.renderJobId }
  }

  private async monitorRenderProgress(
    jobId: string,
    renderId: string,
    config: RenderConfig
  ): Promise<RenderResult> {
    const pollInterval = 2000 // 2 seconds
    const maxWaitTime = 300000 // 5 minutes
    const startTime = Date.now()

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await fetch(`${config.endpoint}/status/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`
          }
        })

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`)
        }

        const status = await response.json()

        // Update progress
        const progress: RenderProgress = {
          stage: status.stage,
          progress: status.progress,
          message: status.message,
          estimatedTimeRemaining: status.estimatedTimeRemaining
        }
        this.emitProgress(renderId, progress)

        // Check if complete
        if (status.stage === 'complete') {
          return {
            success: true,
            videoUrl: status.videoUrl,
            thumbnailUrl: status.thumbnailUrl,
            duration: config.duration,
            resolution: config.resolution,
            fileSize: status.fileSize
          }
        }

        // Check if failed
        if (status.stage === 'error') {
          return {
            success: false,
            error: status.error,
            duration: config.duration,
            resolution: config.resolution
          }
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval))

      } catch (error) {
        logger.error("Status check failed", { jobId, error })
        // Continue polling despite errors
      }
    }

    // Timeout
    return {
      success: false,
      error: 'Render timeout - took longer than 5 minutes',
      duration: config.duration,
      resolution: config.resolution
    }
  }

  private emitProgress(renderId: string, progress: RenderProgress): void {
    const callback = this.renderCallbacks.get(renderId)
    if (callback) {
      callback(progress)
    }
  }
}

// Singleton instance
export const videoRenderer = new VideoRenderer()