import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Share2,
  Settings,
  Loader2,
  Undo,
  Redo,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button, Card, Badge, Modal, Input } from '@/components/ui';
import VideoPreview from '@/components/video/VideoPreview';
import SceneEditor from '@/components/editor/SceneEditor';
import StyleSelector from '@/components/editor/StyleSelector';
import { useStore } from '@/lib/store';
import { copyToClipboard, generateId } from '@/lib/utils';
import type { VideoScene, VideoStyle } from '@/types';

export default function Editor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    projects,
    currentProject,
    setCurrentProject,
    updateProject,
    updateScene,
    setProjectStatus,
    addToast,
    editor,
    setEditorState,
  } = useStore();

  const [isExporting, setIsExporting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);

  // Load project on mount
  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      } else {
        navigate('/');
      }
    }
  }, [projectId, projects, setCurrentProject, navigate]);

  if (!currentProject || !currentProject.script) {
    return (
      <Layout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      </Layout>
    );
  }

  const { script } = currentProject;

  const handleReorderScenes = (newScenes: VideoScene[]) => {
    const reorderedScenes = newScenes.map((scene, index) => ({
      ...scene,
      order: index,
    }));
    updateProject(currentProject.id, {
      script: { ...script, scenes: reorderedScenes },
    });
  };

  const handleUpdateScene = (sceneId: string, updates: Partial<VideoScene>) => {
    updateScene(currentProject.id, sceneId, updates);
  };

  const handleDeleteScene = (sceneId: string) => {
    if (script.scenes.length <= 1) {
      addToast({
        type: 'warning',
        title: 'Cannot delete',
        message: 'Video must have at least one scene',
      });
      return;
    }

    const updatedScenes = script.scenes
      .filter((s) => s.id !== sceneId)
      .map((s, i) => ({ ...s, order: i }));

    const totalDuration = updatedScenes.reduce((sum, s) => sum + s.duration, 0);

    updateProject(currentProject.id, {
      script: {
        ...script,
        scenes: updatedScenes,
        totalDuration,
      },
    });

    addToast({
      type: 'success',
      title: 'Scene deleted',
    });
  };

  const handleRegenerateScene = (sceneId: string) => {
    addToast({
      type: 'info',
      title: 'Regenerating scene...',
      message: 'This would call Claude to regenerate the scene content',
    });
  };

  const handleStyleChange = (style: VideoStyle) => {
    updateProject(currentProject.id, { style });
    setShowStyleModal(false);
    addToast({
      type: 'success',
      title: 'Style updated',
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    setProjectStatus(currentProject.id, 'rendering');

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsExporting(false);
    setProjectStatus(currentProject.id, 'complete');
    addToast({
      type: 'success',
      title: 'Video exported',
      message: 'Your video is ready for download',
    });
  };

  const handleShare = async () => {
    const shareLink = `${window.location.origin}/share/${generateId()}`;
    updateProject(currentProject.id, { shareLink });
    await copyToClipboard(shareLink);
    addToast({
      type: 'success',
      title: 'Link copied',
      message: 'Share link has been copied to clipboard',
    });
    setShowShareModal(false);
  };

  return (
    <Layout
      title={currentProject.title}
      subtitle="Edit your video"
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowStyleModal(true)}
            leftIcon={<Settings className="w-4 h-4" />}
          >
            Style
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowShareModal(true)}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            isLoading={isExporting}
            leftIcon={!isExporting && <Download className="w-4 h-4" />}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      }
    >
      <div className="flex h-[calc(100vh-64px)]">
        {/* Video preview */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <VideoPreview script={script} style={currentProject.style} />

            {/* Project info */}
            <div className="mt-4 flex items-center gap-4 text-sm text-surface-500">
              <span>{script.scenes.length} scenes</span>
              <span>•</span>
              <span>{script.totalDuration} seconds</span>
              <span>•</span>
              <Badge variant="outline">{currentProject.style}</Badge>
            </div>
          </div>
        </div>

        {/* Scene editor sidebar */}
        <div className="w-96 border-l border-surface-200 bg-white overflow-auto">
          <div className="p-4">
            <SceneEditor
              scenes={script.scenes}
              onReorder={handleReorderScenes}
              onUpdateScene={handleUpdateScene}
              onDeleteScene={handleDeleteScene}
              onRegenerateScene={handleRegenerateScene}
              currentSceneIndex={editor.currentSceneIndex}
              onSelectScene={(index) => setEditorState({ currentSceneIndex: index })}
            />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Video"
        description="Create a shareable link for your video"
      >
        <div className="space-y-4">
          {currentProject.shareLink ? (
            <div className="space-y-3">
              <Input
                value={currentProject.shareLink}
                readOnly
                hint="Anyone with this link can view your video"
              />
              <Button
                className="w-full"
                onClick={() => {
                  copyToClipboard(currentProject.shareLink!);
                  addToast({ type: 'success', title: 'Link copied!' });
                }}
              >
                Copy Link
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-surface-600 mb-4">
                Generate a link to share your video with others
              </p>
              <Button onClick={handleShare}>Generate Share Link</Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Style Modal */}
      <Modal
        isOpen={showStyleModal}
        onClose={() => setShowStyleModal(false)}
        title="Change Video Style"
        size="lg"
      >
        <StyleSelector
          value={currentProject.style}
          onChange={handleStyleChange}
        />
      </Modal>
    </Layout>
  );
}
