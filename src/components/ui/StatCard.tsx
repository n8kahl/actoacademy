'use client';

import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = 'text-acto-teal',
  iconBg = 'bg-acto-teal/10',
}: StatCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
            <Icon className={clsx('w-5 h-5', iconColor)} />
          </div>
        </div>

        <p className="text-2xl font-semibold text-acto-black tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {subtext && (
          <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">{subtext}</p>
        )}
      </div>
    </div>
  );
}
