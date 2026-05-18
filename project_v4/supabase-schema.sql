-- Supabase Schema for EmbedPrep Assignment 3
-- Run this in the Supabase SQL Editor to create your tables

-- Saved GitHub repos (user's study list)
CREATE TABLE saved_repos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  repo_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  html_url TEXT NOT NULL,
  stargazers_count INT DEFAULT 0,
  language TEXT,
  topics TEXT[],
  owner_avatar_url TEXT,
  notes TEXT DEFAULT '',
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, repo_id)
);

-- Saved interview questions (user favorites from the question bank)
CREATE TABLE saved_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  status TEXT DEFAULT 'Not Started',
  notes TEXT DEFAULT '',
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Enable Row Level Security on both tables
ALTER TABLE saved_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
-- These use Clerk's JWT user ID from the auth token

CREATE POLICY "Users can view their own repos"
  ON saved_repos FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own repos"
  ON saved_repos FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own repos"
  ON saved_repos FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own repos"
  ON saved_repos FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view their own questions"
  ON saved_questions FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own questions"
  ON saved_questions FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own questions"
  ON saved_questions FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own questions"
  ON saved_questions FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);
