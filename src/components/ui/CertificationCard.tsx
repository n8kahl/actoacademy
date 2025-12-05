'use client';

import { CheckCircle, Lock, Trophy } from 'lucide-react';
import clsx from 'clsx';

export interface Certification {
  name: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  modules: string;
  status: 'earned' | 'in-progress' | 'locked';
  date?: string;
  progress?: number;
}

interface CertificationCardProps {
  certification: Certification;
}

const levelConfig = {
  Bronze: {
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-200/50',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'ring-amber-200',
  },
  Silver: {
    gradient: 'from-slate-300 to-slate-500',
    glow: 'shadow-slate-200/50',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    ring: 'ring-slate-200',
  },
  Gold: {
    gradient: 'from-yellow-300 to-amber-500',
    glow: 'shadow-yellow-200/50',
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    ring: 'ring-yellow-200',
  },
  Platinum: {
    gradient: 'from-cyan-400 to-blue-500',
    glow: 'shadow-cyan-200/50',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    ring: 'ring-cyan-200',
  },
};

const defaultConfig = {
  gradient: 'from-gray-400 to-gray-600',
  glow: 'shadow-gray-200/50',
  bg: 'bg-gray-50',
  text: 'text-gray-600',
  ring: 'ring-gray-200',
};

export default function CertificationCard({ certification }: CertificationCardProps) {
  const config = levelConfig[certification.level] || defaultConfig;
  const isLocked = certification.status === 'locked';
  const isEarned = certification.status === 'earned';

  return (
    <div
      className={clsx(
        'group relative bg-white rounded-2xl p-5 border transition-all duration-200',
        isLocked
          ? 'border-gray-100 opacity-50'
          : 'border-gray-100 hover:shadow-lg hover:shadow-gray-100/50'
      )}
    >
      {/* Badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
            config.gradient,
            isLocked ? 'opacity-40' : `shadow-lg ${config.glow}`
          )}
        >
          {isEarned ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : isLocked ? (
            <Lock className="w-5 h-5 text-white/80" />
          ) : (
            <Trophy className="w-5 h-5 text-white" />
          )}
        </div>

        {isEarned && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Earned
          </span>
        )}
      </div>

      {/* Level */}
      <span
        className={clsx(
          'text-[10px] uppercase tracking-widest font-semibold',
          isLocked ? 'text-gray-400' : config.text
        )}
      >
        {certification.level}
      </span>

      {/* Name */}
      <h3
        className={clsx(
          'font-semibold text-base mt-1 mb-1',
          isLocked ? 'text-gray-400' : 'text-acto-black'
        )}
      >
        {certification.name}
      </h3>

      {/* Modules */}
      <p className="text-xs text-gray-400 mb-4">
        Modules {certification.modules}
      </p>

      {/* Status content */}
      {isEarned && certification.date && (
        <p className="text-xs text-gray-500">
          Achieved {certification.date}
        </p>
      )}

      {certification.status === 'in-progress' && certification.progress !== undefined && (
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium text-acto-teal">{certification.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-acto-teal to-acto-teal-light rounded-full transition-all"
              style={{ width: `${certification.progress}%` }}
            />
          </div>
        </div>
      )}

      {isLocked && (
        <p className="text-xs text-gray-400">
          Complete previous level
        </p>
      )}
    </div>
  );
}
