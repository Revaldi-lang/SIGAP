import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qoojwiiioxaesvgqtkyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvb2p3aWlpb3hhZXN2Z3F0a3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTQ4NDgsImV4cCI6MjA5OTA5MDg0OH0.3MeuyAjWLZHNfWJXY757TjBvWBQ2tlA5LssY0MreBgU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data: cols, error } = await supabase.rpc('inspect_table', { table_name: 'laporan' });
  if (error) {
    // If rpc doesn't exist, select one record or try something else
    console.log('inspect_table RPC not available. Trying direct select limit 1...');
    const { data, error: selectError } = await supabase.from('laporan').select('*').limit(1);
    if (selectError) {
      console.error('Error selecting from laporan:', selectError);
    } else {
      console.log('Laporan columns:', data);
    }
  } else {
    console.log('Columns:', cols);
  }
}

main();
