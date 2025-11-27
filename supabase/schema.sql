-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'blocked', 'done', 'archived');
CREATE TYPE energy_level AS ENUM ('high_focus', 'low_energy', 'quick_win');

-- 1. Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority INTEGER DEFAULT 0 CHECK (priority >= 0 AND priority <= 3),
  energy_level energy_level,
  estimated_time INTEGER, 
  deadline TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  manual_progress INTEGER DEFAULT 0 CHECK (manual_progress >= 0 AND manual_progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create task_logs table (Added duration_minutes)
CREATE TABLE task_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  progress_snapshot INTEGER NOT NULL, 
  duration_minutes INTEGER DEFAULT 0, -- 新增字段
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_user_parent ON tasks(user_id, parent_id); -- 组合索引优化
CREATE INDEX idx_task_logs_task_id ON task_logs(task_id);
CREATE INDEX idx_task_logs_created_at ON task_logs(created_at);

-- 4. Updated_at Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;

-- Tasks Policies
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Logs Policies
CREATE POLICY "Users can view logs for their tasks" ON task_logs FOR SELECT 
USING (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_logs.task_id AND tasks.user_id = auth.uid()));

CREATE POLICY "Users can insert logs for their tasks" ON task_logs FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_logs.task_id AND tasks.user_id = auth.uid()));

-- 6. Auto Log Trigger
CREATE OR REPLACE FUNCTION log_task_progress_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if manual_progress has changed
  IF NEW.manual_progress IS DISTINCT FROM OLD.manual_progress THEN
    INSERT INTO task_logs (task_id, progress_snapshot, note)
    VALUES (NEW.id, NEW.manual_progress, 'Auto-log: Progress updated');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_task_progress
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_progress_change();