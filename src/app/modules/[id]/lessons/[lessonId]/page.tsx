import { getLessonWithQuiz, getAdjacentLessons, getModuleWithLessons } from '@/lib/data';
import LessonClient from '@/components/lesson/LessonClient';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

interface LessonPageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params;
  const moduleId = parseInt(resolvedParams.id);
  const lessonId = parseInt(resolvedParams.lessonId);

  const [lessonData, moduleData] = await Promise.all([
    getLessonWithQuiz(lessonId),
    getModuleWithLessons(moduleId),
  ]);

  if (!lessonData || !moduleData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={`/modules/${moduleId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-acto-teal mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Module
          </Link>
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-acto-black mb-2">Lesson Not Found</h1>
            <p className="text-gray-600">This lesson doesn&apos;t exist or is not available yet.</p>
          </div>
        </main>
      </div>
    );
  }

  // Get adjacent lessons for navigation
  const adjacentLessons = await getAdjacentLessons(moduleId, lessonData.order_index);

  // Transform lesson data for client component
  const lesson = {
    id: lessonData.id,
    moduleId: moduleId,
    moduleName: moduleData.title,
    title: lessonData.title,
    description: lessonData.description || '',
    duration: `${lessonData.duration_minutes} min`,
    videoId: lessonData.vidyard_id || null,
    content: lessonData.content || 'Content coming soon.',
    prevLesson: adjacentLessons.prev ? {
      id: adjacentLessons.prev.id,
      title: adjacentLessons.prev.title,
    } : null,
    nextLesson: adjacentLessons.next ? {
      id: adjacentLessons.next.id,
      title: adjacentLessons.next.title,
    } : null,
    quiz: lessonData.quiz ? {
      id: lessonData.quiz.id,
      title: lessonData.quiz.title,
      passingScore: lessonData.quiz.passing_score,
      questions: lessonData.quiz.questions || [],
    } : null,
  };

  return <LessonClient lesson={lesson} />;
}
