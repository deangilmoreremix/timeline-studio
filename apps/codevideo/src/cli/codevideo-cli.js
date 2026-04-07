#!/usr/bin/env node

/**
 * CodeVideo CLI
 * Command-line interface for CodeVideo operations
 */

import { Command } from 'commander'
import { renderVideo } from './src/features/renderer/services/video-renderer.js'
import { aiAssistant } from './src/features/ai-assistant/services/ai-assistant.js'
import fs from 'fs'
import path from 'path'

const program = new Command()

program
  .name('codevideo')
  .description('CodeVideo - Write code, create videos')
  .version('1.0.0')

// Render command
program
  .command('render <input> <output>')
  .description('Render a video from CodeVideo composition')
  .option('-f, --format <format>', 'Output format (mp4, webm, gif)', 'mp4')
  .option('-q, --quality <quality>', 'Quality preset (fast, standard, high, ultra)', 'high')
  .option('-d, --duration <seconds>', 'Video duration in seconds', '5')
  .option('-r, --resolution <res>', 'Resolution (720p, 1080p, 4k)', '1080p')
  .option('--muapi-endpoint <url>', 'MUAPI endpoint URL')
  .option('--muapi-key <key>', 'MUAPI API key')
  .action(async (input, output, options) => {
    try {
      console.log(`🎬 Rendering ${input} to ${output}...`)

      // Read the input file
      const code = fs.readFileSync(input, 'utf-8')

      // Configure rendering
      const config = {
        code,
        duration: parseInt(options.duration),
        resolution: options.resolution,
        quality: options.quality,
        format: options.format,
        apiKey: options.muapiKey || process.env.MUAPI_KEY,
        endpoint: options.muapiEndpoint || process.env.MUAPI_ENDPOINT || 'https://api.muapi.com'
      }

      // Render the video
      const result = await renderVideo(config)

      if (result.success) {
        console.log(`✅ Video rendered successfully!`)
        console.log(`📁 Output: ${output}`)
        console.log(`🎥 Duration: ${result.duration}s`)
        console.log(`📐 Resolution: ${result.resolution}`)
        if (result.videoUrl) {
          console.log(`🔗 Video URL: ${result.videoUrl}`)
        }
      } else {
        console.error(`❌ Render failed: ${result.error}`)
        process.exit(1)
      }

    } catch (error) {
      console.error('❌ Error:', error.message)
      process.exit(1)
    }
  })

// Enhance command
program
  .command('enhance <input>')
  .description('Enhance CodeVideo code with AI assistance')
  .option('--claude-key <key>', 'Claude API key')
  .option('--enhancement <text>', 'What to enhance', 'Add more visual effects and improve animations')
  .action(async (input, options) => {
    try {
      console.log(`🤖 Enhancing ${input}...`)

      // Configure AI assistant
      if (options.claudeKey) {
        aiAssistant.setApiKey(options.claudeKey)
      } else if (process.env.CLAUDE_API_KEY) {
        aiAssistant.setApiKey(process.env.CLAUDE_API_KEY)
      } else {
        console.error('❌ Claude API key required. Use --claude-key or set CLAUDE_API_KEY env var')
        process.exit(1)
      }

      // Read and enhance code
      const code = fs.readFileSync(input, 'utf-8')
      const enhancement = await aiAssistant.enhanceCode(code, options.enhancement)

      // Output enhanced code
      console.log(`✅ Code enhanced successfully!`)
      console.log(`📝 Changes made:`)
      enhancement.changes.forEach((change, i) => {
        console.log(`   ${i + 1}. ${change}`)
      })
      console.log(`\n💡 Explanation: ${enhancement.explanation}`)
      console.log(`\n📄 Enhanced code:\n`)
      console.log(enhancement.enhancedCode)

    } catch (error) {
      console.error('❌ Enhancement failed:', error.message)
      process.exit(1)
    }
  })

