import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-surface-200">
      {/* Left side - Title */}
      <div>
        {title && (
          <h1 className="text-lg font-semibold text-surface-900">{title}</h1>
        )}
        {subtitle && (
          <p className="text-sm text-surface-500">{subtitle}</p>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-64 pl-9 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Custom actions */}
        {actions}

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="p-2">
          <Bell className="w-5 h-5" />
        </Button>

        {/* User menu */}
        <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-100 transition-colors">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-brand-600" />
          </div>
        </button>
      </div>
    </header>
  );
}
