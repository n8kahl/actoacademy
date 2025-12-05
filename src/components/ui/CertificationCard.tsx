'use client';

import { Award, CheckCircle, Lock, Shield } from 'lucide-react';
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

const levelColors = {
  Bronze: {
    gradient: 'from-amber-500 to-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-600',
  },
  Silver: {
    gradient: 'from-gray-400 to-gray-600',
    bg: 'bg-gray-50 border-gray-200',
    text: 'text-gray-600',
  },
  Gold: {
    gradient: 'from-yellow-400 to-yellow-600',
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-600',
  },
  Platinum: {
    gradient: 'from-cyan-400 to-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-600',
  },
};

export default function CertificationCard({ certification }: CertificationCardProps) {
  const colors = levelColors[certification.level];

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl p-6 border-2 transition-all',
        certification.status === 'earned'
          ? colors.bg
          : certification.status === 'in-progress'
          ? 'bg-white border-acto-teal/30'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      {/* Badge */}
      <div
        className={clsx(
          'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4',
          colors.gradient,
          certification.status === 'locked' && 'opacity-40'
        )}
      >
        {certification.status === 'earned' ? (
          <CheckCircle className="w-7 h-7 text-white" />
        ) : certification.status === 'locked' ? (
          <Lock className="w-7 h-7 text-white" />
        ) : (
          <Shield className="w-7 h-7 text-white" />
        )}
      </div>

      {/* Level tag */}
      <span
        className={clsx(
          'text-xs uppercase tracking-wider font-semibold',
          certification.status === 'earned'
            ? colors.text
            : certification.status === 'in-progress'
            ? 'text-acto-teal'
            : 'text-gray-400'
        )}
      >
        {certification.level} Level
      </span>

      {/* Name */}
      <h3
        className={clsx(
          'font-bold text-lg mt-1 mb-2',
          certification.status === 'locked' ? 'text-gray-400' : 'text-acto-black'
        )}
      >
        {certification.name}
      </h3>

      {/* Modules */}
      <p
        className={clsx(
          'text-sm mb-4',
          certification.status === 'locked' ? 'text-gray-400' : 'text-gray-500'
        )}
      >
        Modules {certification.modules}
      </p>

      {/* Status-specific content */}
      {certification.status === 'earned' && certification.date && (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Earned {certification.date}</span>
        </div>
      )}

      {certification.status === 'in-progress' && certification.progress !== undefined && (
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="text-acto-teal font-medium">{certification.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-acto-teal rounded-full transition-all"
              style={{ width: `${certification.progress}%` }}
            />
          </div>
        </div>
      )}

      {certification.status === 'locked' && (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Lock className="w-4 h-4" />
          <span>Complete previous level to unlock</span>
        </div>
      )}
    </div>
  );
}
