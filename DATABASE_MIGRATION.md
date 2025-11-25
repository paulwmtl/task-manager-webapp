# Database Migration - Advanced Features

## Step 1: Update tasks table

Run this SQL in your Supabase SQL Editor:

```sql
-- Add new columns to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS importance TEXT DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Allgemein',
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_importance ON tasks(importance);
```

## Step 2: Create categories table

```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, user_id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id AND is_default = false);

-- Insert default categories
INSERT INTO categories (name, color, is_default) VALUES
  ('Haushalt', '#10b981', true),
  ('Schule', '#3b82f6', true),
  ('Uni', '#8b5cf6', true),
  ('Arbeit', '#ef4444', true),
  ('Finanzen', '#f59e0b', true),
  ('Allgemein', '#6b7280', true)
ON CONFLICT DO NOTHING;
```

## Step 3: Update RLS policies for tasks (OPTIONAL - for later when auth is implemented)

**Note:** Only run this when you're ready to implement authentication! For now, keep the existing "Allow all operations" policy.

```sql
-- OPTIONAL: Run this later when implementing authentication
-- Drop old policy
-- DROP POLICY IF EXISTS "Allow all operations" ON tasks;

-- Create user-specific policies
-- CREATE POLICY "Users can view own tasks" ON tasks
--   FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own tasks" ON tasks
--   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own tasks" ON tasks
--   FOR UPDATE USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own tasks" ON tasks
--   FOR DELETE USING (auth.uid() = user_id);
```

## Verification

After running the migration, verify in Supabase:

1. Go to **Table Editor** → **tasks**
2. Check that new columns exist: `importance`, `category`, `user_id`
3. Go to **Table Editor** → **categories**
4. Verify 6 default categories are present

## Rollback (if needed)

```sql
-- Remove new columns
ALTER TABLE tasks 
DROP COLUMN IF EXISTS importance,
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS user_id;

-- Drop categories table
DROP TABLE IF EXISTS categories CASCADE;
```
