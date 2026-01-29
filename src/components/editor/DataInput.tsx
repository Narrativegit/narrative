import React, { useState } from 'react';
import {
  FileText,
  MessageSquare,
  Mail,
  Table,
  Plus,
  X,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Textarea, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { DataSource, DataSourceType } from '@/types';

const dataSourceTypes: {
  type: DataSourceType;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  color: string;
}[] = [
  {
    type: 'meeting-summary',
    label: 'Meeting Summary',
    icon: FileText,
    placeholder: 'Paste your AI meeting summary here...',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    type: 'jira-retro',
    label: 'Jira/Retro',
    icon: Table,
    placeholder: 'Paste your Jira data or retrospective notes...',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    type: 'email',
    label: 'Email',
    icon: Mail,
    placeholder: 'Paste email content or email thread...',
    color: 'text-amber-600 bg-amber-100',
  },
  {
    type: 'slack',
    label: 'Slack',
    icon: MessageSquare,
    placeholder: 'Paste Slack messages or conversation...',
    color: 'text-green-600 bg-green-100',
  },
  {
    type: 'excel',
    label: 'Excel/Data',
    icon: Table,
    placeholder: 'Paste tabular data from Excel or spreadsheets...',
    color: 'text-emerald-600 bg-emerald-100',
  },
  {
    type: 'custom',
    label: 'Custom',
    icon: FileText,
    placeholder: 'Paste any text content...',
    color: 'text-surface-600 bg-surface-100',
  },
];

interface DataInputProps {
  dataSources: DataSource[];
  onAddSource: (source: Omit<DataSource, 'id' | 'createdAt'>) => void;
  onRemoveSource: (id: string) => void;
  onUpdateSource: (id: string, updates: Partial<DataSource>) => void;
}

export default function DataInput({
  dataSources,
  onAddSource,
  onRemoveSource,
  onUpdateSource,
}: DataInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<DataSourceType | null>(null);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!selectedType || !content.trim()) return;

    const typeConfig = dataSourceTypes.find((t) => t.type === selectedType);
    onAddSource({
      type: selectedType,
      name: name.trim() || typeConfig?.label || 'Untitled',
      content: content.trim(),
    });

    // Reset form
    setIsAdding(false);
    setSelectedType(null);
    setContent('');
    setName('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedType(null);
    setContent('');
    setName('');
  };

  const selectedTypeConfig = dataSourceTypes.find((t) => t.type === selectedType);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-surface-900">Data Sources</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Add the data you want to summarize in your video
          </p>
        </div>
        {!isAdding && dataSources.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Source
          </Button>
        )}
      </div>

      {/* Existing sources */}
      <AnimatePresence mode="popLayout">
        {dataSources.map((source) => {
          const typeConfig = dataSourceTypes.find((t) => t.type === source.type);
          const Icon = typeConfig?.icon || FileText;

          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card padding="sm" className="group">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      typeConfig?.color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-surface-900 truncate">
                        {source.name}
                      </span>
                      <Badge variant="outline" size="sm">
                        {typeConfig?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-surface-500 mt-1 line-clamp-2">
                      {source.content.slice(0, 150)}
                      {source.content.length > 150 && '...'}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveSource(source.id)}
                    className="p-1 rounded hover:bg-surface-100 text-surface-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add new source */}
      {isAdding ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="md" className="border-brand-200 bg-brand-50/30">
            {!selectedType ? (
              <>
                <p className="text-sm font-medium text-surface-900 mb-3">
                  Choose data type:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {dataSourceTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => setSelectedType(type.type)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-surface-200 bg-white hover:border-brand-300 hover:bg-brand-50 transition-colors text-left"
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center',
                          type.color
                        )}
                      >
                        <type.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-surface-700">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      selectedTypeConfig?.color
                    )}
                  >
                    {selectedTypeConfig && <selectedTypeConfig.icon className="w-4 h-4" />}
                  </div>
                  <span className="font-medium text-surface-900">
                    {selectedTypeConfig?.label}
                  </span>
                  <button
                    onClick={() => setSelectedType(null)}
                    className="ml-auto p-1 rounded hover:bg-surface-100 text-surface-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Source name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-surface-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />

                <Textarea
                  placeholder={selectedTypeConfig?.placeholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="bg-white"
                />

                <div className="flex items-center gap-2 mt-4">
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAdd}
                    disabled={!content.trim()}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Source
                  </Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      ) : dataSources.length === 0 ? (
        <Card
          variant="interactive"
          className="border-dashed border-2 text-center py-8 cursor-pointer"
          onClick={() => setIsAdding(true)}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-brand-600" />
          </div>
          <p className="text-sm font-medium text-surface-900">Add your first data source</p>
          <p className="text-xs text-surface-500 mt-1">
            Paste content from meetings, emails, Slack, or any other source
          </p>
        </Card>
      ) : null}

      {/* Info */}
      {dataSources.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-surface-500 bg-surface-50 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            You've added {dataSources.length} source{dataSources.length !== 1 && 's'}.
            The AI will analyze all sources together to create your video summary.
          </p>
        </div>
      )}
    </div>
  );
}
