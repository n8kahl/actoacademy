'use client';

import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = 'text-acto-teal',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm">{label}</span>
        <Icon className={clsx('w-5 h-5', iconColor)} />
      </div>
      <p className="text-3xl font-bold text-acto-black">{value}</p>
      {subtext && <p className="text-gray-500 text-sm mt-1">{subtext}</p>}
    </div>
  );
}
