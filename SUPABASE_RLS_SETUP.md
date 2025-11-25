# Supabase Row Level Security (RLS) Setup

## Wichtig: RLS aktivieren!

Damit jeder Benutzer nur seine eigenen Tasks sehen kann, musst du Row Level Security (RLS) in Supabase aktivieren.

## Schritte:

### 1. Gehe zu deinem Supabase Dashboard

https://app.supabase.com/project/DEIN-PROJECT/editor

### 2. SQL Editor öffnen

Klicke auf "SQL Editor" im linken Menü.

### 3. Führe folgende SQL-Befehle aus:

**Option 1: Erst löschen, dann neu erstellen (empfohlen)**

```sql
-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (no error if they don't exist)
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
DROP POLICY IF EXISTS "Users can update own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON categories;

-- Create new policies for tasks
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

-- Create new policies for categories
CREATE POLICY "Users can view own categories"
ON categories
FOR SELECT
USING (auth.uid() = user_id);

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
USING (auth.uid() = user_id);
```

**Option 2: Nur fehlende Tasks-Policies erstellen**

Falls du nur die Tasks-Policies benötigst:

```sql
-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Create new policies
CREATE POLICY "Users can view own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON tasks FOR DELETE
USING (auth.uid() = user_id);
```

### 4. Email Confirmations (Optional)

Standardmäßig verlangt Supabase eine E-Mail-Bestätigung bei der Registrierung.

**Für die Entwicklung kannst du das deaktivieren:**

1. Gehe zu Authentication → Settings
2. Scrolle zu "Email Confirmations"
3. Deaktiviere "Enable email confirmations"

**Für Production solltest du es aktiviert lassen!**

## Teste es!

1. Erstelle einen Account
2. Erstelle ein paar Tasks
3. Logout und erstelle einen anderen Account
4. Du solltest keine Tasks vom ersten Account sehen!

## Wichtig für das Frontend

Das Frontend sendet automatisch das Auth Token mit jedem Request. Supabase verwendet dieses Token, um `auth.uid()` zu bestimmen und die RLS Policies anzuwenden.

Keine Code-Änderungen im Frontend nötig! 🎉
