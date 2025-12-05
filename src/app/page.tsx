'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ModuleCard, { Module } from '@/components/ui/ModuleCard';
import CertificationCard, { Certification } from '@/components/ui/CertificationCard';
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

const modules: Module[] = [
  {
    id: 1,
    title: 'Platform Essentials',
    duration: '45 min',
    lessons: 5,
    status: 'completed',
    progress: 100,
    icon: Settings,
    description: 'Navigation, domain setup, and core configuration',
    topics: ['Homepage Navigation', 'Admin/User Mode', 'Domain Configuration', 'Branding', 'Notifications'],
  },
  {
    id: 2,
    title: 'User Management',
    duration: '60 min',
    lessons: 5,
    status: 'completed',
    progress: 100,
    icon: Users,
    description: 'Teams, territories, roles, and permissions',
    topics: ['User Management Overview', 'Teams & Territories', 'Adding Users', 'Roles & Permissions', 'Bulk Import'],
  },
  {
    id: 3,
    title: 'Content Management',
    duration: '90 min',
    lessons: 8,
    status: 'in-progress',
    progress: 62,
    icon: FileText,
    description: 'Digital asset library and form creation',
    topics: ['CMS Overview', 'Folders', 'Resources', 'Permissions', 'Forms', 'Quizzes', 'Surveys', 'Digital Signatures'],
  },
  {
    id: 4,
    title: 'Learn (ActionPacks)',
    duration: '90 min',
    lessons: 7,
    status: 'locked',
    progress: 0,
    icon: BookOpen,
    description: 'Creating microlearning training modules',
    topics: ['Learn Overview', 'Categories', 'Learning Sets', 'ActionPacks', 'Topics & Lessons', 'Templates', 'User Experience'],
  },
  {
    id: 5,
    title: 'Resources (Collections)',
    duration: '45 min',
    lessons: 5,
    status: 'locked',
    progress: 0,
    icon: Layers,
    description: 'Resource collections for field teams',
    topics: ['Resources Overview', 'Collections', 'Organization', 'Deployment', 'Offline Mode'],
  },
  {
    id: 6,
    title: 'Coaching Scenarios',
    duration: '60 min',
    lessons: 5,
    status: 'locked',
    progress: 0,
    icon: Target,
    description: 'Virtual role-play and coaching',
    topics: ['Scenarios Overview', 'Evaluation Forms', 'Building Scenarios', 'Assignments', 'Reviews'],
  },
  {
    id: 7,
    title: 'Certifications',
    duration: '60 min',
    lessons: 5,
    status: 'locked',
    progress: 0,
    icon: Award,
    description: 'Assessment and certification programs',
    topics: ['Certifications Overview', 'Assessment Forms', 'Building Certs', 'Scoring', 'Certifying Teams'],
  },
  {
    id: 8,
    title: 'Field Coaching',
    duration: '45 min',
    lessons: 5,
    status: 'locked',
    progress: 0,
    icon: Zap,
    description: 'Real-time field coaching with FCRs',
    topics: ['Field Coaching Overview', 'FCR Forms', 'Configuration', 'Conducting Sessions', 'Pull-Through'],
  },
  {
    id: 9,
    title: 'Journeys',
    duration: '75 min',
    lessons: 5,
    status: 'locked',
    progress: 0,
    icon: TrendingUp,
    description: 'Adaptive learning pathways',
    topics: ['Journeys Overview', 'Creating Journeys', 'Content Integration', 'Conditional Branching', 'Deployment'],
  },
  {
    id: 10,
    title: 'Events',
    duration: '90 min',
    lessons: 8,
    status: 'locked',
    progress: 0,
    icon: Calendar,
    description: 'Meetings, conferences, and NSMs',
    topics: ['Events Overview', 'Creating Events', 'Sponsors & Speakers', 'Sessions', 'Prework', 'Registration', 'Deployment', 'Polls'],
  },
  {
    id: 11,
    title: 'Launchpad',
    duration: '75 min',
    lessons: 7,
    status: 'locked',
    progress: 0,
    icon: Send,
    description: 'Deployment control center',
    topics: ['Launchpad Overview', 'Strategies', 'Custom Strategies', 'Deployments', 'Audience', 'Reminders', 'Notifications'],
  },
  {
    id: 12,
    title: 'Analytics & Reporting',
    duration: '90 min',
    lessons: 8,
    status: 'locked',
    progress: 0,
    icon: BarChart3,
    description: 'Reports, dashboards, and insights',
    topics: ['Analytics Overview', 'Report Generator', 'Learn Reports', 'Resources Reports', 'Coach Reports', 'Scheduling', 'Embedded Reports', 'Manager Insights'],
  },
];

const certifications: Certification[] = [
  {
    name: 'ACTO Foundations',
    level: 'Bronze',
    modules: '1-2',
    status: 'earned',
    date: 'Nov 15, 2024',
  },
  {
    name: 'Content Creator',
    level: 'Silver',
    modules: '1-5',
    status: 'in-progress',
    progress: 52,
  },
  {
    name: 'Coaching Specialist',
    level: 'Gold',
    modules: '1-8',
    status: 'locked',
  },
  {
    name: 'Platform Expert',
    level: 'Platinum',
    modules: '1-12',
    status: 'locked',
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses'>('dashboard');

  const currentModule = modules.find((m) => m.status === 'in-progress');

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
                value="27%"
                subtext="3 of 12 modules"
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
                value="1/4"
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
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-acto-dark-blue font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Certification Journey */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-acto-black mb-4">Certification Journey</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {certifications.map((cert) => (
                  <CertificationCard key={cert.name} certification={cert} />
                ))}
              </div>
            </div>

            {/* Recent Modules */}
            <div>
              <h2 className="text-xl font-bold text-acto-black mb-4">Your Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.slice(0, 6).map((module) => (
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
                <span className="text-green-600">2 Completed</span>
                <span className="text-gray-300">&bull;</span>
                <span className="text-acto-teal">1 In Progress</span>
                <span className="text-gray-300">&bull;</span>
                <span className="text-gray-500">9 Locked</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => (
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
