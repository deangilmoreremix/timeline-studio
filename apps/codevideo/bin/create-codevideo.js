#!/usr/bin/env node

/**
 * create-codevideo
 * CLI tool for scaffolding new CodeVideo projects
 */

import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()

program
  .name('create-codevideo')
  .description('Create a new CodeVideo project')
  .version('1.0.0')
  .argument('<name>', 'Project name')
  .option('-t, --template <template>', 'Template to use', 'basic-fade')
  .option('--typescript', 'Use TypeScript (default)', true)
  .option('--no-install', 'Skip npm install', false)
  .action(async (name, options) => {
    const projectPath = path.resolve(name)

    console.log(`🎬 Creating CodeVideo project: ${name}`)
    console.log(`📁 Location: ${projectPath}`)

    try {
      // Check if directory exists
      if (fs.existsSync(projectPath)) {
        console.error(`❌ Directory "${name}" already exists!`)
        process.exit(1)
      }

      // Create project directory
      fs.mkdirSync(projectPath, { recursive: true })

      // Copy template files
      const templatePath = path.join(__dirname, '../templates', options.template)

      if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template "${options.template}" not found!`)
        console.log('Available templates: basic-fade, spring-bounce, color-transition, particle-explosion, interactive-choice, data-visualization')
        process.exit(1)
      }

      // Copy template files
      copyDirectory(templatePath, projectPath)

      // Update package.json name
      const packageJsonPath = path.join(projectPath, 'package.json')
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
        packageJson.name = name
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
      }

      console.log(`✅ Project created successfully!`)
      console.log(``)
      console.log(`🚀 Next steps:`)
      console.log(`  cd ${name}`)
      if (!options.noInstall) {
        console.log(`  npm install`)
      }
      console.log(`  npm run dev`)
      console.log(`  # Visit http://localhost:3000`)
      console.log(``)
      console.log(`🎬 Happy coding with CodeVideo!`)

    } catch (error) {
      console.error('❌ Failed to create project:', error.message)
      process.exit(1)
    }
  })

program.on('--help', () => {
  console.log(``)
  console.log(`Examples:`)
  console.log(`  $ npx create-codevideo my-video-project`)
  console.log(`  $ npx create-codevideo my-project --template spring-bounce`)
  console.log(`  $ npx create-codevideo my-project --no-install`)
  console.log(``)
  console.log(`Available Templates:`)
  console.log(`  basic-fade          Simple text fade-in`)
  console.log(`  spring-bounce       Physics-based bouncing animation`)
  console.log(`  color-transition    Smooth color interpolation`)
  console.log(`  particle-explosion  Animated particle effects`)
  console.log(`  interactive-choice  User interactive video`)
  console.log(`  data-visualization  Animated data charts`)
})

// Utility function to copy directory recursively
function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      copyDirectory(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

program.parse()