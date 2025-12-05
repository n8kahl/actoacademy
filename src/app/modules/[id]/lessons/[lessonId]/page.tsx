'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Quiz from '@/components/ui/Quiz';
import { VideoPlaceholder } from '@/components/video/VidyardPlayer';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen,
  FileText,
  Play,
} from 'lucide-react';
import clsx from 'clsx';

// Mock lesson data
const lessonsData: Record<number, {
  id: number;
  moduleId: number;
  moduleName: string;
  title: string;
  description: string;
  duration: string;
  videoId: string | null;
  content: string;
  prevLesson: { id: number; title: string } | null;
  nextLesson: { id: number; title: string } | null;
  quiz: {
    id: number;
    title: string;
    passingScore: number;
    questions: {
      id: number;
      text: string;
      options: { id: string; text: string; isCorrect: boolean }[];
      explanation: string;
    }[];
  } | null;
}> = {
  1: {
    id: 1,
    moduleId: 1,
    moduleName: 'Platform Essentials',
    title: 'Homepage Navigation',
    description: 'Learn to navigate the ACTO homepage and understand the main sections',
    duration: '3 min',
    videoId: null, // Will be a Vidyard ID when you have videos
    content: `
## Welcome to ACTO

The ACTO homepage is your central hub for accessing all platform features. In this lesson, you'll learn how to navigate the main sections efficiently.

### Main Navigation Areas

1. **Top Navigation Bar** - Access to main modules like Learn, Resources, and Coach
2. **Left Sidebar** - Quick access to frequently used features
3. **Dashboard Widgets** - At-a-glance metrics and quick actions
4. **Search** - Universal search across all content

### Key Takeaways

- The Analytics Homepage is your default landing page
- Use the navigation bar to switch between major sections
- The search function helps you find content quickly
    `,
    prevLesson: null,
    nextLesson: { id: 2, title: 'Switching Admin/User Mode' },
    quiz: {
      id: 1,
      title: 'Homepage Navigation Quiz',
      passingScore: 80,
      questions: [
        {
          id: 1,
          text: 'When you first log into ACTO in administrative mode, which page do you land on?',
          options: [
            { id: 'a', text: 'Learn', isCorrect: false },
            { id: 'b', text: 'Analytics Homepage', isCorrect: true },
            { id: 'c', text: 'Content Management', isCorrect: false },
            { id: 'd', text: 'Launchpad', isCorrect: false },
          ],
          explanation: 'The Analytics Homepage is the default landing page for administrators.',
        },
        {
          id: 2,
          text: 'Which browsers are recommended for using ACTO?',
          options: [
            { id: 'a', text: 'Safari and Edge', isCorrect: false },
            { id: 'b', text: 'Chrome and Firefox', isCorrect: true },
            { id: 'c', text: 'Opera and Brave', isCorrect: false },
            { id: 'd', text: 'Any browser works equally', isCorrect: false },
          ],
          explanation: 'Chrome and Firefox provide the best experience for ACTO.',
        },
        {
          id: 3,
          text: 'Where can you find the universal search function?',
          options: [
            { id: 'a', text: 'Only in Content Management', isCorrect: false },
            { id: 'b', text: 'In the top navigation bar', isCorrect: true },
            { id: 'c', text: 'In your profile settings', isCorrect: false },
            { id: 'd', text: 'There is no search function', isCorrect: false },
          ],
          explanation: 'The universal search is accessible from the top navigation bar.',
        },
      ],
    },
  },
  15: {
    id: 15,
    moduleId: 3,
    moduleName: 'Content Management',
    title: 'Creating Forms',
    description: 'Build quizzes, surveys, and polls',
    duration: '12 min',
    videoId: null,
    content: `
## Creating Forms in ACTO

Forms are powerful tools for gathering feedback, assessing knowledge, and engaging your audience. ACTO supports multiple form types:

### Form Types

1. **Quizzes** - Knowledge assessments with scoring
2. **Surveys** - Feedback collection without right/wrong answers
3. **Polls** - Quick single-question engagement
4. **Evaluations** - Performance assessments

### Building a Quiz

1. Navigate to Content Management > Forms
2. Click "Create New Form"
3. Select "Quiz" as the form type
4. Add questions using the question builder
5. Set scoring rules and passing thresholds
6. Preview and publish

### Best Practices

- Keep questions clear and concise
- Use a mix of question types
- Provide helpful feedback for incorrect answers
- Set reasonable time limits if applicable
    `,
    prevLesson: { id: 14, title: 'Resource Types & Permissions' },
    nextLesson: { id: 16, title: 'Digital Signatures' },
    quiz: {
      id: 15,
      title: 'Forms Quiz',
      passingScore: 80,
      questions: [
        {
          id: 1,
          text: 'Which form type is best for knowledge assessment with scoring?',
          options: [
            { id: 'a', text: 'Survey', isCorrect: false },
            { id: 'b', text: 'Quiz', isCorrect: true },
            { id: 'c', text: 'Poll', isCorrect: false },
            { id: 'd', text: 'Evaluation', isCorrect: false },
          ],
          explanation: 'Quizzes are designed for knowledge assessments with built-in scoring.',
        },
        {
          id: 2,
          text: 'Where do you create new forms in ACTO?',
          options: [
            { id: 'a', text: 'Learn section', isCorrect: false },
            { id: 'b', text: 'Content Management > Forms', isCorrect: true },
            { id: 'c', text: 'Analytics', isCorrect: false },
            { id: 'd', text: 'Launchpad', isCorrect: false },
          ],
          explanation: 'Forms are created in the Content Management section under Forms.',
        },
      ],
    },
  },
};

