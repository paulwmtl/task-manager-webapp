-- ========================================
-- FIX: Row Level Security (RLS) Policies
-- ========================================
-- This script fixes the security issue where users can see each other's tasks.
-- Run this in your Supabase SQL Editor!

-- Step 1: Enable RLS on tables (if not already enabled)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (including the insecure "Allow all operations")
DROP POLICY IF EXISTS "Allow all operations" ON tasks;
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

DROP POLICY IF EXISTS "Users can view own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
DROP POLICY IF EXISTS "Users can update own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON categories;

-- Step 3: Create SECURE policies for tasks
CREATE POLICY "Users can view own tasks"
ON tasks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
ON tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON tasks
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON tasks
FOR DELETE
USING (auth.uid() = user_id);

-- Step 4: Create SECURE policies for categories
CREATE POLICY "Users can view own categories"
ON categories
FOR SELECT
USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can insert own categories"
ON categories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
ON categories
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
ON categories
FOR DELETE
USING (auth.uid() = user_id AND is_default = false);

-- ========================================
-- Verification Queries
-- ========================================
-- Run these to verify everything is set up correctly:

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tasks', 'categories');
-- Both should show 'true'

-- List all policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- ========================================
-- DATA CLEANUP (Optional)
-- ========================================
-- If you want to assign existing tasks to the current user:
-- (Replace 'YOUR_USER_ID' with your actual auth.users.id)
-- UPDATE tasks SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
