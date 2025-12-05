'use client';

import Link from 'next/link';
import { Clock, BookOpen, Lock, CheckCircle, ArrowRight } from 'lucide-react';
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

export default function ModuleCard({ module }: ModuleCardProps) {
  const Icon = module.icon;
  const isClickable = module.status !== 'locked';

  const CardContent = (
    <div
      className={clsx(
        'group relative bg-white rounded-2xl p-5 border transition-all duration-200',
        module.status === 'locked'
          ? 'border-gray-100 opacity-60'
          : 'border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50',
        isClickable && 'cursor-pointer'
      )}
    >
      {/* Status indicator line */}
      <div
        className={clsx(
          'absolute top-0 left-6 right-6 h-0.5 rounded-full',
          module.status === 'completed' && 'bg-green-400',
          module.status === 'in-progress' && 'bg-acto-teal',
          module.status === 'locked' && 'bg-gray-200'
        )}
      />

      {/* Header */}
      <div className="flex items-start gap-4 mb-4 pt-2">
        <div
          className={clsx(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
            module.status === 'locked'
              ? 'bg-gray-100'
              : module.status === 'completed'
              ? 'bg-green-50'
              : 'bg-gradient-to-br from-acto-teal to-acto-dark-blue shadow-lg shadow-acto-teal/20'
          )}
        >
          {module.status === 'locked' ? (
            <Lock className="w-5 h-5 text-gray-400" />
          ) : module.status === 'completed' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Icon className="w-5 h-5 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              'font-semibold text-base leading-tight mb-1 truncate',
              module.status === 'locked' ? 'text-gray-400' : 'text-acto-black'
            )}
          >
            {module.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {module.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {module.lessons} lessons
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        className={clsx(
          'text-sm leading-relaxed mb-4 line-clamp-2',
          module.status === 'locked' ? 'text-gray-400' : 'text-gray-500'
        )}
      >
        {module.description}
      </p>

      {/* Progress bar for in-progress */}
      {module.status === 'in-progress' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium text-acto-teal">{module.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-acto-teal to-acto-teal-light rounded-full transition-all"
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        {module.status === 'completed' && (
          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        )}
        {module.status === 'in-progress' && (
          <span className="text-xs font-medium text-acto-teal">Continue learning</span>
        )}
        {module.status === 'locked' && (
          <span className="text-xs text-gray-400">Locked</span>
        )}

        {isClickable && (
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-acto-teal group-hover:translate-x-1 transition-all" />
        )}
      </div>
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
