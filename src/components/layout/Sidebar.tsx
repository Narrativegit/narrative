import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FolderOpen,
  Settings,
  HelpCircle,
  Plus,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Projects', href: '/projects', icon: FolderOpen },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help', href: '/help', icon: HelpCircle },
];

interface SidebarProps {
  onNewProject: () => void;
}

export default function Sidebar({ onNewProject }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="flex flex-col w-64 h-screen bg-white border-r border-surface-200">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-surface-200">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Video className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-semibold text-surface-900">Narrative</span>
      </div>

      {/* New Project Button */}
      <div className="px-3 py-4">
        <Button
          onClick={onNewProject}
          className="w-full justify-center"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Video
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <nav className="px-3 py-4 border-t border-surface-200 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
