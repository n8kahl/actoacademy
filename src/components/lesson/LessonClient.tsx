'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import clsx from 'clsx';

interface LessonData {
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
}

interface LessonClientProps {
  lesson: LessonData;
}

export default function LessonClient({ lesson }: LessonClientProps) {
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
    // TODO: Save to Supabase via API route
  };

  // Simple markdown-like content rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-acto-black mt-6 mb-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold text-acto-black mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={i} className="text-gray-600 ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-gray-600 ml-4 list-disc">{line.replace(/^- /, '')}</li>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-gray-700 my-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.trim() === '') return null;
      return <p key={i} className="text-gray-600 my-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-acto-teal">Dashboard</Link>
          <span>/</span>
          <Link href={`/modules/${lesson.moduleId}`} className="hover:text-acto-teal">{lesson.moduleName}</Link>
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
                {lesson.quiz && lesson.quiz.questions.length > 0 && (
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
                    {renderContent(lesson.content)}
                  </div>
                ) : lesson.quiz && lesson.quiz.questions.length > 0 ? (
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
                {lesson.quiz && lesson.quiz.questions.length > 0 && (
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
                    href={`/modules/${lesson.moduleId}/lessons/${lesson.prevLesson.id}`}
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
                    href={`/modules/${lesson.moduleId}/lessons/${lesson.nextLesson.id}`}
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
                href={`/modules/${lesson.moduleId}`}
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
