import { AbsoluteFill, interpolate } from 'remotion';

interface StyleConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface BulletListProps {
  title?: string;
  content: string;
  styleConfig: StyleConfig;
  frame: number;
  fps: number;
}

export function BulletList({ title, content, styleConfig, frame, fps }: BulletListProps) {
  // Parse bullets from content (assumes format: "• item\n• item" or "- item\n- item")
  const bullets = content
    .split('\n')
    .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);

  const titleOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 120,
      }}
    >
      {/* Title */}
      {title && (
        <h2
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: styleConfig.textColor,
            marginBottom: 48,
            opacity: titleOpacity,
          }}
        >
          {title}
        </h2>
      )}

      {/* Bullets */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {bullets.map((bullet, index) => {
          const bulletDelay = fps * 0.3 + index * fps * 0.3;
          const bulletOpacity = interpolate(
            frame,
            [bulletDelay, bulletDelay + fps * 0.3],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const bulletX = interpolate(
            frame,
            [bulletDelay, bulletDelay + fps * 0.3],
            [-30, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                marginBottom: 32,
                opacity: bulletOpacity,
                transform: `translateX(${bulletX}px)`,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: styleConfig.primaryColor,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 40,
                  color: styleConfig.textColor,
                  fontWeight: 500,
                }}
              >
                {bullet}
              </span>
            </li>
          );
        })}
      </ul>
    </AbsoluteFill>
  );
}
