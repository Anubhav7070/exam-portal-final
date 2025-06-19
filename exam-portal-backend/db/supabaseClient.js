const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if environment variables are set
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('🔍 Supabase Configuration:');
console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Key:', supabaseKey ? 'Set (length: ' + supabaseKey.length + ')' : 'Missing');

// Create a mock client if environment variables are not set
let supabase;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here' && supabaseKey !== 'your_supabase_key_here') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    supabase = createMockClient();
  }
} else {
  console.log('⚠️  Supabase credentials not configured. Using mock client for development.');
  supabase = createMockClient();
}

function createMockClient() {
  return {
    from: (table) => ({
      select: (columns = '*') => ({
        eq: (column, value) => ({
          single: () => ({ data: null, error: null }),
          data: null,
          error: null
        }),
        data: null,
        error: null
      }),
      insert: (data) => ({ 
        data: data, 
        error: null 
      }),
      update: (data) => ({
        eq: (column, value) => ({ 
          data: data, 
          error: null 
        })
      }),
      delete: () => ({
        eq: (column, value) => ({ 
          data: null, 
          error: null 
        })
      })
    })
  };
}

module.exports = supabase; 