// Default for lessons without data
const defaultLesson = {
  id: 0,
  moduleId: 1,
  moduleName: 'Module',
  title: 'Lesson',
  description: 'This lesson is being prepared.',
  duration: '-- min',
  videoId: null,
  content: 'Content coming soon.',
  prevLesson: null,
  nextLesson: null,
  quiz: null,
};

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const moduleId = parseInt(resolvedParams.id);
  const lessonId = parseInt(resolvedParams.lessonId);

  const lesson = lessonsData[lessonId] || { ...defaultLesson, id: lessonId, moduleId };

  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizScore(score);
    setQuizCompleted(true);
    if (passed) {
      setLessonCompleted(true);
    }
  };

  const markAsComplete = () => {
    setLessonCompleted(true);
    // TODO: Save to Supabase
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-acto-teal">Dashboard</Link>
          <span>/</span>
          <Link href={`/modules/${moduleId}`} className="hover:text-acto-teal">{lesson.moduleName}</Link>
          <span>/</span>
          <span className="text-acto-black font-medium">{lesson.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <VideoPlaceholder title={lesson.title} />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('content')}
                  className={clsx(
                    'flex-1 px-6 py-4 text-sm font-medium transition-colors',
                    activeTab === 'content'
                      ? 'text-acto-teal border-b-2 border-acto-teal bg-acto-soft-blue/20'
                      : 'text-gray-500 hover:text-acto-black'
                  )}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Lesson Content
                </button>
                {lesson.quiz && (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={clsx(
                      'flex-1 px-6 py-4 text-sm font-medium transition-colors',
                      activeTab === 'quiz'
                        ? 'text-acto-teal border-b-2 border-acto-teal bg-acto-soft-blue/20'
                        : 'text-gray-500 hover:text-acto-black'
                    )}
                  >
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Quiz
                    {quizCompleted && (
                      <span className={clsx(
                        'ml-2 px-2 py-0.5 text-xs rounded-full',
                        quizScore && quizScore >= lesson.quiz.passingScore
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      )}>
                        {quizScore}%
                      </span>
                    )}
                  </button>
                )}
              </div>

              <div className="p-6">
                {activeTab === 'content' ? (
                  <div className="prose prose-gray max-w-none">
                    {lesson.content.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-bold text-acto-black mt-6 mb-3">{line.replace('## ', '')}</h2>;
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-lg font-semibold text-acto-black mt-4 mb-2">{line.replace('### ', '')}</h3>;
                      }
                      if (line.startsWith('1. ') || line.startsWith('- ')) {
                        return <li key={i} className="text-gray-600 ml-4">{line.replace(/^[0-9]+\. |- /, '')}</li>;
                      }
                      if (line.trim() === '') return null;
                      return <p key={i} className="text-gray-600 my-2">{line}</p>;
                    })}
                  </div>
                ) : lesson.quiz ? (
                  <Quiz
                    quiz={lesson.quiz}
                    onComplete={handleQuizComplete}
                    completed={quizCompleted}
                    score={quizScore}
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="font-bold text-acto-black mb-4">{lesson.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration}
                </span>
                {lesson.quiz && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Quiz included
                  </span>
                )}
              </div>

              {/* Completion status */}
              {lessonCompleted ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Lesson Completed</span>
                </div>
              ) : (
                <button
                  onClick={markAsComplete}
                  className="w-full py-3 bg-acto-teal text-white font-semibold rounded-xl hover:bg-acto-teal-dark transition-colors"
                >
                  Mark as Complete
                </button>
              )}
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-acto-black mb-4">Navigation</h3>

              <div className="space-y-3">
                {lesson.prevLesson && (
                  <Link
                    href={`/modules/${moduleId}/lessons/${lesson.prevLesson.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="text-sm font-medium text-acto-black truncate">{lesson.prevLesson.title}</p>
                    </div>
                  </Link>
                )}

                {lesson.nextLesson && (
                  <Link
                    href={`/modules/${moduleId}/lessons/${lesson.nextLesson.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-acto-soft-blue/30 hover:bg-acto-soft-blue/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Next</p>
                      <p className="text-sm font-medium text-acto-black truncate">{lesson.nextLesson.title}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-acto-teal" />
                  </Link>
                )}
              </div>

              <Link
                href={`/modules/${moduleId}`}
                className="block mt-4 text-center text-sm text-acto-teal hover:underline"
              >
                View all lessons
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
