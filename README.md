# Narrative

> Create short, engaging video summaries from your data

Narrative is a browser-based application that allows workers to transform data from various tools (AI meeting summaries, Jira retrospectives, emails, Slack, Excel, etc.) into short, engaging video summaries. Built with Claude AI for intelligent content generation and Remotion for professional video rendering.

## Features

### MVP Features

- **Multi-source Data Input**: Paste content from various sources including:
  - Meeting summaries (AI-generated or manual)
  - Jira/Retrospective notes
  - Email threads
  - Slack conversations
  - Excel/spreadsheet data
  - Custom text content

- **AI-Powered Script Generation**: Claude AI analyzes your data and creates a structured video script with:
  - Smart scene segmentation
  - Key point extraction
  - Engaging narrative flow

- **Video Styles**: Choose from 5 pre-built visual styles:
  - **Professional**: Clean and corporate-friendly
  - **Playful**: Fun and engaging with bouncy animations
  - **Minimal**: Simple and elegant design
  - **Bold**: High impact with dynamic animations
  - **Corporate**: Traditional business presentation style

- **Basic Video Editor**: Edit your generated video with:
  - Scene reordering (drag and drop)
  - Content editing for each scene
  - Duration adjustment per scene
  - Visual type selection (title card, bullet list, stat highlight, quote)
  - Real-time preview

- **Link-based Sharing**: Generate shareable links to distribute your videos

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **Video Rendering**: Remotion
- **AI Integration**: Anthropic Claude API
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
narrative/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── index.ts
│   │   ├── layout/             # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   ├── editor/             # Video editing components
│   │   │   ├── DataInput.tsx
│   │   │   ├── PromptInput.tsx
│   │   │   ├── StyleSelector.tsx
│   │   │   ├── SceneEditor.tsx
│   │   │   └── index.ts
│   │   └── video/              # Video player components
│   │       ├── VideoPreview.tsx
│   │       └── index.ts
│   ├── pages/                  # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Create.tsx
│   │   ├── Editor.tsx
│   │   ├── Share.tsx
│   │   └── index.ts
│   ├── remotion/               # Remotion video compositions
│   │   ├── Root.tsx
│   │   ├── NarrativeVideo.tsx
│   │   ├── scenes/
│   │   │   ├── Scene.tsx
│   │   │   ├── TitleCard.tsx
│   │   │   ├── BulletList.tsx
│   │   │   ├── StatHighlight.tsx
│   │   │   ├── Quote.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and helpers
│   │   ├── utils.ts
│   │   └── store.ts            # Zustand store
│   ├── services/               # API services
│   │   ├── claude.ts           # Claude AI integration
│   │   └── share.ts            # Share link management
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── styles/                 # Global styles
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── remotion.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/narrative.git
cd narrative
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your Anthropic API key:
```
VITE_ANTHROPIC_API_KEY=your-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run remotion:studio` | Open Remotion Studio for video development |
| `npm run remotion:render` | Render a video |
| `npm run remotion:build` | Build Remotion bundle |

## Usage Guide

### Creating a Video

1. **Start a New Project**: Click "New Video" from the dashboard or sidebar
2. **Add Data Sources**: Paste content from your meetings, emails, Slack, etc.
3. **Write a Prompt**: Describe how you want your video summary to be presented
4. **Choose a Style**: Select a visual style that matches your message
5. **Generate**: Click "Generate Video" to create your script

### Editing Your Video

1. **Preview**: Watch your video in the preview player
2. **Edit Scenes**: Click on any scene to expand and edit its content
3. **Reorder**: Drag and drop scenes to change their order
4. **Adjust Timing**: Use the duration slider to change scene length
5. **Change Visual Types**: Switch between title cards, bullet lists, stats, and quotes

### Sharing

1. Click the "Share" button in the editor
2. Generate a shareable link
3. Copy and distribute the link to your team

## Design System

### Colors

The design system uses a custom color palette:

- **Brand**: Blue tones (`brand-50` to `brand-950`)
- **Surface**: Neutral grays (`surface-50` to `surface-950`)
- **Accent**: Coral, Mint, Lavender, Amber, Cyan

### Components

All UI components follow consistent patterns:

- **Buttons**: Primary, Secondary, Ghost, and Danger variants
- **Inputs**: With labels, hints, and error states
- **Cards**: Default, Hover, and Interactive variants
- **Badges**: For status indicators and tags
- **Modals**: For dialogs and confirmations
- **Toasts**: For notifications

## Architecture Decisions

### Why Remotion?

Remotion allows us to create programmatic videos using React components. This means:
- Consistent rendering across all browsers
- Easy to customize and extend
- Can be rendered server-side for production

### Why Zustand?

Zustand provides simple, unopinionated state management:
- Minimal boilerplate
- Works great with React 18
- Easy to test and debug

### Why Tailwind CSS?

Tailwind enables rapid UI development:
- Consistent design tokens
- No context switching between files
- Easy to customize via config

## Future Enhancements

The following features are planned for future releases:

1. **Integrations**: Direct connections to Slack, Jira, Google Meet, etc.
2. **Voiceover**: AI-generated voice narration
3. **Templates**: Pre-built video templates for common use cases
4. **Team Workspaces**: Collaboration features for teams
5. **Analytics**: View counts, watch time, engagement metrics
6. **Custom Branding**: Upload logos, custom colors, fonts
7. **Export Formats**: MP4, GIF, WebM downloads
8. **Embed Support**: Embed videos in Notion, Confluence, etc.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with love by the Narrative team. Inspired by tools like Loom for the fun, enterprise-friendly UI.
