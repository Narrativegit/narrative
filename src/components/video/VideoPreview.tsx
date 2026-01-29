import React, { useCallback, useEffect, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { NarrativeVideo } from '@/remotion/NarrativeVideo';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn, formatDuration } from '@/lib/utils';
import { useStore } from '@/lib/store';
import type { VideoScript, VideoStyle } from '@/types';

interface VideoPreviewProps {
  script: VideoScript;
  style: VideoStyle;
}

export default function VideoPreview({ script, style }: VideoPreviewProps) {
  const playerRef = useRef<PlayerRef>(null);
  const { editor, setEditorState } = useStore();
  const [isMuted, setIsMuted] = React.useState(false);

  const fps = 30;
  const totalDurationInFrames = script.totalDuration * fps;

  // Update current time from player
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleFrameUpdate = () => {
      const currentFrame = player.getCurrentFrame();
      setEditorState({ currentTime: currentFrame / fps });
    };

    const interval = setInterval(handleFrameUpdate, 100);
    return () => clearInterval(interval);
  }, [setEditorState, fps]);

  const handlePlayPause = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (editor.isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setEditorState({ isPlaying: !editor.isPlaying });
  }, [editor.isPlaying, setEditorState]);

  const handleSeek = useCallback(
    (seconds: number) => {
      const player = playerRef.current;
      if (!player) return;

      const currentFrame = player.getCurrentFrame();
      const newFrame = Math.max(0, Math.min(totalDurationInFrames - 1, currentFrame + seconds * fps));
      player.seekTo(newFrame);
    },
    [totalDurationInFrames, fps]
  );

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const player = playerRef.current;
      if (!player) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const frame = Math.floor(percentage * totalDurationInFrames);
      player.seekTo(frame);
    },
    [totalDurationInFrames]
  );

  const progress = (editor.currentTime / script.totalDuration) * 100;

  return (
    <div className="flex flex-col bg-surface-900 rounded-xl overflow-hidden">
      {/* Video player */}
      <div className="relative aspect-video bg-black">
        <Player
          ref={playerRef}
          component={NarrativeVideo}
          inputProps={{ script, style }}
          durationInFrames={totalDurationInFrames}
          fps={fps}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{ width: '100%', height: '100%' }}
          controls={false}
        />

        {/* Play overlay when paused */}
        {!editor.isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
          >
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-strong group-hover:scale-105 transition-transform">
              <Play className="w-8 h-8 text-surface-900 ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3">
        {/* Timeline */}
        <div
          className="h-2 bg-surface-700 rounded-full cursor-pointer group"
          onClick={handleTimelineClick}
        >
          <div
            className="h-full bg-brand-500 rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSeek(-5)}
              className="text-white hover:bg-surface-700"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="text-white hover:bg-surface-700"
            >
              {editor.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSeek(5)}
              className="text-white hover:bg-surface-700"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <span className="text-sm text-surface-400 ml-2">
              {formatDuration(editor.currentTime)} / {formatDuration(script.totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-surface-700"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-surface-700"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
