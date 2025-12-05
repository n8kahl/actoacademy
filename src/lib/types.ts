// Database Types for ACTO Academy

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  user_type: 'internal' | 'customer';
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  order_index: number;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  // Computed fields
  lessons?: Lesson[];
  lesson_count?: number;
  completed_lessons?: number;
  progress_percent?: number;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string | null;
  video_url: string | null;
  video_provider: 'vidyard' | 'youtube' | 'vimeo';
  video_duration_seconds: number | null;
  content_markdown: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  // Relations
  quiz?: Quiz;
  user_progress?: UserProgress;
}

export interface Quiz {
  id: number;
  lesson_id: number;
  title: string;
  description: string | null;
  passing_score: number;
  max_attempts: number;
  is_active: boolean;
  created_at: string;
  // Relations
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'multi_select';
  options: QuizOption[];
  explanation: string | null;
  order_index: number;
  created_at: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface UserProgress {
  id: number;
  user_id: string;
  lesson_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percent: number;
  video_watch_time_seconds: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: number;
  user_id: string;
  quiz_id: number;
  score: number;
  passed: boolean;
  answers: Record<number, string>; // questionId -> selectedOptionId
  time_taken_seconds: number | null;
  created_at: string;
}

export interface Certification {
  id: number;
  name: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  description: string | null;
  required_modules: number[];
  passing_score: number;
  validity_years: number;
  badge_image_url: string | null;
  created_at: string;
}

export interface UserCertification {
  id: number;
  user_id: string;
  certification_id: number;
  status: 'in_progress' | 'earned' | 'expired';
  score: number | null;
  earned_at: string | null;
  expires_at: string | null;
  certificate_url: string | null;
  certificate_id: string | null;
  created_at: string;
  // Relations
  certification?: Certification;
}

// UI State Types
export interface ModuleWithProgress extends Module {
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
}

export interface LessonWithProgress extends Lesson {
  status: 'completed' | 'in-progress' | 'not-started';
  is_locked: boolean;
}