// Suggest command
program
  .command('suggest <input>')
  .description('Get AI suggestions for CodeVideo code improvements')
  .option('--claude-key <key>', 'Claude API key')
  .action(async (input, options) => {
    try {
      console.log(`💡 Getting suggestions for ${input}...`)

      // Configure AI assistant
      if (options.claudeKey) {
        aiAssistant.setApiKey(options.claudeKey)
      } else if (process.env.CLAUDE_API_KEY) {
        aiAssistant.setApiKey(process.env.CLAUDE_API_KEY)
      } else {
        console.error('❌ Claude API key required')
        process.exit(1)
      }

      // Read and analyze code
      const code = fs.readFileSync(input, 'utf-8')
      const suggestions = await aiAssistant.getSuggestions(code)

      console.log(`✅ Suggestions generated:`)
      suggestions.forEach((suggestion, i) => {
        console.log(`   ${i + 1}. ${suggestion}`)
      })

    } catch (error) {
      console.error('❌ Suggestions failed:', error.message)
      process.exit(1)
    }
  })

// Studio command
program
  .command('studio')
  .description('Launch CodeVideo Studio development environment')
  .option('-p, --port <port>', 'Port to run on', '3000')
  .option('--host <host>', 'Host to bind to', 'localhost')
  .action(async (options) => {
    console.log(`🎨 Starting CodeVideo Studio...`)
    console.log(`🌐 http://${options.host}:${options.port}`)
    console.log(`📝 Edit your compositions and see changes instantly`)
    console.log(`🎬 Click "Render" to generate videos`)
    console.log(`🤖 Use AI assistance for code enhancement`)
    console.log(`\nPress Ctrl+C to stop`)

    // In a real implementation, this would start the Next.js dev server
    // For now, we'll just show the message
  })

// Templates command
program
  .command('templates')
  .description('List available CodeVideo templates')
  .action(() => {
    console.log(`🎭 Available CodeVideo Templates:`)
    console.log(``)
    console.log(`📱 basic-fade`)
    console.log(`   Simple text fade-in animation`)
    console.log(``)
    console.log(`🏀 spring-bounce`)
    console.log(`   Physics-based bouncing text animation`)
    console.log(``)
    console.log(`🎨 color-transition`)
    console.log(`   Smooth color interpolation between multiple hues`)
    console.log(``)
    console.log(`⭐ particle-explosion`)
    console.log(`   Animated particles bursting from center`)
    console.log(``)
    console.log(`🎯 interactive-choice`)
    console.log(`   User-interactive video with branching paths`)
    console.log(``)
    console.log(`📊 data-visualization`)
    console.log(`   Animated charts and graphs from live data`)
    console.log(``)
    console.log(`To create a new project with a template:`)
    console.log(`  npx create-codevideo my-project --template basic-fade`)
    console.log(`  npx create-codevideo my-project --template spring-bounce`)
    console.log(`  npx create-codevideo my-project --template color-transition`)
  })

// Help
program.on('--help', () => {
  console.log(``)
  console.log(`Examples:`)
  console.log(`  $ codevideo render src/MyVideo.tsx output/video.mp4`)
  console.log(`  $ codevideo enhance src/MyVideo.tsx --enhancement "add particle effects"`)
  console.log(`  $ codevideo suggest src/MyVideo.tsx`)
  console.log(`  $ codevideo studio`)
  console.log(`  $ codevideo templates`)
  console.log(``)
  console.log(`Environment Variables:`)
  console.log(`  CLAUDE_API_KEY    Your Anthropic Claude API key`)
  console.log(`  MUAPI_KEY         Your MUAPI service key`)
  console.log(`  MUAPI_ENDPOINT    MUAPI service endpoint URL`)
})

// Error handling
program.exitOverride()

try {
  program.parse()
} catch (error) {
  console.error(`❌ Error: ${error.message}`)
  process.exit(1)
}