import { AbsoluteFill, interpolate, spring, useVideoConfig } from 'remotion';

interface StyleConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface StatHighlightProps {
  title?: string;
  content: string;
  styleConfig: StyleConfig;
  frame: number;
  fps: number;
}

export function StatHighlight({
  title,
  content,
  styleConfig,
  frame,
  fps,
}: StatHighlightProps) {
  const { fps: videoFps } = useVideoConfig();

  // Spring animation for the stat
  const scale = spring({
    frame,
    fps: videoFps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const titleOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const statOpacity = interpolate(frame, [fps * 0.2, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Try to detect if content is a number/percentage for special formatting
  const isNumeric = /^[\d,.%$€£¥]+$/.test(content.trim());

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      {/* Background accent circle */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${styleConfig.primaryColor}20 0%, ${styleConfig.secondaryColor}20 100%)`,
          transform: `scale(${scale})`,
        }}
      />

      {/* Title */}
      {title && (
        <h2
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: styleConfig.accentColor,
            marginBottom: 24,
            opacity: titleOpacity,
            textTransform: 'uppercase',
            letterSpacing: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {title}
        </h2>
      )}

      {/* Stat */}
      <div
        style={{
          fontSize: isNumeric ? 160 : 72,
          fontWeight: 700,
          color: styleConfig.primaryColor,
          textAlign: 'center',
          opacity: statOpacity,
          transform: `scale(${scale})`,
          position: 'relative',
          zIndex: 1,
          lineHeight: 1.1,
        }}
      >
        {content}
      </div>

      {/* Decorative underline */}
      <div
        style={{
          width: 100,
          height: 4,
          backgroundColor: styleConfig.secondaryColor,
          borderRadius: 2,
          marginTop: 32,
          opacity: statOpacity,
          transform: `scaleX(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
}
