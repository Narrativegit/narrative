import { generateId } from '@/lib/utils';
import type {
  GenerateScriptRequest,
  VideoScript,
  VideoScene,
  SceneVisualType,
} from '@/types';

/**
 * Generate a video script using Claude AI
 *
 * NOTE: This is a mock implementation for the MVP.
 * In production, this would call the Anthropic API.
 */
export async function generateVideoScript(
  request: GenerateScriptRequest
): Promise<VideoScript> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Combine all data sources into context
  const dataContext = request.dataSources
    .map((source) => `[${source.type.toUpperCase()}]: ${source.content}`)
    .join('\n\n');

  // In production, this would be the actual Claude API call:
  // const response = await anthropic.messages.create({
  //   model: 'claude-3-opus-20240229',
  //   max_tokens: 4096,
  //   messages: [
  //     {
  //       role: 'user',
  //       content: `Generate a video script based on the following data and prompt.
  //
  //         DATA:
  //         ${dataContext}
  //
  //         PROMPT:
  //         ${request.prompt}
  //
  //         STYLE:
  //         ${request.style}
  //
  //         Please structure the response as JSON with scenes array.`,
  //     },
  //   ],
  // });

  // Mock response - generates a sample script
  const scenes = generateMockScenes(request);

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  return {
    id: generateId(),
    scenes,
    totalDuration,
    voiceoverText: scenes.map((s) => s.content).join(' '),
  };
}

/**
 * Generate mock scenes based on the request
 * This simulates what Claude would generate
 */
function generateMockScenes(request: GenerateScriptRequest): VideoScene[] {
  const styleAnimations: Record<string, string> = {
    professional: 'fade',
    playful: 'bounce',
    minimal: 'fade',
    bold: 'zoom',
    corporate: 'slide',
  };

  const animation = styleAnimations[request.style] || 'fade';
  const hasMultipleSources = request.dataSources.length > 1;

  const scenes: VideoScene[] = [
    {
      id: generateId(),
      order: 0,
      duration: 3,
      title: 'Summary',
      content: extractKeyPoint(request, 'opening'),
      visualType: 'title-card',
      animation,
    },
    {
      id: generateId(),
      order: 1,
      duration: 5,
      title: 'Key Highlights',
      content: extractKeyPoint(request, 'highlights'),
      visualType: 'bullet-list',
      animation,
    },
    {
      id: generateId(),
      order: 2,
      duration: 4,
      title: 'Key Metric',
      content: extractKeyPoint(request, 'metric'),
      visualType: 'stat-highlight',
      animation,
    },
  ];

  if (hasMultipleSources) {
    scenes.push({
      id: generateId(),
      order: 3,
      duration: 4,
      title: 'Insights',
      content: extractKeyPoint(request, 'insights'),
      visualType: 'quote',
      animation,
    });
  }

  scenes.push({
    id: generateId(),
    order: scenes.length,
    duration: 4,
    title: 'Action Items',
    content: extractKeyPoint(request, 'actions'),
    visualType: 'bullet-list',
    animation,
  });

  scenes.push({
    id: generateId(),
    order: scenes.length,
    duration: 3,
    title: 'Next Steps',
    content: extractKeyPoint(request, 'closing'),
    visualType: 'title-card',
    animation,
  });

  return scenes;
}

/**
 * Extract key points from the data sources
 * In production, Claude would do this intelligently
 */
function extractKeyPoint(
  request: GenerateScriptRequest,
  type: 'opening' | 'highlights' | 'metric' | 'insights' | 'actions' | 'closing'
): string {
  const combinedContent = request.dataSources.map((s) => s.content).join(' ');
  const wordCount = combinedContent.split(/\s+/).length;

  switch (type) {
    case 'opening':
      return `Here's your ${request.style} summary of ${request.dataSources.length} source${
        request.dataSources.length !== 1 ? 's' : ''
      }`;
    case 'highlights':
      return '• Key discussion points covered\n• Important decisions made\n• Team alignment achieved';
    case 'metric':
      return `${wordCount} words analyzed to bring you the key insights`;
    case 'insights':
      return '"The most important takeaway is the progress we\'ve made together."';
    case 'actions':
      return '• Review the summary\n• Share with stakeholders\n• Schedule follow-up';
    case 'closing':
      return 'Thank you for watching! Questions? Reach out to the team.';
    default:
      return '';
  }
}

/**
 * Regenerate a single scene
 */
export async function regenerateScene(
  scene: VideoScene,
  style: string
): Promise<VideoScene> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    ...scene,
    content: `Updated: ${scene.content}`,
  };
}
