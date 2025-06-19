const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if environment variables are set
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Create a mock client if environment variables are not set
let supabase;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here' && supabaseKey !== 'your_supabase_key_here') {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.log('⚠️  Supabase credentials not configured. Using mock client for development.');
  // Create a mock client that returns empty data
  supabase = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ data: null, error: null }) })
    })
  };
}

module.exports = supabase; 