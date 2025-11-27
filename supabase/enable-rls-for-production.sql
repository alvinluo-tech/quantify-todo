-- Re-enable RLS for production
-- Run this in Supabase SQL Editor after setting up authentication

-- Re-enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on task_logs table  
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;

-- Verify RLS policies are active
-- You should see the policies we created in schema.sql:
-- - Users can view their own tasks
-- - Users can insert their own tasks
-- - Users can update their own tasks
-- - Users can delete their own tasks
