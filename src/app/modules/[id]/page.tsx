'use client';

import { use } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  Lock,
  Play,
  FileText,
  ChevronRight,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import clsx from 'clsx';

// Mock data - will be replaced with Supabase queries
const modulesData: Record<number, {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: string;
  lessons: {
    id: number;
    title: string;
    description: string;
    duration: string;
    status: 'completed' | 'in-progress' | 'not-started' | 'locked';
    hasQuiz: boolean;
  }[];
}> = {
  1: {
    id: 1,
    title: 'Platform Essentials',
    description: 'Navigation, domain setup, and core configuration. This module covers everything you need to know to get started with the ACTO platform.',
    duration: '45 min',
    icon: 'Settings',
    lessons: [
      { id: 1, title: 'Homepage Navigation', description: 'Learn to navigate the ACTO homepage', duration: '3 min', status: 'completed', hasQuiz: true },
      { id: 2, title: 'Switching Admin/User Mode', description: 'Understand the difference between modes', duration: '2 min', status: 'completed', hasQuiz: false },
      { id: 3, title: 'Domain Configuration', description: 'Configure your domain settings', duration: '5 min', status: 'completed', hasQuiz: true },
      { id: 4, title: 'Branding & Taxonomy', description: 'Customize your platform branding', duration: '4 min', status: 'completed', hasQuiz: false },
      { id: 5, title: 'Notification Settings', description: 'Set up notification preferences', duration: '3 min', status: 'completed', hasQuiz: true },
    ],
  },
  2: {
    id: 2,
    title: 'User Management',
    description: 'Teams, territories, roles, and permissions. Learn how to manage your organization\'s user hierarchy effectively.',
    duration: '60 min',
    icon: 'Users',
    lessons: [
      { id: 6, title: 'User Management Overview', description: 'Introduction to user management', duration: '4 min', status: 'completed', hasQuiz: false },
      { id: 7, title: 'Teams & Territories', description: 'Organize users into teams', duration: '6 min', status: 'completed', hasQuiz: true },
      { id: 8, title: 'Adding/Updating Users', description: 'Create and modify user accounts', duration: '5 min', status: 'completed', hasQuiz: false },
      { id: 9, title: 'Roles & Permissions', description: 'Configure role-based access', duration: '8 min', status: 'completed', hasQuiz: true },
      { id: 10, title: 'Bulk User Import', description: 'Import users via CSV', duration: '4 min', status: 'completed', hasQuiz: true },
    ],
  },
  3: {
    id: 3,
    title: 'Content Management',
    description: 'Digital asset library and form creation. Master the content management system to create engaging learning materials.',
    duration: '90 min',
    icon: 'FileText',
    lessons: [
      { id: 11, title: 'Content Management Overview', description: 'Introduction to the CMS', duration: '4 min', status: 'completed', hasQuiz: false },
      { id: 12, title: 'Folder Structure & Organization', description: 'Organize your content library', duration: '5 min', status: 'completed', hasQuiz: false },
      { id: 13, title: 'Uploading Resources', description: 'Add files and media', duration: '6 min', status: 'completed', hasQuiz: true },
      { id: 14, title: 'Resource Types & Permissions', description: 'Configure access controls', duration: '7 min', status: 'completed', hasQuiz: false },
      { id: 15, title: 'Creating Forms', description: 'Build quizzes, surveys, and polls', duration: '12 min', status: 'in-progress', hasQuiz: true },
      { id: 16, title: 'Digital Signatures', description: 'Set up e-signature workflows', duration: '4 min', status: 'not-started', hasQuiz: false },
      { id: 17, title: 'FCRs, Assessments, Evaluations', description: 'Create evaluation forms', duration: '10 min', status: 'locked', hasQuiz: true },
      { id: 18, title: 'Content Expiry & Activity Log', description: 'Manage content lifecycle', duration: '4 min', status: 'locked', hasQuiz: false },
    ],
  },
};

// Default for locked modules
const defaultModule = {
  id: 0,
  title: 'Module Coming Soon',
  description: 'This module content is being prepared.',
  duration: '-- min',
  icon: 'Lock',
  lessons: [],
};

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const moduleId = parseInt(resolvedParams.id);
  const module = modulesData[moduleId] || { ...defaultModule, id: moduleId };

  const completedLessons = module.lessons.filter(l => l.status === 'completed').length;
  const progressPercent = module.lessons.length > 0
    ? Math.round((completedLessons / module.lessons.length) * 100)
    : 0;

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[module.icon] || Icons.BookOpen;

  const statusColors = {
    completed: 'bg-green-100 text-green-700 border-green-200',
    'in-progress': 'bg-acto-soft-blue text-acto-dark-blue border-acto-teal/30',
    'not-started': 'bg-gray-100 text-gray-600 border-gray-200',
    locked: 'bg-gray-50 text-gray-400 border-gray-200',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-acto-teal mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Module Header */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-acto-teal flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-acto-black mb-2">{module.title}</h1>
              <p className="text-gray-600 mb-4">{module.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  {module.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {completedLessons} completed
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-acto-teal">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-acto-teal rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-acto-black">Lessons</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {module.lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={lesson.status !== 'locked' ? `/modules/${moduleId}/lessons/${lesson.id}` : '#'}
                className={clsx(
                  'flex items-center gap-4 p-4 transition-colors',
                  lesson.status === 'locked'
                    ? 'cursor-not-allowed bg-gray-50'
                    : 'hover:bg-gray-50'
                )}
              >
                {/* Lesson number / status icon */}
                <div className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                  lesson.status === 'completed' && 'bg-green-100',
                  lesson.status === 'in-progress' && 'bg-acto-teal',
                  lesson.status === 'not-started' && 'bg-gray-200',
                  lesson.status === 'locked' && 'bg-gray-100',
                )}>
                  {lesson.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : lesson.status === 'locked' ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : lesson.status === 'in-progress' ? (
                    <Play className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  )}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0">
                  <h3 className={clsx(
                    'font-medium',
                    lesson.status === 'locked' ? 'text-gray-400' : 'text-acto-black'
                  )}>
                    {lesson.title}
                  </h3>
                  <p className={clsx(
                    'text-sm truncate',
                    lesson.status === 'locked' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {lesson.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={clsx(
                    'text-sm',
                    lesson.status === 'locked' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {lesson.duration}
                  </span>
                  {lesson.hasQuiz && (
                    <span className={clsx(
                      'px-2 py-0.5 text-xs rounded-full border',
                      statusColors[lesson.status]
                    )}>
                      Quiz
                    </span>
                  )}
                  {lesson.status !== 'locked' && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Continue button */}
        {module.lessons.some(l => l.status === 'in-progress' || l.status === 'not-started') && (
          <div className="mt-6 text-center">
            <Link
              href={`/modules/${moduleId}/lessons/${
                module.lessons.find(l => l.status === 'in-progress')?.id ||
                module.lessons.find(l => l.status === 'not-started')?.id
              }`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-acto-teal text-white font-semibold rounded-xl hover:bg-acto-teal-dark transition-colors"
            >
              <Play className="w-5 h-5" />
              {module.lessons.some(l => l.status === 'in-progress') ? 'Continue Learning' : 'Start Module'}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
