import { generateId } from '@/lib/utils';
import type {
  GenerateScriptRequest,
  VideoScript,
  VideoScene,
} from '@/types';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Debug: Check if API key is loaded
console.log('Claude API Key loaded:', ANTHROPIC_API_KEY ? 'Yes (starts with ' + ANTHROPIC_API_KEY.substring(0, 10) + '...)' : 'NO - Missing!');

/**
 * Generate a video script using Claude AI
 */
export async function generateVideoScript(
  request: GenerateScriptRequest
): Promise<VideoScript> {
  // Check for API key
  if (!ANTHROPIC_API_KEY) {
    console.error('VITE_ANTHROPIC_API_KEY is not set. Make sure .env file exists and you restarted the dev server.');
    return generateFallbackScript(request);
  }

  console.log('Generating video script with Claude API...');
  console.log('Data sources:', request.dataSources.length);
  console.log('Prompt:', request.prompt.substring(0, 50) + '...');

  // Combine all data sources into context
  const dataContext = request.dataSources
    .map((source) => `[${source.type.toUpperCase()}: ${source.name}]\n${source.content}`)
    .join('\n\n---\n\n');

  const systemPrompt = `You are a video script generator for Narrative, an app that creates short, engaging video summaries.

Your task is to analyze the provided data and create a video script with multiple scenes. Each scene should be concise and visually engaging.

IMPORTANT: You must respond with ONLY valid JSON, no markdown code blocks or other text.

The JSON structure must be:
{
  "scenes": [
    {
      "title": "Scene title (short, 2-4 words)",
      "content": "The main text content for this scene",
      "visualType": "title-card" | "bullet-list" | "stat-highlight" | "quote",
      "duration": 3-6 (number of seconds)
    }
  ]
}

Visual type guidelines:
- "title-card": For opening/closing scenes or key statements (content should be 1-2 sentences)
- "bullet-list": For multiple points (content should use bullet format: "• Point one\\n• Point two\\n• Point three")
- "stat-highlight": For impressive numbers/metrics (content should be just the number/stat like "42%" or "$1.2M")
- "quote": For notable quotes or insights (content should be the quote text)

Create 4-6 scenes that tell a compelling story from the data. Extract REAL information from the provided data - do not use generic placeholders.`;

  const userPrompt = `Create a video script based on this data:

DATA SOURCES:
${dataContext}

USER'S REQUEST:
${request.prompt}

VIDEO STYLE: ${request.style}
${request.style === 'professional' ? '(Clean, corporate-friendly tone)' : ''}
${request.style === 'playful' ? '(Fun, energetic, use engaging language)' : ''}
${request.style === 'minimal' ? '(Simple, elegant, fewer words)' : ''}
${request.style === 'bold' ? '(Impactful statements, strong language)' : ''}
${request.style === 'corporate' ? '(Traditional business tone, formal)' : ''}

Remember: Extract REAL data points, names, numbers, and insights from the provided content. Do not use generic placeholder text.`;

  try {
    console.log('Making API request to /api/anthropic/v1/messages...');

    const response = await fetch('/api/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n${userPrompt}`,
          },
        ],
      }),
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response received, parsing...');
    const content = data.content[0].text;
    console.log('Claude response (first 200 chars):', content.substring(0, 200));

    // Parse the JSON response
    let parsedScript;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedScript = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content);
      throw new Error('Failed to parse video script from AI response');
    }

    // Transform to our VideoScript format
    const styleAnimations: Record<string, string> = {
      professional: 'fade',
      playful: 'bounce',
      minimal: 'fade',
      bold: 'zoom',
      corporate: 'slide',
    };

    const animation = styleAnimations[request.style] || 'fade';

    const scenes: VideoScene[] = parsedScript.scenes.map(
      (scene: { title?: string; content: string; visualType: string; duration: number }, index: number) => ({
        id: generateId(),
        order: index,
        duration: scene.duration || 4,
        title: scene.title || `Scene ${index + 1}`,
        content: scene.content,
        visualType: scene.visualType || 'title-card',
        animation,
      })
    );

    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

    return {
      id: generateId(),
      scenes,
      totalDuration,
      voiceoverText: scenes.map((s) => s.content).join(' '),
    };
  } catch (error) {
    console.error('Error generating video script:', error);
    // Fall back to mock data if API fails
    return generateFallbackScript(request);
  }
}

/**
 * Fallback script generation if API fails
 */
function generateFallbackScript(request: GenerateScriptRequest): VideoScript {
  const styleAnimations: Record<string, string> = {
    professional: 'fade',
    playful: 'bounce',
    minimal: 'fade',
    bold: 'zoom',
    corporate: 'slide',
  };

  const animation = styleAnimations[request.style] || 'fade';

  // Try to extract some real content from the data
  const combinedContent = request.dataSources.map((s) => s.content).join(' ');
  const sentences = combinedContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim() || 'Your summary is ready';

  const scenes: VideoScene[] = [
    {
      id: generateId(),
      order: 0,
      duration: 3,
      title: 'Summary',
      content: firstSentence.slice(0, 100),
      visualType: 'title-card',
      animation,
    },
    {
      id: generateId(),
      order: 1,
      duration: 5,
      title: 'Key Points',
      content: '• Review the full content\n• Key insights extracted\n• Action items identified',
      visualType: 'bullet-list',
      animation,
    },
    {
      id: generateId(),
      order: 2,
      duration: 3,
      title: 'Thank You',
      content: 'Thanks for watching!',
      visualType: 'title-card',
      animation,
    },
  ];

  return {
    id: generateId(),
    scenes,
    totalDuration: scenes.reduce((sum, s) => sum + s.duration, 0),
    voiceoverText: scenes.map((s) => s.content).join(' '),
  };
}

/**
 * Regenerate a single scene using Claude
 */
export async function regenerateScene(
  scene: VideoScene,
  context: string,
  style: string
): Promise<VideoScene> {
  try {
    const response = await fetch('/api/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Regenerate this video scene with fresh content. Keep the same visual type but create new, engaging content.

Current scene:
- Title: ${scene.title}
- Content: ${scene.content}
- Visual Type: ${scene.visualType}

Context from the original data: ${context.slice(0, 500)}

Style: ${style}

Respond with ONLY JSON:
{
  "title": "new title",
  "content": "new content"
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const content = data.content[0].text;
    const parsed = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || '{}');

    return {
      ...scene,
      title: parsed.title || scene.title,
      content: parsed.content || scene.content,
    };
  } catch (error) {
    console.error('Error regenerating scene:', error);
    return {
      ...scene,
      content: `${scene.content} (regenerated)`,
    };
  }
}
