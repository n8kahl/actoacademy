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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

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
    // For demo purposes, mark first 2 as completed, 3rd as in-progress, rest as locked
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

    return {
      name: c.name,
      level: c.level as 'Bronze' | 'Silver' | 'Gold' | 'Platinum',
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab buttons */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-acto-teal text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-acto-teal'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'courses'
                ? 'bg-acto-teal text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-acto-teal'
            }`}
          >
            All Courses
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Course Progress"
                value={`${progressPercent}%`}
                subtext={`${completedCount} of ${transformedModules.length} modules`}
                icon={TrendingUp}
                iconColor="text-green-500"
              />
              <StatCard
                label="Time Invested"
                value="4.2 hrs"
                subtext="~11 hrs remaining"
                icon={Clock}
                iconColor="text-acto-dark-blue"
              />
              <StatCard
                label="Quiz Score Avg"
                value="92%"
                subtext="23 questions answered"
                icon={Star}
                iconColor="text-acto-yellow"
              />
              <StatCard
                label="Certifications"
                value={`1/${transformedCertifications.length}`}
                subtext="Bronze earned"
                icon={Award}
                iconColor="text-acto-plum"
              />
            </div>

            {/* Continue Learning */}
            {currentModule && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-acto-black mb-4">Continue Learning</h2>
                <div className="bg-gradient-to-r from-acto-dark-blue to-acto-teal rounded-2xl p-6 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                        <currentModule.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{currentModule.title}</h3>
                        <p className="text-white/80 text-sm">
                          Module {currentModule.id} &bull; Lesson 5 of {currentModule.lessons}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="w-48 h-2 bg-white/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${currentModule.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-white/80">{currentModule.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/modules/${currentModule.id}`}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-acto-dark-blue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Certification Journey */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-acto-black mb-4">Certification Journey</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {transformedCertifications.map((cert) => (
                  <CertificationCard key={cert.name} certification={cert} />
                ))}
              </div>
            </div>

            {/* Recent Modules */}
            <div>
              <h2 className="text-xl font-bold text-acto-black mb-4">Your Modules</h2>
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
              <h2 className="text-xl font-bold text-acto-black">All Modules</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">{completedCount} Completed</span>
                <span className="text-gray-300">&bull;</span>
                <span className="text-acto-teal">{inProgressCount} In Progress</span>
                <span className="text-gray-300">&bull;</span>
                <span className="text-gray-500">{lockedCount} Locked</span>
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
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ACTO. Intelligent Field Excellence for Life Sciences.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-acto-teal transition-colors">Help Center</a>
              <a href="#" className="hover:text-acto-teal transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-acto-teal transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
