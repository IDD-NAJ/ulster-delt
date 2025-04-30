import { prisma } from './db';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnections() {
  try {
    // Test Prisma connection
    console.log('Testing Prisma connection...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Prisma connection successful!');
    
    // Test Supabase connection
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful!');
    }
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnections(); 