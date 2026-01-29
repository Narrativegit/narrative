// Video style configurations
export type VideoStyle =
  | 'professional'
  | 'playful'
  | 'minimal'
  | 'bold'
  | 'corporate';

export interface VideoStyleConfig {
  id: VideoStyle;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  animation: 'fade' | 'slide' | 'zoom' | 'bounce';
}

// Data source types
export type DataSourceType =
  | 'meeting-summary'
  | 'jira-retro'
  | 'email'
  | 'slack'
  | 'excel'
  | 'custom';

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  content: string;
  createdAt: Date;
}

// Video project
export interface VideoProject {
  id: string;
  title: string;
  description?: string;
  dataSources: DataSource[];
  prompt: string;
  style: VideoStyle;
  script?: VideoScript;
  status: ProjectStatus;
  shareLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus =
  | 'draft'
  | 'generating'
  | 'editing'
  | 'rendering'
  | 'complete'
  | 'error';

// AI-generated video script
export interface VideoScript {
  id: string;
  scenes: VideoScene[];
  totalDuration: number;
  voiceoverText?: string;
}

export interface VideoScene {
  id: string;
  order: number;
  duration: number;
  title?: string;
  content: string;
  visualType: SceneVisualType;
  animation: string;
  backgroundColor?: string;
  textColor?: string;
}

export type SceneVisualType =
  | 'text-only'
  | 'stat-highlight'
  | 'bullet-list'
  | 'quote'
  | 'title-card'
  | 'chart-placeholder';

// Editor state
export interface EditorState {
  currentSceneIndex: number;
  isPlaying: boolean;
  currentTime: number;
  selectedElement?: string;
  zoom: number;
}

// Share link
export interface ShareLink {
  id: string;
  projectId: string;
  url: string;
  expiresAt?: Date;
  viewCount: number;
  createdAt: Date;
}

// API response types
export interface GenerateScriptRequest {
  dataSources: DataSource[];
  prompt: string;
  style: VideoStyle;
}

export interface GenerateScriptResponse {
  script: VideoScript;
  suggestions?: string[];
}

// UI state types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
