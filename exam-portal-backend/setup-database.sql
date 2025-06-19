-- Database setup for Exam Portal
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    total_questions INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB, -- for multiple choice questions
    correct_answer TEXT,
    question_type VARCHAR(50) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'text', 'boolean')),
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL, -- store user answers
    score INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exam_id, user_id) -- prevent multiple submissions
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_exam_id ON submissions(exam_id);
CREATE INDEX IF NOT EXISTS idx_results_user_id ON results(user_id);

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Anyone can create users" ON users;

-- Create new policies for users table
-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users 
FOR SELECT USING (auth.uid()::text = id::text);

-- Allow anyone to create new users (for signup)
CREATE POLICY "Anyone can create users" ON users 
FOR INSERT WITH CHECK (true);

-- Create policies for other tables
-- Students can read exams
CREATE POLICY "Students can read exams" ON exams FOR SELECT USING (true);

-- Admins can manage exams
CREATE POLICY "Admins can manage exams" ON exams FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.role = 'admin')
);

-- Users can read their own submissions
CREATE POLICY "Users can read own submissions" ON submissions FOR SELECT USING (user_id::text = auth.uid()::text);

-- Users can create their own submissions
CREATE POLICY "Users can create own submissions" ON submissions FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Users can read their own results
CREATE POLICY "Users can read own results" ON results FOR SELECT USING (user_id::text = auth.uid()::text);

-- Insert sample admin user (password: admin123)
INSERT INTO users (id, name, email, password, role) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Admin User',
    'admin@examportal.com',
    '$2a$10$rQZ8N3YqX2vB1cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample student user (password: student123)
INSERT INTO users (id, name, email, password, role) 
VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    'Student User',
    'student@examportal.com',
    '$2a$10$sRZ8N3YqX2vB1cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH',
    'student'
) ON CONFLICT (email) DO NOTHING;

-- Supabase project configuration
