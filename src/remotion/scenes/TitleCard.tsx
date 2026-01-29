import { AbsoluteFill, interpolate } from 'remotion';

interface StyleConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface TitleCardProps {
  title?: string;
  content: string;
  styleConfig: StyleConfig;
  frame: number;
  fps: number;
}

export function TitleCard({ title, content, styleConfig, frame, fps }: TitleCardProps) {
  const titleOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const contentOpacity = interpolate(frame, [fps * 0.2, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const contentY = interpolate(frame, [fps * 0.2, fps * 0.5], [20, 0], {
    extrapolateRight: 'clamp',
  });

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
      {/* Decorative element */}
      <div
        style={{
          width: 60,
          height: 4,
          backgroundColor: styleConfig.primaryColor,
          borderRadius: 2,
          marginBottom: 40,
          opacity: titleOpacity,
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
          }}
        >
          {title}
        </h2>
      )}

      {/* Content */}
      <p
        style={{
          fontSize: 64,
          fontWeight: 600,
          color: styleConfig.textColor,
          textAlign: 'center',
          maxWidth: 1200,
          lineHeight: 1.3,
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
        }}
      >
        {content}
      </p>
    </AbsoluteFill>
  );
}
