# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: task-manager
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to you
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Create Tasks Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste and run this SQL:

\`\`\`sql
-- Create tasks table
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  description TEXT CHECK (char_length(description) <= 500),
  status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations" ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);
\`\`\`

## Step 3: Get Your Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Frontend

Create a file `.env.local` in the `frontend/` directory:

\`\`\`env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
\`\`\`

Replace the values with your actual Supabase credentials.

## Step 5: Restart Dev Server

\`\`\`bash
# Stop the current dev server (Ctrl+C)
# Then restart it
cd frontend
npm run dev
\`\`\`

## Done! 🎉

Your app should now be connected to Supabase. Open http://localhost:5173 and start creating tasks!
