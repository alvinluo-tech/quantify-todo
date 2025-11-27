import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key (first 20 chars):', supabaseKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
try {
  const { data, error } = await supabase.from('tasks').select('count');
  
  if (error) {
    console.error('❌ Database error:', error.message);
    console.error('Details:', error);
  } else {
    console.log('✅ Successfully connected to Supabase!');
    console.log('Tasks table is accessible');
  }
} catch (err) {
  console.error('❌ Connection failed:', err.message);
}
