#!/usr/bin/env node

/**
 * Interactive New Article Generator
 * Prompts user for article details and generates from templates
 */

import fs from 'fs'
import path from 'path'
import readline from 'readline'

const TEMPLATES_DIR = path.join(process.cwd(), 'scripts/templates')
const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

const TEMPLATES = [
  { name: 'Collaboration Cafe Guide', file: 'collab-cafe.md' },
  { name: 'Anime Pilgrimage Guide', file: 'pilgrimage.md' },
  { name: 'Area/Neighborhood Guide', file: 'area-guide.md' },
  { name: 'Travel Tip', file: 'travel-tip.md' },
]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim())
    })
  })
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

function getToday(): string {
  const date = new Date()
  return date.toISOString().split('T')[0]
}

async function main() {
  console.log('\n📝 New Article Generator\n')

  // Show template options
  console.log('Choose a template:')
  TEMPLATES.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name}`)
  })

  const templateChoice = await question('\nTemplate number (1-4): ')
  const templateIndex = parseInt(templateChoice) - 1

  if (templateIndex < 0 || templateIndex >= TEMPLATES.length) {
    console.error('Invalid choice')
    process.exit(1)
  }

  const selectedTemplate = TEMPLATES[templateIndex]
  const templatePath = path.join(TEMPLATES_DIR, selectedTemplate.file)

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`)
    process.exit(1)
  }

  // Get article details
  console.log(`\n📋 ${selectedTemplate.name} Details\n`)

  const title = await question('Article title: ')
  let slug = slugify(title)
  const slugPrompt = await question(`Slug [${slug}]: `)
  if (slugPrompt) slug = slugPrompt

  const description = await question('Meta description (120-160 chars): ')
  const category = selectedTemplate.file.replace('.md', '')
  const tagsInput = await question('Tags (comma-separated): ')
  const tags = tagsInput.split(',').map((t) => t.trim())

  // Prepare variables
  const variables: Record<string, string> = {
    TITLE: title,
    DATE: getToday(),
    DESCRIPTION: description,
    TAGS: JSON.stringify(tags),
  }

  // Add template-specific variables
  if (category === 'collab-cafe') {
    variables.ANIME_NAME = await question('Anime name: ')
    variables.CITY = await question('City: ')
    variables.YEAR = new Date().getFullYear().toString()
  } else if (category === 'pilgrimage') {
    variables.ANIME_NAME = await question('Anime name: ')
    variables.LOCATION = await question('Location/Prefecture: ')
  } else if (category === 'area-guide') {
    variables.AREA_NAME = await question('Area/District name: ')
  } else if (category === 'travel-tip') {
    variables.TIP_SUBJECT = await question('Tip subject (e.g., "How to Buy Anime Merchandise"): ')
    variables.TIP_SUMMARY = await question('Short summary: ')
  }

  // Read and process template
  let content = fs.readFileSync(templatePath, 'utf-8')

  // Replace variables (both uppercase and with placeholders)
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{${key}}`, 'g'), value)
  })

  // Create article file
  const articlePath = path.join(ARTICLES_DIR, `${slug}.md`)

  if (fs.existsSync(articlePath)) {
    console.error(`\n❌ Article already exists: ${slug}`)
    process.exit(1)
  }

  fs.writeFileSync(articlePath, content)

  console.log(`\n✅ Article created: ${articlePath}`)
  console.log('\n📝 Remember to:')
  console.log(`  1. Edit ${slug}.md to replace placeholder content`)
  console.log('  2. Add a featured image path to frontmatter')
  console.log('  3. Add internal links to related articles')
  console.log('  4. Run: npm run validate')
  console.log('  5. Run: npm run score content/articles/${slug}.md')
  console.log('')

  rl.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
