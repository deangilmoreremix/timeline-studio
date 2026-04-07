/**
 * CodeVideo AI Assistant
 *
 * Claude integration for code generation, enhancement, and video creation help
 */

import { createLogger } from "@/lib/logger"

const logger = createLogger("AIAssistant")

export interface AIRequest {
  prompt: string
  code?: string
  context?: string
  videoParams?: {
    duration?: number
    resolution?: string
    style?: string
  }
}

export interface AIResponse {
  success: boolean
  code?: string
  explanation?: string
  suggestions?: string[]
  error?: string
}

export interface CodeEnhancement {
  originalCode: string
  enhancedCode: string
  changes: string[]
  explanation: string
}

export class AIAssistant {
  private apiKey: string = ''
  private baseUrl = 'https://api.anthropic.com/v1/messages'

  /**
   * Set Claude API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
    logger.info("Claude API key configured")
  }

  /**
   * Generate video code from natural language
   */
  async generateVideoCode(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Claude API key not configured'
      }
    }

    try {
      const prompt = this.buildVideoGenerationPrompt(request)

      const response = await this.callClaude(prompt)

      if (!response.success) {
        return response
      }

      // Extract code from response
      const code = this.extractCodeFromResponse(response.code!)
      const explanation = this.extractExplanationFromResponse(response.code!)

      return {
        success: true,
        code,
        explanation,
        suggestions: this.generateSuggestions(code)
      }

    } catch (error) {
      logger.error("Video code generation failed", { error })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Enhance existing code
   */
  async enhanceCode(code: string, enhancement: string): Promise<CodeEnhancement> {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured')
    }

    try {
      const prompt = `
You are an expert React developer specializing in video animations.

ENHANCE this existing CodeVideo component with: ${enhancement}

Current code:
${code}

Please provide:
1. The enhanced code
2. A list of changes made
3. An explanation of the improvements

Make sure the code follows CodeVideo best practices:
- Use useFrame() for time-based animations
- Use interpolate() for smooth transitions
- Use spring() for physics-based motion
- Keep code clean and well-commented
- Ensure proper React patterns

Enhanced code:
`

      const response = await this.callClaude(prompt)

      if (!response.success) {
        throw new Error(response.error || 'Enhancement failed')
      }

      const enhancedCode = this.extractCodeFromResponse(response.code!)
      const changes = this.extractChangesFromResponse(response.code!)
      const explanation = this.extractExplanationFromResponse(response.code!)

      return {
        originalCode: code,
        enhancedCode,
        changes,
        explanation
      }

    } catch (error) {
      logger.error("Code enhancement failed", { error })
      throw error
    }
  }

  /**
   * Get suggestions for code improvements
   */
  async getSuggestions(code: string): Promise<string[]> {
    if (!this.apiKey) {
      return ['Configure Claude API key to get AI suggestions']
    }

    try {
      const prompt = `
Analyze this CodeVideo React component and provide 3-5 specific suggestions for improvement:

${code}

Focus on:
- Animation performance
- Code organization
- Visual effects
- Best practices
- User experience

Suggestions:
`

      const response = await this.callClaude(prompt)

      if (!response.success) {
        return ['Unable to generate suggestions at this time']
      }

      return this.extractSuggestionsFromResponse(response.code!)

    } catch (error) {
      logger.error("Suggestions generation failed", { error })
      return ['Error generating suggestions']
    }
  }

  /**
   * Fix code errors
   */
  async fixCode(code: string, error: string): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Claude API key not configured'
      }
    }

    try {
      const prompt = `
Fix this CodeVideo React component. The error is: ${error}

Current code:
${code}

Please provide:
1. The corrected code
2. An explanation of what was wrong and how you fixed it

Fixed code:
`

      const response = await this.callClaude(prompt)

      if (!response.success) {
        return response
      }

      const fixedCode = this.extractCodeFromResponse(response.code!)
      const explanation = this.extractExplanationFromResponse(response.code!)

      return {
        success: true,
        code: fixedCode,
        explanation
      }

    } catch (error) {
      logger.error("Code fixing failed", { error })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Private methods

  private buildVideoGenerationPrompt(request: AIRequest): string {
    const { prompt, context, videoParams } = request

    let fullPrompt = `
You are an expert at creating CodeVideo components - React code that generates videos.

Create a React component for: "${prompt}"

Requirements:
- Use CodeVideo APIs: useFrame(), interpolate(), spring(), Fill
- Create visually appealing animations
- Follow React best practices
- Include comments explaining the code
- Make it suitable for video rendering

${context ? `Additional context: ${context}` : ''}

${videoParams ? `Video parameters: ${JSON.stringify(videoParams)}` : ''}

The component should be named "MyVideo" and exported as default.

Complete React component:
`

    return fullPrompt
  }

  private async callClaude(prompt: string): Promise<AIResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          temperature: 0.1, // Low temperature for consistent code
          system: 'You are an expert React developer specializing in CodeVideo - creating videos with React code. Always provide clean, working React components.',
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      })

      if (!response.ok) {
        const error = await response.text()
        return {
          success: false,
          error: `Claude API error: ${response.status} ${error}`
        }
      }

      const result = await response.json()
      const generatedText = result.content[0].text

      return {
        success: true,
        code: generatedText
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  private extractCodeFromResponse(response: string): string {
    // Try to extract code between ```jsx or ```tsx blocks
    const codeBlockRegex = /```(?:jsx|tsx|javascript|typescript)?\n([\s\S]*?)\n```/
    const match = response.match(codeBlockRegex)

    if (match) {
      return match[1].trim()
    }

    // Fallback: try to find code-like content
    const lines = response.split('\n')
    const codeLines = lines.filter(line =>
      line.includes('import') ||
      line.includes('export') ||
      line.includes('const') ||
      line.includes('function') ||
      line.includes('return') ||
      line.includes('useFrame') ||
      line.includes('<')
    )

    return codeLines.join('\n')
  }

  private extractExplanationFromResponse(response: string): string {
    // Remove code blocks and extract explanatory text
    const withoutCodeBlocks = response.replace(/```[\s\S]*?```/g, '').trim()

    // Look for explanation patterns
    const explanationPatterns = [
      /explanation:/i,
      /this code/i,
      /the animation/i,
      /how it works/i
    ]

    for (const pattern of explanationPatterns) {
      const match = withoutCodeBlocks.match(new RegExp(pattern.source + '(.*)', 'i'))
      if (match) {
        return match[1].trim()
      }
    }

    // Fallback to first paragraph
    const firstParagraph = withoutCodeBlocks.split('\n\n')[0]
    return firstParagraph || 'AI-generated video component'
  }

  private extractChangesFromResponse(response: string): string[] {
    const changes: string[] = []

    // Look for bullet points or numbered lists
    const lines = response.split('\n')
    let inChangesSection = false

    for (const line of lines) {
      if (line.toLowerCase().includes('changes') ||
          line.toLowerCase().includes('improvements') ||
          line.toLowerCase().includes('modifications')) {
        inChangesSection = true
        continue
      }

      if (inChangesSection && (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))) {
        changes.push(line.replace(/^[-*]\s*|\d+\.\s*/, '').trim())
      }

      // Stop if we hit another section
      if (inChangesSection && line.toLowerCase().includes('explanation') && changes.length > 0) {
        break
      }
    }

    return changes.length > 0 ? changes : ['Enhanced animations and effects']
  }

  private extractSuggestionsFromResponse(response: string): string[] {
    const suggestions: string[] = []
    const lines = response.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()
      if ((trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) &&
          trimmed.length > 10) {
        suggestions.push(trimmed.replace(/^[-*]\s*|\d+\.\s*/, ''))
      }
    }

    return suggestions.length > 0 ? suggestions : ['Add more visual effects', 'Optimize animation performance']
  }

  private generateSuggestions(code: string): string[] {
    const suggestions: string[] = []

    // Basic code analysis for suggestions
    if (!code.includes('useFrame')) {
      suggestions.push('Consider adding time-based animations with useFrame()')
    }

    if (!code.includes('interpolate')) {
      suggestions.push('Use interpolate() for smooth value transitions')
    }

    if (!code.includes('spring')) {
      suggestions.push('Add spring() for physics-based motion effects')
    }

    if (code.split('\n').length > 50) {
      suggestions.push('Consider breaking down into smaller components')
    }

    return suggestions.length > 0 ? suggestions : ['Code looks good! Consider adding more visual effects.']
  }
}

// Singleton instance
export const aiAssistant = new AIAssistant()