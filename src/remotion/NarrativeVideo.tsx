import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene } from './scenes/Scene';
import type { VideoScript, VideoStyle } from '@/types';

interface NarrativeVideoProps {
  script: VideoScript;
  style: VideoStyle;
}

// Style configurations
const styleConfigs: Record<
  VideoStyle,
  {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  }
> = {
  professional: {
    primaryColor: '#0c87f2',
    secondaryColor: '#06b6d4',
    backgroundColor: '#ffffff',
    textColor: '#18181b',
    accentColor: '#0c87f2',
  },
  playful: {
    primaryColor: '#8b5cf6',
    secondaryColor: '#f472b6',
    backgroundColor: '#faf5ff',
    textColor: '#18181b',
    accentColor: '#a78bfa',
  },
  minimal: {
    primaryColor: '#18181b',
    secondaryColor: '#71717a',
    backgroundColor: '#fafafa',
    textColor: '#18181b',
    accentColor: '#18181b',
  },
  bold: {
    primaryColor: '#dc2626',
    secondaryColor: '#f59e0b',
    backgroundColor: '#18181b',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
  },
  corporate: {
    primaryColor: '#1e3a5f',
    secondaryColor: '#0891b2',
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    accentColor: '#0891b2',
  },
};

export function NarrativeVideo({ script, style }: NarrativeVideoProps) {
  const { fps } = useVideoConfig();
  const styleConfig = styleConfigs[style];

  // Calculate frame offsets for each scene
  let currentFrame = 0;
  const sceneFrames = script.scenes.map((scene) => {
    const startFrame = currentFrame;
    const durationInFrames = scene.duration * fps;
    currentFrame += durationInFrames;
    return { scene, startFrame, durationInFrames };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: styleConfig.backgroundColor,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Background gradient overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${styleConfig.primaryColor}10 0%, ${styleConfig.secondaryColor}10 100%)`,
        }}
      />

      {/* Scenes */}
      {sceneFrames.map(({ scene, startFrame, durationInFrames }) => (
        <Sequence
          key={scene.id}
          from={startFrame}
          durationInFrames={durationInFrames}
        >
          <Scene scene={scene} styleConfig={styleConfig} />
        </Sequence>
      ))}

      {/* Branding watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: 0.5,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            backgroundColor: styleConfig.primaryColor,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: styleConfig.textColor,
          }}
        >
          Narrative
        </span>
      </div>
    </AbsoluteFill>
  );
}
