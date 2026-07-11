import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qoojwiiioxaesvgqtkyw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvb2p3aWlpb3hhZXN2Z3F0a3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTQ4NDgsImV4cCI6MjA5OTA5MDg0OH0.3MeuyAjWLZHNfWJXY757TjBvWBQ2tlA5LssY0MreBgU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
