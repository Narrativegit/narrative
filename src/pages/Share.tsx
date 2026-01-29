import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Video, ArrowLeft, Loader2 } from 'lucide-react';
import { Player } from '@remotion/player';
import { NarrativeVideo } from '@/remotion/NarrativeVideo';
import { Button, Badge } from '@/components/ui';
import { formatDuration } from '@/lib/utils';
import type { VideoProject, VideoScript, VideoStyle } from '@/types';

// Mock function to fetch shared video data
// In production, this would fetch from an API
async function fetchSharedVideo(shareId: string): Promise<VideoProject | null> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock data for demonstration
  const mockScript: VideoScript = {
    id: 'shared-script',
    scenes: [
      {
        id: '1',
        order: 0,
        duration: 3,
        title: 'Welcome',
        content: 'Weekly Team Update',
        visualType: 'title-card',
        animation: 'fade',
      },
      {
        id: '2',
        order: 1,
        duration: 5,
        title: 'Key Accomplishments',
        content: '• Completed sprint goals\n• Launched new feature\n• Improved performance by 25%',
        visualType: 'bullet-list',
        animation: 'slide',
      },
      {
        id: '3',
        order: 2,
        duration: 4,
        title: 'Metric Highlight',
        content: '25%',
        visualType: 'stat-highlight',
        animation: 'zoom',
      },
      {
        id: '4',
        order: 3,
        duration: 3,
        title: 'Next Steps',
        content: 'Continue the momentum!',
        visualType: 'title-card',
        animation: 'fade',
      },
    ],
    totalDuration: 15,
  };

  return {
    id: 'shared-project',
    title: 'Weekly Team Update',
    description: 'A summary of our team progress this week',
    dataSources: [],
    prompt: '',
    style: 'professional',
    script: mockScript,
    status: 'complete',
    shareLink: window.location.href,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default function Share() {
  const { shareId } = useParams<{ shareId: string }>();
  const [project, setProject] = useState<VideoProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function loadVideo() {
      if (!shareId) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      try {
        const videoData = await fetchSharedVideo(shareId);
        if (videoData) {
          setProject(videoData);
        } else {
          setError('Video not found');
        }
      } catch {
        setError('Failed to load video');
      } finally {
        setIsLoading(false);
      }
    }

    loadVideo();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-surface-400">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !project || !project.script) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-800 flex items-center justify-center">
            <Video className="w-8 h-8 text-surface-500" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">
            {error || 'Video not found'}
          </h1>
          <p className="text-surface-400 mb-6">
            This video may have been removed or the link is invalid.
          </p>
          <Link to="/">
            <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Go to Narrative
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fps = 30;
  const totalDurationInFrames = project.script.totalDuration * fps;

  return (
    <div className="min-h-screen bg-surface-900">
      {/* Header */}
      <header className="bg-surface-800/50 backdrop-blur-sm border-b border-surface-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Narrative</span>
          </Link>

          <Link to="/">
            <Button variant="secondary" size="sm">
              Create Your Own
            </Button>
          </Link>
        </div>
      </header>

      {/* Video player */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-xl overflow-hidden bg-black shadow-strong">
          <div className="relative aspect-video">
            <Player
              component={NarrativeVideo}
              inputProps={{
                script: project.script,
                style: project.style as VideoStyle,
              }}
              durationInFrames={totalDurationInFrames}
              fps={fps}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{ width: '100%', height: '100%' }}
              controls
            />
          </div>
        </div>

        {/* Video info */}
        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-white mb-2">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-surface-400 mb-4">{project.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-surface-500">
            <span>{project.script.scenes.length} scenes</span>
            <span>•</span>
            <span>{formatDuration(project.script.totalDuration)}</span>
            <span>•</span>
            <Badge variant="outline" className="bg-surface-800 border-surface-600 text-surface-300">
              {project.style}
            </Badge>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 p-6 rounded-xl bg-surface-800 border border-surface-700">
          <h2 className="text-lg font-semibold text-white mb-2">
            Create your own video summaries
          </h2>
          <p className="text-surface-400 mb-4">
            Turn your meeting notes, reports, and data into engaging video summaries in minutes.
          </p>
          <Link to="/">
            <Button>Get Started Free</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
