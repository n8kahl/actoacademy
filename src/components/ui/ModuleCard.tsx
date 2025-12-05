'use client';

import Link from 'next/link';
import { Clock, BookOpen, Lock, CheckCircle, Play } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
  icon: LucideIcon;
  topics: string[];
}

interface ModuleCardProps {
  module: Module;
  onClick?: () => void;
}

export default function ModuleCard({ module, onClick }: ModuleCardProps) {
  const Icon = module.icon;
  const isClickable = module.status !== 'locked';

  const statusStyles = {
    completed: 'bg-green-50 border-green-200 hover:border-green-300',
    'in-progress': 'bg-acto-soft-blue/30 border-acto-teal/30 hover:border-acto-teal',
    locked: 'bg-gray-50 border-gray-200',
  };

  const statusBadge = {
    completed: { bg: 'bg-green-100 text-green-700 border-green-200', label: 'Completed' },
    'in-progress': { bg: 'bg-acto-soft-blue text-acto-dark-blue border-acto-teal/30', label: 'In Progress' },
    locked: { bg: 'bg-gray-100 text-gray-500 border-gray-200', label: 'Locked' },
  };

  const CardContent = (
    <div
      className={clsx(
        'rounded-2xl p-6 border-2 transition-all',
        statusStyles[module.status],
        isClickable && 'cursor-pointer hover:shadow-md hover:scale-[1.02]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            module.status === 'locked' ? 'bg-gray-200' : 'bg-acto-teal'
          )}
        >
          {module.status === 'locked' ? (
            <Lock className="w-6 h-6 text-gray-400" />
          ) : (
            <Icon className="w-6 h-6 text-white" />
          )}
        </div>
        <span
          className={clsx(
            'px-2.5 py-1 rounded-full text-xs font-medium border',
            statusBadge[module.status].bg
          )}
        >
          {statusBadge[module.status].label}
        </span>
      </div>

      {/* Content */}
      <h3
        className={clsx(
          'font-bold text-lg mb-1',
          module.status === 'locked' ? 'text-gray-400' : 'text-acto-black'
        )}
      >
        {module.title}
      </h3>
      <p
        className={clsx(
          'text-sm mb-4',
          module.status === 'locked' ? 'text-gray-400' : 'text-gray-600'
        )}
      >
        {module.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm">
        <span
          className={clsx(
            'flex items-center gap-1',
            module.status === 'locked' ? 'text-gray-400' : 'text-gray-500'
          )}
        >
          <Clock className="w-4 h-4" />
          {module.duration}
        </span>
        <span
          className={clsx(
            'flex items-center gap-1',
            module.status === 'locked' ? 'text-gray-400' : 'text-gray-500'
          )}
        >
          <BookOpen className="w-4 h-4" />
          {module.lessons} lessons
        </span>
      </div>

      {/* Progress bar for in-progress */}
      {module.status === 'in-progress' && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{module.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-acto-teal rounded-full transition-all"
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action hint */}
      {module.status === 'completed' && (
        <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Review Module</span>
        </div>
      )}
      {module.status === 'in-progress' && (
        <div className="mt-4 flex items-center gap-2 text-acto-teal text-sm font-medium">
          <Play className="w-4 h-4" />
          <span>Continue Learning</span>
        </div>
      )}
    </div>
  );

  if (isClickable) {
    return (
      <Link href={`/modules/${module.id}`}>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
