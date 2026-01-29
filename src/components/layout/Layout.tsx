import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from '../ui/Toast';
import { useStore } from '@/lib/store';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  showSidebar?: boolean;
}

export default function Layout({
  children,
  title,
  subtitle,
  headerActions,
  showSidebar = true,
}: LayoutProps) {
  const navigate = useNavigate();
  const { createProject, setCurrentProject } = useStore();

  const handleNewProject = () => {
    const project = createProject('Untitled Video');
    setCurrentProject(project);
    navigate(`/create/${project.id}`);
  };

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Sidebar */}
      {showSidebar && <Sidebar onNewProject={handleNewProject} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header title={title} subtitle={subtitle} actions={headerActions} />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
