import { createClient } from '@/lib/supabase/server';
import type { Module, Lesson, Quiz, QuizQuestion, UserProgress, Certification } from '@/lib/types';

// Fetch all modules with lesson counts
export async function getModules() {
  const supabase = await createClient();

  const { data: modules, error } = await supabase
    .from('modules')
    .select(`
      *,
      lessons:lessons(count)
    `)
    .order('order_index');

  if (error) {
    console.error('Error fetching modules:', error);
    return [];
  }

  return modules.map(m => ({
    ...m,
    lessonCount: m.lessons?.[0]?.count || 0,
  }));
}

// Fetch a single module with its lessons
export async function getModuleWithLessons(moduleId: number) {
  const supabase = await createClient();

  const { data: module, error: moduleError } = await supabase
    .from('modules')
    .select('*')
    .eq('id', moduleId)
    .single();

  if (moduleError) {
    console.error('Error fetching module:', moduleError);
    return null;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index');

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError);
    return { ...module, lessons: [] };
  }

  return { ...module, lessons: lessons || [] };
}

// Fetch a single lesson with its quiz
export async function getLessonWithQuiz(lessonId: number) {
  const supabase = await createClient();

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (lessonError) {
    console.error('Error fetching lesson:', lessonError);
    return null;
  }

  // Get the quiz for this lesson
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('lesson_id', lessonId)
    .single();

  if (quizError && quizError.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is ok
    console.error('Error fetching quiz:', quizError);
  }

  let quizWithQuestions = null;
  if (quiz) {
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('order_index');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
    }

    quizWithQuestions = {
      ...quiz,
      questions: (questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        options: q.options as { id: string; text: string; isCorrect: boolean }[],
        explanation: q.explanation,
      })),
    };
  }

  return { ...lesson, quiz: quizWithQuestions };
}

// Get adjacent lessons for navigation
export async function getAdjacentLessons(moduleId: number, currentOrderIndex: number) {
  const supabase = await createClient();

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, order_index')
    .eq('module_id', moduleId)
    .order('order_index');

  if (!lessons) return { prev: null, next: null };

  const currentIndex = lessons.findIndex(l => l.order_index === currentOrderIndex);

  return {
    prev: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
  };
}

// Fetch all certifications
export async function getCertifications() {
  const supabase = await createClient();

  const { data: certifications, error } = await supabase
    .from('certifications')
    .select('*')
    .order('level');

  if (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }

  return certifications;
}

// Get user progress for a module
export async function getUserModuleProgress(userId: string, moduleId: number) {
  const supabase = await createClient();

  const { data: progress, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleId);

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return progress || [];
}

// Get user's overall stats
export async function getUserStats(userId: string) {
  const supabase = await createClient();

  // Get completed lessons count
  const { count: completedLessons } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true);

  // Get total quiz score average
  const { data: quizAttempts } = await supabase
    .from('quiz_attempts')
    .select('score')
    .eq('user_id', userId)
    .eq('passed', true);

  const avgScore = quizAttempts && quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
    : 0;

  // Get certifications earned
  const { count: certificationsEarned } = await supabase
    .from('user_certifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return {
    completedLessons: completedLessons || 0,
    avgQuizScore: avgScore,
    certificationsEarned: certificationsEarned || 0,
  };
}

// Mark a lesson as complete
export async function markLessonComplete(userId: string, lessonId: number, moduleId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      module_id: moduleId,
      completed: true,
      completed_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error marking lesson complete:', error);
    return false;
  }

  return true;
}

// Save quiz attempt
export async function saveQuizAttempt(
  userId: string,
  quizId: number,
  score: number,
  passed: boolean,
  answers: Record<number, string>
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score,
      passed,
      answers,
    });

  if (error) {
    console.error('Error saving quiz attempt:', error);
    return false;
  }

  return true;
}
