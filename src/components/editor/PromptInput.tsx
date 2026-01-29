import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

const promptSuggestions = [
  {
    label: 'Executive Summary',
    prompt:
      'Create a concise executive summary highlighting the key decisions, action items, and deadlines. Focus on what matters most for leadership.',
  },
  {
    label: 'Team Update',
    prompt:
      'Create an engaging team update video that celebrates wins, acknowledges challenges, and clearly outlines next steps. Keep it motivating and clear.',
  },
  {
    label: 'Project Status',
    prompt:
      'Summarize the project status including progress made, blockers encountered, and timeline updates. Include key metrics if available.',
  },
  {
    label: 'Sprint Recap',
    prompt:
      'Create a sprint recap covering completed stories, velocity, and retrospective highlights. Include shoutouts for team achievements.',
  },
  {
    label: 'Client Update',
    prompt:
      'Create a professional client-facing update covering progress, milestones achieved, and upcoming deliverables. Keep it positive and results-focused.',
  },
];

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-surface-900">Video Prompt</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Tell the AI how you want your video summary to be presented
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          rightIcon={
            showSuggestions ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )
          }
        >
          <Lightbulb className="w-4 h-4" />
          Suggestions
        </Button>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-3 bg-surface-50 rounded-lg">
              {promptSuggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-surface-200 rounded-full hover:border-brand-300 hover:bg-brand-50 transition-colors"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="E.g., Create a 60-second video summary that highlights the key decisions from this meeting. Focus on action items and deadlines. Use a professional but friendly tone."
          rows={4}
          disabled={disabled}
          className="pr-10"
        />
        <div className="absolute top-2 right-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
        </div>
      </div>

      {/* Character count */}
      <div className="flex items-center justify-between text-xs text-surface-400">
        <span>
          {value.length > 0 && (
            <span className={cn(value.length > 500 && 'text-amber-500')}>
              {value.length} characters
            </span>
          )}
        </span>
        <span>Tip: Be specific about tone, length, and key points to include</span>
      </div>
    </div>
  );
}
