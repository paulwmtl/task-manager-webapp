-- Fix User Deletion (Foreign Key Constraints)
-- Run this in Supabase SQL Editor to allow deleting users even if they have tasks/categories.

-- 1. Fix 'tasks' table
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_user_id_fkey; -- Try standard name

ALTER TABLE tasks
ADD CONSTRAINT tasks_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 2. Fix 'categories' table
ALTER TABLE categories
DROP CONSTRAINT IF EXISTS categories_user_id_fkey; -- Try standard name

ALTER TABLE categories
ADD CONSTRAINT categories_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;
