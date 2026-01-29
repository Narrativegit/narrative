import React, { useState } from 'react';
import {
  GripVertical,
  Clock,
  Type,
  Palette,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button, Card, Textarea, Input, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { VideoScene, SceneVisualType } from '@/types';

const visualTypes: { type: SceneVisualType; label: string }[] = [
  { type: 'title-card', label: 'Title Card' },
  { type: 'bullet-list', label: 'Bullet List' },
  { type: 'stat-highlight', label: 'Stat Highlight' },
  { type: 'quote', label: 'Quote' },
];

interface SceneEditorProps {
  scenes: VideoScene[];
  onReorder: (scenes: VideoScene[]) => void;
  onUpdateScene: (sceneId: string, updates: Partial<VideoScene>) => void;
  onDeleteScene: (sceneId: string) => void;
  onRegenerateScene: (sceneId: string) => void;
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
}

interface SceneItemProps {
  scene: VideoScene;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<VideoScene>) => void;
  onDelete: () => void;
  onRegenerate: () => void;
}

function SceneItem({
  scene,
  index,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onUpdate,
  onDelete,
  onRegenerate,
}: SceneItemProps) {
  return (
    <Reorder.Item
      value={scene}
      id={scene.id}
      className={cn(
        'rounded-lg border transition-all',
        isSelected
          ? 'border-brand-500 bg-brand-50/50 shadow-soft'
          : 'border-surface-200 bg-white hover:border-surface-300'
      )}
    >
      {/* Scene header */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={onSelect}
      >
        <div className="cursor-grab active:cursor-grabbing text-surface-400 hover:text-surface-600">
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="w-6 h-6 rounded bg-surface-100 flex items-center justify-center text-xs font-medium text-surface-600">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-900 truncate">
            {scene.title || `Scene ${index + 1}`}
          </p>
          <p className="text-xs text-surface-500 truncate">
            {scene.content.slice(0, 50)}
            {scene.content.length > 50 && '...'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            {scene.duration}s
          </Badge>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-1 rounded hover:bg-surface-100 text-surface-400"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0 space-y-3 border-t border-surface-100">
              <div className="pt-3 grid grid-cols-2 gap-3">
                {/* Title */}
                <Input
                  label="Title"
                  value={scene.title || ''}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="Scene title..."
                />

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Duration (seconds)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="2"
                      max="15"
                      value={scene.duration}
                      onChange={(e) =>
                        onUpdate({ duration: parseInt(e.target.value) })
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-surface-900 w-8">
                      {scene.duration}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <Textarea
                label="Content"
                value={scene.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                rows={3}
                placeholder="Scene content..."
              />

              {/* Visual type */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Visual Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {visualTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => onUpdate({ visualType: type.type })}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                        scene.visualType === type.type
                          ? 'bg-brand-50 border-brand-300 text-brand-700'
                          : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-600 hover:bg-red-50"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

export default function SceneEditor({
  scenes,
  onReorder,
  onUpdateScene,
  onDeleteScene,
  onRegenerateScene,
  currentSceneIndex,
  onSelectScene,
}: SceneEditorProps) {
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(null);

  const handleToggleExpand = (sceneId: string) => {
    setExpandedSceneId(expandedSceneId === sceneId ? null : sceneId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-surface-900">Scenes</h3>
        <span className="text-xs text-surface-500">
          {scenes.length} scene{scenes.length !== 1 && 's'}
        </span>
      </div>

      <Reorder.Group
        axis="y"
        values={scenes}
        onReorder={onReorder}
        className="space-y-2"
      >
        {scenes.map((scene, index) => (
          <SceneItem
            key={scene.id}
            scene={scene}
            index={index}
            isSelected={currentSceneIndex === index}
            isExpanded={expandedSceneId === scene.id}
            onSelect={() => onSelectScene(index)}
            onToggleExpand={() => handleToggleExpand(scene.id)}
            onUpdate={(updates) => onUpdateScene(scene.id, updates)}
            onDelete={() => onDeleteScene(scene.id)}
            onRegenerate={() => onRegenerateScene(scene.id)}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}
