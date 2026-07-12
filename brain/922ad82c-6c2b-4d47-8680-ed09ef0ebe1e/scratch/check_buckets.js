import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qoojwiiioxaesvgqtkyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvb2p3aWlpb3hhZXN2Z3F0a3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTQ4NDgsImV4cCI6MjA5OTA5MDg0OH0.3MeuyAjWLZHNfWJXY757TjBvWBQ2tlA5LssY0MreBgU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
  } else {
    console.log('Buckets:');
    console.log(JSON.stringify(data, null, 2));
  }
}

main();
