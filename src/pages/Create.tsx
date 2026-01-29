import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button, Card, Input } from '@/components/ui';
import DataInput from '@/components/editor/DataInput';
import PromptInput from '@/components/editor/PromptInput';
import StyleSelector from '@/components/editor/StyleSelector';
import { useStore } from '@/lib/store';
import { generateVideoScript } from '@/services/claude';
import type { VideoStyle } from '@/types';

export default function Create() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    projects,
    currentProject,
    setCurrentProject,
    updateProject,
    addDataSource,
    removeDataSource,
    setScript,
    setProjectStatus,
    addToast,
    isGenerating,
    setIsGenerating,
  } = useStore();

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

  if (!currentProject) {
    return (
      <Layout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      </Layout>
    );
  }

  const handleTitleChange = (title: string) => {
    updateProject(currentProject.id, { title });
  };

  const handlePromptChange = (prompt: string) => {
    updateProject(currentProject.id, { prompt });
  };

  const handleStyleChange = (style: VideoStyle) => {
    updateProject(currentProject.id, { style });
  };

  const handleGenerate = async () => {
    if (currentProject.dataSources.length === 0) {
      addToast({
        type: 'warning',
        title: 'No data sources',
        message: 'Please add at least one data source before generating',
      });
      return;
    }

    if (!currentProject.prompt.trim()) {
      addToast({
        type: 'warning',
        title: 'No prompt',
        message: 'Please add a prompt to guide the video generation',
      });
      return;
    }

    setIsGenerating(true);
    setProjectStatus(currentProject.id, 'generating');

    try {
      const script = await generateVideoScript({
        dataSources: currentProject.dataSources,
        prompt: currentProject.prompt,
        style: currentProject.style,
      });

      setScript(currentProject.id, script);
      addToast({
        type: 'success',
        title: 'Script generated',
        message: 'Your video script is ready for editing',
      });
      navigate(`/editor/${currentProject.id}`);
    } catch (error) {
      setProjectStatus(currentProject.id, 'error');
      addToast({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate =
    currentProject.dataSources.length > 0 && currentProject.prompt.trim().length > 0;

  return (
    <Layout
      title="Create Video"
      subtitle="Add your data and customize your video"
      headerActions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Project title */}
        <Card padding="md">
          <Input
            label="Video Title"
            value={currentProject.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Give your video a title..."
          />
        </Card>

        {/* Data sources */}
        <Card padding="md">
          <DataInput
            dataSources={currentProject.dataSources}
            onAddSource={(source) => addDataSource(currentProject.id, source)}
            onRemoveSource={(id) => removeDataSource(currentProject.id, id)}
            onUpdateSource={() => {}}
          />
        </Card>

        {/* Prompt */}
        <Card padding="md">
          <PromptInput
            value={currentProject.prompt}
            onChange={handlePromptChange}
            disabled={isGenerating}
          />
        </Card>

        {/* Style */}
        <Card padding="md">
          <StyleSelector
            value={currentProject.style}
            onChange={handleStyleChange}
            disabled={isGenerating}
          />
        </Card>

        {/* Generate button */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-surface-500">
            {currentProject.dataSources.length} source
            {currentProject.dataSources.length !== 1 && 's'} added
          </p>
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            isLoading={isGenerating}
            rightIcon={!isGenerating && <ArrowRight className="w-4 h-4" />}
            leftIcon={!isGenerating && <Sparkles className="w-4 h-4" />}
          >
            {isGenerating ? 'Generating...' : 'Generate Video'}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
