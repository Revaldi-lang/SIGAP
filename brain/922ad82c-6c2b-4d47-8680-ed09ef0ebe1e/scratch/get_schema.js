import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qoojwiiioxaesvgqtkyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvb2p3aWlpb3hhZXN2Z3F0a3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTQ4NDgsImV4cCI6MjA5OTA5MDg0OH0.3MeuyAjWLZHNfWJXY757TjBvWBQ2tlA5LssY0MreBgU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.from('laporan').select().limit(0);
  if (error) {
    console.error('Error selecting from laporan:', error);
  } else {
    console.log('Columns fetched via select metadata:', Object.keys(data));
  }

  // Let's check if we can query some info
  const { data: dbLaporan, error: dbError } = await supabase.from('laporan').select('*');
  console.log('All reports from DB count:', dbLaporan?.length, 'error:', dbError);
}

main();
