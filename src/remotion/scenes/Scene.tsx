import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { VideoScene } from '@/types';
import { TitleCard } from './TitleCard';
import { BulletList } from './BulletList';
import { StatHighlight } from './StatHighlight';
import { Quote } from './Quote';

interface StyleConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface SceneProps {
  scene: VideoScene;
  styleConfig: StyleConfig;
}

export function Scene({ scene, styleConfig }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation timing
  const fadeInDuration = fps * 0.5; // 0.5 seconds
  const fadeOutStart = durationInFrames - fps * 0.5;

  // Calculate opacity for fade in/out
  const opacity = interpolate(
    frame,
    [0, fadeInDuration, fadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Calculate slide/scale based on animation type
  const getAnimationStyles = () => {
    switch (scene.animation) {
      case 'slide':
        const slideX = interpolate(
          frame,
          [0, fadeInDuration, fadeOutStart, durationInFrames],
          [50, 0, 0, -50],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return { transform: `translateX(${slideX}px)` };

      case 'zoom':
        const scale = interpolate(
          frame,
          [0, fadeInDuration, fadeOutStart, durationInFrames],
          [0.9, 1, 1, 1.1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return { transform: `scale(${scale})` };

      case 'bounce':
        const bounceY = interpolate(
          frame,
          [0, fadeInDuration * 0.5, fadeInDuration],
          [30, -10, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return { transform: `translateY(${bounceY}px)` };

      case 'fade':
      default:
        return {};
    }
  };

  const renderContent = () => {
    switch (scene.visualType) {
      case 'title-card':
        return (
          <TitleCard
            title={scene.title}
            content={scene.content}
            styleConfig={styleConfig}
            frame={frame}
            fps={fps}
          />
        );

      case 'bullet-list':
        return (
          <BulletList
            title={scene.title}
            content={scene.content}
            styleConfig={styleConfig}
            frame={frame}
            fps={fps}
          />
        );

      case 'stat-highlight':
        return (
          <StatHighlight
            title={scene.title}
            content={scene.content}
            styleConfig={styleConfig}
            frame={frame}
            fps={fps}
          />
        );

      case 'quote':
        return (
          <Quote
            title={scene.title}
            content={scene.content}
            styleConfig={styleConfig}
            frame={frame}
            fps={fps}
          />
        );

      default:
        return (
          <TitleCard
            title={scene.title}
            content={scene.content}
            styleConfig={styleConfig}
            frame={frame}
            fps={fps}
          />
        );
    }
  };

  return (
    <AbsoluteFill
      style={{
        opacity,
        ...getAnimationStyles(),
      }}
    >
      {renderContent()}
    </AbsoluteFill>
  );
}
