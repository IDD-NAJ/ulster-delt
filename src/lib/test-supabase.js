const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://torrweisrjasfeqemebb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcnJ3ZWlzcmphc2ZlcWVtZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTg4NTAsImV4cCI6MjA2MTU5NDg1MH0._V7wj3uv94MqPEF6xGKOPF1wNI_qAnK6Dw7TwuswIFU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful!');
      console.log('Data:', data);
    }
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testSupabase(); 