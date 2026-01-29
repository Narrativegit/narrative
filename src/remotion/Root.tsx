import { Composition } from 'remotion';
import { NarrativeVideo } from './NarrativeVideo';
import type { VideoScript, VideoStyle } from '@/types';

// Default props for the Remotion studio
const defaultScript: VideoScript = {
  id: 'preview',
  scenes: [
    {
      id: '1',
      order: 0,
      duration: 3,
      title: 'Welcome',
      content: 'Your video summary starts here',
      visualType: 'title-card',
      animation: 'fade',
    },
    {
      id: '2',
      order: 1,
      duration: 5,
      title: 'Key Points',
      content: '• Point one\n• Point two\n• Point three',
      visualType: 'bullet-list',
      animation: 'slide',
    },
    {
      id: '3',
      order: 2,
      duration: 4,
      title: 'Highlight',
      content: '42%',
      visualType: 'stat-highlight',
      animation: 'zoom',
    },
    {
      id: '4',
      order: 3,
      duration: 3,
      title: 'Thank You',
      content: 'Questions? Reach out!',
      visualType: 'title-card',
      animation: 'fade',
    },
  ],
  totalDuration: 15,
};

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="NarrativeVideo"
        component={NarrativeVideo}
        durationInFrames={30 * 15} // 15 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          script: defaultScript,
          style: 'professional' as VideoStyle,
        }}
      />
    </>
  );
}
