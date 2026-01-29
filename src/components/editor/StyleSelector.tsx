import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { VideoStyle, VideoStyleConfig } from '@/types';

const videoStyles: VideoStyleConfig[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and corporate-friendly',
    primaryColor: '#0c87f2',
    accentColor: '#06b6d4',
    fontFamily: 'Inter',
    animation: 'fade',
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Fun and engaging',
    primaryColor: '#8b5cf6',
    accentColor: '#f472b6',
    fontFamily: 'Inter',
    animation: 'bounce',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant',
    primaryColor: '#18181b',
    accentColor: '#71717a',
    fontFamily: 'Inter',
    animation: 'fade',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High impact and dynamic',
    primaryColor: '#dc2626',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    animation: 'zoom',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Traditional business style',
    primaryColor: '#1e3a5f',
    accentColor: '#0891b2',
    fontFamily: 'Inter',
    animation: 'slide',
  },
];

interface StyleSelectorProps {
  value: VideoStyle;
  onChange: (style: VideoStyle) => void;
  disabled?: boolean;
}

export default function StyleSelector({
  value,
  onChange,
  disabled,
}: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-sm font-medium text-surface-900">Video Style</h3>
        <p className="text-xs text-surface-500 mt-0.5">
          Choose a visual style that matches your message
        </p>
      </div>

      {/* Style grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {videoStyles.map((style) => {
          const isSelected = value === style.id;

          return (
            <button
              key={style.id}
              onClick={() => !disabled && onChange(style.id)}
              disabled={disabled}
              className={cn(
                'relative flex flex-col rounded-xl border-2 overflow-hidden transition-all',
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-surface-200 hover:border-surface-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Preview */}
              <div
                className="aspect-video relative"
                style={{
                  background: `linear-gradient(135deg, ${style.primaryColor} 0%, ${style.accentColor} 100%)`,
                }}
              >
                {/* Mini preview elements */}
                <div className="absolute inset-3 flex flex-col justify-center items-center">
                  <div className="w-1/2 h-2 bg-white/30 rounded mb-1.5" />
                  <div className="w-3/4 h-1.5 bg-white/20 rounded mb-1" />
                  <div className="w-2/3 h-1.5 bg-white/20 rounded" />
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow"
                  >
                    <Check className="w-3 h-3 text-brand-600" />
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <div className="p-2 bg-white">
                <p className="text-xs font-medium text-surface-900">{style.name}</p>
                <p className="text-[10px] text-surface-500 truncate">
                  {style.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { videoStyles };
