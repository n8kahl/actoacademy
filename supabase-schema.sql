-- ACTO Academy Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'customer' CHECK (user_type IN ('internal', 'customer')),
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- MODULES
-- ============================================
CREATE TABLE public.modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are viewable by everyone" ON public.modules
  FOR SELECT USING (true);

-- ============================================
-- LESSONS
-- ============================================
CREATE TABLE public.lessons (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_provider TEXT DEFAULT 'vidyard', -- vidyard, youtube, vimeo
  video_duration_seconds INTEGER,
  content_markdown TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone" ON public.lessons
  FOR SELECT USING (true);

-- ============================================
-- QUIZZES
-- ============================================
CREATE TABLE public.quizzes (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 80,
  max_attempts INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quizzes are viewable by everyone" ON public.quizzes
  FOR SELECT USING (true);

-- ============================================
-- QUIZ QUESTIONS
-- ============================================
CREATE TABLE public.quiz_questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'multi_select')),
  options JSONB NOT NULL, -- [{id: "a", text: "Option A", isCorrect: false}, ...]
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are viewable by everyone" ON public.quiz_questions
  FOR SELECT USING (true);

-- ============================================
-- USER PROGRESS (per lesson)
-- ============================================
CREATE TABLE public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0,
  video_watch_time_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- QUIZ ATTEMPTS
-- ============================================
CREATE TABLE public.quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL, -- {questionId: selectedOptionId, ...}
  time_taken_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- CERTIFICATIONS (definitions)
-- ============================================
CREATE TABLE public.certifications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
  description TEXT,
  required_modules INTEGER[] NOT NULL, -- array of module IDs
  passing_score INTEGER DEFAULT 80,
  validity_years INTEGER DEFAULT 2,
  badge_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certifications are viewable by everyone" ON public.certifications
  FOR SELECT USING (true);

-- ============================================
-- USER CERTIFICATIONS (earned)
-- ============================================
CREATE TABLE public.user_certifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  certification_id INTEGER REFERENCES public.certifications(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'earned', 'expired')),
  score INTEGER,
  earned_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  certificate_id TEXT UNIQUE, -- for public verification
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, certification_id)
);

ALTER TABLE public.user_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certifications" ON public.user_certifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certifications" ON public.user_certifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own certifications" ON public.user_certifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA: Modules
-- ============================================
INSERT INTO public.modules (title, description, duration_minutes, order_index, icon) VALUES
('Platform Essentials', 'Navigation, domain setup, and core configuration', 45, 1, 'Settings'),
('User Management', 'Teams, territories, roles, and permissions', 60, 2, 'Users'),
('Content Management', 'Digital asset library and form creation', 90, 3, 'FileText'),
('Learn (ActionPacks)', 'Creating microlearning training modules', 90, 4, 'BookOpen'),
('Resources (Collections)', 'Resource collections for field teams', 45, 5, 'Layers'),
('Coaching Scenarios', 'Virtual role-play and coaching', 60, 6, 'Target'),
('Certifications', 'Assessment and certification programs', 60, 7, 'Award'),
('Field Coaching', 'Real-time field coaching with FCRs', 45, 8, 'Zap'),
('Journeys', 'Adaptive learning pathways', 75, 9, 'TrendingUp'),
('Events', 'Meetings, conferences, and NSMs', 90, 10, 'Calendar'),
('Launchpad', 'Deployment control center', 75, 11, 'Send'),
('Analytics & Reporting', 'Reports, dashboards, and insights', 90, 12, 'BarChart3');

-- ============================================
-- SEED DATA: Lessons for Module 1 (Platform Essentials)
-- ============================================
INSERT INTO public.lessons (module_id, title, description, order_index, video_duration_seconds) VALUES
(1, 'Homepage Navigation', 'Learn to navigate the ACTO homepage and understand the main sections', 1, 180),
(1, 'Switching Admin/User Mode', 'Understand the difference between administrative and user mode', 2, 120),
(1, 'Domain Configuration', 'Configure your domain settings and preferences', 3, 300),
(1, 'Branding & Taxonomy', 'Customize your platform branding and organize your taxonomy', 4, 240),
(1, 'Notification Settings', 'Set up and manage notification preferences', 5, 180);

-- ============================================
-- SEED DATA: Sample Quiz for Lesson 1
-- ============================================
INSERT INTO public.quizzes (lesson_id, title, passing_score) VALUES
(1, 'Platform Essentials Quiz', 80);

INSERT INTO public.quiz_questions (quiz_id, question_text, options, order_index, explanation) VALUES
(1, 'When you first log into ACTO in administrative mode, which page do you land on?',
 '[{"id": "a", "text": "Learn", "isCorrect": false}, {"id": "b", "text": "Analytics Homepage", "isCorrect": true}, {"id": "c", "text": "Content Management", "isCorrect": false}, {"id": "d", "text": "Launchpad", "isCorrect": false}]',
 1, 'The Analytics Homepage is the default landing page for administrators.'),
(1, 'Which browsers are recommended for using ACTO?',
 '[{"id": "a", "text": "Safari and Edge", "isCorrect": false}, {"id": "b", "text": "Chrome and Firefox", "isCorrect": true}, {"id": "c", "text": "Opera and Brave", "isCorrect": false}, {"id": "d", "text": "Any browser works equally", "isCorrect": false}]',
 2, 'Chrome and Firefox provide the best experience for ACTO.'),
(1, 'To switch between Administrative and User mode, you should:',
 '[{"id": "a", "text": "Log out and log back in", "isCorrect": false}, {"id": "b", "text": "Click your name and select Switch Role", "isCorrect": true}, {"id": "c", "text": "Contact your system administrator", "isCorrect": false}, {"id": "d", "text": "Use the mobile app only", "isCorrect": false}]',
 3, 'You can easily switch roles by clicking your profile name.'),
(1, 'What is the primary purpose of the Domain Configuration settings?',
 '[{"id": "a", "text": "To change the color scheme", "isCorrect": false}, {"id": "b", "text": "To configure organization-wide platform settings", "isCorrect": true}, {"id": "c", "text": "To add new users", "isCorrect": false}, {"id": "d", "text": "To create content", "isCorrect": false}]',
 4, 'Domain Configuration allows you to set up organization-wide settings.'),
(1, 'How can you access your notification preferences?',
 '[{"id": "a", "text": "Through the Content Management section", "isCorrect": false}, {"id": "b", "text": "Through your profile settings", "isCorrect": true}, {"id": "c", "text": "Only administrators can change notifications", "isCorrect": false}, {"id": "d", "text": "Notifications cannot be customized", "isCorrect": false}]',
 5, 'Notification preferences are accessible through your profile settings.');

-- ============================================
-- SEED DATA: Certifications
-- ============================================
INSERT INTO public.certifications (name, level, description, required_modules, passing_score) VALUES
('ACTO Foundations', 'bronze', 'Master the basics of the ACTO platform', ARRAY[1, 2], 80),
('Content Creator', 'silver', 'Become proficient in content creation and learning design', ARRAY[1, 2, 3, 4, 5], 80),
('Coaching Specialist', 'gold', 'Expert-level coaching and certification skills', ARRAY[1, 2, 3, 4, 5, 6, 7, 8], 85),
('Platform Expert', 'platinum', 'Complete mastery of all ACTO capabilities', ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 90);
