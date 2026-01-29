import { create } from 'zustand';
import { generateId } from './utils';
import type {
  VideoProject,
  VideoStyle,
  DataSource,
  VideoScript,
  Toast,
  EditorState,
  ProjectStatus,
} from '@/types';

interface AppState {
  // Projects
  projects: VideoProject[];
  currentProject: VideoProject | null;

  // Editor
  editor: EditorState;

  // UI
  toasts: Toast[];
  isGenerating: boolean;

  // Project actions
  createProject: (title: string) => VideoProject;
  updateProject: (id: string, updates: Partial<VideoProject>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: VideoProject | null) => void;

  // Data source actions
  addDataSource: (projectId: string, source: Omit<DataSource, 'id' | 'createdAt'>) => void;
  removeDataSource: (projectId: string, sourceId: string) => void;
  updateDataSource: (projectId: string, sourceId: string, updates: Partial<DataSource>) => void;

  // Script actions
  setScript: (projectId: string, script: VideoScript) => void;
  updateScene: (projectId: string, sceneId: string, updates: Partial<VideoScript['scenes'][0]>) => void;

  // Editor actions
  setEditorState: (updates: Partial<EditorState>) => void;

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Generation state
  setIsGenerating: (value: boolean) => void;
  setProjectStatus: (projectId: string, status: ProjectStatus) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  projects: [],
  currentProject: null,
  editor: {
    currentSceneIndex: 0,
    isPlaying: false,
    currentTime: 0,
    zoom: 1,
  },
  toasts: [],
  isGenerating: false,

  // Project actions
  createProject: (title: string) => {
    const newProject: VideoProject = {
      id: generateId(),
      title,
      dataSources: [],
      prompt: '',
      style: 'professional',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      projects: [newProject, ...state.projects],
      currentProject: newProject,
    }));

    return newProject;
  },

  updateProject: (id: string, updates: Partial<VideoProject>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates, updatedAt: new Date() }
          : state.currentProject,
    }));
  },

  deleteProject: (id: string) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  setCurrentProject: (project: VideoProject | null) => {
    set({ currentProject: project });
  },

  // Data source actions
  addDataSource: (projectId: string, source) => {
    const newSource: DataSource = {
      ...source,
      id: generateId(),
      createdAt: new Date(),
    };

    const { updateProject, projects } = get();
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        dataSources: [...project.dataSources, newSource],
      });
    }
  },

  removeDataSource: (projectId: string, sourceId: string) => {
    const { updateProject, projects } = get();
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        dataSources: project.dataSources.filter((s) => s.id !== sourceId),
      });
    }
  },

  updateDataSource: (projectId: string, sourceId: string, updates) => {
    const { updateProject, projects } = get();
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        dataSources: project.dataSources.map((s) =>
          s.id === sourceId ? { ...s, ...updates } : s
        ),
      });
    }
  },

  // Script actions
  setScript: (projectId: string, script: VideoScript) => {
    const { updateProject } = get();
    updateProject(projectId, { script, status: 'editing' });
  },

  updateScene: (projectId: string, sceneId: string, updates) => {
    const { projects, updateProject } = get();
    const project = projects.find((p) => p.id === projectId);
    if (project?.script) {
      const updatedScenes = project.script.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, ...updates } : scene
      );
      updateProject(projectId, {
        script: { ...project.script, scenes: updatedScenes },
      });
    }
  },

  // Editor actions
  setEditorState: (updates: Partial<EditorState>) => {
    set((state) => ({
      editor: { ...state.editor, ...updates },
    }));
  },

  // Toast actions
  addToast: (toast) => {
    const id = generateId();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto-remove toast after duration
    const duration = toast.duration ?? 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Generation state
  setIsGenerating: (value: boolean) => {
    set({ isGenerating: value });
  },

  setProjectStatus: (projectId: string, status: ProjectStatus) => {
    const { updateProject } = get();
    updateProject(projectId, { status });
  },
}));
