/**
 * HowTo Schema Generator for JSON-LD structured data
 * Used for step-by-step guide articles (like booking guides, travel tips, etc.)
 */

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface HowToSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image?: string;
  estimatedCost?: {
    '@type': string;
    currency: string;
    priceCurrency: string;
    price: string;
  };
  totalTime?: string;
  step: Array<{
    '@type': string;
    position: number;
    name: string;
    text: string;
    image?: string;
  }>;
}

/**
 * Generate HowTo Schema from title, description, and steps
 * Useful for guides like "How to Book Anime Collab Cafes" or "How to Buy Rail Passes"
 * @param name - Title of the how-to guide
 * @param description - Description of what the guide covers
 * @param steps - Array of {name, text, image?} step objects
 * @param image - Optional featured image URL
 * @param totalTime - Optional ISO 8601 duration (e.g., "PT30M" for 30 minutes)
 * @returns JSON-LD HowTo schema
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[],
  image?: string,
  totalTime?: string
): HowToSchema {
  const schema: HowToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };

  if (image) {
    schema.image = image;
  }

  if (totalTime) {
    schema.totalTime = totalTime;
  }

  return schema;
}

/**
 * Generate HowTo Recipe Schema (for food/cafe related guides)
 * @param name - Recipe/guide name
 * @param description - Description
 * @param ingredients - Array of ingredient strings
 * @param steps - Array of instruction steps
 * @param prepTime - ISO 8601 duration for prep time
 * @param cookTime - ISO 8601 duration for cook time
 * @returns Extended HowTo schema with recipe properties
 */
export function generateRecipeSchema(
  name: string,
  description: string,
  ingredients: string[],
  steps: HowToStep[],
  prepTime?: string,
  cookTime?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name,
    description,
    ingredients,
    prepTime: prepTime || 'PT15M',
    cookTime: cookTime || 'PT30M',
    totalTime: combineIsoDurations(prepTime || 'PT15M', cookTime || 'PT30M'),
    recipeInstructions: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };
}

/**
 * Helper: Parse ISO 8601 duration and convert to minutes
 * @param duration - ISO duration string (e.g., "PT30M", "PT2H30M")
 * @returns Total minutes
 */
export function parseIsoDuration(duration: string): number {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const match = duration.match(regex);

  let minutes = 0;
  if (match) {
    if (match[1]) minutes += parseInt(match[1]) * 60;
    if (match[2]) minutes += parseInt(match[2]);
    if (match[3]) minutes += Math.ceil(parseInt(match[3]) / 60);
  }

  return minutes;
}

/**
 * Helper: Combine two ISO 8601 durations
 * @param duration1 - First duration (e.g., "PT15M")
 * @param duration2 - Second duration (e.g., "PT30M")
 * @returns Combined duration
 */
export function combineIsoDurations(duration1: string, duration2: string): string {
  const minutes = parseIsoDuration(duration1) + parseIsoDuration(duration2);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  let result = 'PT';
  if (hours > 0) result += `${hours}H`;
  if (mins > 0) result += `${mins}M`;

  return result || 'PT0M';
}

/**
 * Extract HowTo steps from markdown content
 * Looks for numbered lists or H3 headings as step names
 * @param markdown - Raw markdown content
 * @returns Array of HowToStep objects
 */
export function extractHowToStepsFromMarkdown(markdown: string): HowToStep[] {
  const steps: HowToStep[] = [];
  const lines = markdown.split('\n');

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Match "1. Step name" or "### Step name"
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    const headingMatch = trimmed.match(/^###\s+(.+)/);

    if (numberMatch || headingMatch) {
      const stepName = numberMatch ? numberMatch[2] : headingMatch![1];

      // Collect text until next step or heading
      let stepText = '';
      i++;
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextTrimmed = nextLine.trim();

        // Stop at next step
        if (
          nextTrimmed.match(/^\d+\./) ||
          nextTrimmed.startsWith('###') ||
          nextTrimmed.startsWith('##')
        ) {
          break;
        }

        // Accumulate text
        if (nextTrimmed && !nextTrimmed.startsWith('-') && !nextTrimmed.startsWith('*')) {
          stepText += nextTrimmed + ' ';
        }

        i++;
      }

      if (stepName && stepText.trim()) {
        steps.push({
          name: stepName.trim(),
          text: stepText.trim(),
        });
      }
      continue;
    }

    i++;
  }

  return steps;
}

/**
 * Validate HowTo schema for common issues
 * @param schema - HowToSchema object to validate
 * @returns Array of validation error messages
 */
export function validateHowToSchema(schema: HowToSchema): string[] {
  const errors: string[] = [];

  if (!schema.name || schema.name.trim().length === 0) {
    errors.push('HowTo name is required');
  }

  if (!schema.description || schema.description.trim().length === 0) {
    errors.push('HowTo description is required');
  }

  if (!schema.step || schema.step.length === 0) {
    errors.push('HowTo must have at least one step');
  }

  schema.step?.forEach((step, index) => {
    if (!step.name || step.name.trim().length === 0) {
      errors.push(`Step ${index + 1}: Name is required`);
    }
    if (!step.text || step.text.trim().length === 0) {
      errors.push(`Step ${index + 1}: Text is required`);
    }
  });

  return errors;
}
