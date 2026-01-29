import { AbsoluteFill, interpolate } from 'remotion';

interface StyleConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface QuoteProps {
  title?: string;
  content: string;
  styleConfig: StyleConfig;
  frame: number;
  fps: number;
}

export function Quote({ title, content, styleConfig, frame, fps }: QuoteProps) {
  const quoteOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const quoteY = interpolate(frame, [0, fps * 0.4], [30, 0], {
    extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [fps * 0.3, fps * 0.6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Remove surrounding quotes if present
  const cleanContent = content.replace(/^["']|["']$/g, '');

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 120,
      }}
    >
      {/* Large quote mark */}
      <div
        style={{
          fontSize: 200,
          fontWeight: 700,
          color: styleConfig.primaryColor,
          opacity: 0.15,
          position: 'absolute',
          top: 150,
          left: 150,
          lineHeight: 1,
          fontFamily: 'Georgia, serif',
        }}
      >
        "
      </div>

      {/* Quote content */}
      <blockquote
        style={{
          fontSize: 48,
          fontWeight: 500,
          color: styleConfig.textColor,
          textAlign: 'center',
          maxWidth: 1000,
          lineHeight: 1.5,
          fontStyle: 'italic',
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        "{cleanContent}"
      </blockquote>

      {/* Attribution/Title */}
      {title && (
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              width: 40,
              height: 2,
              backgroundColor: styleConfig.primaryColor,
            }}
          />
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: styleConfig.accentColor,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {title}
          </span>
          <div
            style={{
              width: 40,
              height: 2,
              backgroundColor: styleConfig.primaryColor,
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
}
