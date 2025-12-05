'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ModuleCard from '@/components/ui/ModuleCard';
import CertificationCard from '@/components/ui/CertificationCard';
import StatCard from '@/components/ui/StatCard';
import {
  TrendingUp,
  Clock,
  Star,
  Award,
  Play,
  FileText,
  Settings,
  Users,
  BookOpen,
  Layers,
  Target,
  Zap,
  Calendar,
  Send,
  BarChart3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

// Icon mapping for modules
const iconMap: Record<string, LucideIcon> = {
  Settings,
  Users,
  FileText,
  BookOpen,
  Layers,
  Target,
  Award,
  Zap,
  TrendingUp,
  Calendar,
  Send,
  BarChart3,
};

interface ModuleData {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  icon: string;
  order_index: number;
  lessonCount: number;
}

interface CertificationData {
  id: number;
  name: string;
  level: string;
  description: string;
  required_modules: number[];
  badge_color: string;
}

interface DashboardClientProps {
  modules: ModuleData[];
  certifications: CertificationData[];
}

export default function DashboardClient({ modules, certifications }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses'>('dashboard');

  // Transform database modules to UI format
  const transformedModules = modules.map((m, index) => {
    let status: 'completed' | 'in-progress' | 'locked' = 'locked';
    let progress = 0;

    if (index === 0) {
      status = 'completed';
      progress = 100;
    } else if (index === 1) {
      status = 'completed';
      progress = 100;
    } else if (index === 2) {
      status = 'in-progress';
      progress = 62;
    }

    return {
      id: m.id,
      title: m.title,
      description: m.description,
      duration: `${m.duration_minutes} min`,
      lessons: m.lessonCount,
      status,
      progress,
      icon: iconMap[m.icon] || BookOpen,
      topics: [],
    };
  });

  // Transform certifications to UI format
  const transformedCertifications = certifications.map((c, index) => {
    let status: 'earned' | 'in-progress' | 'locked' = 'locked';
    let progress: number | undefined;
    let date: string | undefined;

    if (index === 0) {
      status = 'earned';
      date = 'Nov 15, 2024';
    } else if (index === 1) {
      status = 'in-progress';
      progress = 52;
    }

    // Normalize level to proper case (e.g., "bronze" -> "Bronze")
    const normalizedLevel = c.level
      ? (c.level.charAt(0).toUpperCase() + c.level.slice(1).toLowerCase()) as 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
      : 'Bronze';

    return {
      name: c.name,
      level: normalizedLevel,
      modules: c.required_modules.length > 0
        ? `1-${Math.max(...c.required_modules)}`
        : '',
      status,
      progress,
      date,
    };
  });

  const currentModule = transformedModules.find((m) => m.status === 'in-progress');

  // Calculate stats
  const completedCount = transformedModules.filter(m => m.status === 'completed').length;
  const inProgressCount = transformedModules.filter(m => m.status === 'in-progress').length;
  const lockedCount = transformedModules.filter(m => m.status === 'locked').length;
  const progressPercent = Math.round((completedCount / transformedModules.length) * 100);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-acto-yellow" />
            <span className="text-sm text-gray-500">Welcome back</span>
          </div>
          <h1 className="text-2xl font-semibold text-acto-black">
            Continue your learning journey
          </h1>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-1 mb-8 p-1 bg-gray-100/80 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={clsx(
              'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === 'dashboard'
                ? 'bg-white text-acto-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={clsx(
              'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === 'courses'
                ? 'bg-white text-acto-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            All Courses
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard
                label="Course Progress"
                value={`${progressPercent}%`}
                subtext={`${completedCount} of ${transformedModules.length} modules`}
                icon={TrendingUp}
                iconColor="text-green-500"
                iconBg="bg-green-50"
              />
              <StatCard
                label="Time Invested"
                value="4.2 hrs"
                subtext="~11 hrs remaining"
                icon={Clock}
                iconColor="text-blue-500"
                iconBg="bg-blue-50"
              />
              <StatCard
                label="Quiz Score Avg"
                value="92%"
                subtext="23 questions answered"
                icon={Star}
                iconColor="text-amber-500"
                iconBg="bg-amber-50"
              />
              <StatCard
                label="Certifications"
                value={`1/${transformedCertifications.length}`}
                subtext="Bronze earned"
                icon={Award}
                iconColor="text-purple-500"
                iconBg="bg-purple-50"
              />
            </div>

            {/* Continue Learning */}
            {currentModule && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-acto-black">Continue Learning</h2>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-acto-dark-blue via-acto-dark-blue to-acto-teal rounded-2xl p-6 text-white">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0">
                        <currentModule.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                          Module {currentModule.id}
                        </p>
                        <h3 className="text-xl font-semibold mb-1">{currentModule.title}</h3>
                        <p className="text-white/70 text-sm">
                          Lesson 5 of {currentModule.lessons}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${currentModule.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/70">{currentModule.progress}% complete</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/modules/${currentModule.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-acto-dark-blue font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-lg shadow-black/10"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Certification Journey */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-acto-black">Certification Path</h2>
                <Link href="/certifications" className="text-sm text-acto-teal hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {transformedCertifications.map((cert) => (
                  <CertificationCard key={cert.name} certification={cert} />
                ))}
              </div>
            </div>

            {/* Modules */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-acto-black">Your Modules</h2>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-sm text-acto-teal hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transformedModules.slice(0, 6).map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'courses' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-acto-black">All Modules</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {transformedModules.length} modules in your learning path
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  {completedCount} Completed
                </span>
                <span className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-acto-teal" />
                  {inProgressCount} In Progress
                </span>
                <span className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  {lockedCount} Locked
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transformedModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} ACTO. Intelligent Field Excellence for Life Sciences.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-acto-teal transition-colors">Help</a>
              <a href="#" className="hover:text-acto-teal transition-colors">Privacy</a>
              <a href="#" className="hover:text-acto-teal transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
