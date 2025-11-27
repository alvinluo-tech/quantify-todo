-- Temporary: Disable RLS for testing (DEVELOPMENT ONLY!)
-- Run this in Supabase SQL Editor to allow testing without authentication

-- Disable RLS on tasks table
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Disable RLS on task_logs table  
ALTER TABLE task_logs DISABLE ROW LEVEL SECURITY;

-- NOTE: This allows ANYONE to read/write all tasks!
-- Only use this for development/testing
-- Remember to re-enable RLS when you add authentication:
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;
