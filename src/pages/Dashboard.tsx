import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Clock, Share2, MoreHorizontal } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button, Card, Badge } from '@/components/ui';
import { useStore } from '@/lib/store';
import { formatRelativeTime, truncate } from '@/lib/utils';
import type { VideoProject, ProjectStatus } from '@/types';

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'brand' | 'success' | 'warning' | 'error' }> = {
  draft: { label: 'Draft', variant: 'default' },
  generating: { label: 'Generating', variant: 'brand' },
  editing: { label: 'Editing', variant: 'warning' },
  rendering: { label: 'Rendering', variant: 'brand' },
  complete: { label: 'Complete', variant: 'success' },
  error: { label: 'Error', variant: 'error' },
};

interface ProjectCardProps {
  project: VideoProject;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const status = statusConfig[project.status];

  return (
    <Card
      variant="interactive"
      padding="none"
      className="overflow-hidden group"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-brand-500 to-accent-lavender relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-surface-900 truncate">{project.title}</h3>
        <p className="text-sm text-surface-500 mt-1">
          {project.description ? truncate(project.description, 60) : 'No description'}
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-surface-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatRelativeTime(project.updatedAt)}
          </span>
          {project.shareLink && (
            <span className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              Shared
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, createProject, setCurrentProject } = useStore();

  const handleNewProject = () => {
    const project = createProject('Untitled Video');
    setCurrentProject(project);
    navigate(`/create/${project.id}`);
  };

  const handleProjectClick = (project: VideoProject) => {
    setCurrentProject(project);
    if (project.status === 'draft') {
      navigate(`/create/${project.id}`);
    } else {
      navigate(`/editor/${project.id}`);
    }
  };

  return (
    <Layout title="Dashboard" subtitle="Create and manage your video summaries">
      <div className="p-6">
        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-surface-500 uppercase tracking-wider mb-4">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              variant="interactive"
              className="flex items-center gap-4 cursor-pointer"
              onClick={handleNewProject}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                <Plus className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-medium text-surface-900">New Video</h3>
                <p className="text-sm text-surface-500">Start from scratch</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-surface-500 uppercase tracking-wider">
              Recent Projects
            </h2>
            {projects.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
                View All
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 flex items-center justify-center">
                <Play className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-lg font-medium text-surface-900 mb-2">
                No projects yet
              </h3>
              <p className="text-surface-500 mb-6 max-w-sm mx-auto">
                Create your first video summary by clicking the button below
              </p>
              <Button onClick={handleNewProject} leftIcon={<Plus className="w-4 h-4" />}>
                Create Your First Video
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projects.slice(0, 8).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
